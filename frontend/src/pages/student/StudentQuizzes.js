import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Button, Card, CardContent, CircularProgress,
    MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StudentQuizzes = () => {
    const { currentUser } = useSelector(state => state.user);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showOnlySubmitted, setShowOnlySubmitted] = useState(false);
    const navigate = useNavigate();

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/ClassSubjects/${currentUser.sclassName._id}`);
            setSubjects(res.data);
        } catch (err) {
            console.error("Error fetching subjects", err);
        }
    };

    const fetchQuizzes = async (subjectId) => {
        try {
            setLoading(true);
            const classId = currentUser.sclassName?._id;
            const studentId = currentUser._id;
            if (!classId || !subjectId) return;

            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/student/${studentId}/${classId}/${subjectId}`);
            setQuizzes(res.data);
        } catch (err) {
            console.error("Error fetching quizzes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchQuizzes(selectedSubject);
        }
    }, [selectedSubject]);

    const filteredQuizzes = showOnlySubmitted
        ? quizzes.filter(q => q.status === 'submitted')
        : quizzes;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>My Quizzes</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Subject</InputLabel>
                <Select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    label="Select Subject"
                >
                    {subjects.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>{sub.subName}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={showOnlySubmitted}
                        onChange={(e) => setShowOnlySubmitted(e.target.checked)}
                    />
                }
                label="Show only submitted quizzes"
                sx={{ mb: 2 }}
            />

            {loading ? (
                <CircularProgress />
            ) : filteredQuizzes.length === 0 ? (
                <Typography>No quizzes found.</Typography>
            ) : (
                filteredQuizzes.map((quiz) => (
                    <Card key={quiz._id} sx={{ my: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{quiz.title}</Typography>
                            <Typography>Status: {quiz.status.toUpperCase()}</Typography>
                            <Typography variant="body2">
                                {new Date(quiz.startTime).toLocaleString()} → {new Date(quiz.endTime).toLocaleString()}
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{ mt: 1 }}
                                color={
                                    quiz.status === 'active' ? 'primary' :
                                        quiz.status === 'submitted' ? 'success' :
                                            'inherit'
                                }
                                disabled={quiz.status === 'expired' || quiz.status === 'upcoming'}
                                onClick={() => navigate(`/student/quiz/${quiz._id}`)}
                            >
                                {quiz.status === 'submitted' ? "View Result" :
                                    quiz.status === 'expired' ? "Expired" :
                                        quiz.status === 'upcoming' ? "Upcoming" : "Attempt"}
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default StudentQuizzes;
