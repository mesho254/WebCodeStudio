import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FileExplorer from './components/FileExplorer/FileExplorer';
import Editor from './components/Editor/Editor';
import Terminal from './components/Terminal/Terminal';
import Toolbar from './components/Toolbar/Toolbar';
import Settings from './components/Settings/Settings';
import useStore from './store';
import './App.css';

const App: React.FC = () => {
  const { theme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const muiTheme = createTheme({
    palette: { 
      mode: theme,
      background: {
        default: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        paper: theme === 'dark' ? '#252526' : '#f3f3f3'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--background-color': theme === 'dark' ? '#1e1e1e' : '#ffffff',
            '--divider-color': theme === 'dark' ? '#474747' : '#e0e0e0'
          }
        }
      }
    }
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="toolbar">
          <IconButton 
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={toggleSidebar}
            size="small"
          >
            <MenuIcon />
          </IconButton>
          <Toolbar />
        </div>
        
        <div className="workspace-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div 
            className={`sidebar ${sidebarOpen ? 'open' : ''}`} 
            style={{ display: { xs: sidebarOpen ? 'block' : 'none', md: 'block' }, height: '100%', boxSizing: 'border-box' }}
          >
            <FileExplorer />
          </div>
          
          <div className="editor-container" style={{ flex: 1, height: '100%', boxSizing: 'border-box' }}>
            <Editor />
          </div>
          
          <div className="sidebar" style={{ height: '100%', borderLeft: '1px solid var(--divider-color)', borderRight: 'none', boxSizing: 'border-box' }}>
            <Settings />
          </div>
        </div>
        
        <div className="terminal-container" style={{ height: '200px', boxSizing: 'border-box' }}>
          <Terminal />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;