import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/content/hero-section";
import ContentCarousel from "@/components/content/content-carousel.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Upload, Tv, Radio, Film } from "lucide-react";
import { Channel, Movie, Series, WatchHistory } from "@shared/schema";

export default function Home() {
  const { data: channels = [], isLoading: channelsLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: movies = [], isLoading: moviesLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const { data: series = [], isLoading: seriesLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const { data: featuredMovies = [], isLoading: featuredLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies/featured"],
  });

  const { data: watchHistory = [], isLoading: historyLoading } = useQuery<WatchHistory[]>({
    queryKey: ["/api/watch-history/user-1"],
  });

  const hasAnyContent = channels.length > 0 || movies.length > 0 || series.length > 0;

  const getContinueWatchingContent = () => {
    if (!watchHistory || !movies) return [];
    
    return watchHistory
      .filter((item: WatchHistory) => (item.progress ?? 0) > 0 && (item.progress ?? 0) < 95)
      .map((item: WatchHistory) => {
        const content = movies.find((movie: Movie) => movie.id === item.contentId);
        if (!content) return null;
        
        return {
          ...content,
          progress: item.progress ?? 0,
          timeLeft: Math.ceil((((content.duration ?? 0) * 60) * (100 - (item.progress ?? 0))) / 100 / 60) + "min left"
        };
      })
      .filter(Boolean)
      .slice(0, 6);
  };

  const continueWatchingContent = getContinueWatchingContent();

  if (featuredLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const heroContent = featuredMovies[0] || movies[0];

  // Show welcome screen if no content is available
  if (!hasAnyContent && !channelsLoading && !moviesLoading && !seriesLoading) {
    return (
      <div className="min-h-full flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-samsung-blue to-accent-orange bg-clip-text text-transparent">
              TizenTV Pro'ya Hoş Geldiniz
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Gerçek IPTV aboneliğinizi bağlayarak başlayın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <Tv className="h-12 w-12 mx-auto mb-4 text-samsung-blue" />
                <CardTitle>Canlı TV Kanalları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  M3U playlist'inizden canlı TV kanallarını yükleyin
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Radio className="h-12 w-12 mx-auto mb-4 text-accent-orange" />
                <CardTitle>Radyo İstasyonları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Radyo kanalları otomatik olarak ayrı bölümde görünecek
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Film className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <CardTitle>Film & Diziler</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  VOD içeriklerinizi yönetin ve kategorilere ayırın
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="mr-4" 
              onClick={() => window.location.href = '/settings'}
              data-testid="button-get-started"
            >
              <Settings className="mr-2 h-5 w-5" />
              IPTV Aboneliğimi Bağla
            </Button>
            
            <p className="text-sm text-gray-500">
              M3U playlist URL'nizi veya Xtream Codes bilgilerinizi ayarlar sayfasından ekleyin
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {heroContent && <HeroSection content={heroContent} />}
      
      <div className="px-8 space-y-8 pb-12">
        <ContentCarousel
          title="Live TV"
          viewAllLink="/live-tv"
          items={channels}
          isLoading={channelsLoading}
          type="channel"
        />

        {continueWatchingContent.length > 0 && (
          <ContentCarousel
            title="Continue Watching"
            items={continueWatchingContent}
            isLoading={historyLoading}
            type="continue-watching"
          />
        )}

        <ContentCarousel
          title="Trending Movies"
          viewAllLink="/movies"
          items={movies.slice(0, 10)}
          isLoading={moviesLoading}
          type="movie"
        />

        <ContentCarousel
          title="Popular TV Series"
          viewAllLink="/series"
          items={series}
          isLoading={seriesLoading}
          type="series"
        />
      </div>
    </div>
  );
}
