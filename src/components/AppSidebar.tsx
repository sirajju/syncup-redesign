
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Search, MessageCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Chat } from "@/pages/Index";
import { useState } from "react";

interface AppSidebarProps {
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    lastMessage: 'That\'s awesome! What kind of workout did you do?',
    timestamp: '10:33 AM',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '/placeholder.svg',
    lastMessage: 'See you at the meeting tomorrow 👍',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Team Project',
    avatar: '/placeholder.svg',
    lastMessage: 'Alex: The new designs look amazing!',
    timestamp: 'Yesterday',
    unreadCount: 5,
    isOnline: true
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: '/placeholder.svg',
    lastMessage: 'Thanks for your help today!',
    timestamp: 'Monday',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '5',
    name: 'David Park',
    avatar: '/placeholder.svg',
    lastMessage: 'Let\'s catch up soon ☕',
    timestamp: 'Sunday',
    unreadCount: 1,
    isOnline: false
  }
];

export function AppSidebar({ selectedChat, onChatSelect }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="border-r border-gray-200/50 bg-white/70 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-200/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg text-gray-800">ChatApp</span>
          </div>
          <Settings className="h-5 w-5 text-gray-500 ml-auto cursor-pointer hover:text-gray-700 transition-colors" />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50/80 border-gray-200/50 focus:bg-white transition-colors"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {filteredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => onChatSelect(chat)}
                className={`w-full p-3 rounded-lg transition-all duration-200 hover:bg-emerald-50 ${
                  selectedChat?.id === chat.id ? 'bg-emerald-100 border-emerald-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-medium">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500 ml-2">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 ml-2 px-2 py-1 text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
