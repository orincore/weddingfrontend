import { create } from 'zustand';
import { AuthState, PhotoStore, Photo } from './types';
import { 
  adminLogin as apiLogin, 
  adminLogout as apiLogout, 
  deletePhoto as apiDeletePhoto, 
  getPhotos as apiGetPhotos,
  getUserPhotos as apiGetUserPhotos 
} from './services/api';

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  login: async (password: string) => {
    const success = await apiLogin(password);
    if (success) {
      set({ isAdmin: true });
    }
    return success;
  },
  logout: async () => {
    await apiLogout();
    set({ isAdmin: false });
  },
}));

export const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  userPhotos: [],
  loading: false,
  userPhotosLoading: false,
  error: null,
  userPhotosError: null,
  fetchPhotos: async (nameFilter?: string) => {
    set({ loading: true, error: null });
    try {
      const photos = await apiGetPhotos(nameFilter);
      set({ photos, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        loading: false 
      });
    }
  },
  fetchUserPhotos: async (uploaderName: string) => {
    set({ userPhotosLoading: true, userPhotosError: null });
    try {
      const userPhotos = await apiGetUserPhotos(uploaderName);
      set({ userPhotos, userPhotosLoading: false });
    } catch (error) {
      set({ 
        userPhotosError: error instanceof Error ? error.message : 'An error occurred', 
        userPhotosLoading: false 
      });
    }
  },
  addPhoto: (photo) =>
    set((state) => ({ 
      photos: [...state.photos, photo],
      userPhotos: [...state.userPhotos, photo]
    })),
  deletePhoto: async (id) => {
    const success = await apiDeletePhoto(id);
    if (success) {
      set((state) => ({
        photos: state.photos.filter((photo) => photo.id !== id),
        userPhotos: state.userPhotos.filter((photo) => photo.id !== id)
      }));
    }
    return success;
  },
}));