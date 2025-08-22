import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock, Tv, Calendar } from "lucide-react";
import { Channel, EpgProgram } from "@shared/schema";

export default function EPGPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: epgData = [] } = useQuery<EpgProgram[]>({
    queryKey: ["/api/epg", selectedDate.toISOString().split('T')[0]],
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const getDateButtons = () => {
    const dates = [];
    for (let i = -3; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(hour * 60 + minute);
      }
    }
    return slots;
  };

  const getProgram = (channelId: string, timeSlot: number) => {
    const startTime = new Date(selectedDate);
    startTime.setHours(Math.floor(timeSlot / 60), timeSlot % 60, 0, 0);
    
    return epgData.find(program => 
      program.channelId === channelId &&
      new Date(program.startTime) <= startTime &&
      new Date(program.endTime) > startTime
    );
  };

  const isCurrentTimeSlot = (timeSlot: number) => {
    if (!isToday(selectedDate)) return false;
    const currentTime = getCurrentTimeSlot();
    return Math.abs(currentTime - timeSlot) < 30;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getAgeRatingColor = (rating: number) => {
    if (rating >= 18) return "bg-red-600";
    if (rating >= 16) return "bg-orange-600";
    if (rating >= 13) return "bg-yellow-600";
    if (rating >= 7) return "bg-blue-600";
    return "bg-green-600";
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Tv className="h-8 w-8 text-samsung-blue" />
            <div>
              <h1 className="text-3xl font-bold">Electronic Program Guide</h1>
              <p className="text-gray-400">7-day TV schedule and catch-up</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-medium">{formatDate(selectedDate)}</span>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDate('prev')}
            data-testid="button-prev-date"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex space-x-2 overflow-x-auto">
            {getDateButtons().map((date, index) => (
              <Button
                key={index}
                variant={date.toDateString() === selectedDate.toDateString() ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDate(date)}
                className="whitespace-nowrap"
                data-testid={`button-date-${index}`}
              >
                <div className="text-center">
                  <div className="text-xs">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="font-bold">
                    {date.getDate()}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDate('next')}
            data-testid="button-next-date"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* EPG Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Channel List */}
        <div className="w-64 border-r border-gray-800 bg-card-bg">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold text-lg">Channels</h3>
          </div>
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {channels.map((channel) => (
                <Card 
                  key={channel.id}
                  className={`cursor-pointer transition-colors ${
                    selectedChannel === channel.id ? 'bg-samsung-blue' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                  data-testid={`channel-${channel.id}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={channel.logoUrl || `https://via.placeholder.com/40x40?text=${channel.name.charAt(0)}`}
                        alt={channel.name}
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{channel.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{channel.category}</p>
                      </div>
                      {channel.isLive && (
                        <Badge variant="destructive" className="text-xs">LIVE</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            {/* Time Header */}
            <div className="sticky top-0 bg-card-bg border-b border-gray-800 z-10">
              <div className="flex">
                {getTimeSlots().map((timeSlot, index) => {
                  if (timeSlot % 60 !== 0) return null; // Show only hour markers
                  return (
                    <div 
                      key={index}
                      className={`w-32 p-3 text-center border-r border-gray-700 ${
                        isCurrentTimeSlot(timeSlot) ? 'bg-samsung-blue' : ''
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {String(Math.floor(timeSlot / 60)).padStart(2, '0')}:00
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Program Grid */}
            <div className="space-y-1">
              {channels.map((channel) => (
                <div key={channel.id} className="flex border-b border-gray-800">
                  {getTimeSlots().map((timeSlot, index) => {
                    if (timeSlot % 30 !== 0) return null; // 30-minute slots
                    
                    const program = getProgram(channel.id, timeSlot);
                    const isCurrentTime = isCurrentTimeSlot(timeSlot);
                    
                    return (
                      <div 
                        key={index}
                        className={`w-32 min-h-[80px] border-r border-gray-700 p-2 relative ${
                          isCurrentTime ? 'bg-samsung-blue bg-opacity-20' : ''
                        }`}
                      >
                        {program && (
                          <Card className="h-full cursor-pointer hover:bg-gray-700">
                            <CardContent className="p-2 h-full">
                              <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-xs text-gray-400">
                                    {formatTime(new Date(program.startTime))}
                                  </div>
                                  {program.ageRating > 0 && (
                                    <Badge 
                                      className={`text-xs ${getAgeRatingColor(program.ageRating)}`}
                                    >
                                      {program.ageRating}+
                                    </Badge>
                                  )}
                                </div>
                                <h5 className="text-sm font-medium line-clamp-2 flex-1">
                                  {program.title}
                                </h5>
                                {program.category && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {program.category}
                                  </Badge>
                                )}
                                {program.isCatchupAvailable && (
                                  <div className="flex items-center mt-1">
                                    <Clock className="h-3 w-3 text-accent-orange mr-1" />
                                    <span className="text-xs text-accent-orange">Catch-up</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Time Indicator */}
      {isToday(selectedDate) && (
        <div 
          className="absolute bg-red-500 w-0.5 top-0 bottom-0 z-20 pointer-events-none"
          style={{
            left: `${64 + (getCurrentTimeSlot() / 30) * 32}rem`,
          }}
        />
      )}
    </div>
  );
}