import apiClient, { isMockMode } from './apiClient';
import { MOCK_ACCOMMODATIONS } from '../mocks/mockData';

export const accommodationsService = {
  async getAccommodations(params = {}) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 350)); // simulate realistic API response

      let filtered = [...MOCK_ACCOMMODATIONS];

      // Filter by university
      if (params.university && params.university !== 'all') {
        filtered = filtered.filter(
          (item) => item.universityId.toLowerCase() === params.university.toLowerCase()
        );
      }

      // Filter by area
      if (params.area && params.area !== 'all') {
        const areaLower = params.area.toLowerCase();
        filtered = filtered.filter((item) =>
          item.area.toLowerCase().includes(areaLower)
        );
      }

      // Filter by price range
      if (params.minPrice) {
        filtered = filtered.filter((item) => item.price >= Number(params.minPrice));
      }
      if (params.maxPrice && params.maxPrice !== 'any') {
        filtered = filtered.filter((item) => item.price <= Number(params.maxPrice));
      }

      // Filter by room type
      if (params.type && params.type !== 'all') {
        filtered = filtered.filter((item) => {
          if (params.type === 'single') return item.roomType === 'single';
          if (params.type === 'shared') return item.roomType === 'shared';
          if (params.type === 'bedsitter' || params.type === 'self-contained') {
            return item.roomType === 'bedsitter' || item.roomType === 'single';
          }
          return item.roomType === params.type;
        });
      }

      // Filter by facilities (e.g., borehole_water, solar_backup)
      if (params.facilities) {
        const requiredFacilities = Array.isArray(params.facilities)
          ? params.facilities
          : params.facilities.split(',').map((f) => f.trim());

        filtered = filtered.filter((item) => {
          const itemFacilityIds = item.facilities.map((f) => f.id);
          return requiredFacilities.every((rf) => itemFacilityIds.includes(rf));
        });
      }

      // Sorting
      if (params.sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'distance') {
        // Mock distance sort
        filtered.sort((a, b) => a.distanceToGate.localeCompare(b.distanceToGate));
      } else {
        // Default newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Pagination
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 6;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const items = filtered.slice(start, start + limit);

      return {
        data: items,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    }

    const { data } = await apiClient.get('/accommodations', { params });
    return data;
  },

  async getAccommodationById(id) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const found = MOCK_ACCOMMODATIONS.find((item) => item.id === id);
      if (!found) {
        const error = new Error('Accommodation listing not found');
        error.response = { status: 404, data: { message: 'Listing not found' } };
        throw error;
      }
      return found;
    }

    const { data } = await apiClient.get(`/accommodations/${id}`);
    return data;
  },
};
