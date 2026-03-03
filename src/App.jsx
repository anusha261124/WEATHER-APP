import React from 'react';
import { WeatherProvider, useWeatherContext } from './context/WeatherContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import CurrentWeather from './components/Weather/CurrentWeather';
import ForecastList from './components/Weather/ForecastList';
import HistoricalData from './components/Weather/HistoricalData';
import MarineWeather from './components/Weather/MarineWeather';
import LocationSearch from './components/Weather/LocationSearch';

const ContentArea = () => {
  const { activeTab } = useWeatherContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentWeather />;
      case 'forecast':
        return <ForecastList />;
      case 'historical':
        return <HistoricalData />;
      case 'marine':
        return <MarineWeather />;
      case 'location':
        return <LocationSearch />;
      default:
        return <CurrentWeather />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <ContentArea />
      </div>
    </div>
  );
};

function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

export default App;
