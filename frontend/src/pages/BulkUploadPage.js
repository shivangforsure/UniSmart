import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  InputLabel,
  Input,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// ✅ Redux
import { useDispatch, useSelector } from 'react-redux';
import { getAllStudents } from '../redux/studentRelated/studentHandle'; // adjust path if needed

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { currentUser } = useSelector((state) => state.user);

  // ✅ Hardcoded school ID
  const schoolId = '64f7e5ad47efac321234abcd';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await axios.get('http://localhost:5000/subjects');
        const classRes = await axios.get('http://localhost:5000/classes');

        setSubjects(subjectsRes.data);
        setClasses(classRes.data);
      } catch (error) {
        console.error('Error fetching dropdowns', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !subjectId || !classId) {
      alert('Please select subject, class, and a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', subjectId);
    formData.append('classId', classId);
    formData.append('schoolId', schoolId); // ✅ hardcoded

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/bulk-upload', formData);
      setResult(res.data);

      // ✅ Refresh student list
      // dispatch(getAllStudents(currentUser.school));
      dispatch(getAllStudents(schoolId));
      navigate('/Admin/students');

    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Bulk Attendance Upload</Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select
            labelId="subject-label"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.subName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="class-label">Class</InputLabel>
          <Select
            labelId="class-label"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.sclassName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mb={2}>
          <InputLabel>Excel File</InputLabel>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            fullWidth
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </form>

      {result && (
        <Box mt={4}>
          <Typography variant="h6">Upload Result</Typography>
          <Typography>✅ Success Count: {result.successCount}</Typography>
          <Typography>❌ Failed Rows: {result.failedRows?.length}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BulkUploadPage;
