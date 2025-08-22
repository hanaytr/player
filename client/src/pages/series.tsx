import { useQuery } from "@tanstack/react-query";
import ContentCarousel from "@/components/content/content-carousel.tsx";

export default function Series() {
  const { data: series = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/series"],
  });

  const seriesByGenre = series.reduce((acc: any, show: any) => {
    const genres = show.genre.split(", ");
    genres.forEach((genre: string) => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(show);
    });
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">TV Series</h1>
        <p className="text-lg text-gray-400">Binge-watch your favorite shows</p>
      </div>

      <ContentCarousel
        title="All Series"
        items={series}
        isLoading={isLoading}
        type="series"
      />

      {Object.entries(seriesByGenre).map(([genre, genreSeries]) => (
        <ContentCarousel
          key={genre}
          title={`${genre} Series`}
          items={genreSeries as any[]}
          isLoading={isLoading}
          type="series"
        />
      ))}
    </div>
  );
}
