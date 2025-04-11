import React from 'react';
import { Heart, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <div className="w-full bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white py-3 text-center text-sm font-medium relative mb-[5.5rem]">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <span>Made with</span>
          <Heart size={16} fill="currentColor" className="inline-block mx-1 text-white" />
          <span>by Adarsh Suradkar</span>
        </div>
        <div className="hidden sm:block text-white/70">•</div>
        <a 
          href="https://www.instagram.com/ig_orincore/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:text-white/80 transition-colors"
        >
          <Instagram size={16} className="inline-block mr-1" />
          <span>@ig_orincore</span>
        </a>
      </div>
    </div>
  );
} 