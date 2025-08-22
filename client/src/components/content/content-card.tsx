import { Movie, Series } from "@shared/schema";
import { Play } from "lucide-react";

interface ContentCardProps {
  content: any; // Movie, Series, or continue-watching item
  type: "movie" | "series" | "continue-watching";
  tabIndex?: number;
}

export default function ContentCard({ content, type, tabIndex = 0 }: ContentCardProps) {
  const openVideoPlayer = () => {
    if ((window as any).openVideoPlayer) {
      (window as any).openVideoPlayer(content);
    }
  };

  if (type === "continue-watching") {
    return (
      <div 
        className="content-card flex-shrink-0 w-72 bg-card-bg rounded-lg overflow-hidden cursor-pointer focus-ring" 
        tabIndex={tabIndex}
        onClick={openVideoPlayer}
        data-testid={`card-continue-watching-${content.id}`}
      >
        <div className="relative">
          <img 
            src={content.posterUrl || getDefaultPoster(type)} 
            alt={content.title} 
            className="w-full h-40 object-cover"
          />
          {content.progress && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-accent-orange" 
                  style={{ width: `${content.progress}%` }}
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs" data-testid={`text-time-left-${content.id}`}>
                {content.timeLeft}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-bold mb-1" data-testid={`text-title-${content.id}`}>
            {content.title}
          </h4>
          <p className="text-sm text-gray-400" data-testid={`text-info-${content.id}`}>
            {content.genre} • {content.year}
          </p>
        </div>
      </div>
    );
  }

  if (type === "series") {
    return (
      <div 
        className="content-card flex-shrink-0 w-48 cursor-pointer focus-ring" 
        tabIndex={tabIndex}
        onClick={openVideoPlayer}
        data-testid={`card-series-${content.id}`}
      >
        <div className="relative mb-3">
          <img 
            src={content.posterUrl || getDefaultPoster(type)} 
            alt={`${content.title} poster`} 
            className="w-full h-72 object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-bold">
            S{content.seasons}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
            <button className="bg-white bg-opacity-90 text-black p-4 rounded-full">
              <Play className="text-xl" />
            </button>
          </div>
        </div>
        <h4 className="font-bold mb-1" data-testid={`text-series-title-${content.id}`}>
          {content.title}
        </h4>
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
          <span data-testid={`text-series-seasons-${content.id}`}>
            {content.seasons} Season{content.seasons !== 1 ? 's' : ''}
          </span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span data-testid={`text-series-rating-${content.id}`}>
              {content.imdbRating}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500" data-testid={`text-series-genre-${content.id}`}>
          {content.genre}
        </p>
      </div>
    );
  }

  // Movie type
  return (
    <div 
      className="content-card flex-shrink-0 w-48 cursor-pointer focus-ring" 
      tabIndex={tabIndex}
      onClick={openVideoPlayer}
      data-testid={`card-movie-${content.id}`}
    >
      <div className="relative mb-3">
        <img 
          src={content.posterUrl || getDefaultPoster(type)} 
          alt={`${content.title} poster`} 
          className="w-full h-72 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-bold">
          {content.quality || "HD"}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
          <button className="bg-white bg-opacity-90 text-black p-4 rounded-full">
            <Play className="text-xl" />
          </button>
        </div>
      </div>
      <h4 className="font-bold mb-1" data-testid={`text-movie-title-${content.id}`}>
        {content.title}
      </h4>
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span data-testid={`text-movie-year-${content.id}`}>
          {content.year}
        </span>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <span className="text-yellow-400">★</span>
          <span data-testid={`text-movie-rating-${content.id}`}>
            {content.imdbRating}
          </span>
        </div>
      </div>
    </div>
  );
}

function getDefaultPoster(type: string): string {
  const defaultPosters = {
    "movie": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=192&h=288",
    "series": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=192&h=288",
    "continue-watching": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=288&h=162",
  };
  return defaultPosters[type as keyof typeof defaultPosters] || defaultPosters["movie"];
}
