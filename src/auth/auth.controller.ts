import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService, TokenResponse } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Inject(AuthService) private readonly authService: AuthService;

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async auth(@Body() authParams: AuthRequestDto): Promise<TokenResponse> {
    return this.authService.attemptLogin(authParams);
  }

  @Post('signup')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<void> {
    return this.authService.signUp(signUpRequestDto);
  }

  @Get('profile')
  async getUser(@Request() request) {
    return request.user;
  }
}
