
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, Phone, Video } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ActivePanel } from '@/pages/Index';

interface QuickActionsProps {
  activePanel: ActivePanel;
  onPanelChange: (panel: ActivePanel) => void;
}

export const QuickActions = ({ activePanel, onPanelChange }: QuickActionsProps) => {
  const menuItems = [
    {
      label: 'Settings',
      icon: Settings,
      action: () => onPanelChange('settings'),
      isActive: activePanel === 'settings',
      type: 'panel' as const
    },
    {
      label: 'Profile',
      icon: User,
      href: '/profile',
      type: 'link' as const
    },
    {
      label: 'Calls',
      icon: Phone,
      href: '/call',
      type: 'link' as const
    },
    {
      label: 'Video Calls',
      icon: Video,
      href: '/call',
      type: 'link' as const
    }
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          {item.type === 'panel' ? (
            <SidebarMenuButton
              onClick={item.action}
              className={`w-full rounded-xl transition-all duration-300 ${
                item.isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'hover:bg-emerald-100/80 text-gray-700'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild className="w-full rounded-xl hover:bg-emerald-100/80 text-gray-700 transition-all duration-300">
              <Link to={item.href!}>
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
