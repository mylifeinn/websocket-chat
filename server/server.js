const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8088 });

const clients = new Map();

server.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'text') {
      // Broadcast message to all clients
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } else if (data.type === 'set_nickname') {
      // Store the client's nickname
      clients.set(ws, data.nickname);
    }
  });

  ws.on('close', () => {
    // Remove the client's nickname on disconnect
    clients.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8088');
