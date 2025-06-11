
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Search, MessageCircle, Settings, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <Sidebar className="border-r border-gray-200/50 bg-white/80 backdrop-blur-md shadow-sm">
      <SidebarHeader className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Chats</h1>
              <p className="text-sm text-gray-600">{filteredChats.length} conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-emerald-100">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-emerald-100">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/80 border-gray-200/50 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 rounded-xl"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu className="space-y-1">
          {filteredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => onChatSelect(chat)}
                className={`w-full p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  selectedChat?.id === chat.id 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-[1.02]' 
                    : 'hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-4 w-full relative z-10">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold text-lg">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-sm animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold text-base truncate ${
                        selectedChat?.id === chat.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-xs ml-2 flex-shrink-0 ${
                        selectedChat?.id === chat.id ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate flex-1 ${
                        selectedChat?.id === chat.id ? 'text-emerald-50' : 'text-gray-600'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge className={`ml-3 px-2 py-1 text-xs font-medium min-w-[20px] h-6 flex items-center justify-center ${
                          selectedChat?.id === chat.id 
                            ? 'bg-white text-emerald-600' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        } animate-scale-in`}>
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {/* Subtle gradient overlay for non-selected items */}
                {selectedChat?.id !== chat.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50/0 to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats found</h3>
            <p className="text-sm text-gray-500">Try searching for a different name</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
