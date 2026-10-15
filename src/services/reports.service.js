import apiClient, { isMockMode } from './apiClient';

export const reportsService = {
  async submitReport(accommodationId, reportData) {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newReport = {
        id: `rep-${Date.now()}`,
        accommodationId,
        reason: reportData.reason,
        details: reportData.details,
        status: 'under_investigation',
        caseReference: `SEC-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toISOString(),
      };

      const saved = JSON.parse(localStorage.getItem('campusnest_reports') || '[]');
      saved.push(newReport);
      localStorage.setItem('campusnest_reports', JSON.stringify(saved));

      return newReport;
    }

    const { data } = await apiClient.post(`/accommodations/${accommodationId}/reports`, reportData);
    return data;
  },
};
