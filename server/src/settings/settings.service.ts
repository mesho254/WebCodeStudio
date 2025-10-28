import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async saveSettings(userId: number, fontSize: number) {
    await this.prisma.settings.upsert({
      where: { userId },
      update: { fontSize },
      create: { userId, fontSize },
    });
  }
}