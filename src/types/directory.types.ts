// Tipos para el Directorio UPGD/UI
export interface DirectoryEntry {
  id: number;
  // Sección 1: Datos Generales
  email: string;
  fechaRevision: Date;
  nombreRevisor: string;
  codigoUPGD: string; // 76001_________
  nombreInstitution: string;
  nombreGerente: string;
  emailGerente: string;
  celularGerente: string;
  tieneSistemas: boolean;
  
  // Sección 2: Personal de Sistemas (opcional)
  nombreSistemas?: string;
  emailSistemas?: string;
  celularSistemas?: string;
  
  // Sección 3: Comité de Infecciones
  tieneComiteInfecciones: boolean;
  
  // Sección 4: Personal del Comité de Infecciones (opcional)
  nombreComiteInfecciones?: string;
  emailComiteInfecciones?: string;
  celularComiteInfecciones?: string;
  
  // Sección 5: Personal Responsable del Sivigila
  nombreSivigila: string;
  emailSivigila: string;
  celularSivigila: string;
  
  // Metadatos del sistema
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
  updatedBy?: number;
  isActive: boolean;
}

export interface CreateDirectoryEntryDto {
  // Sección 1: Datos Generales
  email: string;
  fechaRevision: string; // YYYY-MM-DD format
  nombreRevisor: string;
  codigoUPGD: string;
  nombreInstitution: string;
  nombreGerente: string;
  emailGerente: string;
  celularGerente: string;
  tieneSistemas: boolean;
  
  // Sección 2: Personal de Sistemas (opcional)
  nombreSistemas?: string;
  emailSistemas?: string;
  celularSistemas?: string;
  
  // Sección 3: Comité de Infecciones
  tieneComiteInfecciones: boolean;
  
  // Sección 4: Personal del Comité de Infecciones (opcional)
  nombreComiteInfecciones?: string;
  emailComiteInfecciones?: string;
  celularComiteInfecciones?: string;
  
  // Sección 5: Personal Responsable del Sivigila
  nombreSivigila: string;
  emailSivigila: string;
  celularSivigila: string;
}

export interface UpdateDirectoryEntryDto extends Partial<CreateDirectoryEntryDto> {
  id: number;
}

export interface DirectoryFile {
  id: number;
  fileName: string;
  filePath: string;
  uploadedAt: Date;
  uploadedBy: number;
  totalRecords: number;
  status: 'PROCESSED' | 'ERROR';
}

export interface DirectoryStats {
  totalEntries: number;
  upgdCount: number;
  uiCount: number;
  withSistemas: number;
  withComiteInfecciones: number;
  withSystemsPersonnelPct: number;
  withComiteInfeccionesPct: number;
  lastUpdated: Date;
}
