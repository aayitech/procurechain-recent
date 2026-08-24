import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class HealthCheckLeadDto {
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
  jobTitle?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  industry?: string;
}

export class SubmitHealthCheckDto {
  @IsObject()
  answers!: Record<string, string>;

  @ValidateNested()
  @Type(() => HealthCheckLeadDto)
  lead!: HealthCheckLeadDto;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
