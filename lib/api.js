import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);


export default api;



export const api_v1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_FASTAPI,
  headers: {
    'Content-Type': 'application/json',
  },
});

api_v1.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);


// export default api_v1;