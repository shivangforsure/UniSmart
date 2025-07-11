const Resource = require('../models/resourceSchema');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');
const Subject = require('../models/subjectSchema');
const Progress = require('../models/StudentResourceProgress');
const Student = require('../models/studentSchema');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


const uploadResource = async (req, res) => {
    try {
        const { title, subjectId, teacherId, classId, link } = req.body;

        let fileType = 'link';
        let url = link;

        if (req.file) {
            // console.log("File received:", req.file);
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "raw",
                folder: "resources",
                use_filename: true,
                unique_filename: false,
                access_mode: "public"
            });
            url = result.secure_url;
            fileType = req.file.originalname.split('.').pop();
            fs.unlinkSync(req.file.path); // remove local copy
        }

        const newRes = new Resource({
            title,
            subject: subjectId,
            teacher: teacherId,
            classId,
            url,
            fileType
        });

        await newRes.save();
        res.status(201).json({ message: "Resource uploaded", data: newRes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};


const getResourcesBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const resources = await Resource.find({ subject: subjectId }).sort({ uploadedAt: -1 });
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ message: "Error fetching resources" });
    }
};


const getTeacherSubjects = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const subjects = await Subject.find({ teacher: teacherId }).populate("sclassName", "sclassName");
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch teacher subjects" });
    }
};


const getResourcesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const resources = await Resource.find({ teacher: teacherId })
            .populate('subject', 'subName')
            .sort({ createdAt: -1 });

        // console.log("Found resources:", resources);
        res.status(200).json(resources);
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({ message: "Error fetching resources" });
    }
};


const deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};


const updateResourceTitle = async (req, res) => {
    try {
        const { title } = req.body;
        const updated = await Resource.findByIdAndUpdate(req.params.id, { title }, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};


const markResourceAsViewed = async (req, res) => {
    try {
        const { studentId, resourceId } = req.body;

        const existing = await Progress.findOne({ studentId, resourceId });
        if (existing) return res.status(200).json({ message: "Already marked as done" });

        const progress = new Progress({ studentId, resourceId });
        await progress.save();

        res.status(201).json({ message: "Marked as done" });
    } catch (err) {
        res.status(500).json({ message: "Failed to mark as done", error: err.message });
    }
};


const getDoneResourcesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const doneResources = await Progress.find({ studentId });
        res.status(200).json(doneResources);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch progress", error: err.message });
    }
};


const getResourcesForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        // get student class ID
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const classId = student.sclassName;

        // fetch all resources of that class
        const resources = await Resource.find({ classId }).populate("subject", "subName");

        // fetch viewed resources for this student
        const progress = await Progress.find({ studentId });
        const viewedSet = new Set(progress.map((p) => p.resourceId.toString()));

        // mark viewed
        const result = resources.map((r) => ({
            ...r._doc,
            isViewed: viewedSet.has(r._id.toString()),
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch resources for student" });
    }
};



module.exports = {
    uploadResource,
    getResourcesBySubject,
    upload, // for multer middleware use,
    getTeacherSubjects,
    getResourcesByTeacher,
    deleteResource,
    updateResourceTitle,
    markResourceAsViewed,
    getDoneResourcesByStudent,
    getResourcesForStudent
};
