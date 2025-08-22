import { useState, useEffect } from "react";
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Settings, Maximize, Captions, Plus, Heart } from "lucide-react";
import EnhancedVideoPlayer from "./enhanced-video-player";

interface VideoPlayerModalProps {
  content: any;
  onClose: () => void;
}

export default function VideoPlayerModal({ content, onClose }: VideoPlayerModalProps) {
  const [useEnhancedPlayer, setUseEnhancedPlayer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState("12:35");
  const [duration, setDuration] = useState("1:45:22");

  // Use enhanced player for better features
  if (useEnhancedPlayer) {
    return <EnhancedVideoPlayer content={content} onClose={onClose} />;
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setProgress(prev => Math.min(prev + 5, 100));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setProgress(prev => Math.max(prev - 5, 0));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50" data-testid="modal-video-player">
      <div className="relative w-full h-full">
        {/* Video Container */}
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-xl">Video Player Interface</p>
              <p className="text-sm mt-2">Playing: {content?.title || content?.name}</p>
            </div>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full h-1 bg-gray-600 rounded-full cursor-pointer" data-testid="progress-bar">
              <div 
                className="h-full bg-accent-orange rounded-full transition-all duration-200" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-300 mt-2">
              <span data-testid="text-current-time">{currentTime}</span>
              <span data-testid="text-duration">{duration}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-skip-back"
              >
                <SkipBack className="text-2xl" />
              </button>
              
              <button 
                className="p-4 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                onClick={() => setIsPlaying(prev => !prev)}
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="text-3xl" /> : <Play className="text-3xl" />}
              </button>
              
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-skip-forward"
              >
                <SkipForward className="text-2xl" />
              </button>
              
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-volume"
              >
                <Volume2 className="text-xl" />
              </button>
              
              <div className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer" data-testid="volume-bar">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${volume}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-subtitles"
              >
                <Captions className="text-xl" />
              </button>
              
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-settings"
              >
                <Settings className="text-xl" />
              </button>
              
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                data-testid="button-fullscreen"
              >
                <Maximize className="text-xl" />
              </button>
              
              <button 
                className="p-3 hover:bg-gray-800 rounded-lg focus-ring" 
                tabIndex={0}
                onClick={onClose}
                data-testid="button-close"
              >
                <X className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Info Overlay (Top) */}
        <div className="absolute top-8 left-8 right-8">
          <div className="flex items-start justify-between">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-2" data-testid="text-content-title">
                {content?.title || content?.name}
              </h2>
              <p className="text-lg text-gray-300" data-testid="text-content-description">
                {content?.description || content?.currentShow || "Now Playing"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-gray-800 bg-opacity-80 p-3 rounded-lg hover:bg-gray-700 focus-ring" 
                tabIndex={0}
                data-testid="button-add-to-favorites"
              >
                <Plus className="text-lg" />
              </button>
              <button 
                className="bg-gray-800 bg-opacity-80 p-3 rounded-lg hover:bg-gray-700 focus-ring" 
                tabIndex={0}
                data-testid="button-like"
              >
                <Heart className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
