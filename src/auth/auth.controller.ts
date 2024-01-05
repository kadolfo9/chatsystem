import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService, TokenResponse } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';

@Controller('auth')
export class AuthController {
  @Inject(AuthService) private readonly authService: AuthService;

  @Post()
  async auth(@Body() authParams: AuthRequestDto): Promise<TokenResponse> {
    return this.authService.attemptLogin(authParams);
  }
}
