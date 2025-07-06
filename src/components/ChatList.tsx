
import { SidebarMenu } from "@/components/ui/sidebar";
import { Chat, ActivePanel } from "@/pages/Index";
import { ChatItem } from "./ChatItem";
import { EmptyState } from "./EmptyState";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  activePanel: ActivePanel;
  onChatSelect: (chat: Chat) => void;
}

export const ChatList = ({ chats, selectedChat, activePanel, onChatSelect }: ChatListProps) => {
  if (chats.length === 0) {
    return <EmptyState />;
  }

  return (
    <SidebarMenu className="space-y-1">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          activePanel={activePanel}
          onClick={onChatSelect}
        />
      ))}
    </SidebarMenu>
  );
};
