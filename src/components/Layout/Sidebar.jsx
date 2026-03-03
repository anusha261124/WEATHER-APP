import React from 'react';
import { 
  Cloud, 
  CalendarDays, 
  History, 
  Waves, 
  MapPin, 
  Settings 
} from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';

const navItems = [
  { id: 'current', label: 'Current', icon: Cloud },
  { id: 'forecast', label: 'Forecast', icon: CalendarDays },
  { id: 'historical', label: 'Historical', icon: History },
  { id: 'marine', label: 'Marine', icon: Waves },
  { id: 'location', label: 'Location', icon: MapPin },
];

const Sidebar = () => {
  const { activeTab, setActiveTab } = useWeatherContext();

  return (
    <aside className="w-64 h-full glass flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">WeatherStack</h1>
            <p className="text-xs text-slate-400">SaaS Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="nav-item w-full">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
