import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, RefreshCw, Repeat, UserCircle, Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePhotoStore } from '../store';
import { uploadPhoto as apiUploadPhoto, uploadBase64Photo as apiUploadBase64Photo } from '../services/api';
import { ExpirationBanner } from './ExpirationBanner';
import { Footer } from './Footer';

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isUploading, setIsUploading] = useState(false);
  const [isFromCamera, setIsFromCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const addPhoto = usePhotoStore((state) => state.addPhoto);
  const guestName = localStorage.getItem('guestName') || '';

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          // For camera capture, enforce 9:16 portrait ratio
          aspectRatio: 9/16
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      toast.error('Unable to access camera');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };
  
  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
    toast.success(`Switched to ${facingMode === 'user' ? 'back' : 'front'} camera`);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !guestName) return;
    
    // Take the photo
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Show preview and start upload immediately
    setPreviewUrl(imageData);
    setIsFromCamera(true);
    setIsUploading(true);
    
    try {
      // Upload directly
      const uploadedPhoto = await apiUploadBase64Photo(imageData, guestName);
      
      if (uploadedPhoto) {
        addPhoto(uploadedPhoto);
        toast.success(`Photo captured and uploaded!`);
        // Short delay before navigating to my photos
        setTimeout(() => {
          setPreviewUrl(null);
          navigate('/myphotos');
        }, 1500);
      } else {
        toast.error('Failed to upload photo');
      }
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsFromCamera(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedFile) return;

    setIsUploading(true);
    try {
      // Only handle file uploads here, camera uploads are handled directly in capturePhoto
      const uploadedPhoto = await apiUploadPhoto(selectedFile, guestName);
      
      if (uploadedPhoto) {
        addPhoto(uploadedPhoto);
        toast.success(`Thanks ${guestName}! Your photo is added.`);
        setSelectedFile(null);
        setPreviewUrl(null);
        navigate('/myphotos');
      } else {
        toast.error('Failed to upload photo. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during upload.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 px-3 py-6 sm:p-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 mt-2 sm:mt-8 border border-rose-200 animate-fadeIn relative overflow-hidden pb-12 mb-24">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-100/40 to-pink-100/40 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-5">
            <Heart size={22} className="text-rose-500 mr-2 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-serif text-rose-600 text-center font-semibold">Capture Your Moments</h1>
            <Heart size={22} className="text-rose-500 ml-2 animate-pulse" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mb-5"></div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Guest Name</label>
            <div className="flex items-center mt-1 w-full px-3 sm:px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl overflow-hidden text-ellipsis transition-all duration-300 hover:border-rose-300 shadow-sm">
              <UserCircle className="text-rose-400 mr-2 flex-shrink-0" size={18} />
              <span className="truncate">{guestName}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-black shadow-lg transform transition-transform duration-300 hover:shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-[9/16] object-cover"
              />
              <div className="absolute inset-0 border-4 border-white/20 rounded-xl pointer-events-none"></div>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={isUploading}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 rounded-full p-3 sm:p-4 shadow-lg disabled:bg-gray-300 transition-transform duration-200 hover:scale-110 transform active:scale-95 hover:bg-rose-600"
              >
                {isUploading && isFromCamera ? (
                  <div className="h-6 w-6 sm:h-8 sm:w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                )}
              </button>
              <button
                type="button"
                onClick={switchCamera}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white transform hover:scale-110 active:scale-95"
              >
                <Repeat className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
              </button>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-white/70">
                <Heart size={18} fill="currentColor" className="animate-pulse" />
              </div>
              <div className="absolute bottom-16 right-4 text-white/70">
                <Heart size={14} fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {previewUrl && isFromCamera && (
              <div className="relative mt-4 animate-slideUp">
                <div className="w-full flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[400px] object-contain rounded-xl shadow-lg border-4 border-white"
                  />
                </div>
                {isUploading ? (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="p-3 bg-black bg-opacity-50 rounded-lg">
                      <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative animate-fadeIn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-rose-300 rounded-xl cursor-pointer hover:border-rose-500 transition-all duration-300 hover:bg-rose-50 group"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-rose-400 group-hover:text-rose-500 mb-2 transition-all duration-300 transform group-hover:scale-110" />
                    <span className="text-sm text-gray-600">Upload from gallery</span>
                    <p className="text-xs text-rose-400 mt-1">Any ratio accepted</p>
                  </div>
                </label>
              </div>

              {previewUrl && !isFromCamera && (
                <div className="animate-slideUp">
                  <div className="relative mt-4">
                    <div className="w-full flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[400px] object-contain rounded-xl shadow-lg border-4 border-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-rose-100 transform hover:scale-110 active:scale-95"
                    >
                      <RefreshCw className="h-5 w-5 text-rose-500" />
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-70 disabled:from-gray-400 disabled:to-gray-400 transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-medium flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Heart size={18} className="text-white" />
                        Share Your Moment
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
      <ExpirationBanner />
    </div>
  );
}