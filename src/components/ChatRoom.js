import { Button, Input, List } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const { TextArea } = Input;

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://65.49.207.149:8088');//这里用localhost无法连上websocket服务
    ws.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input && nickname) {
      const message = { type: 'text', content: input, sender: nickname };
      ws.current.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleSetNickname = () => {
    if (nickname.trim()) {
      setIsNicknameSet(true);
      ws.current.send(JSON.stringify({ type: 'set_nickname', nickname }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!isNicknameSet ? (
        <div>
          <Input
            placeholder="请输入您的昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Button type="primary" onClick={handleSetNickname}>
            设置昵称
          </Button>
        </div>
      ) : (
        <div>
          <List
            size="small"
            bordered
            dataSource={messages}
            renderItem={(item) => (
              <List.Item>
                <strong>{item.sender}: </strong> <span style={{ wordWrap: 'break-word' }}>{item.content}</span>
              </List.Item>
            )}
            style={{ marginBottom: '20px', height: '400px', overflowY: 'scroll' }}
          />
          <TextArea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={sendMessage}
          />
          <Button type="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
            发送
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
