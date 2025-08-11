/**
 * @typedef {Object} DirectoryEntry
 * @property {number} id
 * @property {string} email
 * @property {string} fechaRevision
 * @property {string} nombreRevisor
 * @property {string} codigoUPGD
 * @property {string} nombreInstitution
 * @property {string} nombreGerente
 * @property {string} emailGerente
 * @property {string} celularGerente
 * @property {boolean} tieneSistemas
 * @property {string} [nombreSistemas]
 * @property {string} [emailSistemas]
 * @property {string} [celularSistemas]
 * @property {boolean} tieneComiteInfecciones
 * @property {string} [nombreComiteInfecciones]
 * @property {string} [emailComiteInfecciones]
 * @property {string} [celularComiteInfecciones]
 * @property {string} nombreSivigila
 * @property {string} emailSivigila
 * @property {string} celularSivigila
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} [createdBy]
 * @property {number} [updatedBy]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} CreateDirectoryEntryDto
 * @property {string} email
 * @property {string} fechaRevision
 * @property {string} nombreRevisor
 * @property {string} codigoUPGD
 * @property {string} nombreInstitution
 * @property {string} nombreGerente
 * @property {string} emailGerente
 * @property {string} celularGerente
 * @property {boolean} tieneSistemas
 * @property {string} [nombreSistemas]
 * @property {string} [emailSistemas]
 * @property {string} [celularSistemas]
 * @property {boolean} tieneComiteInfecciones
 * @property {string} [nombreComiteInfecciones]
 * @property {string} [emailComiteInfecciones]
 * @property {string} [celularComiteInfecciones]
 * @property {string} nombreSivigila
 * @property {string} emailSivigila
 * @property {string} celularSivigila
 */

/**
 * @typedef {Object} UpdateDirectoryEntryDto
 * @property {number} id
 * @property {Partial<CreateDirectoryEntryDto>} [data]
 */

/**
 * @typedef {Object} DirectoryFile
 * @property {number} id
 * @property {string} fileName
 * @property {string} filePath
 * @property {string} uploadedAt
 * @property {number} uploadedBy
 * @property {number} totalRecords
 * @property {'PROCESSED'|'ERROR'} status
 */

/**
 * @typedef {Object} DirectoryStats
 * @property {number} totalEntries
 * @property {number} upgdCount
 * @property {number} uiCount
 * @property {number} withSistemas
 * @property {number} withComiteInfecciones
 * @property {number} withSystemsPersonnelPct
 * @property {number} withComiteInfeccionesPct
 * @property {string} lastUpdated
 */
