
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Search, MessageCircle, Plus, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chat, ActivePanel } from "@/pages/Index";
import { useState } from "react";
import { QuickActions } from "./QuickActions";

interface AppSidebarProps {
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  activePanel: ActivePanel;
  onPanelChange: (panel: ActivePanel) => void;
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
  },
  {
    id: '6',
    name: 'Marketing Team',
    avatar: '/placeholder.svg',
    lastMessage: 'Campaign results are looking great!',
    timestamp: 'Friday',
    unreadCount: 3,
    isOnline: true
  },
  {
    id: '7',
    name: 'John Smith',
    avatar: '/placeholder.svg',
    lastMessage: 'Can we reschedule our call?',
    timestamp: 'Thursday',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '8',
    name: 'Anna Wilson',
    avatar: '/placeholder.svg',
    lastMessage: 'Perfect! Thanks for the update',
    timestamp: 'Wednesday',
    unreadCount: 1,
    isOnline: true
  }
];

export function AppSidebar({ selectedChat, onChatSelect, activePanel, onPanelChange }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="border-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
      <SidebarHeader className="border-0 p-0">
        {/* Header Section */}
        <div className="p-6 pb-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900 tracking-tight">StyleChat</h1>
                <p className="text-xs text-gray-600 font-medium">{filteredChats.length} active chats</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className={`h-8 w-8 rounded-lg transition-all duration-200 ${
                  activePanel === 'new-chat' 
                    ? 'bg-emerald-200/80 text-emerald-700' 
                    : 'hover:bg-emerald-100/80 text-gray-600'
                }`}
                onClick={() => onPanelChange('new-chat')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-emerald-100/80 rounded-lg transition-all duration-200">
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/90 border-0 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition-all duration-200 rounded-xl shadow-sm text-sm placeholder:text-gray-500"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3 pt-1">
        <SidebarMenu className="space-y-1">
          {filteredChats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => onChatSelect(chat)}
                className={`w-full p-0 rounded-xl transition-all duration-300 group relative overflow-hidden border-0 h-auto ${
                  selectedChat?.id === chat.id && activePanel === 'chat'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 transform scale-[1.01]' 
                    : 'hover:bg-gray-50/80 hover:shadow-md hover:shadow-gray-500/5'
                }`}
              >
                <div className="flex items-center gap-3 w-full p-4 relative z-10">
                  <div className="relative flex-shrink-0">
                    <Avatar className={`h-12 w-12 shadow-md transition-all duration-300 ${
                      selectedChat?.id === chat.id && activePanel === 'chat' ? 'ring-3 ring-white/30' : 'ring-1 ring-gray-200'
                    }`}>
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className={`font-semibold text-sm ${
                        selectedChat?.id === chat.id && activePanel === 'chat'
                          ? 'bg-white/20 text-white' 
                          : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                      }`}>
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-3 shadow-sm animate-pulse ${
                        selectedChat?.id === chat.id && activePanel === 'chat' ? 'bg-green-400 border-white/30' : 'bg-green-500 border-white'
                      }`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold text-sm truncate ${
                        selectedChat?.id === chat.id && activePanel === 'chat' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-xs font-medium ml-2 flex-shrink-0 ${
                        selectedChat?.id === chat.id && activePanel === 'chat' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate flex-1 ${
                        selectedChat?.id === chat.id && activePanel === 'chat' ? 'text-emerald-50' : 'text-gray-600'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge className={`ml-3 px-2 py-1 text-xs font-bold min-w-[20px] h-5 flex items-center justify-center shadow-md transition-all duration-300 ${
                          selectedChat?.id === chat.id && activePanel === 'chat'
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
                {!(selectedChat?.id === chat.id && activePanel === 'chat') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No conversations found</h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Try searching with a different name or start a new conversation
            </p>
          </div>
        )}
      </SidebarContent>

      {/* Footer with quick actions */}
      <SidebarFooter className="p-3 border-t border-emerald-100/50 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50">
        <QuickActions 
          activePanel={activePanel}
          onPanelChange={onPanelChange}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
