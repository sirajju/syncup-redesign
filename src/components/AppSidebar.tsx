
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Chat, ActivePanel } from "@/pages/Index";
import { useState } from "react";
import { QuickActions } from "./QuickActions";
import { SidebarHeader as CustomSidebarHeader } from "./SidebarHeader";
import { ChatList } from "./ChatList";

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
        <CustomSidebarHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          chatCount={filteredChats.length}
          activePanel={activePanel}
          onPanelChange={onPanelChange}
        />
      </SidebarHeader>
      
      <SidebarContent className="p-3 pt-1">
        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          activePanel={activePanel}
          onChatSelect={onChatSelect}
        />
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-emerald-100/50 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50">
        <QuickActions 
          activePanel={activePanel}
          onPanelChange={onPanelChange}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
