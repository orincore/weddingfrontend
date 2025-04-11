import React, { useEffect } from 'react';
import { Download, X, Loader2, UserCircle, Heart, Calendar } from 'lucide-react';
import { usePhotoStore } from '../store';
import { Photo } from '../types';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { ExpirationBanner } from './ExpirationBanner';
import { Footer } from './Footer';
import { formatDate, formatTime } from '../utils/dateUtils';

export function UserPhotosPage() {
  const { userPhotos, userPhotosLoading, userPhotosError, fetchUserPhotos } = usePhotoStore();
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);
  const guestName = localStorage.getItem('guestName') || '';

  useEffect(() => {
    if (guestName) {
      fetchUserPhotos(guestName);
    }
  }, [fetchUserPhotos, guestName]);

  const downloadPhoto = async (url: string, fileName: string) => {
    try {
      // Show loading toast
      const toastId = toast.loading('Downloading photo...');
      
      // Fetch the image as a blob
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Use saveAs from file-saver to download the blob
      saveAs(blob, fileName);
      
      // Update toast on success
      toast.success('Download complete!', { id: toastId });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const viewFullScreen = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeFullScreen = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 px-3 py-6 sm:p-6 relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-rose-300 opacity-50 hidden md:block">
        <Heart size={30} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-300 opacity-50 hidden md:block">
        <Heart size={24} fill="currentColor" />
      </div>
      
      <div className="max-w-6xl mx-auto animate-fadeIn relative z-10 pb-36">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart size={24} className="text-rose-500 mr-3 animate-pulse" fill="currentColor" />
            <h1 className="text-2xl sm:text-3xl font-serif text-rose-600 text-center font-semibold">Your Moments</h1>
            <Heart size={24} className="text-rose-500 ml-3 animate-pulse" fill="currentColor" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mb-5"></div>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-full shadow-sm border border-rose-200 animate-fadeIn">
            <UserCircle size={18} className="text-rose-500" />
            <span className="text-sm sm:text-base text-gray-700 truncate max-w-[200px] font-medium">{guestName}</span>
          </div>
        </div>
        
        {userPhotosLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart size={16} className="text-rose-400" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {userPhotosError && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-red-500 text-center mx-auto max-w-xl animate-fadeIn border border-rose-100">
            <div className="font-medium">Error loading your photos</div>
            <div className="text-sm text-red-400 mt-1">{userPhotosError}</div>
          </div>
        )}

        {!userPhotosLoading && userPhotos.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-10 shadow-lg mx-auto max-w-xl text-center animate-fadeIn border border-rose-100">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-rose-400" fill="currentColor" />
              </div>
              <h3 className="text-xl font-medium text-rose-600 mb-2">No moments captured yet</h3>
              <p className="text-gray-500">Create memories at the engagement celebration!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {userPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn border border-rose-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="cursor-pointer relative group w-full"
                onClick={() => viewFullScreen(photo)}
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-rose-50/50">
                  <img
                    src={photo.url}
                    alt={`Your photo`}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">View Memory</span>
                </div>
              </div>
              <div className="p-4 relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-rose-50/30 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-1 items-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        <Heart size={12} fill="currentColor" />
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {new Date(photo.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPhoto(photo.url, `photo-${photo.id}.jpg`);
                      }}
                      className="text-gray-500 hover:text-rose-500 transition-all duration-300 p-2 rounded-full hover:bg-rose-50"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatTime(photo.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen image viewer */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={closeFullScreen}
          >
            <div 
              className="relative max-w-6xl w-full h-full flex items-center justify-center animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-5 left-5 text-rose-500/30">
                <Heart size={30} fill="currentColor" />
              </div>
              <div className="absolute bottom-10 right-10 text-rose-500/30">
                <Heart size={20} fill="currentColor" />
              </div>
              
              <button
                onClick={closeFullScreen}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-white/10 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="max-h-[90vh] max-w-[90vw] relative">
                <img
                  src={selectedPhoto.url}
                  alt={`Your photo`}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm flex items-center space-x-3">
                  <div className="flex items-center text-white/90">
                    <Heart size={14} className="mr-1" fill="currentColor" />
                    <span className="font-medium">{guestName}'s Moment</span>
                  </div>
                  <span className="text-white/70">•</span>
                  <div className="flex items-center text-white/80">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(selectedPhoto.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(selectedPhoto.timestamp)}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(selectedPhoto.url, `photo-${selectedPhoto.id}.jpg`);
                    }}
                    className="ml-2 text-white hover:text-rose-300 transition-colors duration-300 p-1"
                    title="Download Photo"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
      <ExpirationBanner />
    </div>
  );
} 