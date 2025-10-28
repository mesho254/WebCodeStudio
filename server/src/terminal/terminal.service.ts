import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class TerminalService {
  async runCommand(command: string): Promise<string> {
    const { stdout, stderr } = await execAsync(command);
    return stderr || stdout;
  }

  async runGit(command: string): Promise<string> {
    return this.runCommand(`git ${command}`);
  }
}