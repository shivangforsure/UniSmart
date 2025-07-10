const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sclass",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("resource", resourceSchema);
