const Quiz = require('../models/Quiz');
const Submission = require('../models/QuizSubmission');
const ExcelJS = require('exceljs');


// ✅ Create a quiz
exports.createQuiz = async (req, res) => {
    try {
        const { teacherId, classId, subjectId, title, questions, startTime, endTime, duration } = req.body;

        if (!title || !questions || !questions.length || !classId || !subjectId || !teacherId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const quiz = new Quiz({
            teacher: teacherId,
            classId,
            subjectId,
            title,
            questions,
            startTime,
            endTime,
            durationMinutes: duration
        });

        await quiz.save();
        res.status(201).json({ quiz });
    } catch (err) {
        console.error("Error creating quiz:", err.message);
        res.status(500).json({ message: "Failed to create quiz" });
    }
};

// ✅ Get available quizzes for student (active + filtered)
exports.getAvailableQuizzes = async (req, res) => {
    try {
        const now = new Date();
        const quizzes = await Quiz.find({
            classId: req.params.classId,
            subjectId: req.params.subjectId,
            startTime: { $lte: now },
            endTime: { $gte: now }
        }).sort({ startTime: -1 });

        res.json(quizzes);
    } catch (err) {
        console.error("Error fetching quizzes:", err.message);
        res.status(500).json({ message: "Failed to fetch available quizzes" });
    }
};

// ✅ Get a specific quiz (student attempts it)
// exports.getQuiz = async (req, res) => {
//     try {
//         const quiz = await Quiz.findById(req.params.quizId);
//         if (!quiz) return res.status(404).json({ message: "Quiz not found" });
//         res.json(quiz);
//     } catch (err) {
//         console.error("Error fetching quiz:", err.message);
//         res.status(500).json({ message: "Failed to get quiz" });
//     }
// };

exports.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const studentId = req.query.studentId;
        const alreadySubmitted = studentId
            ? await Submission.findOne({ quiz: quiz._id, student: studentId })
            : false;

        // If not submitted, hide correct answers
        if (!alreadySubmitted) {
            quiz.questions = quiz.questions.map(q => {
                const { correctAnswerIndex, ...rest } = q.toObject();
                return rest;
            });
        }

        res.json(quiz);
    } catch (err) {
        console.error("Error fetching quiz:", err.message);
        res.status(500).json({ message: "Failed to get quiz" });
    }
};




// ✅ Submit quiz response
// exports.submitQuiz = async (req, res) => {
//     try {
//         const { quizId } = req.params;
//         const { studentId, answers } = req.body;

//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//         const now = new Date();
//         if (now < quiz.startTime || now > quiz.endTime) {
//             return res.status(400).json({ message: "Quiz not active currently" });
//         }

//         // Prevent resubmission
//         const existing = await Submission.findOne({ quiz: quizId, student: studentId });
//         if (existing) return res.status(400).json({ message: "Already submitted" });

//         if (now > quiz.endTime) return res.status(400).json({ msg: "Deadline passed" });
//         // Score calculation
//         let score = 0;
//         answers.forEach(a => {
//             const q = quiz.questions[a.questionIndex];
//             if (q && q.correctAnswerIndex === a.selectedIndex) score++;
//         });

//         const submission = new Submission({
//             quiz: quizId,
//             student: studentId,
//             answers,
//             submittedAt: now,
//             score
//         });

//         await submission.save();
//         res.status(201).json({ message: "Quiz submitted", submission });
//     } catch (err) {
//         console.error("Error submitting quiz:", err.message);
//         res.status(500).json({ message: "Failed to submit quiz" });
//     }
// };

exports.submitQuiz = async (req, res) => {
    try {
        console.log("✅ Received body:", req.body);
        console.log("✅ Params:", req.params);

        const { quizId } = req.params;
        const { studentId, answers } = req.body;

        if (!studentId || !answers) {
            return res.status(400).json({ message: "Missing studentId or answers" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const now = new Date();
        if (now < quiz.startTime || now > quiz.endTime) {
            return res.status(400).json({ message: "Quiz not active currently" });
        }

        const existing = await Submission.findOne({ quiz: quizId, student: studentId });
        if (existing) return res.status(400).json({ message: "Already submitted" });

        // ✅ Score calculation
        let score = 0;
        answers.forEach(a => {
            const q = quiz.questions[a.questionIndex];
            if (q && q.correctAnswerIndex === a.selectedIndex) score++;
        });

        const submission = new Submission({
            quiz: quizId,
            student: studentId,
            answers,
            submittedAt: now,
            score
        });

        await submission.save();
        res.status(201).json({ message: "Quiz submitted", submission });
    } catch (err) {
        console.error("❌ Error submitting quiz:", err.message);
        res.status(500).json({ message: "Failed to submit quiz" });
    }
};


// ✅ Get all submissions for a quiz (for teacher/admin)
exports.getQuizSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ quiz: req.params.quizId })
            .populate('student', 'name rollNum')
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (err) {
        console.error("Error fetching submissions:", err.message);
        res.status(500).json({ message: "Failed to fetch quiz submissions" });
    }
};

// Get all quizzes created by a teacher
exports.getQuizzesByTeacher = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ teacher: req.params.teacherId })
            .populate('classId', 'sclassName')
            .populate('subjectId', 'subjectName')
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (err) {
        console.error("Error fetching teacher quizzes:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.exportQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId).populate('classId subjectId');
        const submissions = await Submission.find({ quiz: quizId }).populate('student', 'name rollNum');

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Quiz Results');

        // Header
        sheet.addRow([
            'Student Name',
            'Roll Number',
            'Score',
            'Submitted At',
            'Quiz Title',
            'Class',
            'Subject'
        ]);

        // Data
        submissions.forEach(sub => {
            sheet.addRow([
                sub.student.name,
                sub.student.rollNum,
                sub.score,
                new Date(sub.submittedAt).toLocaleString(),
                quiz.title,
                quiz.classId?.sclassName || '',
                quiz.subjectId?.subjectName || ''
            ]);
        });

        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=quiz_results_${quizId}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Excel export failed:", err);
        res.status(500).json({ message: "Export failed" });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            classId: req.params.classId,
            subjectId: req.params.subjectId,
        });
        res.json(quizzes);
    } catch (err) {
        console.error("Failed to get all quizzes", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getStudentQuizList = async (req, res) => {
    const { classId, subjectId, studentId } = req.params;
    const now = new Date();
    const quizzes = await Quiz.find({ classId, subjectId });
    const submissions = await Submission.find({ student: studentId });

    const submissionMap = Object.fromEntries(submissions.map(s => [s.quiz.toString(), true]));

    const quizList = quizzes.map(q => ({
        _id: q._id,
        title: q.title,
        startTime: q.startTime,
        endTime: q.endTime,
        durationMinutes: q.durationMinutes,
        status:
            submissionMap[q._id.toString()] ? 'submitted' :
                now < q.startTime ? 'upcoming' :
                    now > q.endTime ? 'expired' :
                        'active'
    }));

    res.json(quizList);
};

