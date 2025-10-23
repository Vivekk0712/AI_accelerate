import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  withCredentials: true,
});

// Add interceptor to include Firebase token from localStorage as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const sessionLogin = (idToken: string) => {
  return api.post('/api/sessionLogin', { idToken });
};

export const sessionLogout = () => {
  return api.post('/api/sessionLogout');
};

export const getMe = () => {
  return api.get('/api/me');
};

export const getHistory = () => {
  return api.get('/api/history');
};

export const sendMessage = (message: string, metadata?: Record<string, unknown>) => {
  return api.post('/api/chat', { message, metadata });
};

export const sendMessageWithImage = async (message: string, imageFile: File) => {
  // Convert image to base64
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  return api.post('/api/chat', {
    message,
    image_base64: base64Image,
    image_mime_type: imageFile.type
  });
};

export const clearChat = () => {
  return api.delete('/api/clear-chat');
};

// Profile management
export const updateProfile = async (profileData: {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
}) => {
  const response = await api.put('/api/profile', profileData);
  return response.data;
};

// File management functions
export const uploadPdf = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/upload-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserFiles = () => {
  return api.get('/api/files');
};

export const deleteFile = (fileId: string) => {
  return api.delete(`/api/files/${fileId}`);
};

export const searchFiles = (query: string) => {
  return api.post('/api/search-files', { query });
};

export default api;
