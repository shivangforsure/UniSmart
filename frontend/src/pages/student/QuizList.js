import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuizList = ({ classId, subjectId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if (!classId || !subjectId) return;
        setLoading(true);
        setError(null);

        axios.get(`/quiz/all/${classId}/${subjectId}`)
            .then(res => setQuizzes(res.data))
            .catch(() => setError("Failed to load quizzes"))
            .finally(() => setLoading(false));
    }, [classId, subjectId]);

    const now = new Date();

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Assigned Quizzes</Typography>

            {loading && <Typography>Loading quizzes...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && quizzes.length === 0 && (
                <Typography>No quizzes assigned yet for this subject.</Typography>
            )}

            {quizzes.map(q => {
                const start = new Date(q.startTime);
                const end = new Date(q.endTime);
                const isActive = now >= start && now <= end;

                return (
                    <Box key={q._id} sx={{ m: 2, p: 2, border: '1px solid gray', borderRadius: 1 }}>
                        <Typography variant="h6">{q.title}</Typography>
                        <Typography>From: {start.toLocaleString()}</Typography>
                        <Typography>To: {end.toLocaleString()}</Typography>
                        {q.durationMinutes && (
                            <Typography>Duration: {q.durationMinutes} min</Typography>
                        )}
                        <Button
                            disabled={!isActive}
                            onClick={() => nav(`/student/quiz/${q._id}`)}
                            variant="contained"
                            sx={{ mt: 1 }}
                            color={isActive ? "primary" : "secondary"}
                        >
                            {isActive ? "Attempt" : "Closed"}
                        </Button>
                    </Box>
                );
            })}
        </Box>
    );
};

export default QuizList;
