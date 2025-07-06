
import { Search, MessageCircle, Plus, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivePanel } from "@/pages/Index";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  chatCount: number;
  activePanel: ActivePanel;
  onPanelChange: (panel: ActivePanel) => void;
}

export const SidebarHeader = ({ 
  searchQuery, 
  onSearchChange, 
  chatCount, 
  activePanel, 
  onPanelChange 
}: SidebarHeaderProps) => {
  return (
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
            <p className="text-xs text-gray-600 font-medium">{chatCount} active chats</p>
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-3 bg-white/90 border-0 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition-all duration-200 rounded-xl shadow-sm text-sm placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};
