import { useQuery } from "@tanstack/react-query";
import ContentCarousel from "@/components/content/content-carousel.tsx";

export default function Movies() {
  const { data: movies = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/movies"],
  });

  const moviesByGenre = movies.reduce((acc: any, movie: any) => {
    const genres = movie.genre.split(", ");
    genres.forEach((genre: string) => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(movie);
    });
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Movies</h1>
        <p className="text-lg text-gray-400">Discover your next favorite movie</p>
      </div>

      <ContentCarousel
        title="All Movies"
        items={movies}
        isLoading={isLoading}
        type="movie"
      />

      {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
        <ContentCarousel
          key={genre}
          title={`${genre} Movies`}
          items={genreMovies as any[]}
          isLoading={isLoading}
          type="movie"
        />
      ))}
    </div>
  );
}
