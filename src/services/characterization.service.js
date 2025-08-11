import api from './api.js';

export const CharacterizationService = {
  async checkHealth() {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ Health check falló:', error);
      return false;
    }
  },
  async uploadFile(file, period, userId) {
    console.log(`📤 Iniciando upload de archivo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('period', period);
    formData.append('userId', userId.toString());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Upload timeout alcanzado (60s), cancelando petición');
      controller.abort();
    }, 60000);
    try {
      const response = await api.post(`/characterization/upload/${period}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        timeout: 60000,
      });
      clearTimeout(timeoutId);
      console.log('✅ Upload completado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('❌ Upload cancelado por timeout');
        throw new Error('El archivo tardó demasiado en subirse. Verifique su conexión e inténtelo de nuevo.');
      }
      if (error.code === 'ECONNABORTED') {
        console.error('❌ Timeout en la conexión');
        throw new Error('La conexión tardó demasiado. Inténtelo de nuevo.');
      }
      console.error('❌ Error en upload de archivo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al subir archivo';
      throw new Error(errorMessage);
    }
  },
  async getAllFiles() {
    const response = await api.get('/characterization');
    console.log('📊 Response from backend:', response.data);
    if (!Array.isArray(response.data)) {
      console.error('❌ Backend response is not an array:', response.data);
      throw new Error('La respuesta del servidor no tiene el formato correcto');
    }
    return response.data;
  },
  async getFileById(id) { const r = await api.get(`/characterization/${id}`); return r.data; },
  async getFileRecords(id, page = 1, limit = 1000) { const r = await api.get(`/characterization/${id}/records?page=${page}&limit=${limit}`); return r.data; },
  async addObservation(fileId, message, userId) { const r = await api.post(`/characterization/${fileId}/observations`, { fileId, message, userId }); return r.data; },
  async markObservationsResolved(fileId) { const r = await api.patch(`/characterization/${fileId}/mark-resolved`); return r.data; },
  async clearObservations(fileId) { const r = await api.delete(`/characterization/${fileId}/observations`); return r.data; },
  async verifyFile(fileId) { const r = await api.patch(`/characterization/${fileId}/verify`); return r.data; },
  async deleteFile(fileId) { const r = await api.delete(`/characterization/${fileId}`); return r.data; },
  async createUsersFromFile(fileId) { const r = await api.post(`/characterization/${fileId}/create-users`); return r.data; },
};
