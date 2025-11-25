import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // grâce au rewrite, ça partira vers Express
});
