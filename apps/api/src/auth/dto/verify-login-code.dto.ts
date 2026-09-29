import { IsEmail, IsIn, Matches } from 'class-validator';
import type { AuthMode } from './request-login-code.dto';

export class VerifyLoginCodeDto {
  @IsEmail()
  email!: string;

  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code!: string;

  @IsIn(['LOGIN', 'SIGNUP'])
  mode!: AuthMode;
}
