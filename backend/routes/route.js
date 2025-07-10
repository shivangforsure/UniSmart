const router = require('express').Router();
const multer = require('multer');


const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');
const { bulkUploadAttendance, getClasses, getSubjects } = require('../controllers/attendance-controller.js');

const { generateTeacherReport } = require('../controllers/report-controller.js')

const { sendOtp, verifyOtp } = require("../controllers/otp-controller.js");

const { uploadResource, getResourcesBySubject, upload, getTeacherSubjects, getResourcesByTeacher, getStudentResources } = require('../controllers/resource-controller');

const { deleteResource, updateResourceTitle } = require('../controllers/resource-controller');

const {
    markResourceAsDone,
    getDoneResourcesByStudent
} = require('../controllers/resource-controller');


const { getResourcesForStudent, markResourceAsViewed } = require('../controllers/resource-controller');

const quizCtrl = require('../controllers/quizController');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)


// Student

router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id", getStudents)
router.get("/Student/:id", getStudentDetail)

router.delete("/Students/:id", deleteStudents)
router.delete("/StudentsClass/:id", deleteStudentsByClass)
router.delete("/Student/:id", deleteStudent)

router.put("/Student/:id", updateStudent)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/StudentAttendance/:id', studentAttendance)

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance)

// Teacher

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn)

router.get("/Teachers/:id", getTeachers)
router.get("/Teacher/:id", getTeacherDetail)

router.delete("/Teachers/:id", deleteTeachers)
router.delete("/TeachersClass/:id", deleteTeachersByClass)
router.delete("/Teacher/:id", deleteTeacher)

router.put("/TeacherSubject", updateTeacherSubject)

router.post('/TeacherAttendance/:id', teacherAttendance)

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

// Sclass

router.post('/SclassCreate', sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail)

router.get("/Sclass/Students/:id", getSclassStudents)

router.delete("/Sclasses/:id", deleteSclasses)
router.delete("/Sclass/:id", deleteSclass)

// Subject

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail)

router.delete("/Subject/:id", deleteSubject)
router.delete("/Subjects/:id", deleteSubjects)
router.delete("/SubjectsClass/:id", deleteSubjectsByClass)

//Bulk Upload
const storage = multer.memoryStorage();
const excelUpload = multer({ storage });

router.post('/bulk-upload', excelUpload.single('file'), bulkUploadAttendance);

router.get('/teacher/:id/report', generateTeacherReport);


router.get('/subjects', getSubjects)
router.get('/classes', getClasses)

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);



router.post('/resource-upload', upload.single('file'), uploadResource);
router.get('/resources/:subjectId', getResourcesBySubject);
router.get('/resources/teacher/:teacherId', getResourcesByTeacher);
router.delete('/resource/:id', deleteResource);
router.put('/resource/:id', updateResourceTitle);

router.get('/teacher/:teacherId/subjects', getTeacherSubjects)

router.get('/resources/student/:studentId', getResourcesForStudent);
router.post('/resource/mark-done', markResourceAsViewed);
router.get('/resource/done/:studentId', getDoneResourcesByStudent);

router.post('/quiz/create', quizCtrl.createQuiz);
router.get('/quiz/available/:classId/:subjectId', quizCtrl.getAvailableQuizzes);
router.get('/quiz/:quizId', quizCtrl.getQuiz);
router.post('/quiz/submit/:quizId', quizCtrl.submitQuiz);
router.get('/quiz/results/:quizId', quizCtrl.getQuizSubmissions);
router.get('/quiz/results/export/:quizId', quizCtrl.exportQuizResults);
router.get('/quiz/all/:classId/:subjectId', quizCtrl.getAllQuizzes);

router.get('/quizzes/teacher/:teacherId', quizCtrl.getQuizzesByTeacher);
router.get('/quiz/student/:studentId/:classId/:subjectId', quizCtrl.getStudentQuizList);



module.exports = router;