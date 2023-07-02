import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(81, { namespace: 'events', transports: ['websocket'] })
export class UserGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    return 'Hello world!';
  }
}
