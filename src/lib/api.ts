/// <reference types="vite/client" />
// src/lib/api.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

export { api };
export const getPosts = () => api.get('/posts');