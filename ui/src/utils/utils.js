/**
 * Check if we are running in production mode.
 */
const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Generate a random id.
 */
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // eslint-disable-next-line no-bitwise
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );

/**
 * Check if input is string.
 */
const isStr = (obj) => typeof obj === 'string' || obj instanceof String;

/**
 * Check if input is an object.
 */
const isObj = (obj) => typeof obj === 'object' && obj !== null;

export { isProduction, uuid, isStr, isObj };
