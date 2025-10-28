// Utility functions, e.g., getLanguageFromExt
export const getLanguageFromExt = (file: string): string => {
  const ext = file.split('.').pop();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'py': return 'python';
    case 'cpp': return 'cpp';
    default: return 'plaintext';
  }
};