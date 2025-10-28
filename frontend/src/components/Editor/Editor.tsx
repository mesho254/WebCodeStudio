import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import useStore, { type FileNode } from '../../store';
import { Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const CodeEditor: React.FC = () => {
  const { currentFile, openFiles, fileTree, setCurrentFile, theme, updateFileContent } = useStore();
  const editorRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ theme: theme === 'dark' ? 'vs-dark' : 'vs' });
    }
  }, [theme]);

  const findNode = (path: string): FileNode | undefined => {
    const find = (node: FileNode): FileNode | undefined => {
      if (node.path === path) return node;
      return node.children?.map(find).find(c => c !== undefined);
    };
    return find(fileTree!);
  };

  const findContent = (path: string): string => {
    const node = findNode(path);
    return node?.content || '';
  };

  useEffect(() => {
    if (currentFile) {
      const node = findNode(currentFile);
      if (node && node.content === undefined) {
        const load = async () => {
          try {
            const res = await axios.post(`${apiUrl}/files/read`, { path: currentFile });
            updateFileContent(currentFile, res.data.content);
          } catch (err) {
            console.error(err);
          }
        };
        load();
      }
    }
  }, [currentFile, fileTree, updateFileContent, apiUrl]);

  const saveFile = async (path: string, content: string) => {
    try {
      await axios.post(`${apiUrl}/files/write`, { path, content });
    } catch (err) {
      console.error('Failed to save file:', err);
    }
  };

  const getLanguage = (filePath: string | null): string => {
    if (!filePath) return 'plaintext';
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'env':
      case 'gitignore':
        return 'plaintext';
      default:
        return 'plaintext';
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs
        value={currentFile}
        onChange={(_, value) => setCurrentFile(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {openFiles.map(path => <Tab key={path} label={path.split('/').pop()} value={path} />)}
      </Tabs>
      <Box sx={{ flex: 1, height: '100%' }}>
        <Editor
          height="100%"
          language={getLanguage(currentFile)}
          value={currentFile ? findContent(currentFile) : ''}
          onChange={(value) => {
            if (currentFile) {
              updateFileContent(currentFile, value || '');
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                saveFile(currentFile, value || '');
              }, 1000);
            }
          }}
          onMount={(editor) => (editorRef.current = editor)}
          options={{
            minimap: { enabled: true },
            lineNumbers: 'on',
            bracketPairColorization: { enabled: true },
            fontSize: 14,
            tabSize: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default CodeEditor;