const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'subject', required: true },
    title: { type: String, required: true },
    questions: [{
        text: String,
        options: [String],
        correctAnswerIndex: Number
    }],
    startTime: Date,
    endTime: Date,
    durationMinutes: Number,
}, { timestamps: true });
module.exports = mongoose.model('Quiz', quizSchema);
