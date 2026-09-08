import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  question!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsObject()
  currentContext?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  profile?: Record<string, unknown>;
}
