import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Collapse, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewQuizResults = () => {
    const { quizId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [expandedSubmission, setExpandedSubmission] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/results/${quizId}`);
                setSubmissions(res.data);
            } catch (err) {
                console.error("Error fetching quiz submissions", err);
            }
        };
        fetchSubmissions();
    }, [quizId]);

    const toggleExpand = (index) => {
        setExpandedSubmission(prev => (prev === index ? null : index));
    };

    return (
        <>
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Quiz Submissions</Typography>

                {submissions.length === 0 ? (
                    <Typography>No submissions found.</Typography>
                ) : (
                    submissions.map((submission, idx) => (
                        <Card key={idx} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{submission.student.name} (Roll: {submission.student.rollNum})</Typography>
                                <Typography>Score: {submission.score}</Typography>

                                <Button variant="outlined" onClick={() => toggleExpand(idx)} sx={{ mt: 1 }}>
                                    {expandedSubmission === idx ? 'Hide Submission' : 'View Submission'}
                                </Button>

                                <Collapse in={expandedSubmission === idx}>
                                    <Box mt={2}>
                                        <Typography variant="subtitle1">Answers:</Typography>
                                        <List dense>
                                            {submission.answers.map((a, i) => (
                                                <ListItem key={i}>
                                                    <ListItemText
                                                        primary={`Q${a.questionIndex + 1}: Selected Option Index - ${a.selectedIndex}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Typography variant="caption" color="text.secondary">
                                            Submitted At: {new Date(submission.submittedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </CardContent>
                        </Card>

                    ))
                )}
            </Box>
            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => {
                    window.open(`${process.env.REACT_APP_BASE_URL}/quiz/results/export/${quizId}`, '_blank');
                }}
            >
                Download Results as Excel
            </Button>

        </>

    );
};

export default ViewQuizResults;
