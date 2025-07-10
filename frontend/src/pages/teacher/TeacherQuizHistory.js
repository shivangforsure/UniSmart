import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TeacherQuizHistory = () => {
    const { currentUser } = useSelector(state => state.user);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/quizzes/teacher/${currentUser._id}`);
                setQuizzes(res.data);
            } catch (err) {
                console.error("Error fetching quiz history", err);
            }
        };

        fetchQuizzes();
    }, [currentUser]);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Your Created Quizzes</Typography>
            {quizzes.length === 0 ? (
                <Typography>No quizzes created yet.</Typography>
            ) : (
                quizzes.map(quiz => (
                    <Card key={quiz._id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{quiz.title}</Typography>
                            <Typography variant="body2">
                                Class: {quiz.classId?.sclassName} | Subject: {quiz.subjectId?.subjectName}
                            </Typography>
                            <Typography variant="body2">
                                Scheduled: {new Date(quiz.startTime).toLocaleString()} - {new Date(quiz.endTime).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                Total Questions: {quiz.questions?.length}
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 1 }}
                                onClick={() => navigate(`/Teacher/quiz-results/${quiz._id}`)}
                            >
                                View Submissions
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default TeacherQuizHistory;
