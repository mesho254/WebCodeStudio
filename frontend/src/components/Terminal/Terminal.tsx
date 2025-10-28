import React, { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import 'xterm/css/xterm.css';
import io, { Socket } from 'socket.io-client';
import useStore from '../../store';
import { Box } from '@mui/material';

const Term: React.FC = () => {
  const { projectPath } = useStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const initTerminal = useCallback(() => {
    if (!terminalRef.current) return;

    xtermRef.current = new XTerm({
      rows: 20,
      cols: 80,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        cursorAccent: '#1e1e1e',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
      cursorBlink: true,
      allowTransparency: true,
      allowProposedApi: true,
    });

    // Add terminal addons
    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);
    xtermRef.current.loadAddon(new WebLinksAddon());
    xtermRef.current.loadAddon(new Unicode11Addon());

    xtermRef.current.open(terminalRef.current);
    fitAddonRef.current.fit();

    // Initialize socket connection
    socketRef.current = io(apiUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle terminal input
    xtermRef.current.onData(data => {
      socketRef.current?.emit('terminal_input', data);
    });

    // Handle terminal output
    socketRef.current.on('terminal_output', (output: string) => {
      xtermRef.current?.write(output);
    });

    // Handle socket connection events
    socketRef.current.on('connect', () => {
      xtermRef.current?.writeln('\x1B[1;32mConnected to terminal server\x1B[0m');
      if (projectPath) {
        socketRef.current?.emit('terminal_input', `cd "${projectPath}"\r`);
      }
    });

    socketRef.current.on('disconnect', () => {
      xtermRef.current?.writeln('\x1B[1;31mDisconnected from terminal server\x1B[0m');
    });

    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddonRef.current?.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      socketRef.current?.disconnect();
      xtermRef.current?.dispose();
    };
  }, [apiUrl, projectPath]);

  useEffect(() => {
    const cleanup = initTerminal();
    return () => {
      cleanup?.();
    };
  }, [initTerminal]);

  return (
    <Box 
      sx={{ 
        height: '100%',
        width: '100%',
        bgcolor: '#1e1e1e',
        overflow: 'hidden',
        '& .xterm': {
          height: '100%',
          padding: '4px',
        },
        '& .xterm-viewport': {
          overflow: 'auto !important',
        },
      }}
    >
      <div ref={terminalRef} className="terminal-container" />
    </Box>
  );
};

export default Term;