import { useQuery } from "@tanstack/react-query";
import ContentCarousel from "@/components/content/content-carousel.tsx";

export default function LiveTV() {
  const { data: channels = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/channels"],
  });

  const channelsByCategory = channels.reduce((acc: any, channel: any) => {
    if (!acc[channel.category]) {
      acc[channel.category] = [];
    }
    acc[channel.category].push(channel);
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Live TV</h1>
        <p className="text-lg text-gray-400">Watch live channels and current programming</p>
      </div>

      {Object.entries(channelsByCategory).map(([category, categoryChannels]) => (
        <ContentCarousel
          key={category}
          title={category}
          items={categoryChannels as any[]}
          isLoading={isLoading}
          type="channel"
        />
      ))}
    </div>
  );
}
