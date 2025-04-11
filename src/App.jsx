import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NameEntryModal } from './components/NameEntryModal';
import { UploadPage } from './components/UploadPage';
import { GalleryPage } from './components/GalleryPage';
import { AdminPanel } from './components/AdminPanel';
import { UserPhotosPage } from './components/UserPhotosPage';
import { Navigation } from './components/Navigation';
import { ExpirationBanner } from './components/ExpirationBanner';
import { Footer } from './components/Footer';
import axios from 'axios';

// Configuration for keep-alive
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://weddingbackend-1fp6.onrender.com';
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
const PING_INTERVAL = 300000; // 5 minutes (reduced from 14 minutes)

function App() {
  // Keep-alive functionality
  useEffect(() => {
    // Function to ping servers
    const pingServers = async () => {
      try {
        // Ping backend
        const backendResponse = await axios.get(`${BACKEND_URL}/health`);
        console.log('Backend ping:', backendResponse.status);
        
        // Ping frontend (self)
        const frontendResponse = await axios.get(`${FRONTEND_URL}/ping.txt`);
        console.log('Frontend ping:', frontendResponse.status);
      } catch (error) {
        console.error('Error pinging servers:', error.message);
      }
    };

    // Ping immediately on load
    pingServers();
    
    // Set up interval for recurring pings
    const intervalId = setInterval(pingServers, PING_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-rose-50 pb-20">
        <NameEntryModal />
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/myphotos" element={<UserPhotosPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Navigation />
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App; 