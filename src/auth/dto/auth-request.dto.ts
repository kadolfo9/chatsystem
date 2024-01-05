import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRequestDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
