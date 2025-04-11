export interface Photo {
  id: string;
  url: string;
  uploaderName: string;
  timestamp: number;
}

export interface AuthState {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export interface PhotoStore {
  photos: Photo[];
  userPhotos: Photo[];
  loading: boolean;
  userPhotosLoading: boolean;
  error: string | null;
  userPhotosError: string | null;
  fetchPhotos: (nameFilter?: string) => Promise<void>;
  fetchUserPhotos: (uploaderName: string) => Promise<void>;
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => Promise<boolean>;
}