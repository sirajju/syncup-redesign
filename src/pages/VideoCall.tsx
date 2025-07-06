
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageSquare,
  MoreVertical,
  Users,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const VideoCall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  // Get call type and contact from URL params
  const callType = searchParams.get('type') || 'video'; // 'video' or 'audio'
  const contactName = searchParams.get('contact') || 'Unknown Contact';
  const isIncoming = searchParams.get('incoming') === 'true';

  useEffect(() => {
    // Simulate call connection
    const connectionTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
  };

  const handleDeclineCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  if (callStatus === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Call Ended</h2>
          <p className="text-red-200">Duration: {formatDuration(callDuration)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Video Background */}
      {callType === 'video' && isVideoOn && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20">
          {/* Simulated video background */}
          <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
        </div>
      )}

      {/* Contact Info */}
      <div className="absolute top-12 left-0 right-0 text-center text-white z-10">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32 border-4 border-white/20">
            <AvatarImage src="/placeholder.svg" alt={contactName} />
            <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-2xl">
              {contactName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-semibold">{contactName}</h1>
            <p className="text-white/70 text-lg">
              {callStatus === 'connecting' && isIncoming && 'Incoming call...'}
              {callStatus === 'connecting' && !isIncoming && 'Calling...'}
              {callStatus === 'connected' && formatDuration(callDuration)}
            </p>
          </div>
        </div>
      </div>

      {/* Self Video (for video calls) */}
      {callType === 'video' && isVideoOn && (
        <div className="absolute top-20 right-4 w-32 h-48 bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20 z-20">
          <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 flex items-center justify-center">
            <div className="text-white/60 text-sm">You</div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="absolute bottom-20 left-0 right-0 z-20">
        <div className="flex justify-center items-center space-x-6">
          {/* Incoming Call Controls */}
          {callStatus === 'connecting' && isIncoming && (
            <>
              <Button
                onClick={handleDeclineCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
              >
                <Phone size={24} className="rotate-135" />
              </Button>
              
              <Button
                onClick={handleAcceptCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 border-4 border-white/20"
              >
                <Phone size={24} />
              </Button>
            </>
          )}

          {/* Active Call Controls */}
          {(callStatus === 'connected' || (callStatus === 'connecting' && !isIncoming)) && (
            <>
              {/* Mute Button */}
              <Button
                onClick={() => setIsMuted(!isMuted)}
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="w-14 h-14 rounded-full border-4 border-white/20"
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </Button>

              {/* Video Toggle (only for video calls) */}
              {callType === 'video' && (
                <Button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  size="lg"
                  variant={!isVideoOn ? "destructive" : "secondary"}
                  className="w-14 h-14 rounded-full border-4 border-white/20"
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </Button>
              )}

              {/* Speaker Button (only for audio calls) */}
              {callType === 'audio' && (
                <Button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  size="lg"
                  variant={isSpeakerOn ? "default" : "secondary"}
                  className="w-14 h-14 rounded-full border-4 border-white/20"
                >
                  <Volume2 size={20} />
                </Button>
              )}

              {/* Message Button */}
              <Button
                onClick={() => navigate('/')}
                size="lg"
                variant="secondary"
                className="w-14 h-14 rounded-full border-4 border-white/20"
              >
                <MessageSquare size={20} />
              </Button>

              {/* End Call Button */}
              <Button
                onClick={handleEndCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-4 border-white/20"
              >
                <Phone size={24} className="rotate-135" />
              </Button>

              {/* More Options */}
              <Button
                size="lg"
                variant="secondary"
                className="w-14 h-14 rounded-full border-4 border-white/20"
              >
                <MoreVertical size={20} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        {isMuted && (
          <div className="bg-red-500/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <MicOff size={16} className="text-white" />
            <span className="text-white text-sm">Muted</span>
          </div>
        )}
        {callType === 'video' && !isVideoOn && (
          <div className="bg-gray-500/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <VideoOff size={16} className="text-white" />
            <span className="text-white text-sm">Video Off</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
