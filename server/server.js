const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const server = new WebSocket.Server({ port: 8088 });

const app = express();
const clients = new Map();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

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

// 启动静态文件服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Static file server is running on http://localhost:${PORT}`);
});
