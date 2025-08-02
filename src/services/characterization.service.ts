import api from './api';
import { CharacterizationFile, Observation } from '../types/characterization.types';

export const CharacterizationService = {
  // Función para verificar la conectividad del backend
  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ Health check falló:', error);
      return false;
    }
  },

  async uploadFile(file: File, period: string, userId: number): Promise<{ message: string; fileId: number; total: number }> {
    console.log(`📤 Iniciando upload de archivo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('period', period);
    formData.append('userId', userId.toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Upload timeout alcanzado (60s), cancelando petición');
      controller.abort();
    }, 60000); // 60 segundos timeout

    try {
      const response = await api.post(`/characterization/upload/${period}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
        timeout: 60000, // 60 segundos timeout
      });

      clearTimeout(timeoutId);
      console.log(`✅ Upload completado exitosamente:`, response.data);
      return response.data;
    } catch (error: any) {
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
      
      // Extraer mensaje de error más específico del backend
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al subir archivo';
      throw new Error(errorMessage);
    }
  },

  async getAllFiles(): Promise<CharacterizationFile[]> {
    const response = await api.get(`/characterization`);
    return response.data;
  },

  async getFileById(id: number): Promise<CharacterizationFile> {
    const response = await api.get(`/characterization/${id}`);
    return response.data;
  },

  async addObservation(fileId: number, message: string, userId: number): Promise<Observation> {
    const response = await api.post(`/characterization/${fileId}/observations`, {
      fileId,
      message,
      userId,
    });
    return response.data;
  },

  async markObservationsResolved(fileId: number): Promise<CharacterizationFile> {
    const response = await api.patch(`/characterization/${fileId}/mark-resolved`);
    return response.data;
  },

  async clearObservations(fileId: number): Promise<{ message: string; observationsDeleted: number }> {
    const response = await api.delete(`/characterization/${fileId}/observations`);
    return response.data;
  },

  async verifyFile(fileId: number): Promise<CharacterizationFile> {
    const response = await api.patch(`/characterization/${fileId}/verify`);
    return response.data;
  },

  async deleteFile(fileId: number): Promise<{ message: string }> {
    const response = await api.delete(`/characterization/${fileId}`);
    return response.data;
  },

  async createUsersFromFile(fileId: number): Promise<{ message: string; users: any[] }> {
    const response = await api.post(`/characterization/${fileId}/create-users`);
    return response.data;
  },
};
