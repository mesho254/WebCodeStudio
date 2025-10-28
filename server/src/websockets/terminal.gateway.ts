import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as pty from '@lydell/node-pty';

@WebSocketGateway({ cors: true })
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private ptys: Map<string, pty.IPty> = new Map();

  handleConnection(client: Socket) {
    const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env as any,
    });

    this.ptys.set(client.id, ptyProcess);

    ptyProcess.onData((data) => client.emit('terminal_output', data));

    client.on('disconnect', () => this.handleDisconnect(client));
  }

  handleDisconnect(client: Socket) {
    const ptyProcess = this.ptys.get(client.id);
    if (ptyProcess) {
      ptyProcess.kill();
      this.ptys.delete(client.id);
    }
  }

  @SubscribeMessage('terminal_input')
  handleInput(client: Socket, data: string) {
    const ptyProcess = this.ptys.get(client.id);
    if (ptyProcess) {
      ptyProcess.write(data);
    }
  }
}