import { Controller, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('save')
  async saveSettings(@Body() body: { fontSize: number }) {
    // Assume userId '1' for default; in prod, use auth
    await this.settingsService.saveSettings(1, body.fontSize);
    return { success: true };
  }
}