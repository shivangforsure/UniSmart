# 🎓 UniSmart: AI-Powered University Learning Management System

> 🚀 One Platform. Unlimited Learning. Smartly Managed.

---

## 💻 Built With

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express.js-lightgrey)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![MaterialUI](https://img.shields.io/badge/UI-MaterialUI-007FFF)
![Redux](https://img.shields.io/badge/State-Redux-764ABC)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Bcrypt](https://img.shields.io/badge/Security-Bcrypt-yellow)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blueviolet)
![ExcelJS](https://img.shields.io/badge/Reports-ExcelJS-darkgreen)
![Multer](https://img.shields.io/badge/Uploads-Multer-9cf)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-yellowgreen)

---

## 📘 About the Project

**UniSmart** is a full-stack, AI-ready Learning Management System tailored for universities. It empowers Admins, Teachers, and Students with features like OTP login, resource sharing, attendance tracking, quiz management, Excel report generation, and bulk upload — all through one powerful and user-friendly platform.

---

## 🧠 Core Features

| 👨‍🎓 Student | 👨‍🏫 Teacher | 🛠️ Admin |
|-------------|-------------|-----------|
| Register/Login (OTP or Password) | Create & Schedule Quizzes | Manage Users |
| Take Quizzes & View Results | Upload PDF/PPT Resources | Assign Subjects/Classes |
| View Attendance % | Track Resource Usage | Post Notices |
| Access Study Resources | Mark Attendance | Mark Attendance via Bulk Upload |
| Submit Complaints | Evaluate Submissions | Bulk Upload Students via Excel |
| View Notices | View Assigned Subjects | Generate Reports |
| — | — | Handle Complaints |

---

## 📘 User Manual

📄 You can view the complete [UniSmart User Manual here](https://docs.google.com/document/d/1O95E6pulfGJZsp20t0RFBGwhbtOm2U6Hz-2YQsM4xaQ/edit?usp=sharing).

---

## 🖼️ System Overview (ER Diagram)

> This single ER Diagram gives a complete picture of UniSmart's architecture and database design:

![ER Diagram](./assets/er%20diagram%20unismart.png)

---

## 🧱 Tech Stack

### 🔹 Frontend
- React.js (Hooks + Router)
- Redux Toolkit
- Material UI

### 🔹 Backend
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- JWT + OTP Login (Email)

### 🔹 Utilities
- ExcelJS (report generation)
- Multer (file uploads)
- Nodemailer (email OTP)
- Cloudinary (resource storage)

---

## 🗂️ Project Folder Structure

```bash
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── assests/
│       ├── pages/
│       ├── redux/
│       └── App.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── uploads/
│   └── index.js
└── assets/
```

---

## 🔐 OTP Login (Secure + Role-Based)

- Login via OTP (expires in 5 minutes) for Admin and Teachers
- Students use password-based login
- Backend OTP verification using a dedicated OTP model
- Nodemailer for secure mailing

---

## 📊 Report Generator

Teachers can generate Excel reports containing:
- Name, Email, Student ID
- Subject-wise Marks
- Attendance Percentage
- Total Sessions, Attended, Absent
- Remarks, Last Attendance Date
- Number of Quizzes Attempted

➡️ Powered by **ExcelJS**  
➡️ Exports `.xlsx` reports dynamically class-wise

---

## 🧾 Modules Breakdown

### 1️⃣ Authentication
- Role-based login (Admin, Teacher, Student)
- JWT token with frontend protection
- OTP system (Admin & Teacher only)

### 2️⃣ Quiz Management
- Teacher creates quiz with time slots
- Students see active/inactive/attempted quizzes
- Submissions are auto-evaluated
- Teachers can view individual results

### 3️⃣ Attendance Tracking
- Teachers mark daily attendance
- Students see % stats and session breakdown
- Admin gets cumulative data
- Bulk Attendance Upload by Admin via Excel

### 4️⃣ Resource Sharing
- Upload PDF, PPT or link
- Resource visible subject-wise
- Students can “Mark as Done”
- Progress tracked via a `Progress` model

### 5️⃣ Complaints & Notices
- Students raise complaints
- Admin handles grievances
- Admin broadcasts notices to classes

### 6️⃣ Bulk Upload Module
- Admin can upload `.xlsx` file with multiple students
- Excel is parsed using Multer + ExcelJS
- Automatically adds student records
- Supports class and school mapping

---

## ⚙️ Getting Started Locally

### 🔑 Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or Local)
- Cloudinary Account
- Email Credentials (for OTP)

### 📦 Installation

```bash
# Clone Repository
git clone https://github.com/shivangforsure/UniSmart.git
cd UniSmart

# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup
cd ../frontend
npm install
npm start
```

### 🔐 Environment Variables

Create a `.env` file in `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🌍 Deployment

> UniSmart is live on Render

🔗 Live App: https://unismart-d475.onrender.com/  
🔗 GitHub Repo: https://github.com/shivangforsure/UniSmart

---

## 💡 Future Enhancements

- [ ] AI-based Smart Attendance Prediction System
- [ ] Admin Analytics Dashboard with Graphs
- [ ] ChatGPT API integration for student doubts
- [ ] Fully responsive mobile-first version

---

## 🙋‍♂️ Developer Info

**Name**: Shivang Goyal  
**Email**: shivanggoyal0204@gmail.com  
**GitHub**: [shivangforsure](https://github.com/shivangforsure)

---

## 📜 License

MIT License  
© 2025 Shivang Goyal – All Rights Reserved

---

## ⭐ Support

If you liked this project, give it a **⭐** on GitHub and share it with others!

---
