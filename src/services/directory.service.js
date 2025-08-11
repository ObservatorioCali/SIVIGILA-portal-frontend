import api from './api.js';

export const DirectoryService = {
  async uploadInitialFile(file) {
    console.log(`📤 Iniciando upload del archivo inicial del directorio: ${file.name}`);
    const formData = new FormData();
    formData.append('file', file);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Upload timeout alcanzado (120s), cancelando petición');
      controller.abort();
    }, 120000);
    try {
      const response = await api.post('/directory/upload-initial', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        timeout: 120000,
      });
      clearTimeout(timeoutId);
      console.log('✅ Upload del directorio completado:', response.data);
      return response.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('❌ Upload cancelado por timeout');
        throw new Error('El archivo tardó demasiado en procesarse. Verifique su conexión e inténtelo de nuevo.');
      }
      console.error('❌ Error en upload del directorio:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al subir archivo';
      throw new Error(errorMessage);
    }
  },
  async getAllEntries() { const r = await api.get('/directory'); return r.data; },
  async getEntryById(id) { const r = await api.get(`/directory/${id}`); return r.data; },
  async createEntry(entry) { const r = await api.post('/directory', entry); return r.data; },
  async updateEntry(id, entry) { const r = await api.patch(`/directory/${id}`, entry); return r.data; },
  async deleteEntry(id) { const r = await api.delete(`/directory/${id}`); return r.data; },
  async getStats() { const r = await api.get('/directory/stats'); return r.data; },
  async search(query) { if (!query.trim()) return []; const r = await api.get('/directory/search', { params: { q: query } }); return r.data; },
};
