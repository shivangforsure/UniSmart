import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Chip } from '@mui/material';
import { useSelector } from 'react-redux';

const StudentResources = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [resources, setResources] = useState([]);

    const fetchResources = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/resources/student/${currentUser._id}`);
            setResources(res.data);
        } catch (err) {
            console.error("Failed:", err);
        }
    };

    useEffect(() => {
        if (currentUser?._id) fetchResources();
    }, [currentUser]);

    const handleMarkAsDone = async (resId) => {
        try {
            await axios.post("http://localhost:5000/resource/mark-done", {
                studentId: currentUser._id,
                resourceId: resId,
            });
            fetchResources(); // Refresh
        } catch (err) {
            console.error("Marking failed:", err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Shared Resources</Typography>

            {resources.length === 0 ? (
                <Typography>No resources yet.</Typography>
            ) : (
                resources.map((res) => (
                    <Box key={res._id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="subtitle1">{res.title}</Typography>
                        <Typography variant="body2">Subject: {res.subject?.subName || 'N/A'}</Typography>
                        <Chip label={res.fileType?.toUpperCase()} size="small" sx={{ mt: 1, mr: 2 }} />
                        <Button size="small" href={res.url} target="_blank" variant="outlined" sx={{ mr: 2 }}>
                            Open
                        </Button>
                        {res.isViewed ? (
                            <Chip label="Viewed" color="success" />
                        ) : (
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => handleMarkAsDone(res._id)}
                            >
                                Mark as Done
                            </Button>
                        )}
                    </Box>
                ))
            )}
        </Box>
    );
};

export default StudentResources;
