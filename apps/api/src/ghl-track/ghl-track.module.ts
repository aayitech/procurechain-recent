import { Module } from '@nestjs/common';
import { GhlTrackController } from './ghl-track.controller';

@Module({ controllers: [GhlTrackController] })
export class GhlTrackModule {}
