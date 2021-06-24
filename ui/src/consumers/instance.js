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
 */
const errorToResponse = (error) => {
  if (error.response) return error.response;
  return { status: -1 };
};

/**
 * Get request to API.
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
