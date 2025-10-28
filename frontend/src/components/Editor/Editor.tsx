import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import useStore, { type FileNode } from '../../store';
import { Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const CodeEditor: React.FC = () => {
  const { currentFile, openFiles, fileTree, setCurrentFile, theme, updateFileContent } = useStore();
  const editorRef = useRef<any>(null);
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
          defaultLanguage="javascript"
          value={currentFile ? findContent(currentFile) : ''}
          onChange={(value) => currentFile && updateFileContent(currentFile, value || '')}
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