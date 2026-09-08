import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  regionCity?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procurementCategories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  commodities?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(80)
  purchaseMix?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourcingCountries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tradeLanes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procurementChallenges?: string[];
}
