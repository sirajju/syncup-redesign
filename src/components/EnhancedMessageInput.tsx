
import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from './EmojiPicker';

interface EnhancedMessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const EnhancedMessageInput = ({ onSendMessage, disabled }: EnhancedMessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      
      // Focus back to input and set cursor position
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const attachmentOptions = [
    { icon: Image, label: 'Photos & Videos', color: 'bg-purple-500' },
    { icon: FileText, label: 'Document', color: 'bg-blue-500' },
    { icon: Mic, label: 'Audio', color: 'bg-red-500' },
  ];

  return (
    <div className="border-t border-gray-200/50 p-4 bg-white/70 backdrop-blur-sm">
      {/* Attachment Menu */}
      {showAttachments && (
        <div className="mb-3 flex space-x-2">
          {attachmentOptions.map((option, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${option.color} text-white text-sm hover:opacity-80 transition-opacity`}
              onClick={() => {
                setShowAttachments(false);
                // Handle attachment type selection
              }}
            >
              <option.icon size={16} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-2">
        {/* Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          onClick={() => setShowAttachments(!showAttachments)}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="pr-12 bg-gray-50/80 border-gray-200/50 focus:bg-white transition-colors"
          />
          
          {/* Emoji Picker */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>

        {/* Send/Voice Button */}
        {message.trim() ? (
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 h-9 w-9 p-0 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-9 w-9 flex-shrink-0 ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center justify-center space-x-2 text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Recording... Tap to stop</span>
        </div>
      )}
    </div>
  );
};
