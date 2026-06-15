import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('voicedoc_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Request failed';

    return Promise.reject(new Error(message));
  }
);

export default client;
