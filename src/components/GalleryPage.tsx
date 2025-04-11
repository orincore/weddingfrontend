import React, { useState, useEffect } from 'react';
import { Download, X, Loader2, Heart, Search, ArrowDownToLine, Calendar } from 'lucide-react';
import { usePhotoStore } from '../store';
import { Photo } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { ExpirationBanner } from './ExpirationBanner';
import { Footer } from './Footer';
import { formatDate, formatTime } from '../utils/dateUtils';

export function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const { photos, loading, error, fetchPhotos } = usePhotoStore();

  // Handle search term debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch photos when component mounts or search term changes
  useEffect(() => {
    fetchPhotos(debouncedSearchTerm);
  }, [fetchPhotos, debouncedSearchTerm]);

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

  const downloadAllPhotos = async () => {
    if (photos.length === 0) return;
    
    try {
      setIsDownloadingAll(true);
      const zip = new JSZip();
      toast.success(`Preparing ${photos.length} photos for download...`);
      
      // Add each photo to the zip file
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const fileName = `photo_${i+1}_by_${photo.uploaderName}.jpg`;
        
        // Fetch the image
        const response = await fetch(photo.url);
        const blob = await response.blob();
        
        // Add it to the zip
        zip.file(fileName, blob);
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      saveAs(content, 'engagement_gallery_photos.zip');
      
      toast.success('Download complete!');
    } catch (error) {
      console.error('Error downloading images:', error);
      toast.error('Failed to download images');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 px-3 py-6 sm:p-6 relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-rose-300 opacity-50 hidden md:block">
        <Heart size={40} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-300 opacity-50 hidden md:block">
        <Heart size={30} fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-[10%] text-rose-300 opacity-30 hidden lg:block">
        <Heart size={24} fill="currentColor" />
      </div>
      
      <div className="max-w-6xl mx-auto animate-fadeIn relative z-10 pb-36">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="flex items-center justify-center">
              <Heart size={28} className="text-rose-500 mr-3 animate-pulse" fill="currentColor" />
              <h1 className="text-3xl sm:text-4xl font-serif text-rose-600 text-center font-semibold">Engagement Gallery</h1>
              <Heart size={28} className="text-rose-500 ml-3 animate-pulse" fill="currentColor" />
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-3"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden border border-rose-100">
          <div className="p-4 sm:p-6 flex flex-wrap gap-4 items-center animate-slideUp relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50/40 to-pink-50/40 pointer-events-none"></div>
            
            <div className="flex-1 min-w-[250px] relative z-10">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-rose-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-rose-200 bg-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm"
              />
            </div>
            
            {photos.length > 0 && (
              <button
                onClick={downloadAllPhotos}
                disabled={isDownloadingAll}
                className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 flex items-center gap-2 disabled:opacity-70 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-medium relative z-10"
              >
                {isDownloadingAll ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ArrowDownToLine size={20} />
                )}
                Download All
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart size={16} className="text-rose-400" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-red-500 text-center mx-auto max-w-xl animate-fadeIn border border-rose-100">
            <div className="font-medium">Error loading photos</div>
            <div className="text-sm text-red-400 mt-1">{error}</div>
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg mx-auto max-w-xl text-center animate-fadeIn border border-rose-100">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-rose-300" fill="currentColor" />
              </div>
              <h3 className="text-xl font-medium text-rose-600 mb-2">No moments captured yet</h3>
              <p className="text-gray-500">Be the first to share a special memory!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn h-full flex flex-col border border-rose-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="cursor-pointer relative group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-rose-50/50">
                  <img
                    src={photo.url}
                    alt={`Uploaded by ${photo.uploaderName}`}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">View Moment</span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-rose-50/30 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {photo.uploaderName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">{photo.uploaderName}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPhoto(photo.url, `photo_by_${photo.uploaderName}.jpg`);
                      }}
                      className="text-gray-500 hover:text-rose-500 transition-all duration-300 p-2 rounded-full hover:bg-rose-50"
                      title="Download Photo"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs mt-auto">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatDate(photo.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="relative max-w-6xl w-full h-full flex items-center justify-center animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-5 left-5 text-rose-500/30">
                <Heart size={34} fill="currentColor" />
              </div>
              <div className="absolute bottom-10 right-10 text-rose-500/30">
                <Heart size={24} fill="currentColor" />
              </div>
              
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-white/10 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="max-h-[90vh] max-w-[90vw] relative">
                <img
                  src={selectedPhoto.url}
                  alt={`Uploaded by ${selectedPhoto.uploaderName}`}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{selectedPhoto.uploaderName}</span>
                    <span className="text-white/70">•</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(selectedPhoto.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(selectedPhoto.timestamp)}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(selectedPhoto.url, `photo_by_${selectedPhoto.uploaderName}.jpg`);
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