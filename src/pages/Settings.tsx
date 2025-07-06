
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle, 
  Info,
  ChevronRight,
  Camera,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', description: 'Name, about, phone number' },
        { icon: Shield, label: 'Privacy', description: 'Block contacts, disappearing messages' },
        { icon: Bell, label: 'Notifications', description: 'Message, group & call tones' },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { icon: Palette, label: 'Theme', description: 'Light, dark, system default' },
        { icon: Globe, label: 'Language', description: 'English (device language)' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help', description: 'Help center, contact us, privacy policy' },
        { icon: Info, label: 'About', description: 'Version, terms of service' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" alt="Your profile" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-lg">
                  YO
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors">
                <Camera className="text-white" size={16} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">Your Name</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="text-gray-400" size={16} />
                </button>
              </div>
              <p className="text-gray-500">Available</p>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Quick Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Message and call alerts</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Read Receipts</p>
                <p className="text-sm text-gray-500">Send read receipts</p>
              </div>
              <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Online Status</p>
                <p className="text-sm text-gray-500">Show when you're online</p>
              </div>
              <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="pb-6">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <item.icon className="text-gray-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <Button 
            variant="destructive" 
            className="w-full py-3 bg-red-500 hover:bg-red-600"
            onClick={() => {/* Handle logout */}}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
