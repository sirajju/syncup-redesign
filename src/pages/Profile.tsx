
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Edit, MapPin, Calendar, Phone, Mail, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Your Name',
    about: 'Available',
    phone: '+1 (555) 123-4567',
    email: 'your.email@example.com',
    location: 'New York, NY'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  const stats = [
    { label: 'Messages Sent', value: '2,547' },
    { label: 'Active Chats', value: '12' },
    { label: 'Groups', value: '5' },
    { label: 'Calls Made', value: '89' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Profile</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 shadow-lg">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-3xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors">
                  <Camera className="text-white" size={20} />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="bg-white/50"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                {isEditing ? (
                  <Textarea
                    value={profileData.about}
                    onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                    className="bg-white/50"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-600">{profileData.about}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="bg-white/50 flex-1"
                      />
                    ) : (
                      <span className="text-gray-900">{profileData.phone}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="bg-white/50 flex-1"
                      />
                    ) : (
                      <span className="text-gray-900">{profileData.email}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="bg-white/50 flex-1"
                    />
                  ) : (
                    <span className="text-gray-900">{profileData.location}</span>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-white/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-white/70 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield size={20} className="text-gray-600" />
                  <span className="text-gray-900">Two-Factor Authentication</span>
                </div>
                <Badge variant="outline" className="text-emerald-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} className="text-gray-600" />
                  <span className="text-gray-900">Last Seen</span>
                </div>
                <Badge variant="outline">Everyone</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
