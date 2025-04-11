import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Image, Lock, UserCircle } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex gap-6 z-40">
      <button
        onClick={() => navigate('/upload')}
        className={`p-2 rounded-full transition-colors ${
          location.pathname === '/upload'
            ? 'bg-rose-100 text-rose-600'
            : 'text-gray-600 hover:bg-rose-50'
        }`}
      >
        <Camera size={24} />
      </button>
      <button
        onClick={() => navigate('/gallery')}
        className={`p-2 rounded-full transition-colors ${
          location.pathname === '/gallery'
            ? 'bg-rose-100 text-rose-600'
            : 'text-gray-600 hover:bg-rose-50'
        }`}
      >
        <Image size={24} />
      </button>
      <button
        onClick={() => navigate('/myphotos')}
        className={`p-2 rounded-full transition-colors ${
          location.pathname === '/myphotos'
            ? 'bg-rose-100 text-rose-600'
            : 'text-gray-600 hover:bg-rose-50'
        }`}
      >
        <UserCircle size={24} />
      </button>
      <button
        onClick={() => navigate('/admin')}
        className={`p-2 rounded-full transition-colors ${
          location.pathname === '/admin'
            ? 'bg-rose-100 text-rose-600'
            : 'text-gray-600 hover:bg-rose-50'
        }`}
      >
        <Lock size={24} />
      </button>
    </nav>
  );
}