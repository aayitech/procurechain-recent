import { IsEmail, Matches } from 'class-validator';

export class VerifyLoginCodeDto {
  @IsEmail()
  email!: string;

  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code!: string;
}
