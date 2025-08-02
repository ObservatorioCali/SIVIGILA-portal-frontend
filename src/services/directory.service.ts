/**
 * DirectoryService - Servicio frontend para la gestión del directorio institucional
 * 
 * Este servicio encapsula todas las llamadas HTTP al backend relacionadas con
 * el directorio institucional. Proporciona una API limpia y tipada para los
 * componentes React, con manejo de errores, timeouts y logging integrado.
 * 
 * Funcionalidades principales:
 * - Carga masiva de archivos Excel con progreso
 * - CRUD completo de instituciones
 * - Búsqueda y filtrado avanzado
 * - Estadísticas en tiempo real
 * - Manejo robusto de errores y timeouts
 * 
 * @author SIVIGILA Portal Team
 * @version 2.0.0
 * @since 2024-07-31
 */

import api from './api';
import { DirectoryEntry, CreateDirectoryEntryDto, UpdateDirectoryEntryDto, DirectoryStats } from '../types/directory.types';

/**
 * Servicio principal para operaciones del directorio institucional
 * 
 * Implementa el patrón Service para abstraer las llamadas HTTP
 * y proporcionar una interfaz consistente para los componentes.
 */
export const DirectoryService = {
  /**
   * Sube un archivo Excel con el directorio institucional inicial
   * 
   * Esta función maneja la carga masiva de instituciones desde un archivo Excel.
   * Implementa timeout extendido (2 minutos) para archivos grandes y cancellation
   * automática para evitar peticiones colgadas.
   * 
   * Proceso:
   * 1. Crea FormData con el archivo
   * 2. Configura timeout de 2 minutos
   * 3. Envía petición POST multipart/form-data
   * 4. Maneja respuesta con estadísticas de procesamiento
   * 5. Limpia timeout y resources
   * 
   * @param {File} file - Archivo Excel (.xls/.xlsx) a procesar
   * @returns {Promise<object>} Resultado con estadísticas del procesamiento
   * @throws {Error} Si el archivo es inválido o hay error de red
   * 
   * @example
   * ```typescript
   * const file = fileInput.files[0];
   * try {
   *   const result = await DirectoryService.uploadInitialFile(file);
   *   console.log(`Procesadas ${result.processedRows} instituciones`);
   * } catch (error) {
   *   console.error('Error en upload:', error.message);
   * }
   * ```
   */
  async uploadInitialFile(file: File): Promise<{ message: string; fileName: string; processedRows: number }> {
    console.log(`📤 Iniciando upload del archivo inicial del directorio: ${file.name}`);
    
    // Preparar datos del formulario multipart
    const formData = new FormData();
    formData.append('file', file);

    // Configurar cancelación automática por timeout (120 segundos)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏰ Upload timeout alcanzado (120s), cancelando petición');
      controller.abort();
    }, 120000); // 2 minutos timeout para archivos grandes

    try {
      const response = await api.post('/directory/upload-initial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
        timeout: 120000,
      });

      clearTimeout(timeoutId);
      console.log(`✅ Upload del directorio completado:`, response.data);
      return response.data;
    } catch (error: any) {
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

  // Obtener todas las entradas del directorio
  async getAllEntries(): Promise<DirectoryEntry[]> {
    const response = await api.get('/directory');
    return response.data;
  },

  // Obtener una entrada específica
  async getEntryById(id: number): Promise<DirectoryEntry> {
    const response = await api.get(`/directory/${id}`);
    return response.data;
  },

  // Crear nueva entrada en el directorio
  async createEntry(entry: CreateDirectoryEntryDto): Promise<DirectoryEntry> {
    const response = await api.post('/directory', entry);
    return response.data;
  },

  // Actualizar entrada existente
  async updateEntry(id: number, entry: UpdateDirectoryEntryDto): Promise<DirectoryEntry> {
    const response = await api.patch(`/directory/${id}`, entry);
    return response.data;
  },

  // Eliminar entrada (marcar como inactiva)
  async deleteEntry(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/directory/${id}`);
    return response.data;
  },

  // Obtener estadísticas del directorio
  async getStats(): Promise<DirectoryStats> {
    const response = await api.get('/directory/stats');
    return response.data;
  },

  // Buscar en el directorio
  async search(query: string): Promise<DirectoryEntry[]> {
    if (!query.trim()) return [];
    const response = await api.get('/directory/search', {
      params: { q: query },
    });
    return response.data;
  },
};
