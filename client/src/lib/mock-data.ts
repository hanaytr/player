// This file contains mock data generation utilities
// All actual data is now managed by the storage layer

export const MOCK_USER_ID = "user-1";

export function generateMockImageUrl(width: number, height: number, seed?: string): string {
  return `https://picsum.photos/${width}/${height}${seed ? `?random=${seed}` : ''}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatTimeRemaining(progressPercent: number, totalMinutes: number): string {
  const remainingMinutes = Math.ceil(((totalMinutes * 60) * (100 - progressPercent)) / 100 / 60);
  return `${remainingMinutes}min left`;
}

export function getGenreColor(genre: string): string {
  const colors = {
    'Action': 'bg-red-600',
    'Adventure': 'bg-orange-600',
    'Comedy': 'bg-yellow-600',
    'Drama': 'bg-blue-600',
    'Horror': 'bg-purple-600',
    'Sci-Fi': 'bg-green-600',
    'Fantasy': 'bg-pink-600',
    'Thriller': 'bg-gray-600',
    'Crime': 'bg-red-800',
    'Documentary': 'bg-teal-600',
    'News': 'bg-blue-800',
    'Sports': 'bg-orange-800',
    'Music': 'bg-purple-800',
  };
  
  return colors[genre as keyof typeof colors] || 'bg-gray-600';
}
