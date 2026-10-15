import apiClient, { isMockMode } from './apiClient';
import { MOCK_VIEWINGS, MOCK_ACCOMMODATIONS } from '../mocks/mockData';

export const viewingsService = {
  async requestViewing(accommodationId, viewingData) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const accommodation = MOCK_ACCOMMODATIONS.find((a) => a.id === accommodationId);
      
      const newViewing = {
        id: `view-${Date.now()}`,
        accommodationId,
        accommodationTitle: accommodation?.title || 'Student Accommodation',
        accommodationArea: accommodation?.area || 'University Vicinity',
        universityName: accommodation?.universityName || 'Campus',
        price: accommodation?.price || 50000,
        landlordName: accommodation?.landlord?.name || 'Property Host',
        landlordPhone: accommodation?.landlord?.phone || '+265 991 600 735',
        landlordWhatsapp: accommodation?.landlord?.whatsapp || '265991600735',
        preferredDate: viewingData.preferredDate,
        preferredTimeSlot: viewingData.preferredTimeSlot,
        contactPhone: viewingData.contactPhone,
        studentNotes: viewingData.studentNotes || '',
        status: 'pending',
        statusNote: 'Request received. Host will verify and confirm physical walkthrough slot.',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for user session persistence
      const saved = JSON.parse(localStorage.getItem('campusnest_viewings') || '[]');
      saved.unshift(newViewing);
      localStorage.setItem('campusnest_viewings', JSON.stringify(saved));

      return newViewing;
    }

    const { data } = await apiClient.post(`/accommodations/${accommodationId}/viewings`, viewingData);
    return data;
  },

  async getViewings() {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const local = JSON.parse(localStorage.getItem('campusnest_viewings') || 'null');
      if (local && local.length > 0) {
        return local;
      }
      return MOCK_VIEWINGS;
    }

    const { data } = await apiClient.get('/student/viewings');
    return data;
  },

  async cancelViewing(viewingId) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const local = JSON.parse(localStorage.getItem('campusnest_viewings') || 'null') || [...MOCK_VIEWINGS];
      const updated = local.map((v) =>
        v.id === viewingId ? { ...v, status: 'cancelled', statusNote: 'Cancelled by student' } : v
      );
      localStorage.setItem('campusnest_viewings', JSON.stringify(updated));
      return { success: true };
    }

    const { data } = await apiClient.post(`/viewings/${viewingId}/cancel`);
    return data;
  },
};
