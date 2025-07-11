import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Button, RadioGroup, Radio,
    FormControlLabel, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AttemptQuiz = () => {
    const { quizId } = useParams();
    const { currentUser } = useSelector(state => state.user);
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/${quizId}`, {
                    params: { studentId: currentUser._id }
                });

                const quizData = res.data;
                const now = new Date();
                const start = new Date(quizData.startTime);
                const end = new Date(quizData.endTime);

                if (now < start) {
                    alert("Quiz has not started yet.");
                    return navigate('/student/dashboard');
                }

                if (now > end && !quizData.alreadySubmitted) {
                    alert("Quiz has already ended.");
                    return navigate('/student/dashboard');
                }

                setQuiz(quizData);

                // If quiz already submitted, fetch submission
                if (quizData.questions[0]?.correctAnswerIndex !== undefined) {
                    const resultRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/results/${quizId}`);
                    const studentSubmission = resultRes.data.find(s => s.student._id === currentUser._id);

                    if (studentSubmission) {
                        const selected = {};
                        studentSubmission.answers.forEach(a => {
                            selected[a.questionIndex] = a.selectedIndex;
                        });
                        setSelectedAnswers(selected);
                        setSubmitted(true);

                        const correctAnswers = quizData.questions.map(q => q.correctAnswerIndex);
                        let scoreCount = 0;
                        correctAnswers.forEach((correct, i) => {
                            if (selected[i] === correct) scoreCount++;
                        });
                        setScore(scoreCount);
                    }
                } else {
                    // If not submitted, start timer
                    const secondsLeft = quizData.durationMinutes * 60;
                    setTimeLeft(secondsLeft);
                }
            } catch (err) {
                console.error("Failed to load quiz", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, navigate]);

    useEffect(() => {
        if (timeLeft <= 0 || submitted) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, submitted]);

    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${mins}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleAnswerChange = (index, value) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [index]: parseInt(value) }));
    };

    const handleSubmit = async () => {
        if (submitted) return;

        const payload = {
            studentId: currentUser._id,
            answers: Object.entries(answers).map(([qIndex, selectedIndex]) => ({
                questionIndex: parseInt(qIndex),
                selectedIndex: parseInt(selectedIndex)
            }))
        };

        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/quiz/submit/${quiz._id}`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const correctAnswers = quiz.questions.map(q => q.correctAnswerIndex);
            let scoreCount = 0;
            correctAnswers.forEach((correct, i) => {
                if (answers[i] === correct) scoreCount++;
            });
            setScore(scoreCount);
            setSubmitted(true);

            const refreshedQuiz = await axios.get(`${process.env.REACT_APP_BASE_URL}/quiz/${quiz._id}`, {
                params: { studentId: currentUser._id }
            });
            setQuiz(refreshedQuiz.data);
            setSelectedAnswers(answers);
        } catch (err) {
            alert("Submission failed: Already submitted or expired.");
            console.error("Error submitting quiz", err);
        }
    };

    useEffect(() => {
        if (timeLeft === 0 && quiz && !submitted) {
            handleSubmit();
        }
    }, [timeLeft]);

    if (loading || !quiz) return <CircularProgress />;

    return (
        <Box p={3}>
            <Typography variant="h4">{quiz.title}</Typography>

            {!submitted && (
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    Time Left: {formatTime(timeLeft)}
                </Typography>
            )}

            {quiz.questions.map((q, idx) => {
                const selected = submitted ? selectedAnswers[idx] : answers[idx];
                return (
                    <Box key={idx} my={2} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                        <Typography>{idx + 1}. {q.text}</Typography>
                        <RadioGroup
                            value={selected?.toString() ?? ''}
                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        >
                            {q.options.map((opt, i) => {
                                const isCorrect = i === q.correctAnswerIndex;
                                const isSelected = selected === i;
                                const showColors = submitted;

                                return (
                                    <FormControlLabel
                                        key={i}
                                        value={i.toString()}
                                        control={<Radio disabled={submitted} />}
                                        label={opt}
                                        sx={{
                                            color:
                                                showColors && isCorrect ? 'green' :
                                                    showColors && isSelected && !isCorrect ? 'red' : 'inherit'
                                        }}
                                    />
                                );
                            })}
                        </RadioGroup>
                        {submitted && q.correctAnswerIndex != null && (
                            <Typography variant="caption" color="green">
                                Correct Answer: {q.options[q.correctAnswerIndex]}
                            </Typography>
                        )}
                    </Box>
                );
            })}

            {!submitted ? (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit Quiz
                </Button>
            ) : (
                <Box mt={3}>
                    <Typography variant="h6" color="primary">
                        ✅ Your Score: {score} / {quiz.questions.length}
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/student/quizzes')}
                    >
                        Back to Quiz List
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default AttemptQuiz;
