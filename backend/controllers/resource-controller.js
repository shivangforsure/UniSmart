const Resource = require('../models/resourceSchema');
const uploadFileToCloud = require('../utils/uploadToCloud'); // if using cloud

// Upload resource (file or link)
exports.uploadResource = async (req, res) => {
    try {
        const { title, description, link, teacherId, classId, subjectId } = req.body;
        let fileUrl = null;

        if (req.file) {
            // use multer and optionally cloud upload
            fileUrl = await uploadFileToCloud(req.file); // or generate static path
        }

        const resource = new Resource({ title, description, link, fileUrl, teacherId, classId, subjectId });
        await resource.save();
        res.status(201).json({ message: 'Resource uploaded', resource });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload resource', error: err.message });
    }
};

// Get all resources for a student (based on classId and subjectId)
exports.getResourcesForStudent = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;
        const resources = await Resource.find({ classId, subjectId });
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching resources', error: err.message });
    }
};
