import axios from 'axios';

// Membuat instance axios dengan URL base API
const axiosInstance = axios.create({
  baseURL: 'https://ameera-org.my.id',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token pada header request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Specific function for registration with valid headers (without HTTP/2 pseudo-headers)
// Define interfaces for user data and registration response
interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface RegistrationResponse {
  [key: string]: any; // This can be refined based on actual API response
}

// Venue interfaces
export interface Venue {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  email?: string;
  capacity?: number;
  price_range?: string;
  dress_code?: string;
  cover_charge?: string;
  parking?: string;
  hours?: VenueHour[];
  amenities?: Amenity[];
  tags?: Tag[];
  genres?: Genre[];
  ambiances?: Ambiance[];
  crowd_types?: CrowdType[];
  rating?: number;
  category?: string;
  venue_type?: string;
  created_by?: string;
}

// Hours interface
export interface VenueHour {
  id?: number;
  venue_id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
}

// Ambiance interface
export interface Ambiance {
  id: number;
  name: string;
  description?: string;
}

// Crowd Type interface
export interface CrowdType {
  id: number;
  name: string;
  description?: string;
}

// Search params interface
export interface VenueSearchParams {
  query?: string;
  tags?: number[];
  ambiances?: number[];
  crowd_types?: number[];
  amenities?: number[];
  lat?: number;
  lng?: number;
  radius?: number;
}

// Amenity interfaces
export interface Amenity {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  [key: string]: any; // For additional properties
}

// Tag interfaces
export interface Tag {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  slug?: string;
  [key: string]: any; // For additional properties
}

// Genre interfaces
export interface Genre {
  id: number;
  name: string;
  description?: string;
  [key: string]: any; // For additional properties
}

// Article interfaces
export interface Article {
  id: number;
  title: string;
  url?: string;
  content: string;
  status: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  published_at?: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  deleted_at?: string;
  author?: string; // For compatibility with existing components
  location?: string; // For compatibility with existing components
}

export interface CreateArticleData {
  title: string;
  content: string;
  status: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateArticleData {
  id: number;
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImage?: File | null;
}

// Article API functions
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axiosInstance.get('/api/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchArticleById = async (id: number | string): Promise<Article> => {
  try {
    const response = await axiosInstance.get(`/api/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};

export const createArticle = async (articleData: CreateArticleData): Promise<Article> => {
  try {
    // Create article without image
    const response = await axiosInstance.post('/api/articles', articleData);
    
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (articleData: UpdateArticleData): Promise<Article> => {
  try {
    // Handle file upload separately if coverImage is included
    let uploadedImageUrl: string | undefined;
    
    if (articleData.coverImage) {
      const formData = new FormData();
      formData.append('file', articleData.coverImage);
      
      const uploadResponse = await axiosInstance.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      uploadedImageUrl = uploadResponse.data.url;
    }
    
    // Prepare data for update by removing the File object
    const { coverImage, ...restData } = articleData;
    
    // Update article with image URL if available
    const response = await axiosInstance.put(`/api/articles/${articleData.id}`, {
      ...restData,
      ...(uploadedImageUrl && { coverImageUrl: uploadedImageUrl }),
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating article ${articleData.id}:`, error);
    throw error;
  }
};

export const deleteArticle = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/articles/${id}`);
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (userData: UserRegistrationData): Promise<RegistrationResponse> => {
  // Get CSRF token from cookies if available
  const getCsrfToken = (): string => {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] || '' : '';
  };

  const csrfToken: string = getCsrfToken();

  return await axios<RegistrationResponse>({
    method: 'POST',
    url: 'https://ameera-org.my.id/api/register',
    // headers: {
    //   'accept': 'application/json',
    //   'accept-encoding': 'gzip, deflate, br, zstd',
    //   'accept-language': 'en-US,en;q=0.9',
    //   'content-type': 'application/json',
    //   'origin': 'https://ameera-org.my.id',
    //   'referer': 'https://ameera-org.my.id/swagger/',
    //   'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    //   'sec-ch-ua-mobile': '?0',
    //   'sec-ch-ua-platform': '"Windows"',
    //   'sec-fetch-dest': 'empty',
    //   'sec-fetch-mode': 'cors',
    //   'sec-fetch-site': 'same-origin',
    //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    //   'x-csrftoken': csrfToken || 'vHzKk8vmXVQ2rShkN5YkLHIww4CNzdrEQujGxuaHsKXwaLxb7TFHv3TjVks1UqDR'
    // },
    data: userData,
  });
};

// Venues API functions
export const fetchVenues = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/venues');
    console.log('Raw venues response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const fetchVenueById = async (id: string): Promise<Venue> => {
  try {
    const response = await axiosInstance.get(`/api/venues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    throw error;
  }
};

// Create a new venue
export const createVenue = async (venueData: Venue): Promise<Venue> => {
  try {
    const response = await axiosInstance.post('/api/venues', venueData);
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// Update an existing venue
export const updateVenue = async (id: string, venueData: Venue): Promise<Venue> => {
  try {
    const response = await axiosInstance.put(`/api/venues/${id}`, venueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating venue ${id}:`, error);
    throw error;
  }
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/venues/${id}`);
  } catch (error) {
    console.error(`Error deleting venue ${id}:`, error);
    throw error;
  }
};

// Search venues with filters
export const searchVenues = async (params: VenueSearchParams): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/venues/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching venues:', error);
    throw error;
  }
};

// Amenities API functions
export const fetchAmenities = async (page = 1, perPage = 10): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/amenities', { 
      params: { page, per_page: perPage } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw error;
  }
};

export const fetchAmenityById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/amenities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching amenity ${id}:`, error);
    throw error;
  }
};

export const createAmenity = async (amenityData: { name: string, description: string, icon?: string }): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/amenities', amenityData);
    return response.data;
  } catch (error) {
    console.error('Error creating amenity:', error);
    throw error;
  }
};

export const updateAmenity = async (id: string, amenityData: { name: string, description: string, icon?: string }): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/api/amenities/${id}`, amenityData);
    return response.data;
  } catch (error) {
    console.error(`Error updating amenity ${id}:`, error);
    throw error;
  }
};

export const deleteAmenity = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/amenities/${id}`);
  } catch (error) {
    console.error(`Error deleting amenity ${id}:`, error);
    throw error;
  }
};

// Tags API functions
export const fetchTags = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/tags');
    console.log('Raw tags response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const fetchTagById = async (id: string): Promise<Tag> => {
  try {
    const response = await axiosInstance.get(`/api/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tag ${id}:`, error);
    throw error;
  }
};

export const createTag = async (tagData: { name: string, description: string }): Promise<Tag> => {
  try {
    const response = await axiosInstance.post('/api/tags', tagData);
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

export const updateTag = async (id: string, tagData: { name: string, description: string }): Promise<Tag> => {
  try {
    const response = await axiosInstance.put(`/api/tags/${id}`, tagData);
    return response.data;
  } catch (error) {
    console.error(`Error updating tag ${id}:`, error);
    throw error;
  }
};

export const deleteTag = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/tags/${id}`);
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    throw error;
  }
};

export const createTagsBatch = async (tags: { name: string, description: string }[]): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/tags/batch', { items: tags });
    return response.data;
  } catch (error) {
    console.error('Error creating tags batch:', error);
    throw error;
  }
};

export const deleteTagsBatch = async (tagIds: string[]): Promise<void> => {
  try {
    await axiosInstance.delete('/api/tags/batch', { data: { items: tagIds } });
  } catch (error) {
    console.error('Error deleting tags batch:', error);
    throw error;
  }
};

// Genres API functions
export const fetchGenres = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/genres');
    console.log('Raw genres response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export default axiosInstance;
