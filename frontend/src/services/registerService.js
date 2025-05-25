import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function register_us(data) {
  return axios.post(`${API_URL}/api/user/`,data);
}

export function register_employee(data) {
  return axios.post(`${API_URL}/api/employee/`,data);
}

export function register_company(name,nit,address,phone,email,website) {
  return axios.post(`${API_URL}/api/company/`, { name,nit,address,phone,email,website });
}