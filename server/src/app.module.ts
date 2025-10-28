import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { TerminalModule } from './terminal/terminal.module';
import { SettingsModule } from './settings/settings.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { PrismaService } from './prisma.service';  // Create this if needed, but PrismaClient is injectable

@Module({
  imports: [FilesModule, TerminalModule, SettingsModule, WebsocketsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}