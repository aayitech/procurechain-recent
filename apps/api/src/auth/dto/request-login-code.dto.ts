import { IsEmail, IsIn } from 'class-validator';

export type AuthMode = 'LOGIN' | 'SIGNUP';

export class RequestLoginCodeDto {
  @IsEmail()
  email!: string;

  @IsIn(['LOGIN', 'SIGNUP'])
  mode!: AuthMode;
}
