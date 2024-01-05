import { Test, TestingModule } from '@nestjs/testing';
import io, { Socket } from 'socket.io-client';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

describe('SocketIO Test', () => {
  let socket: Socket;

  beforeEach(async () => {
    const socket: Socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('connected');
    });
  });

  it('show data from event', () => {
    expect(socket).toBeDefined();

    socket.on('message', (data) => {
      console.log(data);
    });
  });
});
