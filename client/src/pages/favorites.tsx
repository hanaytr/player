import { useQuery } from "@tanstack/react-query";
import ContentCarousel from "@/components/content/content-carousel.tsx";

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/favorites/user-1"],
  });

  // This would need to be enhanced to fetch the actual content based on favorites
  // For now, showing empty state

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Favorites</h1>
        <p className="text-lg text-gray-400">Your saved content collection</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold mb-4">No favorites yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            Start adding your favorite channels, movies, and series to see them here.
          </p>
        </div>
      ) : (
        <ContentCarousel
          title="Your Favorites"
          items={favorites}
          isLoading={isLoading}
          type="mixed"
        />
      )}
    </div>
  );
}
