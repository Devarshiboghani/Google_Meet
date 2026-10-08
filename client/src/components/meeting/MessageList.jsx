import React, { useRef, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm p-6 text-center">
        <p>No messages yet.</p>
        <p className="mt-1">Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
      {messages.map((msg, index) => {
        const isMine = msg.senderId === currentUserId;
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isFile = msg.type === 'file';
        
        return (
          <div 
            key={index} 
            className={`flex flex-col max-w-[85%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            {/* Sender Name & Time */}
            <div className="flex items-baseline space-x-2 mb-1 px-1">
              <span className="text-xs font-medium text-slate-300">
                {isMine ? 'You' : msg.senderName}
              </span>
              <span className="text-[10px] text-slate-500">{time}</span>
            </div>
            
            {/* Message Bubble */}
            <div 
              className={`p-2 rounded-2xl text-sm ${
                isMine 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
              }`}
            >
              {!isFile ? (
                <div className="px-2 py-0.5 whitespace-pre-wrap break-words">{msg.message}</div>
              ) : (
                <div className="flex flex-col min-w-[200px]">
                  {/* Image Preview */}
                  {msg.file.mimeType.startsWith('image/') ? (
                    <a href={msg.file.fileUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/10 mb-2">
                      <img src={msg.file.fileUrl} alt={msg.file.fileName} className="w-full max-w-sm max-h-48 object-cover hover:scale-105 transition-transform" />
                    </a>
                  ) : null}

                  {/* File Metadata Card */}
                  <a href={msg.file.fileUrl} target="_blank" rel="noreferrer" className={`flex items-center p-2.5 rounded-xl border ${isMine ? 'border-white/20 bg-black/10 hover:bg-black/20' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-900'} transition-colors group`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isMine ? 'bg-white/20' : 'bg-slate-700'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{msg.file.fileName}</p>
                      <p className={`text-xs ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>{formatFileSize(msg.file.fileSize)}</p>
                    </div>
                    <div className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center ${isMine ? 'bg-white/20' : 'bg-slate-700 text-slate-300 group-hover:text-white'}`}>
                      <Download className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} className="h-1 w-full" />
    </div>
  );
};

export default MessageList;
