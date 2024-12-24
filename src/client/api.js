import axios from "axios";
import useUserStore from "../store/user";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("No auth token found! Check user login state.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Check your token or login credentials.");
    }
    return Promise.reject(error);
  }
);
