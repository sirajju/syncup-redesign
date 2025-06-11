
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Video, Phone, MoreVertical } from "lucide-react";
import { Chat, Message } from "@/pages/Index";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ChatAreaProps {
  selectedChat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatArea({ selectedChat, messages, onSendMessage }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
            <Send className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to ChatApp</h2>
          <p className="text-gray-500 max-w-md">Select a chat from the sidebar to start messaging with your friends and colleagues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white/80 to-emerald-50/30 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-medium">
                {selectedChat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {selectedChat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
            <p className="text-sm text-emerald-600">
              {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isOwn
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-md border border-gray-200/50'
              } shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className={`flex items-center justify-end gap-1 mt-1 ${
                message.isOwn ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">{message.timestamp}</span>
                {message.isOwn && (
                  <div className="flex">
                    <div className={`w-1 h-1 rounded-full ${
                      message.status === 'read' ? 'bg-blue-300' : 'bg-emerald-200'
                    }`}></div>
                    <div className={`w-1 h-1 rounded-full ml-0.5 ${
                      message.status === 'read' ? 'bg-blue-300' : 'bg-emerald-200'
                    }`}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200/50 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 bg-gray-50/80 border-gray-200/50 focus:bg-white focus:border-emerald-300 transition-all duration-200 rounded-full"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
