import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../../store';
import { Box, TextField, Button, Typography } from '@mui/material';

const Settings: React.FC = () => {
  const { fontSize, setFontSize } = useStore();
  const [newFontSize, setNewFontSize] = useState(fontSize);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const saveSettings = async () => {
    try {
      await axios.post(`${apiUrl}/settings/save`, { fontSize: newFontSize });
      setFontSize(newFontSize);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3, width: { xs: '100%', md: '300px' } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <TextField
        label="Font Size"
        type="number"
        value={newFontSize}
        onChange={(e) => setNewFontSize(Number(e.target.value))}
        size="small"
        sx={{ mb: 2, width: '100%' }}
      />
      <Button variant="contained" onClick={saveSettings} fullWidth>
        Save
      </Button>
    </Box>
  );
};

export default Settings;