import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { HelpersTransform } from '../core/helpers.transform';
import { SignUpRequestDto } from './dto/signup-request.dto';

export interface TokenResponse {
  name: string;
  email: string;
  token: string;
}

@Injectable()
export class AuthService {
  @Inject(UsersService) private readonly userService: UsersService;
  @Inject(JwtService) protected jwtService: JwtService;

  login(user: User): TokenResponse {
    const payload = {
      sub: user.id,
    };

    return {
      name: user.name,
      email: user.email,
      token: this.jwtService.sign(payload),
    };
  }

  async attemptLogin(authParams: AuthRequestDto): Promise<TokenResponse> {
    const user = await this.userService.findByEmail(authParams.email);

    if (user) {
      const compare = await HelpersTransform.compareHash(
        authParams.password,
        user.password,
      );

      if (compare) return this.login(user);
    }

    throw new UnauthorizedException('Email address or incorrect password.');
  }

  async signUp(signUpParams: SignUpRequestDto): Promise<void> {
    signUpParams.password = await HelpersTransform.generateHash(
      signUpParams.password,
    );

    await this.userService.create(signUpParams).then(async () => {
      await this.attemptLogin(signUpParams);
    });
  }
}
