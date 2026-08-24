import { IsArray, IsBoolean, IsEmail, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { LeadSource } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  annualSpendBand?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoriesOfInterest?: string[];

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsBoolean()
  newsletterOptIn?: boolean;

  @IsEnum(LeadSource)
  source!: LeadSource;

  @IsOptional()
  @IsString()
  sourceDetail?: string;

  // Arbitrary extra key/value pairs synced to GHL as custom fields — e.g.
  // Health Check scores, primary/secondary gap, engagement score. Kept
  // generic here rather than adding health-check-specific columns to Lead.
  @IsOptional()
  @IsObject()
  customFields?: Record<string, string | number | boolean>;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
