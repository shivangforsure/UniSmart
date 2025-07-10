import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Typography,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Divider
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TeacherHistoryResources from './TeacherHistoryResources';


const UploadResources = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState(null);
    const [subjectId, setSubjectId] = useState('');
    const [title, setTitle] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [refreshResources, setRefreshResources] = useState(false);


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/teacher/${currentUser._id}/subjects`);
                console.log("Subjects fetched:", res.data);
                setSubjects(res.data);
            } catch (err) {
                console.error("Error fetching subjects:", err);
            }
        };
        fetchSubjects();
    }, [currentUser._id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !subjectId || !title) return alert("Please select file, title, and subject");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subjectId", subjectId);
        formData.append("classId", currentUser.teachSclass._id);
        formData.append("teacherId", currentUser._id);
        formData.append("title", title);

        try {
            await axios.post("http://localhost:5000/resource-upload", formData);
            alert("File uploaded successfully!");
            setFile(null);
            setSubjectId('');
            setTitle('');
            setRefreshResources(prev => !prev);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed");
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Upload Study Resource</Typography>
            <form onSubmit={handleUpload}>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Select Subject</InputLabel>
                    <Select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        label="Select Subject"
                    >
                        {subjects.map((sub) => (
                            <MenuItem key={sub._id} value={sub._id}>{sub.subName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                    Choose File
                    <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                </Button>

                {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Upload
                </Button>
            </form>

            <Divider sx={{ my: 4 }} />
            <TeacherHistoryResources teacherId={currentUser._id} refreshTrigger={refreshResources} />
        </Box>

    );
};

export default UploadResources;
