import { Link, useLocation } from "wouter";
import { Home, Tv, Film, Monitor, Heart, Clock, Search, Settings, Calendar, Radio } from "lucide-react";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/live-tv", label: "Live TV", icon: Tv },
  { path: "/radio", label: "Radio", icon: Radio },
  { path: "/movies", label: "Movies", icon: Film },
  { path: "/series", label: "TV Shows", icon: Monitor },
  { path: "/favorites", label: "Favorites", icon: Heart },
  { path: "/search", label: "Search", icon: Search },
  { path: "/epg", label: "TV Guide", icon: Calendar },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-card-bg border-r border-gray-800 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-samsung-blue rounded-lg flex items-center justify-center">
            <Tv className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">TizenTV Pro</h1>
            <p className="text-xs text-gray-400">v2.1.0</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 focus-ring rounded-lg p-2 cursor-pointer" tabIndex={0}>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
            alt="User avatar" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-gray-400">Premium Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={`nav-item focus-ring ${
                      isActive ? 'nav-item-active' : 'nav-item-inactive'
                    }`}
                    tabIndex={0}
                    data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link href="/settings">
          <a className="nav-item nav-item-inactive focus-ring w-full" tabIndex={0} data-testid="link-settings">
            <Settings className="text-lg" />
            <span className="font-medium">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
