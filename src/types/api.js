/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data
 * @property {string} [message]
 * @property {boolean} success
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {number} statusCode
 * @property {string} error
 */

// Utilidad: funciones helpers opcionales para crear respuestas

/**
 * @template T
 * @param {T} data
 * @param {string} [message]
 * @returns {ApiResponse<T>}
 */
export function ok(data, message = 'OK') {
  return { data, message, success: true };
}

/**
 * @param {ApiError} err
 * @returns {ApiResponse<null>}
 */
export function fail(err) {
  return { data: null, message: err.message, success: false };
}
