import React from 'react';
import { useAppContext } from '../context/AppContext';

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className = "" }) => {
  const { state } = useAppContext();

  // If user selected a specific logo, use it
  if (state.user.appLogo) {
    return <img src={state.user.appLogo} alt="App Logo" className={`object-cover ${className}`} referrerPolicy="no-referrer" />;
  }

  // Otherwise generate a dynamic logo based on theme
  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-primary to-blue-500 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      <span className="text-white font-black text-2xl tracking-tighter select-none">RM</span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default AppLogo;
