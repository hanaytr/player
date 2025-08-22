import { useState, useEffect } from "react";
import { Search, Bell, Signal } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-card-bg border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search channels, movies, shows..."
              className="w-full bg-gray-800 border-gray-700 rounded-lg px-12 py-3 text-lg focus-ring focus:border-samsung-blue"
              tabIndex={0}
              data-testid="input-search-top"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center space-x-4">
          {/* Signal Status */}
          <div className="flex items-center space-x-2 text-success-green">
            <Signal className="text-lg" />
            <span className="font-medium">Connected</span>
          </div>

          {/* Time Display */}
          <div className="text-lg font-medium" data-testid="text-current-time">
            {currentTime}
          </div>

          {/* Notifications */}
          <button className="relative p-3 hover:bg-gray-800 rounded-lg focus-ring" tabIndex={0} data-testid="button-notifications">
            <Bell className="text-lg" />
            <span className="absolute -top-1 -right-1 bg-accent-orange text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Menu */}
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg focus-ring" tabIndex={0} data-testid="button-profile-menu">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
              alt="User profile" 
              className="w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
