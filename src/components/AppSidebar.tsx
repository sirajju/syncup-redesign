
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Search, MessageCircle, Settings, Plus, MoreVertical } from "lucide-react";
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
    <Sidebar className="border-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
      <SidebarHeader className="border-0 p-0">
        {/* Header Section */}
        <div className="p-8 pb-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-gray-900 tracking-tight">Messages</h1>
                <p className="text-sm text-gray-600 font-medium">{filteredChats.length} active chats</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-emerald-100/80 rounded-xl transition-all duration-200">
                <Plus className="h-5 w-5 text-gray-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-emerald-100/80 rounded-xl transition-all duration-200">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 bg-white/90 border-0 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition-all duration-200 rounded-2xl shadow-sm text-base placeholder:text-gray-500"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 pt-2">
        <SidebarMenu className="space-y-2">
          {filteredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => onChatSelect(chat)}
                className={`w-full p-0 rounded-2xl transition-all duration-300 group relative overflow-hidden border-0 ${
                  selectedChat?.id === chat.id 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/25 transform scale-[1.02]' 
                    : 'hover:bg-gray-50/80 hover:shadow-lg hover:shadow-gray-500/5 hover:transform hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-4 w-full p-6 relative z-10">
                  <div className="relative flex-shrink-0">
                    <Avatar className={`h-16 w-16 shadow-lg transition-all duration-300 ${
                      selectedChat?.id === chat.id ? 'ring-4 ring-white/30' : 'ring-2 ring-gray-100'
                    }`}>
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className={`font-semibold text-lg ${
                        selectedChat?.id === chat.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                      }`}>
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 shadow-sm animate-pulse ${
                        selectedChat?.id === chat.id ? 'bg-green-400 border-white/30' : 'bg-green-500 border-white'
                      }`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg truncate ${
                        selectedChat?.id === chat.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-sm font-medium ml-3 flex-shrink-0 ${
                        selectedChat?.id === chat.id ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-base truncate flex-1 leading-relaxed ${
                        selectedChat?.id === chat.id ? 'text-emerald-50' : 'text-gray-600'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge className={`ml-4 px-3 py-2 text-sm font-bold min-w-[28px] h-7 flex items-center justify-center shadow-lg transition-all duration-300 ${
                          selectedChat?.id === chat.id 
                            ? 'bg-white/90 text-emerald-600 hover:bg-white' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/25'
                        }`}>
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                {selectedChat?.id !== chat.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No conversations found</h3>
            <p className="text-base text-gray-500 max-w-xs leading-relaxed">
              Try searching with a different name or start a new conversation
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
