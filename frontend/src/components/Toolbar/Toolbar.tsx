import React from 'react';
import useStore from '../../store';
import axios from 'axios';
import { AppBar, Toolbar as MuiToolbar, Button, Switch, Typography } from '@mui/material';

const Toolbar: React.FC = () => {
  const { theme, setTheme } = useStore();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const runGitCommand = async (cmd: string) => {
    try {
      const res = await axios.post(`${apiUrl}/terminal/git`, { command: cmd });
      console.log(res.data.output);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar position="static" sx={{ boxShadow: 2 }}>
      <MuiToolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          WebCode Studio
        </Typography>
        <Button color="inherit" onClick={() => runGitCommand('status')} sx={{ mr: 1 }}>
          Git Status
        </Button>
        <Button color="inherit" onClick={() => runGitCommand('commit -m "Update"')} sx={{ mr: 1 }}>
          Commit
        </Button>
        <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        <Typography>Dark Mode</Typography>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;