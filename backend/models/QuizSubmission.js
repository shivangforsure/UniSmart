const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    answers: [{
        questionIndex: Number,
        selectedIndex: Number
    }],
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', submissionSchema);
