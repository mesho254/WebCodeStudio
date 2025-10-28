import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface Store {
  projectPath: string | null;
  setProjectPath: (path: string | null) => void;
  fileTree: FileNode | null;
  setFileTree: (tree: FileNode | null) => void;
  openFiles: string[];  // Paths of open files
  currentFile: string | null;
  setCurrentFile: (path: string | null) => void;
  updateFileContent: (path: string, content: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const useStore = create<Store>((set, get) => ({
  projectPath: null,
  setProjectPath: (path) => set({ projectPath: path }),
  fileTree: null,
  setFileTree: (tree) => set({ fileTree: tree }),
  openFiles: [],
  currentFile: null,
  setCurrentFile: (path) => set({ currentFile: path, openFiles: [...new Set([...get().openFiles, path])] }),
  updateFileContent: (path, content) => set((state) => {
    const updateTree = (node: FileNode): FileNode => {
      if (node.path === path) return { ...node, content };
      if (node.children) return { ...node, children: node.children.map(updateTree) };
      return node;
    };
    return { fileTree: state.fileTree ? updateTree(state.fileTree) : null };
  }),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  fontSize: 14,
  setFontSize: (size) => set({ fontSize: size }),
}));

export default useStore;