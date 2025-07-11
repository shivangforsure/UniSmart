import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, MenuItem, Grid
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/teacher/${currentUser._id}/subjects`);
                setSubjects(res.data);
            } catch (err) {
                console.error("Error fetching subjects", err);
            }
        };
        fetchSubjects();
    }, [currentUser._id]);

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        if (field === 'text') updated[index].text = value;
        else if (field === 'correctAnswerIndex') updated[index].correctAnswerIndex = parseInt(value);
        else updated[index].options[field] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    };

    const handleSubmit = async () => {
        if (!subjectId) return alert("Please select a subject");
        try {
            const payload = {
                teacherId: currentUser._id,
                classId: currentUser.teachSclass._id,
                subjectId,
                title,
                questions,
                startTime,
                endTime,
                duration
            };
            await axios.post(`${process.env.REACT_APP_BASE_URL}/quiz/create`, payload);
            alert("Quiz created successfully");
            navigate('/Teacher/quiz-history');
        } catch (err) {
            console.error("Failed to create quiz", err);
            alert("Quiz creation failed");
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Create Quiz</Typography>

            <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />

            <TextField
                select
                label="Select Subject"
                value={subjectId}
                fullWidth
                onChange={(e) => setSubjectId(e.target.value)}
                sx={{ mb: 2 }}
            >
                {subjects.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                        {sub.subName}
                    </MenuItem>
                ))}
            </TextField>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Grid>
            </Grid>

            <TextField
                label="Duration (minutes)"
                type="number"
                fullWidth
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{ mb: 3 }}
            />

            <Typography variant="h6">Questions</Typography>
            {questions.map((q, idx) => (
                <Box key={idx} mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
                    <TextField
                        label={`Question ${idx + 1}`}
                        fullWidth
                        value={q.text}
                        onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {q.options.map((opt, optIdx) => (
                        <TextField
                            key={optIdx}
                            label={`Option ${optIdx + 1}`}
                            fullWidth
                            value={opt}
                            onChange={(e) => handleQuestionChange(idx, optIdx, e.target.value)}
                            sx={{ mb: 1 }}
                        />
                    ))}
                    <TextField
                        label="Correct Answer Index (0-3)"
                        type="number"
                        value={q.correctAnswerIndex}
                        onChange={(e) => handleQuestionChange(idx, 'correctAnswerIndex', e.target.value)}
                    />
                </Box>
            ))}
            <Button variant="outlined" onClick={addQuestion} sx={{ mb: 2 }}>Add Question</Button>
            <Button variant="contained" onClick={handleSubmit}>Create Quiz</Button>
        </Box>
    );
};

export default CreateQuiz;
