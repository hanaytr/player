import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings, 
  Maximize, Minimize, Captions, Languages, Download, Share, Rewind,
  FastForward, PictureInPicture, Cast, MoreHorizontal
} from "lucide-react";

interface EnhancedVideoPlayerProps {
  content: any;
  onClose: () => void;
}

export default function EnhancedVideoPlayer({ content, onClose }: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Advanced player state
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [selectedAudio, setSelectedAudio] = useState("default");
  const [selectedSubtitle, setSelectedSubtitle] = useState("off");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPiPEnabled, setIsPiPEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);

  // Mock data for demo
  const qualityOptions = [
    { value: "auto", label: "Auto (4K)" },
    { value: "2160p", label: "4K (2160p)" },
    { value: "1080p", label: "Full HD (1080p)" },
    { value: "720p", label: "HD (720p)" },
    { value: "480p", label: "SD (480p)" },
  ];

  const audioTracks = [
    { value: "default", label: "English (Original)" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ];

  const subtitleTracks = [
    { value: "off", label: "Off" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ar", label: "Arabic" },
  ];

  const speedOptions = [
    { value: 0.25, label: "0.25x" },
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "Normal" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(-10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      setControlsTimeout(setTimeout(() => setShowControls(false), 3000));
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const seek = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(prev + seconds, duration)));
  };

  const adjustVolume = (delta: number) => {
    setVolume(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const togglePictureInPicture = async () => {
    if (!document.pictureInPictureEnabled) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPEnabled(false);
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPEnabled(true);
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const SettingsPanel = () => (
    <Card className="absolute bottom-20 right-4 w-80 bg-black bg-opacity-90 border-gray-700">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Player Settings</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Audio Track</label>
            <Select value={selectedAudio} onValueChange={setSelectedAudio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audioTracks.map(track => (
                  <SelectItem key={track.value} value={track.value}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitles</label>
            <Select value={selectedSubtitle} onValueChange={setSelectedSubtitle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subtitleTracks.map(track => (
                  <SelectItem key={track.value} value={track.value}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Playback Speed</label>
            <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {speedOptions.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-4'}`} data-testid="enhanced-video-player">
      <div className="relative w-full h-full">
        {/* Video Container */}
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-400 relative">
            {/* Mock Video Display */}
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-2xl font-bold mb-2">{content?.title || content?.name}</p>
              <p className="text-lg mb-4">{selectedQuality} • {selectedAudio} • {selectedSubtitle !== 'off' ? 'Subtitles' : 'No Subtitles'}</p>
              
              {/* Quality Badge */}
              <div className="flex justify-center space-x-2 mb-4">
                {selectedQuality.includes('4K') && <Badge className="bg-purple-600">4K UHD</Badge>}
                {selectedQuality.includes('1080p') && <Badge className="bg-blue-600">Full HD</Badge>}
                {selectedAudio !== 'default' && <Badge className="bg-green-600">Multi-Audio</Badge>}
                {selectedSubtitle !== 'off' && <Badge className="bg-yellow-600">Subtitles</Badge>}
              </div>

              {/* Playback Status */}
              <div className="text-lg">
                {isPlaying ? '▶️ Playing' : '⏸️ Paused'} • {playbackSpeed}x Speed
              </div>
              
              {/* Buffer Progress */}
              <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto mt-4">
                <div 
                  className="h-full bg-gray-500 rounded-full transition-all duration-200" 
                  style={{ width: `${bufferProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-t from-black via-black to-transparent p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-600 rounded-full cursor-pointer relative" data-testid="progress-bar">
                {/* Buffer Progress */}
                <div 
                  className="absolute h-full bg-gray-400 rounded-full" 
                  style={{ width: `${bufferProgress}%` }}
                />
                {/* Play Progress */}
                <div 
                  className="absolute h-full bg-accent-orange rounded-full transition-all duration-200" 
                  style={{ width: `${progress}%` }}
                />
                {/* Hover Thumb */}
                <div 
                  className="absolute w-4 h-4 bg-accent-orange rounded-full -top-1 transform -translate-x-1/2" 
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-300 mt-2">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-duration">{formatTime(duration || 6300)}</span>
              </div>
            </div>

            {/* Main Control Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" data-testid="button-rewind">
                  <Rewind className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="sm" data-testid="button-skip-back">
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={togglePlayPause}
                  data-testid="button-play-pause"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                
                <Button variant="ghost" size="sm" data-testid="button-skip-forward">
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="sm" data-testid="button-fast-forward">
                  <FastForward className="h-5 w-5" />
                </Button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleMute}
                    data-testid="button-volume"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer" data-testid="volume-bar">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${isMuted ? 0 : volume}%` }}
                    />
                  </div>
                  <span className="text-sm w-8">{isMuted ? 0 : volume}</span>
                </div>

                {/* Time Display */}
                <div className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration || 6300)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" data-testid="button-download">
                  <Download className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="sm" data-testid="button-share">
                  <Share className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedSubtitle(selectedSubtitle === 'off' ? 'en' : 'off')}
                  data-testid="button-subtitles"
                  className={selectedSubtitle !== 'off' ? 'bg-accent-orange text-black' : ''}
                >
                  <Captions className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="sm" data-testid="button-cast">
                  <Cast className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={togglePictureInPicture}
                  data-testid="button-pip"
                  className={isPiPEnabled ? 'bg-accent-orange text-black' : ''}
                >
                  <PictureInPicture className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  data-testid="button-settings"
                  className={showSettings ? 'bg-accent-orange text-black' : ''}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleFullscreen}
                  data-testid="button-fullscreen"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onClose}
                  data-testid="button-close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Info Overlay (Top) */}
        <div className={`absolute top-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-b from-black to-transparent p-6">
            <div className="flex items-start justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-content-title">
                  {content?.title || content?.name}
                </h1>
                <p className="text-lg text-gray-300 mb-4" data-testid="text-content-description">
                  {content?.description || content?.currentShow || "Now Playing"}
                </p>
                
                {/* Content Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {content?.year && <span>{content.year}</span>}
                  {content?.genre && <span>{content.genre}</span>}
                  {content?.rating && (
                    <Badge variant="outline" className="text-xs">
                      {content.rating}
                    </Badge>
                  )}
                  {content?.imdbRating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span>{content.imdbRating}</span>
                    </div>
                  )}
                  {content?.duration && (
                    <span>{Math.floor(content.duration / 60)}h {content.duration % 60}m</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && <SettingsPanel />}

        {/* Loading/Buffering Indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-orange opacity-0" />
        </div>
      </div>
    </div>
  );
}