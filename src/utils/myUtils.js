// utils/myUtils.js

/**
 * 模拟发送消息到聊天界面的工具函数
 * @param {Object[]} oldMessages - 之前的消息列表
 * @param {string} sender - 发送者 ('user' 或 'ai')
 * @param {string} text - 消息内容
 * @returns {Object[]} 更新后的消息列表
 */
export function sendMessageToChat(oldMessages, sender, text) {
  const newMessage = createChatMessage(sender, text);
  return [...oldMessages, newMessage];
}

/**
 * 创建聊天消息
 * @param {string} sender - 发送者 ('user' 或 'ai')
 * @param {string} text - 消息内容
 * @returns {Object} 聊天消息对象
 */
export function createChatMessage(sender, text) {
  return {
    sender,
    text,
  };
}
