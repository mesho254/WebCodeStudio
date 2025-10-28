import { Module } from '@nestjs/common';
import { TerminalGateway } from './terminal.gateway';
import { TerminalService } from '../terminal/terminal.service';

@Module({
  providers: [TerminalGateway, TerminalService],
})
export class WebsocketsModule {}