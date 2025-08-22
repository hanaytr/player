import { Link } from "wouter";
import ChannelCard from "./channel-card.tsx";
import ContentCard from "./content-card.tsx";

interface ContentCarouselProps {
  title: string;
  viewAllLink?: string;
  items: any[];
  isLoading: boolean;
  type: "channel" | "movie" | "series" | "continue-watching" | "mixed";
}

export default function ContentCarousel({ 
  title, 
  viewAllLink, 
  items, 
  isLoading, 
  type 
}: ContentCarouselProps) {
  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <a 
              className="text-samsung-blue hover:text-accent-orange focus-ring rounded px-2 py-1" 
              tabIndex={0}
              data-testid={`link-view-all-${title.toLowerCase().replace(' ', '-')}`}
            >
              View All
            </a>
          </Link>
        )}
      </div>
      
      <div className="carousel-container overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {items.map((item, index) => {
            if (type === "channel") {
              return (
                <ChannelCard
                  key={item.id}
                  channel={item}
                  tabIndex={0}
                />
              );
            } else {
              return (
                <ContentCard
                  key={item.id}
                  content={item}
                  type={type === "continue-watching" ? "continue-watching" : 
                       type === "series" ? "series" : "movie"}
                  tabIndex={0}
                />
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}
