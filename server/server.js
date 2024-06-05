const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = new WebSocket.Server({ port: 8088 });

const clients = new Map();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

server.on('connection', ws => {
  ws.on('message', message => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      // 处理非JSON格式的消息
      console.error('Received non-JSON message:', message);
      return;
    }

    if (data.type === 'text') {
      // 广播消息给所有客户端
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } else if (data.type === 'set_nickname') {
      // 存储客户端昵称
      clients.set(ws, data.nickname);
    }
  });

  ws.on('close', () => {
    // 客户端断开连接时移除昵称
    clients.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8088');

// 启动静态文件服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Static file server is running on http://localhost:${PORT}`);
});
