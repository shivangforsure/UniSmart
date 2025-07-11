import React from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherReports = () => {
    const { currentUser } = useSelector((state) => state.user);

    const handleDownloadReport = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${currentUser._id}/report`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Teacher_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Generate Attendance Report</h2>
            <Button variant="contained" onClick={handleDownloadReport}>
                Download Report
            </Button>
        </div>
    );
};

export default TeacherReports;
