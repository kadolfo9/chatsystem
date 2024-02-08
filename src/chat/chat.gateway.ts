import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CustomSocket } from 'src/chat/adapters/chat.adapter';
import { ChatGatewayGuard } from './chat.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  private logger: Logger = new Logger('MessageGateway');

  afterInit() {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: CustomSocket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: CustomSocket) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @UseGuards(ChatGatewayGuard)
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: CustomSocket,
  ) {
    // console.log(client.user);
    console.log(`${client.id} enviou: ${payload.data}`);
    this.server.emit('message', {
      clientId: client.id,
      message: payload.data,
    });
  }
}
