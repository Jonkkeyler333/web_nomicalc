import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function register_bank(data) {
  return axios.post(`${API_URL}/api/bank/`, data);
}

export function getBank(id_employee) {
  return axios.get(`${API_URL}/api/bank/employee/${id_employee}`);
}