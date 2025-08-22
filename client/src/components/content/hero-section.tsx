import { Play, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  content: any;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const openVideoPlayer = () => {
    if ((window as any).openVideoPlayer) {
      (window as any).openVideoPlayer(content);
    }
  };

  return (
    <section className="relative h-96 mb-8">
      <img 
        src={content.backdropUrl || content.posterUrl || "https://images.unsplash.com/photo-1489599578855-a6cbbc6c3d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600"} 
        alt={content.title || content.name} 
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 video-overlay"></div>
      
      <div className="absolute bottom-8 left-8 max-w-lg">
        <h2 className="text-4xl font-bold mb-4" data-testid="text-hero-title">
          {content.title || content.name}
        </h2>
        <p className="text-lg mb-6 text-gray-200" data-testid="text-hero-description">
          {content.description || "Featured content"}
        </p>
        
        <div className="flex items-center space-x-4 mb-6">
          {content.rating && (
            <span className="bg-accent-orange px-3 py-1 rounded text-sm font-medium" data-testid="text-hero-rating">
              {content.rating}
            </span>
          )}
          {content.year && (
            <span className="text-gray-300" data-testid="text-hero-year">
              {content.year}
            </span>
          )}
          {content.genre && (
            <span className="text-gray-300" data-testid="text-hero-genre">
              {content.genre}
            </span>
          )}
          {content.imdbRating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span data-testid="text-hero-imdb-rating">{content.imdbRating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            className="tv-button tv-button-primary focus-ring" 
            onClick={openVideoPlayer}
            tabIndex={0}
            data-testid="button-hero-play"
          >
            <Play className="mr-2" />
            Play
          </Button>
          
          <Button 
            className="tv-button tv-button-secondary focus-ring" 
            variant="secondary"
            tabIndex={0}
            data-testid="button-hero-info"
          >
            <Info className="mr-2" />
            More Info
          </Button>
          
          <Button 
            className="bg-gray-800 bg-opacity-80 p-3 rounded-lg hover:bg-gray-700 focus-ring" 
            variant="secondary"
            size="icon"
            tabIndex={0}
            data-testid="button-hero-add"
          >
            <Plus />
          </Button>
        </div>
      </div>
    </section>
  );
}
