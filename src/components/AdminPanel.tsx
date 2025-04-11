import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Download, Check, X, Edit, Save, Calendar, ArrowDownToLine, Heart, LogIn, LogOut, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore, usePhotoStore } from '../store';
import { getAdminPhotos } from '../services/api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ExpirationBanner } from './ExpirationBanner';
import { Footer } from './Footer';
import { formatDate, formatTime } from '../utils/dateUtils';

export function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const { isAdmin, login, logout } = useAuthStore();
  const { photos, deletePhoto } = usePhotoStore();
  const [adminPhotos, setAdminPhotos] = useState(photos);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminPhotos();
  }, []);

  const fetchAdminPhotos = async () => {
    setIsLoading(true);
    try {
      const photos = await getAdminPhotos();
      setAdminPhotos(photos);
      if (photos.length > 0) {
        useAuthStore.getState().login('admin@123');
      }
    } catch (error) {
      console.error('Error fetching admin photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(password);
      
      if (success) {
        toast.success('Logged in successfully');
        setPassword('');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deletePhoto(id);
      
      if (success) {
        toast.success('Photo deleted successfully');
        setAdminPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
        setSelectedPhotos(prev => prev.filter(photoId => photoId !== id));
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      toast.error('Error deleting photo');
    } finally {
      setIsDeleting(null);
    }
  };

  const viewFullScreen = (photo: any) => {
    setSelectedPhoto(photo);
  };

  const closeFullScreen = () => {
    setSelectedPhoto(null);
  };

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

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotos(prev => 
      prev.includes(id) 
        ? prev.filter(photoId => photoId !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedPhotos([]);
    }
  };

  const selectAll = () => {
    if (selectedPhotos.length === adminPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(adminPhotos.map(photo => photo.id));
    }
  };

  const deleteSelected = async () => {
    if (selectedPhotos.length === 0) return;
    
    const confirmed = window.confirm(`Delete ${selectedPhotos.length} selected photos?`);
    if (!confirmed) return;
    
    try {
      let failCount = 0;
      
      // Create a copy to avoid issues when deleting
      const toDelete = [...selectedPhotos];
      
      for (const id of toDelete) {
        setIsDeleting(id);
        const success = await deletePhoto(id);
        
        if (success) {
          setAdminPhotos(prev => prev.filter(photo => photo.id !== id));
          setSelectedPhotos(prev => prev.filter(photoId => photoId !== id));
        } else {
          failCount++;
        }
        
        setIsDeleting(null);
      }
      
      if (failCount === 0) {
        toast.success(`Deleted ${toDelete.length} photos successfully`);
      } else {
        toast.error(`Failed to delete ${failCount} photos`);
      }
      
    } catch (error) {
      toast.error('Error during batch delete');
    }
  };

  const downloadAll = async () => {
    if (adminPhotos.length === 0) return;
    
    try {
      setIsDownloadingAll(true);
      const zip = new JSZip();
      const photosToDownload = selectedPhotos.length > 0 
        ? adminPhotos.filter(photo => selectedPhotos.includes(photo.id))
        : adminPhotos;
        
      toast.success(`Preparing ${photosToDownload.length} photos for download...`);
      
      // Add each photo to the zip file
      for (let i = 0; i < photosToDownload.length; i++) {
        const photo = photosToDownload[i];
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

  // Always render the admin panel content, regardless of auth status
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 p-4 relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-rose-300 opacity-20 hidden md:block">
        <Heart size={30} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-300 opacity-20 hidden md:block">
        <Heart size={20} fill="currentColor" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 pb-36">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Heart size={24} className="text-rose-500 mr-3" fill="currentColor" />
            <h1 className="text-3xl font-serif text-rose-600 font-semibold">Admin Panel</h1>
          </div>
          <button
            onClick={logout}
            className="bg-white text-rose-600 py-2 px-4 rounded-xl hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm flex items-center gap-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap gap-3 items-center border border-gray-100">
          <button
            onClick={toggleSelectMode}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              selectMode 
                ? 'bg-gray-100 text-gray-800 shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Check size={18} className={selectMode ? 'text-rose-500' : 'text-gray-400'} />
            {selectMode ? 'Exit Select Mode' : 'Select Photos'}
          </button>

          {selectMode && (
            <>
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
              >
                <Check size={18} />
                {selectedPhotos.length === adminPhotos.length 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
              
              <button
                onClick={deleteSelected}
                disabled={selectedPhotos.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:bg-red-300 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedPhotos.length})
              </button>
              
              <button
                onClick={downloadAll}
                disabled={isDownloadingAll || selectedPhotos.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-70 flex items-center gap-2"
              >
                {isDownloadingAll ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowDownToLine size={18} />
                )}
                Download Selected
              </button>
            </>
          )}
          
          {!selectMode && adminPhotos.length > 0 && (
            <button
              onClick={downloadAll}
              disabled={isDownloadingAll}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-70 flex items-center gap-2 ml-auto"
            >
              {isDownloadingAll ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowDownToLine size={18} />
              )}
              Download All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            </div>
          </div>
        ) : adminPhotos.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg mx-auto max-w-xl text-center animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Calendar size={32} className="text-rose-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No photos yet</h3>
              <p className="text-gray-500">The gallery is empty at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {adminPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn ${
                  selectedPhotos.includes(photo.id) ? 'ring-2 ring-rose-500' : ''
                }`}
              >
                <div className="relative">
                  {/* Image wrapper with aspect ratio container */}
                  <div 
                    className="cursor-pointer relative group w-full"
                    onClick={() => selectMode ? toggleSelectPhoto(photo.id) : viewFullScreen(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={`Uploaded by ${photo.uploaderName}`}
                      className="w-full object-contain max-h-[300px]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">
                        {selectMode ? 'Select' : 'View Full'}
                      </span>
                    </div>
                    
                    {selectMode && selectedPhotos.includes(photo.id) && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo metadata and actions */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {photo.uploaderName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
                        {photo.uploaderName}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(photo.url, `photo_by_${photo.uploaderName}.jpg`);
                        }}
                        className="text-gray-500 hover:text-rose-500 transition-all duration-300 p-1 rounded-full hover:bg-rose-50"
                        title="Download Photo"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        disabled={isDeleting === photo.id}
                        className="text-gray-500 hover:text-red-500 transition-all duration-300 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                        title="Delete Photo"
                      >
                        {isDeleting === photo.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Date stamp */}
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatDate(photo.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(photo.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
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
              <button
                onClick={closeFullScreen}
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
                    onClick={() => downloadPhoto(selectedPhoto.url, `photo_by_${selectedPhoto.uploaderName}.jpg`)}
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
