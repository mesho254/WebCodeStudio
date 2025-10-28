import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileNode } from './types';

@Injectable()
export class FilesService {
  async loadProject(projectPath: string): Promise<{ tree: FileNode }> {
    async function buildTree(dir: string, relativePath: string = '', depth: number = 0): Promise<FileNode> {
      // Limit depth to prevent excessive recursion
      if (depth > 5) {
        return {
          name: path.basename(dir),
          path: dir,
          type: 'folder' as const,
          children: []
        };
      }

      const entries = await fs.readdir(dir, { withFileTypes: true });
      const childrenPromises = entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relativePath, entry.name);

        // Skip node_modules and hidden folders
        if (entry.isDirectory() && (entry.name === 'node_modules' || entry.name.startsWith('.'))) {
          return null;
        }

        if (entry.isDirectory()) {
          return buildTree(fullPath, relPath, depth + 1);
        } else {
          // Don't load file content immediately, only provide metadata
          return { 
            name: entry.name, 
            path: fullPath, 
            type: 'file' as const
          };
        }
      });

      const childrenResults = await Promise.all(childrenPromises);
      const children = childrenResults.filter((item): item is FileNode => item !== null);

      return { 
        name: path.basename(dir), 
        path: dir, 
        type: 'folder' as const, 
        children 
      };
    }
    const tree = await buildTree(projectPath);
    return { tree };
  }

  async readFile(filePath: string): Promise<{ content: string }> {
    const content = await fs.readFile(filePath, 'utf-8');
    return { content };
  }

  async writeFile(filePath: string, content: string) {
    await fs.writeFile(filePath, content);
  }

  async createFile(filePath: string, content: string = '', isFolder: boolean = false) {
    if (isFolder) {
      await fs.mkdir(filePath, { recursive: true });
    } else {
      await fs.writeFile(filePath, content);
    }
  }

  async deleteItem(itemPath: string) {
    await fs.rm(itemPath, { recursive: true, force: true });
  }
}