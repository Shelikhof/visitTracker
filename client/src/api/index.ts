import axios from "axios";
import getCookie from "../utils/getCookieByName";
import AuthService from "./AuthService";

const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getCookie("accessToken")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await AuthService.refresh();
        return $api.request(originalRequest);
      } catch (e) {
        if (window.location.href.split("/")[3] == "login") return;
        window.location.href = "/login";
      }
    }
    throw error;
  }
);

export default $api;
