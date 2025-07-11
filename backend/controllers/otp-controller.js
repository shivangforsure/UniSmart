const Otp = require("../models/otpSchema");
const nodemailer = require("nodemailer");
const Teacher = require("../models/teacherSchema");
const Admin = require("../models/adminSchema");
require("dotenv").config();
// Transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
    const { email, role } = req.body;

    let user;
    if (role === "Admin") user = await Admin.findOne({ email });
    else if (role === "Teacher") user = await Teacher.findOne({ email });
    else return res.status(400).json({ message: "OTP login not supported for this role." });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for login',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp });

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ message: "Email sending failed", error: err });
        return res.status(200).json({ message: "OTP sent successfully" });
    });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp, role } = req.body;

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    let user;
    if (role === "Admin") user = await Admin.findOne({ email });
    else if (role === "Teacher") user = await Teacher.findOne({ email });
    else return res.status(400).json({ message: "OTP login not supported for this role." });

    await Otp.deleteOne({ email }); // cleanup after verification
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
};
