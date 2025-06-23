// src/services/api/agrovetService.ts
import { API_CONFIG } from "../../constants/api";
import { AgrovetInfo } from "../../types/soil";
import { apiClient } from "./client";

interface AgrovetSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
  fertilizer_type?: string;
  category?: string;
  rating_min?: number;
  open_now?: boolean;
  sort_by?: "distance" | "rating" | "name";
  limit?: number;
}

interface AgrovetFilters {
  categories?: string[];
  price_range?: "low" | "medium" | "high";
  has_delivery?: boolean;
  has_online_payment?: boolean;
  operating_hours?: {
    day: string;
    from: string;
    to: string;
  }[];
}

interface PaginatedAgrovets {
  data: AgrovetInfo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AgrovetReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  verified_purchase?: boolean;
}

export interface AgrovetCreateData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  categories: string[];
  operating_hours?: {
    [key: string]: {
      open: string;
      close: string;
      is_open: boolean;
    };
  };
  services?: string[];
  description?: string;
}

class AgrovetService {
  /**
   * Find nearby agrovets with enhanced filtering
   */
  async findNearbyAgrovets(
    params: AgrovetSearchParams,
    filters?: AgrovetFilters
  ): Promise<AgrovetInfo[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
        radius: (params.radius || 10).toString(),
        limit: (params.limit || 20).toString(),
      });

      // Add optional parameters
      if (params.fertilizer_type) {
        queryParams.append("fertilizer_type", params.fertilizer_type);
      }
      if (params.category) {
        queryParams.append("category", params.category);
      }
      if (params.rating_min) {
        queryParams.append("rating_min", params.rating_min.toString());
      }
      if (params.open_now) {
        queryParams.append("open_now", params.open_now.toString());
      }
      if (params.sort_by) {
        queryParams.append("sort_by", params.sort_by);
      }

      // Add filters
      if (filters) {
        if (filters.categories) {
          queryParams.append("categories", filters.categories.join(","));
        }
        if (filters.price_range) {
          queryParams.append("price_range", filters.price_range);
        }
        if (filters.has_delivery !== undefined) {
          queryParams.append("has_delivery", filters.has_delivery.toString());
        }
        if (filters.has_online_payment !== undefined) {
          queryParams.append(
            "has_online_payment",
            filters.has_online_payment.toString()
          );
        }
      }

      const response = await apiClient.get<AgrovetInfo[]>(
        `${API_CONFIG.endpoints.agrovets}?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error finding agrovets:", error);
      throw error;
    }
  }

  /**
   * Get agrovet details by ID
   */
  async getAgrovetDetails(id: string): Promise<AgrovetInfo | null> {
    try {
      const response = await apiClient.get<AgrovetInfo>(
        `${API_CONFIG.endpoints.agrovets}/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching agrovet details:", error);
      throw error;
    }
  }

  /**
   * Get paginated list of agrovets
   */
  async getAgrovetsList(
    page: number = 1,
    limit: number = 10,
    filters?: AgrovetFilters
  ): Promise<PaginatedAgrovets> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters
      if (filters) {
        if (filters.categories) {
          queryParams.append("categories", filters.categories.join(","));
        }
        if (filters.price_range) {
          queryParams.append("price_range", filters.price_range);
        }
        if (filters.has_delivery !== undefined) {
          queryParams.append("has_delivery", filters.has_delivery.toString());
        }
        if (filters.has_online_payment !== undefined) {
          queryParams.append(
            "has_online_payment",
            filters.has_online_payment.toString()
          );
        }
      }

      const response = await apiClient.get<PaginatedAgrovets>(
        `${API_CONFIG.endpoints.agrovets}/list?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error("Error fetching agrovets list:", error);
      throw error;
    }
  }

  /**
   * Search agrovets by name or product
   */
  async searchAgrovets(
    query: string,
    location?: { latitude: number; longitude: number; radius?: number }
  ): Promise<AgrovetInfo[]> {
    try {
      const queryParams = new URLSearchParams({
        q: query,
      });

      if (location) {
        queryParams.append("latitude", location.latitude.toString());
        queryParams.append("longitude", location.longitude.toString());
        queryParams.append("radius", (location.radius || 50).toString());
      }

      const response = await apiClient.get<AgrovetInfo[]>(
        `${API_CONFIG.endpoints.agrovets}/search?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error searching agrovets:", error);
      throw error;
    }
  }

  /**
   * Get agrovet reviews
   */
  async getAgrovetReviews(
    agrovetId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: AgrovetReview[];
    total: number;
    average_rating: number;
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiClient.get<{
        reviews: AgrovetReview[];
        total: number;
        average_rating: number;
      }>(
        `${
          API_CONFIG.endpoints.agrovets
        }/${agrovetId}/reviews?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return {
        reviews: [],
        total: 0,
        average_rating: 0,
      };
    } catch (error) {
      console.error("Error fetching agrovet reviews:", error);
      throw error;
    }
  }

  /**
   * Add a review for an agrovet
   */
  async addReview(
    agrovetId: string,
    review: {
      rating: number;
      comment: string;
    }
  ): Promise<AgrovetReview> {
    try {
      const response = await apiClient.post<AgrovetReview>(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/reviews`,
        review
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to add review");
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  }

  /**
   * Update a review
   */
  async updateReview(
    agrovetId: string,
    reviewId: string,
    review: {
      rating?: number;
      comment?: string;
    }
  ): Promise<AgrovetReview> {
    try {
      const response = await apiClient.put<AgrovetReview>(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/reviews/${reviewId}`,
        review
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to update review");
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(agrovetId: string, reviewId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/reviews/${reviewId}`
      );

      return response.success;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  /**
   * Get agrovet products/inventory
   */
  async getAgrovetProducts(
    agrovetId: string,
    category?: string,
    search?: string
  ): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();

      if (category) {
        queryParams.append("category", category);
      }
      if (search) {
        queryParams.append("search", search);
      }

      const response = await apiClient.get<any[]>(
        `${
          API_CONFIG.endpoints.agrovets
        }/${agrovetId}/products?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching agrovet products:", error);
      throw error;
    }
  }

  /**
   * Check product availability
   */
  async checkProductAvailability(
    agrovetId: string,
    productId: string
  ): Promise<{ available: boolean; quantity?: number; price?: number }> {
    try {
      const response = await apiClient.get<{
        available: boolean;
        quantity?: number;
        price?: number;
      }>(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/products/${productId}/availability`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return { available: false };
    } catch (error) {
      console.error("Error checking product availability:", error);
      throw error;
    }
  }

  /**
   * Create new agrovet (for admin/business users)
   */
  async createAgrovet(agrovetData: AgrovetCreateData): Promise<AgrovetInfo> {
    try {
      const response = await apiClient.post<AgrovetInfo>(
        API_CONFIG.endpoints.agrovets,
        agrovetData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to create agrovet");
    } catch (error) {
      console.error("Error creating agrovet:", error);
      throw error;
    }
  }

  /**
   * Update agrovet information
   */
  async updateAgrovet(
    agrovetId: string,
    agrovetData: Partial<AgrovetCreateData>
  ): Promise<AgrovetInfo> {
    try {
      const response = await apiClient.put<AgrovetInfo>(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}`,
        agrovetData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to update agrovet");
    } catch (error) {
      console.error("Error updating agrovet:", error);
      throw error;
    }
  }

  /**
   * Delete agrovet
   */
  async deleteAgrovet(agrovetId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}`
      );

      return response.success;
    } catch (error) {
      console.error("Error deleting agrovet:", error);
      throw error;
    }
  }

  /**
   * Get agrovet categories
   */
  async getAgrovetCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        `${API_CONFIG.endpoints.agrovets}/categories`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching agrovet categories:", error);
      throw error;
    }
  }

  /**
   * Mark agrovet as favorite
   */
  async addToFavorites(agrovetId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/favorite`
      );

      return response.success;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }

  /**
   * Remove agrovet from favorites
   */
  async removeFromFavorites(agrovetId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(
        `${API_CONFIG.endpoints.agrovets}/${agrovetId}/favorite`
      );

      return response.success;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  }

  /**
   * Get user's favorite agrovets
   */
  async getFavoriteAgrovets(): Promise<AgrovetInfo[]> {
    try {
      const response = await apiClient.get<AgrovetInfo[]>(
        `${API_CONFIG.endpoints.agrovets}/favorites`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching favorite agrovets:", error);
      throw error;
    }
  }
}

export const agrovetService = new AgrovetService();
