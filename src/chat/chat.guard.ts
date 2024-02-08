import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatGatewayGuard implements CanActivate {
  private readonly logger = new Logger(ChatGatewayGuard.name);

  constructor(
    protected readonly userService: UsersService,
    protected readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake.auth?.token;

    try {
      return new Promise(async (resolve, reject) => {
        const user = await this.userService.findByEmail(token?.email);
        if (user) {
          context.switchToWs().getData().user = token; // save user info to a user object.
          resolve(Boolean(user));
        } else {
          reject(false);
        }
      });
    } catch (ex) {
      throw new WsException(ex.message);
    }
  }
}
