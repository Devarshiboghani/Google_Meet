import React, { useState, useRef } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSendText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    onSendMessage(trimmed, 'text');
    setText('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File too large. Max 50MB.");
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      // Native fetch API is cleaner than adding axios as a dependency here just for one request
      const response = await fetch(`${backendUrl}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        onSendMessage(data.file, 'file');
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800">
      <div className="flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1 pr-2 transition-colors focus-within:border-blue-500/50 focus-within:bg-slate-800/80 shadow-inner">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        />

        {/* Attachment Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mb-1 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Attach File"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Paperclip className="w-4 h-4" />}
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          className="flex-1 max-h-[120px] min-h-[40px] bg-transparent resize-none outline-none text-sm text-white py-2.5 placeholder-slate-500 custom-scrollbar"
          rows={1}
        />
        <button 
          onClick={handleSendText}
          disabled={!text.trim() || isUploading}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all ${
            text.trim() 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
      <div className="text-[10px] text-slate-500 text-center mt-2 px-2">
        Press <kbd className="bg-slate-800 px-1 rounded">Enter</kbd> to send, <kbd className="bg-slate-800 px-1 rounded">Shift + Enter</kbd> for new line
      </div>
    </div>
  );
};

export default MessageInput;
