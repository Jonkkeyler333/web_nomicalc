import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getCompanies(name) {
    const params = name ? { params: { name } } : {};
    return axios.get(`${API_URL}/api/company/`, params);
}

export function getCompanyById(id) {
    return axios.get(`${API_URL}/api/company/${id}`);
}