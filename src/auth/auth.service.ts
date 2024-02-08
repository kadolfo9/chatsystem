import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { HelpersTransform } from '../core/helpers.transform';
import { SignUpRequestDto } from './dto/signup-request.dto';

export interface TokenResponse {
  token: string;
}

@Injectable()
export class AuthService {
  @Inject(UsersService) private readonly userService: UsersService;
  @Inject(JwtService) protected jwtService: JwtService;

  login(user: User): TokenResponse {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      token: jwtToken,
    };
  }

  async attemptLogin(authParams: AuthRequestDto): Promise<TokenResponse> {
    const { email, password } = authParams;

    const user = await this.userService.findByEmail(email);

    if (user) {
      const compare = await HelpersTransform.compareHash(
        password,
        user.password,
      );

      if (compare) return this.login(user);
    } else {
      throw new UnauthorizedException(
        'Incorrect Email address or incorrect password.',
      );
    }
  }

  async signUp(signUpParams: SignUpRequestDto): Promise<void> {
    const user = this.userService.findByEmail(signUpParams.email);
    if (user) throw new BadRequestException('User with this e-mail exists.');

    signUpParams.password = await HelpersTransform.generateHash(
      signUpParams.password,
    );

    await this.userService.create(signUpParams).then(async () => {
      await this.attemptLogin(signUpParams);
    });
  }

  async verifyToken(token: string) {
    const checkToken = await this.jwtService.verifyAsync(token);

    return checkToken;
  }
}
