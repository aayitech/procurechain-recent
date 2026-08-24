import { IsIn, IsOptional, IsString } from 'class-validator';
import { ENGAGEMENT_EVENT_POINTS } from '../engagement.config';

export class TrackEventDto {
  @IsString()
  sessionId!: string;

  @IsIn(Object.keys(ENGAGEMENT_EVENT_POINTS))
  eventType!: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}
