import axios from "axios";
import { getCookie } from "@/helpers/cookies.js";

const _axios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
    },
});

// use interceptor to handle auth token
_axios.interceptors.request.use(
    (config) => {
        const token = getCookie("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        Promise.reject(error).then(r => console.log(r));
    },
);

export default _axios;