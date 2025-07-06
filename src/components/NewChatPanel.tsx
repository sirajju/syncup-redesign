
import React, { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Users, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chat } from '@/pages/Index';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface NewChatPanelProps {
  onContactSelect: (contact: Chat) => void;
  onBack: () => void;
}

export const NewChatPanel = ({ onContactSelect, onBack }: NewChatPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      isOnline: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '/placeholder.svg',
      isOnline: false,
      lastSeen: '2 hours ago'
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: '/placeholder.svg',
      isOnline: true
    },
    {
      id: '4',
      name: 'Alex Rivera',
      avatar: '/placeholder.svg',
      isOnline: false,
      lastSeen: '1 day ago'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: '/placeholder.svg',
      isOnline: true
    },
    {
      id: '6',
      name: 'James Wilson',
      avatar: '/placeholder.svg',
      isOnline: false,
      lastSeen: '3 hours ago'
    },
    {
      id: '7',
      name: 'Maria Garcia',
      avatar: '/placeholder.svg',
      isOnline: true
    },
    {
      id: '8',
      name: 'Tom Anderson',
      avatar: '/placeholder.svg',
      isOnline: false,
      lastSeen: '5 minutes ago'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact: Contact) => {
    // Convert contact to chat format
    const chatContact: Chat = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: 'Start a conversation...',
      timestamp: 'now',
      unreadCount: 0,
      isOnline: contact.isOnline
    };
    onContactSelect(chatContact);
  };

  return (
    <div className="flex-1 bg-white/70 backdrop-blur-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">New Chat</h1>
        </div>
      </div>

      <div className="h-full overflow-y-auto">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <div className="space-y-3">
            <button className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <span className="font-medium text-gray-700">New Group</span>
            </button>
            
            <button className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <UserPlus className="text-white" size={20} />
              </div>
              <span className="font-medium text-gray-700">New Contact</span>
            </button>

            <button className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <MessageSquarePlus className="text-white" size={20} />
              </div>
              <span className="font-medium text-gray-700">New Community</span>
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Contacts on StyleChat
          </h2>
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-500">
                    {contact.isOnline ? 'Online' : `Last seen ${contact.lastSeen}`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
