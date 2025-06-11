
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import { Chat, Message } from "@/pages/Index";

interface ChatAreaProps {
  selectedChat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatArea({ selectedChat, messages, onSendMessage }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to ChatApp</h3>
          <p className="text-gray-600">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200/50 p-4 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between">
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
              <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.isOwn
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${
                message.isOwn ? 'justify-end' : 'justify-start'
              }`}>
                <span className={`text-xs ${
                  message.isOwn ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </span>
                {message.isOwn && (
                  <div className="flex">
                    {message.status === 'sent' && (
                      <svg className="w-3 h-3 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    {message.status === 'delivered' && (
                      <svg className="w-3 h-3 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                      </svg>
                    )}
                    {message.status === 'read' && (
                      <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200/50 p-4 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50/80 border-gray-200/50 focus:bg-white transition-colors"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
