import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore, { type FileNode } from '../../store';
import { ExpandMore, ChevronRight, Folder, InsertDriveFile, Add, Delete } from '@mui/icons-material';
import { Box, TextField, Button, IconButton, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';

const FileExplorer: React.FC = () => {
  const { fileTree, setFileTree, setCurrentFile, projectPath, setProjectPath } = useStore();
  const [newName, setNewName] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (fileTree?.path) {
      setExpanded(new Set([fileTree.path]));
    }
  }, [fileTree]);

  const openFolder = async () => {
    let folderPath: string | undefined;
    if ((window as any).electron) {
      folderPath = await (window as any).electron.openFolder();
    } else {
      folderPath = prompt('Enter folder path (web fallback):');
    }
    if (folderPath) {
      loadProject(folderPath);
    }
  };

  const loadProject = async (path: string) => {
    try {
      const res = await axios.post(`${apiUrl}/files/load`, { path });
      setFileTree(res.data.tree);
      setProjectPath(path);
    } catch (err) {
      console.error(err);
    }
  };

  const createItem = async () => {
    if (!selectedPath || !newName) return;
    try {
      await axios.post(`${apiUrl}/files/create`, { path: `${selectedPath}/${newName}`, isFolder });
      loadProject(projectPath!);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (path: string) => {
    try {
      await axios.post(`${apiUrl}/files/delete`, { path });
      loadProject(projectPath!);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (path: string) => () => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  };

  const renderTree = (node: FileNode): JSX.Element => {
    const isFolder = node.type === 'folder';
    const handleClick = isFolder ? handleToggle(node.path) : () => setCurrentFile(node.path);

    return (
      <React.Fragment key={node.path}>
        <ListItem
          secondaryAction={
            <>
              {isFolder && (
                <IconButton edge="end" size="small" onClick={() => { setSelectedPath(node.path); setIsFolder(true); }}>
                  <Add />
                </IconButton>
              )}
              <IconButton edge="end" size="small" onClick={() => deleteItem(node.path)}>
                <Delete />
              </IconButton>
            </>
          }
        >
          <ListItemButton onClick={handleClick} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemIcon>
              {isFolder ? (expanded.has(node.path) ? <ExpandMore /> : <ChevronRight />) : <ChevronRight sx={{ visibility: 'hidden' }} />}
            </ListItemIcon>
            <ListItemIcon>
              {isFolder ? <Folder /> : <InsertDriveFile />}
            </ListItemIcon>
            <ListItemText primary={node.name} />
          </ListItemButton>
        </ListItem>
        {isFolder && (
          <Collapse in={expanded.has(node.path)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {node.children?.map(renderTree)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '250px' },
        height: '100%',
        bgcolor: 'background.paper',
        p: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button variant="contained" onClick={openFolder} sx={{ mb: 2, width: '100%' }}>
        Open Folder
      </Button>
      {projectPath && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Project: {projectPath}
        </Typography>
      )}
      {selectedPath && (
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={isFolder ? 'New Folder' : 'New File'}
            size="small"
            sx={{ flex: 1, mr: 1 }}
          />
          <Button variant="outlined" onClick={createItem}>
            Create
          </Button>
        </Box>
      )}
      {fileTree && (
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {renderTree(fileTree)}
        </List>
      )}
    </Box>
  );
};

export default FileExplorer;