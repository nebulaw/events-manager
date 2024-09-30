import axios from "axios";

export const API_BASE_URL = "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
});

export const setAuthToken = (token?: string) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        axiosInstance.defaults.headers.common["Authorization"] = null;
    }
};

export async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



