import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, message } from 'antd';
import CryptoJS from 'crypto-js';
import React, { useState } from 'react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [messageCount, setMessageCount] = useState(0);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    if (messageCount >= 5) {
      message.error('您已达到消息限制，不能继续发送。');
      return;
    }

    const userMessage = createChatMessage('user', inputValue);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setMessageCount((prevCount) => prevCount + 1);

    try {
      const aiResponse = await callXFYunTTS(inputValue);
      const aiMessage = createChatMessage('ai', aiResponse);
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('调用讯飞TTS时出错:', error);
      message.error('无法获取AI响应');
    }
  };

  const createChatMessage = (sender: string, text: string): Message => {
    return { sender, text };
  };

  const getWebsocketUrl = async (apiKey: string, apiSecret: string) => {
    const url = 'wss://tts-api.xfyun.cn/v2/tts';
    const host = location.host;
    const date = new Date().toGMTString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
  };

  const callXFYunTTS = async (input: string) => {
    const API_KEY = 'xxx'; // 用您的API密钥替换
    const API_SECRET = 'xxx'; // 用您的API密钥替换
    const url = await getWebsocketUrl(API_KEY, API_SECRET);

    try {
      // 调用讯飞TTS API的逻辑
      const response = await fetch(url); // 发起WebSocket请求或其他HTTP请求方式，具体请参考讯飞TTS API文档
      return await response.text(); // 返回实际的API响应数据
    } catch (error) {
      throw new Error('讯飞TTS API调用错误: ' + error.message);
    }
  };

  return (
    <div className="chat-page">
      <Card>
        <Divider>聊天</Divider>
        <div className="chat-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}
              style={{ justifyContent: message.sender === 'ai' ? 'flex-start' : 'flex-end' }}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <Form.Item>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="输入消息..."
            />
          </Form.Item>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            style={{ position: 'absolute', bottom: '0', right: '0' }}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface Message {
  sender: string;
  text: string;
}

export default ChatPage;
