const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sclass'
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    },
    title: String,
    description: String,
    fileUrl: String, // If uploaded
    link: String,    // If it's a YouTube/Google Drive/etc. link
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', resourceSchema);
