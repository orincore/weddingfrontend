import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, Heart } from 'lucide-react';

export function NameEntryModal() {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('guestName');
    if (storedName) {
      setIsOpen(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('guestName', name.trim());
      setShowOptions(true);
    }
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="bg-white/95 rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-md border border-rose-100 animate-scaleIn">
        <div className="relative flex flex-col items-center mb-8">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full opacity-40 blur-md"></div>
            <Heart size={32} className="text-rose-500 absolute" fill="currentColor" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 text-center font-semibold mb-2">
            Engagement Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mt-1"></div>
        </div>

        {!showOptions ? (
          <form onSubmit={handleSubmit} className="space-y-5 animate-slideUp">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Please enter your name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white/60 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  placeholder="Your name"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-xl pointer-events-none"></div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg font-medium"
            >
              Continue
            </button>
          </form>
        ) : (
          <div className="space-y-5 animate-slideUp">
            <p className="text-center text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
              Welcome, <span className="font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-transparent bg-clip-text">{name}</span>! We're excited to have you join us in capturing special moments.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleNavigation('/upload')}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg font-medium"
              >
                <Camera className="h-5 w-5" />
                Take Photos
              </button>
              <button
                onClick={() => handleNavigation('/gallery')}
                className="w-full bg-white border border-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-rose-50 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <Image className="h-5 w-5 text-rose-500" />
                View Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}