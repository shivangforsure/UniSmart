const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const Sclass = require('../models/sclassSchema');

//  Bulk Upload Attendance
const bulkUploadAttendance = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const { classId, subjectId } = req.body;

    const schoolId = "6862eb9d44af78eac5059129";
    if (!classId || !subjectId) {
      return res.status(400).json({ message: 'Missing subjectId, classId, or schoolId in request body' });
    }

    let success = 0;
    const failed = [];

    for (const row of data) {
      // console.log('Processing row:', row);

      const { name, rollNum, password, date, status, email } = row;

      //Validate required fields
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!rollNum) missingFields.push('rollNum');
      if (!password) missingFields.push('password');
      if (!date) missingFields.push('date');
      if (!status) missingFields.push('status');

      if (missingFields.length) {
        // console.log('Missing fields →', missingFields);
        failed.push({ row, error: 'Missing required fields', missingFields });
        continue;
      }

      //Find existing student
      let student = await Student.findOne({
        rollNum,
        sclassName: classId,
        school: schoolId
      });

      //Create new student if not found
      if (!student) {
        try {
          const hashedPass = await bcrypt.hash(password.toString(), 10);
          student = new Student({
            name,
            rollNum,
            password: hashedPass,
            sclassName: classId,
            school: schoolId,
            email
          });
          await student.save();
          // console.log(`Created new student: ${student.name}`);
        } catch (err) {
          console.error('Error creating student:', err);
          failed.push({ row, error: 'Failed to create student', details: err.message });
          continue;
        }
      }

      //  Check if attendance already marked
      const alreadyMarked = student.attendance.some(att =>
        att.subName.toString() === subjectId &&
        new Date(att.date).toDateString() === new Date(date).toDateString()
      );

      if (alreadyMarked) {
        // console.log(`Attendance already marked for ${student.name} on ${date}`);
        failed.push({ row, error: 'Attendance already marked' });
        continue;
      }

      //  Normalize and push attendance
      const normalizedStatus = status.toLowerCase() === 'present' ? 'Present' : 'Absent';

      student.attendance.push({
        subName: subjectId,
        date: new Date(date),
        status: normalizedStatus
      });

      await student.save();
      // console.log(`Attendance added for ${student.name} on ${date}`);
      success++;
    }

    res.status(200).json({
      message: 'Bulk attendance processing completed',
      successCount: success,
      failedRows: failed
    });

  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({ message: 'Error processing Excel file', error: error.message });
  }
};

// Fetch Subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}, 'subName');
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Failed to fetch subjects:', error);
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

//  Fetch Classes
const getClasses = async (req, res) => {
  try {
    const classes = await Sclass.find({}, 'sclassName');
    res.status(200).json(classes);
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    res.status(500).json({ message: 'Failed to fetch classes', error: error.message });
  }
};

module.exports = {
  bulkUploadAttendance,
  getSubjects,
  getClasses
};
