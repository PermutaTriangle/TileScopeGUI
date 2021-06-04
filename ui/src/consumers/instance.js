import axios from 'axios';

const host = 'http://127.0.0.1:5000';

const apiConsumer = axios.create({
  baseURL: `${host}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const errorToResponse = (error) => {
  if (error.response) return error.response;
  return { status: -1 };
};

const apiGet = async (path, config = null) => {
  try {
    const res = await apiConsumer.get(path, config);
    return res;
  } catch (error) {
    return errorToResponse(error);
  }
};

const apiPost = async (path, data, config = null) => {
  console.log(data);
  try {
    const jsonData = JSON.stringify(data);
    const res = await apiConsumer.post(path, jsonData, config);
    return res;
  } catch (error) {
    return errorToResponse(error);
  }
};

export { apiGet, apiPost };
