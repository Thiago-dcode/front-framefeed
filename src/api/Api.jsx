import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': `multipart/form-data`,
    Accept: "application/json",
  },
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }
    throw error;
  }
);
export default Api;
