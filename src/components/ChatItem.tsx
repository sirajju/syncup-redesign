
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Chat, ActivePanel } from "@/pages/Index";

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  activePanel: ActivePanel;
  onClick: (chat: Chat) => void;
}

export const ChatItem = ({ chat, isSelected, activePanel, onClick }: ChatItemProps) => {
  const isActiveChat = isSelected && activePanel === 'chat';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onClick(chat)}
        className={`w-full p-0 rounded-xl transition-all duration-300 group relative overflow-hidden border-0 h-auto ${
          isActiveChat
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 transform scale-[1.01]' 
            : 'hover:bg-gray-50/80 hover:shadow-md hover:shadow-gray-500/5'
        }`}
      >
        <div className="flex items-center gap-3 w-full p-4 relative z-10">
          <div className="relative flex-shrink-0">
            <Avatar className={`h-12 w-12 shadow-md transition-all duration-300 ${
              isActiveChat ? 'ring-3 ring-white/30' : 'ring-1 ring-gray-200'
            }`}>
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className={`font-semibold text-sm ${
                isActiveChat
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
              }`}>
                {chat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {chat.isOnline && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-3 shadow-sm animate-pulse ${
                isActiveChat ? 'bg-green-400 border-white/30' : 'bg-green-500 border-white'
              }`}></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className={`font-semibold text-sm truncate ${
                isActiveChat ? 'text-white' : 'text-gray-900'
              }`}>
                {chat.name}
              </h3>
              <span className={`text-xs font-medium ml-2 flex-shrink-0 ${
                isActiveChat ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                {chat.timestamp}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <p className={`text-sm truncate flex-1 ${
                isActiveChat ? 'text-emerald-50' : 'text-gray-600'
              }`}>
                {chat.lastMessage}
              </p>
              {chat.unreadCount > 0 && (
                <Badge className={`ml-3 px-2 py-1 text-xs font-bold min-w-[20px] h-5 flex items-center justify-center shadow-md transition-all duration-300 ${
                  isActiveChat
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
        {!isActiveChat && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
