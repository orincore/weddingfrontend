import React from 'react';
import { Calendar, Info } from 'lucide-react';

export function ExpirationBanner() {
  return (
    <div className="fixed bottom-[4.5rem] left-0 right-0 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-2 px-4 text-center text-sm z-40 shadow-lg flex items-center justify-center gap-2">
      <Info size={16} className="flex-shrink-0" />
      <p className="font-medium">This website is only valid till 19 April 2025</p>
      <Calendar size={16} className="flex-shrink-0" />
    </div>
  );
} 