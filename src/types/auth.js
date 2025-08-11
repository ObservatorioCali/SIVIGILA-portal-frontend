/** Roles de usuario */
export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  UPGD_UI: 'UPGD_UI'
});

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} codigo
 * @property {string} cod_pre
 * @property {string} cod_sub
 * @property {keyof typeof UserRole} role
 * @property {string} institucion
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} codigo
 * @property {string} password
 * @property {string} recaptchaToken
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} access_token
 * @property {User} user
 */

/**
 * @typedef {Object} AuthContextShape
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {(credentials: LoginRequest) => Promise<void>} login
 * @property {() => void} logout
 */
