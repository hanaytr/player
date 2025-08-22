import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Upload, Download, Shield, Palette, Users, Tv } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [activeProfile, setActiveProfile] = useState("main");
  
  // App settings state
  const [appSettings, setAppSettings] = useState({
    appName: "TizenTV Pro",
    logoUrl: "",
    primaryColor: "#1428A0",
    secondaryColor: "#FF6B00",
    theme: "dark",
    language: "en",
    parentalPin: "",
    autoplay: true,
    hdDefault: true,
    subtitlesDefault: false,
  });

  // Playlist management
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    url: "",
    type: "m3u",
    username: "",
    password: "",
  });

  const { data: profiles = [] } = useQuery<UserProfile[]>({
    queryKey: ["/api/user-profiles/user-1"],
  });

  const { data: playlists = [] } = useQuery<any[]>({
    queryKey: ["/api/playlists/user-1"],
  });

  const addPlaylistMutation = useMutation({
    mutationFn: (playlist: any) => apiRequest("POST", "/api/playlists", playlist),
    onSuccess: () => {
      toast({
        title: "Playlist Added",
        description: "Your playlist has been successfully added.",
      });
      setNewPlaylist({ name: "", url: "", type: "m3u", username: "", password: "" });
    },
  });

  const removePlaylistMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/playlists/${id}`),
    onSuccess: () => {
      toast({
        title: "Playlist Removed",
        description: "Playlist has been removed from your account.",
      });
    },
  });

  const addProfileMutation = useMutation({
    mutationFn: (profile: any) => apiRequest("POST", "/api/user-profiles", profile),
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "New user profile has been created successfully.",
      });
    },
  });

  const handleAddPlaylist = () => {
    if (!newPlaylist.name || !newPlaylist.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addPlaylistMutation.mutate({ ...newPlaylist, userId: "user-1" });
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
    setAppSettings(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryColor' : 'secondaryColor']: color
    }));
    
    // Apply color change to CSS variables
    const root = document.documentElement;
    if (type === 'primary') {
      root.style.setProperty('--samsung-blue', color);
      root.style.setProperty('--primary', color);
    } else {
      root.style.setProperty('--accent-orange', color);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-lg text-gray-400">Customize your IPTV experience</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" data-testid="tab-general">
            <Palette className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="profiles" data-testid="tab-profiles">
            <Users className="mr-2 h-4 w-4" />
            Profiles
          </TabsTrigger>
          <TabsTrigger value="playlists" data-testid="tab-playlists">
            <Tv className="mr-2 h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="parental" data-testid="tab-parental">
            <Shield className="mr-2 h-4 w-4" />
            Parental
          </TabsTrigger>
          <TabsTrigger value="appearance" data-testid="tab-appearance">
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="advanced" data-testid="tab-advanced">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Configuration</CardTitle>
              <CardDescription>Customize your app name and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">App Name</Label>
                  <Input
                    id="app-name"
                    value={appSettings.appName}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, appName: e.target.value }))}
                    data-testid="input-app-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={appSettings.logoUrl}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    data-testid="input-logo-url"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={appSettings.language} onValueChange={(value) => setAppSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Default Theme</Label>
                  <Select value={appSettings.theme} onValueChange={(value) => setAppSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger data-testid="select-theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autoplay Videos</Label>
                    <p className="text-sm text-gray-500">Automatically start playing content</p>
                  </div>
                  <Switch
                    checked={appSettings.autoplay}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, autoplay: checked }))}
                    data-testid="switch-autoplay"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>HD Quality Default</Label>
                    <p className="text-sm text-gray-500">Default to highest quality stream</p>
                  </div>
                  <Switch
                    checked={appSettings.hdDefault}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, hdDefault: checked }))}
                    data-testid="switch-hd-default"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Subtitles</Label>
                    <p className="text-sm text-gray-500">Show subtitles by default</p>
                  </div>
                  <Switch
                    checked={appSettings.subtitlesDefault}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, subtitlesDefault: checked }))}
                    data-testid="switch-subtitles-default"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>Manage multiple user profiles with personalized settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {profiles.map((profile: any) => (
                  <Card key={profile.id} className="cursor-pointer hover:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
                          alt={profile.profileName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{profile.profileName}</h3>
                          <p className="text-sm text-gray-400">
                            {profile.isChild ? "Child Profile" : "Adult Profile"}
                          </p>
                          {profile.pin && <Badge variant="secondary">PIN Protected</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="cursor-pointer hover:bg-gray-800 border-dashed">
                  <CardContent className="p-4 flex items-center justify-center h-full">
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">Add Profile</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IPTV Playlists</CardTitle>
              <CardDescription>Manage your M3U/Xtream Codes playlists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My IPTV Playlist"
                    data-testid="input-playlist-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playlist-type">Type</Label>
                  <Select value={newPlaylist.type} onValueChange={(value) => setNewPlaylist(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger data-testid="select-playlist-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3u">M3U/M3U8</SelectItem>
                      <SelectItem value="xtream">Xtream Codes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="playlist-url">URL</Label>
                <Input
                  id="playlist-url"
                  value={newPlaylist.url}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="http://example.com/playlist.m3u"
                  data-testid="input-playlist-url"
                />
              </div>

              {newPlaylist.type === "xtream" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-username">Username</Label>
                    <Input
                      id="playlist-username"
                      value={newPlaylist.username}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, username: e.target.value }))}
                      data-testid="input-playlist-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playlist-password">Password</Label>
                    <Input
                      id="playlist-password"
                      type="password"
                      value={newPlaylist.password}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, password: e.target.value }))}
                      data-testid="input-playlist-password"
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleAddPlaylist} className="w-full" data-testid="button-add-playlist">
                <Plus className="mr-2 h-4 w-4" />
                Add Playlist
              </Button>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Active Playlists</h3>
                {playlists.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No playlists configured</p>
                ) : (
                  playlists.map((playlist: any) => (
                    <Card key={playlist.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{playlist.name}</h4>
                            <p className="text-sm text-gray-400">{playlist.type.toUpperCase()} • {playlist.url}</p>
                            <p className="text-xs text-gray-500">
                              Last updated: {new Date(playlist.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={playlist.isActive ? "default" : "secondary"}>
                              {playlist.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePlaylistMutation.mutate(playlist.id)}
                              data-testid={`button-remove-playlist-${playlist.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parental" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parental Controls</CardTitle>
              <CardDescription>Set up PIN protection and content filtering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="parental-pin">Master PIN</Label>
                <Input
                  id="parental-pin"
                  type="password"
                  value={appSettings.parentalPin}
                  onChange={(e) => setAppSettings(prev => ({ ...prev, parentalPin: e.target.value }))}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  data-testid="input-parental-pin"
                />
                <p className="text-sm text-gray-500">Used to access settings and adult content</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Ratings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Age Rating</Label>
                    <Select defaultValue="18">
                      <SelectTrigger data-testid="select-age-rating">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Ages</SelectItem>
                        <SelectItem value="7">7+</SelectItem>
                        <SelectItem value="13">13+</SelectItem>
                        <SelectItem value="16">16+</SelectItem>
                        <SelectItem value="18">18+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Restricted Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="destructive">Adult</Badge>
                      <Badge variant="destructive">Violence</Badge>
                      <Badge variant="outline">+ Add Category</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White Label Customization</CardTitle>
              <CardDescription>Customize colors, theme and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={appSettings.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'primary')}
                      className="w-16 h-10"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={appSettings.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'primary')}
                      placeholder="#1428A0"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Accent Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={appSettings.secondaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'secondary')}
                      className="w-16 h-10"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={appSettings.secondaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'secondary')}
                      placeholder="#FF6B00"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme Preview</h3>
                <div className="p-6 rounded-lg border bg-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: appSettings.primaryColor }}></div>
                    <div>
                      <h4 className="font-bold text-lg">{appSettings.appName}</h4>
                      <p className="text-sm text-gray-400">Preview your customized theme</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button style={{ backgroundColor: appSettings.primaryColor }} className="text-white">
                      Primary Button
                    </Button>
                    <Button variant="outline" style={{ borderColor: appSettings.secondaryColor, color: appSettings.secondaryColor }}>
                      Accent Button
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Technical settings and data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Cloud Sync</Label>
                    <p className="text-sm text-gray-500">Sync favorites and watch history across devices</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-cloud-sync" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Background Updates</Label>
                    <p className="text-sm text-gray-500">Automatically update playlists and EPG data</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-background-updates" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hardware Acceleration</Label>
                    <p className="text-sm text-gray-500">Use GPU for video decoding (requires restart)</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-hardware-acceleration" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" data-testid="button-export-settings">
                    <Download className="mr-2 h-4 w-4" />
                    Export Settings
                  </Button>
                  <Button variant="outline" data-testid="button-import-settings">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Settings
                  </Button>
                </div>
                <Button variant="destructive" className="w-full" data-testid="button-reset-app">
                  Reset App to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}