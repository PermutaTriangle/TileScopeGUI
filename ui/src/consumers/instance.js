import axios from 'axios';

/**
 * The host endpoint of the API.
 */
const host = 'http://127.0.0.1:5000';

/**
 * A communication instance for API requests.
 */
const apiConsumer = axios.create({
  baseURL: `${host}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Convert errors to response.
 *
 * @param {Error} err
 * @returns {{status: number, data: null}} Exceptions as response object.
 */
const errorToResponse = (err) => {
  if (err.response) {
    return { status: err.response.status, data: null };
  }
  return { status: -1, data: null };
};

/**
 * Get request to API.
 *
 * @async
 * @param {string} path
 * @param {null|object} config
 * @returns {Promise.<{status: number, data: object|null}>} A promise with response
 */
const apiGet = async (path, config = null) => {
  try {
    const res = await apiConsumer.get(path, config);
    return res;
  } catch (error) {
    return errorToResponse(error);
  }
};

/**
 * Post request to API.
 *
 * @async
 * @param {string} path
 * @param {object} data
 * @param {null|object} config
 * @returns {Promise.<{status: number, data: object|null}>} A promise with response
 */
const apiPost = async (path, data, config = null) => {
  try {
    const jsonData = JSON.stringify(data);
    const res = await apiConsumer.post(path, jsonData, config);
    return res;
  } catch (error) {
    return errorToResponse(error);
  }
};

export { apiGet, apiPost };
