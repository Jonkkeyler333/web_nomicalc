import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function login(email, password) {
  return axios.post(`${API_URL}/auth/login`, { email, password });
}
