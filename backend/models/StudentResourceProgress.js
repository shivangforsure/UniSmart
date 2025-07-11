const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    viewedAt: { type: Date, default: Date.now },
}, { timestamps: true });

progressSchema.index({ studentId: 1, resourceId: 1 }, { unique: true }); // prevent duplicate

module.exports = mongoose.model('StudentResourceProgress', progressSchema);
