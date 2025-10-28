import { Controller, Post, Body } from '@nestjs/common';
import { TerminalService } from './terminal.service';

@Controller('terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Post('run')
  async runCommand(@Body() body: { command: string }) {
    const output = await this.terminalService.runCommand(body.command);
    return { output };
  }

  @Post('git')
  async runGit(@Body() body: { command: string }) {
    const output = await this.terminalService.runGit(body.command);
    return { output };
  }
}