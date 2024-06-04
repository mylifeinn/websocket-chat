const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const server = new WebSocket.Server({ port: 8088 });

const app = express();
const clients = new Map();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 启用 CORS 允许所有来源
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许所有来源的请求
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

server.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'text') {
      // 广播消息给所有客户端
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } else if (data.type === 'set_nickname') {
      // 存储客户端的昵称
      clients.set(ws, data.nickname);
    }
  });

  ws.on('close', () => {
    // 断开连接时删除客户端的昵称
    clients.delete(ws);
  });
});

console.log('WebSocket 服务器运行在 ws://localhost:8088');

// 启动静态文件服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`静态文件服务器运行在 http://localhost:${PORT}`);
});
