import { IsEmail, IsIn, IsObject, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class GhlTrackDto {
  @IsIn(['health_started', 'health_completed', 'calculator_used', 'platform_registered', 'follow_up_requested', 'newsletter_subscribed', 'nader_engaged', 'benchmarking_used', 'login'])
  event!: 'health_started' | 'health_completed' | 'calculator_used' | 'platform_registered' | 'follow_up_requested' | 'newsletter_subscribed' | 'nader_engaged' | 'benchmarking_used' | 'login';

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'health_completed')
  @IsIn(['Strong', 'Developing', 'Opportunity'])
  scoreBand?: 'Strong' | 'Developing' | 'Opportunity';

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'health_completed')
  @IsString()
  @MaxLength(200)
  identifiedArea?: string;

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'calculator_used')
  @IsString() @MaxLength(100)
  calculator?: string;

  @IsOptional() @IsString() @MaxLength(254) lastName?: string;
  @IsOptional() @IsString() @MaxLength(100) phone?: string;
  @IsOptional() @IsString() @MaxLength(500) message?: string;
  @IsOptional() @IsString() @MaxLength(200) productInterest?: string;
  @IsOptional() @IsString() @MaxLength(200) campaignFit?: string;
  @IsOptional() @IsString() @MaxLength(200) campaignEntryAsset?: string;
  @IsOptional() @IsString() @MaxLength(300) landingPage?: string;

  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(200) companyName?: string;
  @IsOptional() @IsObject() utm?: Record<string, string>;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
}
