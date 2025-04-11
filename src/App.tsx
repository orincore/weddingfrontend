import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NameEntryModal } from './components/NameEntryModal';
import { UploadPage } from './components/UploadPage';
import { GalleryPage } from './components/GalleryPage';
import { AdminPanel } from './components/AdminPanel';
import { UserPhotosPage } from './components/UserPhotosPage';
import { Navigation } from './components/Navigation';

function App() {
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