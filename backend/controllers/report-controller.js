const XLSX = require('xlsx');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');

const generateTeacherReport = async (req, res) => {
    try {
        const teacherId = req.params.id;

        // Get teacher with subjects & class
        const teacher = await Teacher.findById(teacherId)
            .populate('teachSclass')
            .populate('teachSubject')
            .populate('school');

        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        // Fetch students in that class
        const students = await Student.find({ sclassName: teacher.teachSclass._id, school: teacher.school._id })
            .populate('sclassName')
            .populate('school')
            .populate('examResult.subName')
            .lean();

        const subjectId = teacher.teachSubject._id.toString();

        const reportData = students.map(student => {
            // Filter attendance by subject
            const attendance = student.attendance.filter(att => att.subName.toString() === subjectId);

            const totalSessions = attendance.length;
            const presentCount = attendance.filter(att => att.status === 'Present').length;
            const absentCount = totalSessions - presentCount;
            const attendancePercentage = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(2) : '0.00';

            const lastAttendanceDate = attendance.length > 0
                ? new Date(Math.max(...attendance.map(a => new Date(a.date).getTime()))).toLocaleDateString()
                : 'N/A';

            // Fetch marks for subject
            const exam = student.examResult.find(ex => ex.subName && ex.subName._id.toString() === subjectId);
            const marks = exam ? exam.marksObtained : 'N/A';

            // Remark logic
            let remarks = '';
            const perc = parseFloat(attendancePercentage);
            if (perc >= 90) remarks = 'Excellent';
            else if (perc >= 75) remarks = 'Good';
            else if (perc >= 50) remarks = 'Average';
            else remarks = 'Poor';

            return {
                Name: student.name,
                Email: student.email || 'N/A',
                StudentID: student._id.toString(),
                School: student.school?.schoolName || 'N/A',
                Class: student.sclassName?.sclassName || 'N/A',
                'Total Sessions': totalSessions,
                'Present': presentCount,
                'Absent': absentCount,
                'Attendance %': attendancePercentage,
                'Last Attendance': lastAttendanceDate,
                'Marks': marks,
                'Remarks': remarks
            };
        });

        // Convert to Excel
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Send Excel as response
        res.setHeader('Content-Disposition', 'attachment; filename=Teacher_Report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Report generation failed', error: err.message });
    }
};

module.exports = { generateTeacherReport };
