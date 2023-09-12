import axios from 'axios';
import { appConfig } from "../config/config";
// import { store } from "../redux/store";

const axiosInstance = axios.create({
   baseURL: appConfig.apiBaseUrl,
   timeout: 10000,
   headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
   }
});

export { axiosInstance };
