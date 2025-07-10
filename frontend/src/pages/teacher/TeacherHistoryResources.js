import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Chip, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axios from 'axios';

const TeacherHistoryResources = ({ refreshTrigger }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [resources, setResources] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');

    const fetchResources = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/resources/teacher/${currentUser._id}`);
            setResources(res.data);
        } catch (err) {
            console.error("Failed to fetch teacher resources", err);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [currentUser._id, refreshTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
        try {
            await axios.delete(`http://localhost:5000/resource/${id}`);
            fetchResources();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleEditSave = async (id) => {
        try {
            await axios.put(`http://localhost:5000/resource/${id}`, { title: editedTitle });
            setEditingId(null);
            setEditedTitle('');
            fetchResources();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const groupedByWeek = resources.reduce((acc, item) => {
        const date = item.createdAt;
        const week = moment(date).startOf('week').format('D MMM') + ' - ' + moment(date).endOf('week').format('D MMM');
        if (!acc[week]) acc[week] = [];
        acc[week].push(item);
        return acc;
    }, {});

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>My Uploaded Resources</Typography>
            {resources.length === 0 ? (
                <Typography>No resources uploaded yet.</Typography>
            ) : (
                Object.entries(groupedByWeek).map(([week, resList]) => (
                    <Accordion key={week} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">{week}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {resList.map((res) => (
                                <Box key={res._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                    {editingId === res._id ? (
                                        <TextField
                                            fullWidth
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            onBlur={() => handleEditSave(res._id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleEditSave(res._id);
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <Typography variant="subtitle1" onClick={() => {
                                            setEditingId(res._id);
                                            setEditedTitle(res.title);
                                        }} style={{ cursor: 'pointer' }}>
                                            {res.title}
                                        </Typography>
                                    )}

                                    <Typography variant="body2" color="textSecondary">
                                        Subject: {res.subject?.subName || 'N/A'} <br />
                                        Uploaded: {moment(res.createdAt).format('dddd, D MMM YYYY, h:mm A')}
                                    </Typography>
                                    <Chip label={res.fileType?.toUpperCase()} size="small" sx={{ mt: 1, mr: 2 }} />
                                    <Button size="small" href={res.url} target="_blank" variant="outlined">Open</Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(res._id)} sx={{ ml: 2 }}>Delete</Button>
                                </Box>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Box>
    );
};

export default TeacherHistoryResources;
