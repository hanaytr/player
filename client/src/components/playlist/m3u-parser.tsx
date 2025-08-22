import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Tv, Film, Radio, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface M3UChannel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
  tvgId?: string;
  language?: string;
  country?: string;
  type: 'tv' | 'radio' | 'vod';
}

interface M3UParserProps {
  onChannelsLoaded: (channels: M3UChannel[]) => void;
}

export default function M3UParser({ onChannelsLoaded }: M3UParserProps) {
  const { toast } = useToast();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [channels, setChannels] = useState<M3UChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState({
    type: 'all',
    group: 'all',
    search: ''
  });

  const parseM3U = async (content: string): Promise<M3UChannel[]> => {
    const lines = content.split('\n');
    const channels: M3UChannel[] = [];
    let currentChannel: Partial<M3UChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse EXTINF line
        const nameMatch = line.match(/,(.+)$/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
        
        // Extract attributes
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
        const languageMatch = line.match(/tvg-language="([^"]+)"/);
        const countryMatch = line.match(/tvg-country="([^"]+)"/);
        
        currentChannel = {
          name,
          logo: logoMatch ? logoMatch[1] : undefined,
          group: groupMatch ? groupMatch[1] : 'Uncategorized',
          tvgId: tvgIdMatch ? tvgIdMatch[1] : undefined,
          language: languageMatch ? languageMatch[1] : undefined,
          country: countryMatch ? countryMatch[1] : undefined,
          type: 'tv' // Default type
        };
        
        // Determine channel type based on name/group - Turkish support
        const nameToCheck = currentChannel.name?.toLowerCase() || '';
        const groupToCheck = currentChannel.group?.toLowerCase() || '';
        
        if (groupToCheck.includes('radio') || groupToCheck.includes('radyo') ||
            nameToCheck.includes('radio') || nameToCheck.includes('radyo') ||
            groupToCheck.includes('music') || groupToCheck.includes('müzik')) {
          currentChannel.type = 'radio';
        } else if (groupToCheck.includes('vod') || groupToCheck.includes('movie') ||
                   groupToCheck.includes('series') || groupToCheck.includes('film') ||
                   groupToCheck.includes('dizi') || groupToCheck.includes('sinema')) {
          currentChannel.type = 'vod';
        }
        
      } else if (line && !line.startsWith('#') && currentChannel.name) {
        // This is the URL line
        currentChannel.url = line;
        channels.push(currentChannel as M3UChannel);
        currentChannel = {};
        
        // Update progress
        setProgress((i / lines.length) * 100);
      }
    }
    
    return channels;
  };

  const handleUrlLoad = async () => {
    if (!playlistUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid M3U URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      const response = await fetch(playlistUrl);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      
      const content = await response.text();
      const parsedChannels = await parseM3U(content);
      
      setChannels(parsedChannels);
      setSelectedChannels(new Set(parsedChannels.map((_, index) => index)));
      
      const tvChannels = parsedChannels.filter(ch => ch.type === 'tv').length;
      const radioChannels = parsedChannels.filter(ch => ch.type === 'radio').length;
      const vodChannels = parsedChannels.filter(ch => ch.type === 'vod').length;
      
      toast({
        title: "Başarılı",
        description: `${parsedChannels.length} kanal yüklendi (${tvChannels} TV, ${radioChannels} Radyo, ${vodChannels} VOD)`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load playlist. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setProgress(0);

    try {
      const content = await file.text();
      const parsedChannels = await parseM3U(content);
      
      setChannels(parsedChannels);
      setSelectedChannels(new Set(parsedChannels.map((_, index) => index)));
      
      const tvChannels = parsedChannels.filter(ch => ch.type === 'tv').length;
      const radioChannels = parsedChannels.filter(ch => ch.type === 'radio').length;
      const vodChannels = parsedChannels.filter(ch => ch.type === 'vod').length;
      
      toast({
        title: "Başarılı",
        description: `${parsedChannels.length} kanal yüklendi (${tvChannels} TV, ${radioChannels} Radyo, ${vodChannels} VOD)`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse M3U file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleImportSelected = async () => {
    const selectedChannelObjects = Array.from(selectedChannels).map(index => channels[index]);
    
    setIsLoading(true);
    try {
      // Import channels to backend
      for (const channel of selectedChannelObjects) {
        const channelData = {
          name: channel.name,
          category: channel.group || 'General',
          logoUrl: channel.logo || null,
          streamUrl: channel.url,
          isLive: true,
          streamType: channel.type === 'radio' ? 'radio' : 'hls',
          ageRating: 0,
          isCatchupEnabled: false,
          countryCode: channel.country || null
        };

        await fetch('/api/channels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(channelData),
        });
      }

      onChannelsLoaded(selectedChannelObjects);
      
      const tvChannels = selectedChannelObjects.filter(ch => ch.type === 'tv').length;
      const radioChannels = selectedChannelObjects.filter(ch => ch.type === 'radio').length;
      const vodChannels = selectedChannelObjects.filter(ch => ch.type === 'vod').length;
      
      toast({
        title: "Kanallar İçe Aktarıldı",
        description: `Başarıyla ${selectedChannelObjects.length} kanal eklendi (${tvChannels} TV, ${radioChannels} Radyo, ${vodChannels} VOD)`,
      });
      
      // Clear the parsed channels after successful import
      setChannels([]);
      setSelectedChannels(new Set());
      
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kanallar içe aktarılırken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChannelSelection = (index: number) => {
    const newSelected = new Set(selectedChannels);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedChannels(newSelected);
  };

  const selectAllChannels = () => {
    setSelectedChannels(new Set(filteredChannels.map((_, index) => 
      channels.indexOf(filteredChannels[index])
    )));
  };

  const deselectAllChannels = () => {
    setSelectedChannels(new Set());
  };

  const filteredChannels = channels.filter(channel => {
    if (filter.type !== 'all' && channel.type !== filter.type) return false;
    if (filter.group !== 'all' && channel.group !== filter.group) return false;
    if (filter.search && !channel.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'radio': return <Radio className="h-4 w-4" />;
      case 'vod': return <Film className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const channelGroups = Array.from(new Set(channels.map(ch => ch.group).filter(Boolean)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>M3U/M3U8 Playlist Parser</CardTitle>
          <CardDescription>
            Import channels from M3U playlists via URL or file upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">From URL</TabsTrigger>
              <TabsTrigger value="file">From File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://example.com/playlist.m3u"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  data-testid="input-playlist-url"
                />
                <Button 
                  onClick={handleUrlLoad}
                  disabled={isLoading}
                  data-testid="button-load-url"
                >
                  {isLoading ? 'Loading...' : 'Load'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Select an M3U file to upload</p>
                <Input
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                  data-testid="input-file-upload"
                />
              </div>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Parsing playlist...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {channels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Parsed Channels ({channels.length})</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllChannels}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllChannels}>
                  Deselect All
                </Button>
                <Button 
                  onClick={handleImportSelected}
                  disabled={selectedChannels.size === 0}
                  data-testid="button-import-selected"
                >
                  Import Selected ({selectedChannels.size})
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  data-testid="select-filter-type"
                >
                  <option value="all">All Types</option>
                  <option value="tv">TV Channels</option>
                  <option value="radio">Radio</option>
                  <option value="vod">VOD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group</label>
                <select
                  value={filter.group}
                  onChange={(e) => setFilter(prev => ({ ...prev, group: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  data-testid="select-filter-group"
                >
                  <option value="all">All Groups</option>
                  {channelGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input
                  placeholder="Search channels..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  data-testid="input-search-channels"
                />
              </div>
            </div>

            {/* Channel List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredChannels.map((channel, index) => {
                const originalIndex = channels.indexOf(channel);
                const isSelected = selectedChannels.has(originalIndex);
                
                return (
                  <Card 
                    key={originalIndex}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-samsung-blue bg-opacity-20 border-samsung-blue' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => toggleChannelSelection(originalIndex)}
                    data-testid={`channel-item-${originalIndex}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by card click
                          className="rounded"
                        />
                        
                        {channel.logo ? (
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                            {getChannelIcon(channel.type)}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{channel.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Badge variant="outline" className="text-xs">
                              {channel.type.toUpperCase()}
                            </Badge>
                            {channel.group && (
                              <span className="truncate">{channel.group}</span>
                            )}
                            {channel.language && (
                              <Badge variant="secondary" className="text-xs">
                                {channel.language}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}