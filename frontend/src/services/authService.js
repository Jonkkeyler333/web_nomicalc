import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function loginService(email, password) {
  return axios.post(`${API_URL}/auth/login`, { email, password });
}

export function getProfile() {
  const token = localStorage.getItem('access_token');
  console.log({Authorization: `Bearer ${token}`})
  return axios.get(`${API_URL}/auth/profile`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}
