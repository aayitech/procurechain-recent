import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { GhlTrackController } from './ghl-track.controller';
import { GhlTrackingService } from './ghl-tracking.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ secret: config.get<string>('JWT_SECRET') }),
    }),
  ],
  controllers: [GhlTrackController],
  providers: [GhlTrackingService],
  exports: [GhlTrackingService],
})
export class GhlTrackModule {}
