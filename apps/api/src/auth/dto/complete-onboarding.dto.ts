import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'CNY'] as const;

export class CompleteOnboardingDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  company!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  jobTitle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  country!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  regionCity?: string;

  @IsIn(CURRENCIES)
  preferredCurrency!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  industry!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @IsString({ each: true })
  procurementCategories!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @IsString({ each: true })
  commodities!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(80)
  purchaseMix?: string;

  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  sourcingCountries!: string[];

  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  tradeLanes!: string[];

  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  procurementChallenges!: string[];

  @IsBoolean()
  newsletterOptIn!: boolean;
}
