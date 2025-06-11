
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { useState } from "react";

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing today?',
      timestamp: '10:30 AM',
      isOwn: false,
      status: 'read'
    },
    {
      id: '2',
      text: 'I\'m doing great! Just finished my morning workout 💪',
      timestamp: '10:32 AM',
      isOwn: true,
      status: 'read'
    },
    {
      id: '3',
      text: 'That\'s awesome! What kind of workout did you do?',
      timestamp: '10:33 AM',
      isOwn: false,
      status: 'read'
    },
    {
      id: '4',
      text: 'Mostly cardio and some weight training. How about you? Any plans for today?',
      timestamp: '10:35 AM',
      isOwn: true,
      status: 'delivered'
    }
  ]);

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <SidebarProvider>
        <div className="flex w-full h-screen">
          <AppSidebar 
            selectedChat={selectedChat} 
            onChatSelect={setSelectedChat} 
          />
          <main className="flex-1 flex flex-col">
            <ChatArea 
              selectedChat={selectedChat}
              messages={messages}
              onSendMessage={addMessage}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
