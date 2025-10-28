import { Controller, Post, Body } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileNode } from './types';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('load')
  async loadProject(@Body() body: { path: string }): Promise<{ tree: FileNode }> {
    return this.filesService.loadProject(body.path);
  }

  @Post('create')
  async createItem(@Body() body: { path: string; content?: string; isFolder: boolean }) {
    await this.filesService.createFile(body.path, body.content, body.isFolder);
    return { success: true };
  }

  @Post('delete')
  async deleteItem(@Body() body: { path: string }) {
    await this.filesService.deleteItem(body.path);
    return { success: true };
  }
}