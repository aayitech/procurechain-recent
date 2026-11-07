import { IsEmail, IsIn, IsObject, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class GhlTrackDto {
  @IsIn(['health_started', 'health_completed', 'calculator_used', 'platform_registered'])
  event!: 'health_started' | 'health_completed' | 'calculator_used' | 'platform_registered';

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'health_completed')
  @IsIn(['Strong', 'Developing', 'Opportunity'])
  scoreBand?: 'Strong' | 'Developing' | 'Opportunity';

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'health_completed')
  @IsString()
  @MaxLength(200)
  identifiedArea?: string;

  @ValidateIf((dto: GhlTrackDto) => dto.event === 'calculator_used')
  @IsIn(['RFQ Efficiency', 'TCO', 'Savings'])
  calculator?: 'RFQ Efficiency' | 'TCO' | 'Savings';

  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(200) companyName?: string;
  @IsOptional() @IsObject() utm?: Record<string, string>;
  @IsOptional() @IsObject() profile?: Record<string, unknown>;
}
