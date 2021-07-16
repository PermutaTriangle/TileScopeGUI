/**
 * Check if we are running in production mode.
 *
 * @returns {boolean} true if production, false otherwise.
 */
const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Check if input is string.
 *
 * @param {any} obj
 * @returns {boolean} true iff obj is a string.
 */
const isStr = (obj) => typeof obj === 'string' || obj instanceof String;

/**
 * Check if input is an object.
 *
 * @param {any} obj
 * @returns {boolean} true iff obj is a js object.
 */
const isObj = (obj) => typeof obj === 'object' && obj !== null;

export { isProduction, isStr, isObj };
