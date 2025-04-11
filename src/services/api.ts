import { Photo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://weddingbackend-1fp6.onrender.com/api';

// Gallery service - get all photos
export const getPhotos = async (nameFilter?: string): Promise<Photo[]> => {
  try {
    const query = nameFilter ? `?name=${encodeURIComponent(nameFilter)}` : '';
    const response = await fetch(`${API_URL}/gallery${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`Failed to fetch photos: ${response.status}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => ({
      id: photo._id,
      url: photo.url,
      uploaderName: photo.uploaderName,
      timestamp: new Date(photo.timestamp).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

// Get photos by specific uploader name
export const getUserPhotos = async (uploaderName: string): Promise<Photo[]> => {
  try {
    const response = await fetch(`${API_URL}/gallery/user/${encodeURIComponent(uploaderName)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`Failed to fetch user photos: ${response.status}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => ({
      id: photo._id,
      url: photo.url,
      uploaderName: photo.uploaderName,
      timestamp: new Date(photo.timestamp).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching user photos:', error);
    return [];
  }
};

// Upload service - upload a photo
export const uploadPhoto = async (
  photo: File,
  uploaderName: string
): Promise<Photo | null> => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('uploaderName', uploaderName);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`Failed to upload photo: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.photo._id,
      url: data.photo.url,
      uploaderName: data.photo.uploaderName,
      timestamp: new Date(data.photo.timestamp).getTime(),
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

// Upload service - upload a base64 photo
export const uploadBase64Photo = async (
  imageData: string,
  uploaderName: string
): Promise<Photo | null> => {
  try {
    const response = await fetch(`${API_URL}/upload/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ 
        imageData, 
        uploaderName 
      }),
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`Failed to upload photo: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.photo._id,
      url: data.photo.url,
      uploaderName: data.photo.uploaderName,
      timestamp: new Date(data.photo.timestamp).getTime(),
    };
  } catch (error) {
    console.error('Error uploading base64 photo:', error);
    return null;
  }
};

// Admin service - login
export const adminLogin = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ password }),
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server login response:', response.status, errorText);
      // Clear password from storage on failed login
      localStorage.removeItem('adminPassword');
    } else {
      // Store password in localStorage for query param auth fallback
      localStorage.setItem('adminPassword', password);
    }

    return response.ok;
  } catch (error) {
    console.error('Error logging in:', error);
    // Clear password from storage on error
    localStorage.removeItem('adminPassword');
    return false;
  }
};

// Admin service - logout
export const adminLogout = async (): Promise<boolean> => {
  try {
    // Clear the password from localStorage on logout
    localStorage.removeItem('adminPassword');
    
    const response = await fetch(`${API_URL}/admin/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server logout response:', response.status, errorText);
    }

    return response.ok;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// Admin service - get all uploads
export const getAdminPhotos = async (): Promise<Photo[]> => {
  try {
    // Get admin password from localStorage if it exists
    const adminPassword = localStorage.getItem('adminPassword');
    
    // Append adminKey to URL if available
    const queryParam = adminPassword ? `?adminKey=${encodeURIComponent(adminPassword)}` : '';
    
    const response = await fetch(`${API_URL}/admin/uploads${queryParam}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server admin photos response:', response.status, errorText);
      throw new Error(`Failed to fetch photos: ${response.status}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => ({
      id: photo._id,
      url: photo.url,
      uploaderName: photo.uploaderName,
      timestamp: new Date(photo.timestamp).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching admin photos:', error);
    return [];
  }
};

// Admin service - delete photo
export const deletePhoto = async (id: string): Promise<boolean> => {
  try {
    // Get admin password from localStorage if it exists
    const adminPassword = localStorage.getItem('adminPassword');
    
    // Append adminKey to URL if available
    const queryParam = adminPassword ? `?adminKey=${encodeURIComponent(adminPassword)}` : '';
    
    const response = await fetch(`${API_URL}/admin/delete/${id}${queryParam}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server delete response:', response.status, errorText);
    }

    return response.ok;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
}; 
