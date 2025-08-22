import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LiveTV from "@/pages/live-tv";
import Movies from "@/pages/movies";
import Series from "@/pages/series";
import Favorites from "@/pages/favorites";
import Search from "@/pages/search";
import Radio from "@/pages/radio";
import Settings from "@/pages/settings";
import EPGPage from "@/pages/epg";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/top-bar";
import VideoPlayerModal from "@/components/video/video-player-modal";
import ProfileSelector from "@/components/profile/profile-selector";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation.tsx";
import { useEffect, useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/live-tv" component={LiveTV} />
      <Route path="/radio" component={Radio} />
      <Route path="/movies" component={Movies} />
      <Route path="/series" component={Series} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/search" component={Search} />
      <Route path="/settings" component={Settings} />
      <Route path="/epg" component={EPGPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainLayout() {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  useKeyboardNavigation();

  const openVideoPlayer = (content: any) => {
    setSelectedContent(content);
    setIsVideoPlayerOpen(true);
  };

  const closeVideoPlayer = () => {
    setIsVideoPlayerOpen(false);
    setSelectedContent(null);
  };

  // Make video player controls available globally
  useEffect(() => {
    (window as any).openVideoPlayer = openVideoPlayer;
    (window as any).closeVideoPlayer = closeVideoPlayer;
  }, []);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto smooth-scroll">
          <Router />
        </main>
      </div>
      {isVideoPlayerOpen && (
        <VideoPlayerModal
          content={selectedContent}
          onClose={closeVideoPlayer}
        />
      )}
      <ProfileSelector
        isOpen={showProfileSelector}
        onClose={() => setShowProfileSelector(false)}
        onSelectProfile={(profile) => {
          setCurrentProfile(profile);
          setShowProfileSelector(false);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
