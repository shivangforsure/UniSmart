import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField,
    CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import bgpic from "../assets/designlogin.jpg"
import bgpic from "../assets/loginbg.png"
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import Popup from '../components/Popup';
import { loginUser } from '../redux/userRelated/userHandle';
import axios from 'axios';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [otpMode, setOtpMode] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loader, setLoader] = useState(false);
    const [guestLoader, setGuestLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            setEmailError(true);
            return;
        }
        setLoader(true);
        try {
            const res = await axios.post('http://localhost:5000/send-otp', { email, role });
            setOtpSent(true);
            setMessage(res.data.message);
            setShowPopup(true);
        } catch (error) {
            setMessage("Failed to send OTP");
            setShowPopup(true);
        }
        setLoader(false);
    };

    const handleOtpLogin = async (e) => {
        e.preventDefault();
        if (!otp || !email) {
            setMessage("Email and OTP required");
            setShowPopup(true);
            return;
        }
        setLoader(true);
        try {
            const res = await axios.post('http://localhost:5000/verify-otp', { email, otp, role });
            if (res.data.role) {
                dispatch({ type: 'user/authSuccess', payload: res.data });
            } else {
                setMessage(res.data.message);
                setShowPopup(true);
            }
        } catch (err) {
            setMessage("OTP verification failed");
            setShowPopup(true);
        }
        setLoader(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) return;

            const fields = { rollNum, studentName, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        } else {
            const password = event.target.password.value;
            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            const roleToPath = {
                Admin: '/Admin/dashboard',
                Teacher: '/Teacher/dashboard',
                Student: '/Student/dashboard'
            };
            navigate(roleToPath[currentRole]);
        } else if (status === 'failed' || status === 'error') {
            setMessage(response || "Network Error");
            setShowPopup(true);
            setLoader(false);
            setGuestLoader(false);
        }
    }, [status, currentRole, navigate, currentUser, response]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>{role} Login</Typography>
                        <Typography variant="h7">Welcome back! Please enter your details</Typography>

                        <Box component="form" noValidate onSubmit={otpMode ? handleOtpLogin : handleSubmit} sx={{ mt: 2 }}>
                            {role !== "Student" && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(false);
                                    }}
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                />
                            )}
                            {role === "Student" && !otpMode && (
                                <>
                                    <TextField margin="normal" required fullWidth id="rollNumber" label="Roll Number" name="rollNumber" />
                                    <TextField margin="normal" required fullWidth id="studentName" label="Name" name="studentName" />
                                </>
                            )}
                            {!otpMode ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={toggle ? 'text' : 'password'}
                                        id="password"
                                        onChange={() => setPasswordError(false)}
                                        error={passwordError}
                                        helperText={passwordError && 'Password is required'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setToggle(!toggle)}>
                                                        {toggle ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <LightPurpleButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                                        {loader ? <CircularProgress size={24} color="inherit" /> : "Login"}
                                    </LightPurpleButton>
                                </>
                            ) : (
                                <>
                                    {otpSent && (
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="otp"
                                            label="Enter OTP"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    )}
                                    {!otpSent ? (
                                        <Button fullWidth variant="contained" onClick={handleSendOtp} sx={{ mt: 2 }}>
                                            {loader ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                                        </Button>
                                    ) : (
                                        <>
                                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                                                {loader ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                                            </Button>
                                            <Button fullWidth onClick={handleSendOtp} sx={{ mt: 1 }}>
                                                Resend OTP
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}

                            {role !== "Student" && (
                                <Button fullWidth onClick={() => setOtpMode(!otpMode)} sx={{ mt: 2 }}>
                                    {otpMode ? "Login with Password" : "Login with OTP"}
                                </Button>
                            )}

                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: `url(${bgpic})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
            </Grid>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={guestLoader}>
                <CircularProgress color="inherit" />
                Please Wait
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

export default LoginPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
