import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, Music } from "lucide-react";
import { Channel } from "@shared/schema";

export default function Radio() {
  const { data: channels = [], isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  // Filter only radio channels
  const radioChannels = channels.filter(channel => 
    channel.category?.toLowerCase().includes('radio') || 
    channel.name?.toLowerCase().includes('radio') ||
    channel.streamType === 'radio'
  );

  const handlePlayRadio = (channel: Channel) => {
    if ((window as any).openVideoPlayer) {
      (window as any).openVideoPlayer(channel);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <div className="mr-4 text-4xl">📻</div>
          Radyo Kanalları
        </h1>
        <p className="text-lg text-gray-400">
          {radioChannels.length} radyo kanalı mevcut
        </p>
      </div>

      {radioChannels.length === 0 ? (
        <div className="text-center py-16">
          <Music className="h-24 w-24 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Henüz Radyo Kanalı Yok</h2>
          <p className="text-gray-400 mb-6">
            Radyo kanalları eklemek için M3U/Xtream playlist'inizi ayarlara ekleyin
          </p>
          <button 
            onClick={() => window.location.href = '/settings'}
            className="bg-samsung-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            data-testid="button-go-to-settings"
          >
            Ayarlara Git
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {radioChannels.map((channel) => (
            <Card 
              key={channel.id}
              className="group cursor-pointer hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              onClick={() => handlePlayRadio(channel)}
              data-testid={`radio-channel-${channel.id}`}
            >
              <CardContent className="p-4">
                <div className="relative aspect-square mb-4">
                  {channel.logoUrl ? (
                    <img
                      src={channel.logoUrl}
                      alt={channel.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <div className="h-12 w-12 text-white flex items-center justify-center">📻</div>
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all duration-200">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200" />
                  </div>

                  {/* Live indicator */}
                  {channel.isLive && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white text-xs">
                      CANLI
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-samsung-blue transition-colors">
                    {channel.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {channel.description || channel.category || "Radyo Kanalı"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {channel.streamType?.toUpperCase() || 'STREAM'}
                      </span>
                    </div>
                    
                    {channel.viewers && channel.viewers > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">
                          {channel.viewers.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Current show info for radio */}
                  {channel.currentShow && (
                    <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
                      <div className="flex items-center space-x-1 mb-1">
                        <Music className="h-3 w-3 text-accent-orange" />
                        <span className="text-accent-orange font-medium">Şimdi Çalıyor</span>
                      </div>
                      <p className="text-gray-300 truncate">{channel.currentShow}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Genre Filter */}
      {radioChannels.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Tümü", count: radioChannels.length, icon: "📻" },
              { name: "Müzik", count: radioChannels.filter(c => c.category?.toLowerCase().includes('music') || c.category?.toLowerCase().includes('müzik')).length, icon: "🎵" },
              { name: "Haber", count: radioChannels.filter(c => c.category?.toLowerCase().includes('news') || c.category?.toLowerCase().includes('haber')).length, icon: "📢" },
              { name: "Spor", count: radioChannels.filter(c => c.category?.toLowerCase().includes('sport') || c.category?.toLowerCase().includes('spor')).length, icon: "⚽" },
            ].map((category) => (
              <Card 
                key={category.name}
                className="cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} kanal</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}