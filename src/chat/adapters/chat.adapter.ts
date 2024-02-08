import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WebSocketServerOptions } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

export interface CustomSocket extends Socket {
  user?: User & SessionUser;
}

export class AuthAdapter extends IoAdapter {
  private readonly logger = new Logger(AuthAdapter.name);
  private userService: UsersService;

  constructor(private app: INestApplicationContext) {
    super(app);

    app.resolve<UsersService>(UsersService).then((userService) => {
      this.userService = userService;
    });
  }

  createIOServer(port: number, options?: WebSocketServerOptions): any {
    const server = super.createIOServer(port, { ...options, cors: true });

    server.use(async (socket: CustomSocket, next) => {
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];

      if (token?.name && token?.email) {
        const user = await this.userService.findByEmail(token?.email);

        if (user.name === token?.name && user.email === token?.email) {
          socket.user = token;
          next();
        } else {
          next(new Error('Authentication error.'));
        }
      } else {
        next(new Error('Not authenticated.'));
      }
    });

    return server;
  }
}

interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
}
