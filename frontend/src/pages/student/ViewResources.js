import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ViewResources = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [resources, setResources] = useState([]);

    const fetchResources = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/resources/${currentUser.subject}`);
            setResources(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5">Available Resources</Typography>
            <List>
                {resources.length > 0 ? resources.map((res) => (
                    <ListItem key={res._id}>
                        <MuiLink href={res.fileUrl} target="_blank" rel="noopener noreferrer">
                            <ListItemText primary={res.originalName} secondary={res.fileType} />
                        </MuiLink>
                    </ListItem>
                )) : <Typography>No resources available.</Typography>}
            </List>
        </Box>
    );
};

export default ViewResources;
