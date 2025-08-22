import { Channel } from "@shared/schema";

interface ChannelCardProps {
  channel: Channel;
  tabIndex?: number;
}

export default function ChannelCard({ channel, tabIndex = 0 }: ChannelCardProps) {
  const openVideoPlayer = () => {
    if ((window as any).openVideoPlayer) {
      (window as any).openVideoPlayer(channel);
    }
  };

  return (
    <div 
      className="channel-item flex-shrink-0 w-80 bg-card-bg rounded-lg overflow-hidden hover:bg-gray-800 focus-ring cursor-pointer" 
      tabIndex={tabIndex}
      onClick={openVideoPlayer}
      data-testid={`card-channel-${channel.id}`}
    >
      <div className="relative">
        <img 
          src={channel.logoUrl || getChannelThumbnail(channel.category)} 
          alt={`${channel.name} preview`} 
          className="w-full h-36 object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-bold">
          LIVE
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs" data-testid={`text-viewers-${channel.id}`}>
          {channel.viewers ? `${(channel.viewers / 1000).toFixed(1)}K watching` : "Live"}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1" data-testid={`text-channel-name-${channel.id}`}>
          {channel.name}
        </h4>
        <p className="text-sm text-gray-400 mb-2" data-testid={`text-current-show-${channel.id}`}>
          {channel.currentShow || channel.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span data-testid={`text-next-show-${channel.id}`}>
            {channel.nextShow ? `Next: ${channel.nextShow}` : channel.category}
          </span>
          <span data-testid={`text-time-remaining-${channel.id}`}>
            {channel.timeRemaining || ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function getChannelThumbnail(category: string): string {
  const thumbnails = {
    "News": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=180",
    "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=180",
    "Documentary": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=180",
    "Music": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=180",
  };
  return thumbnails[category as keyof typeof thumbnails] || thumbnails["News"];
}
