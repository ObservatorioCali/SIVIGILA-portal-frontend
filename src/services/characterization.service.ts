import api from './api';
import { CharacterizationFile, Observation } from '../types/characterization.types';

export const CharacterizationService = {
  async uploadFile(file: File, period: string, userId: number): Promise<{ message: string; fileId: number; total: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('period', period);
    formData.append('userId', userId.toString());

    const response = await api.post(`/characterization/upload/${period}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
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
