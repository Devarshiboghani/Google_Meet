import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatPanel = ({ messages, currentUserId, onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden h-full">
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatPanel;
