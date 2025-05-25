import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getEmployees(name){
    const params = name ? { params: { name } } : {};
    return axios.get(`${API_URL}/api/employee/`, params);
}

export function getEmployeeById(id) {
    return axios.get(`${API_URL}/api/employee/${id}`);
}

export function updateEmployee(id, data) {
    return axios.patch(`${API_URL}/api/employee/${id}`, data);
}

export function deleteEmployee(id) {
    return axios.delete(`${API_URL}/api/employee/${id}`);
}

export function getEmployeesByCompany(name, companyId) {
  const params = {};
  if (name) params.name = name;
  
  return axios.get(`${API_URL}/api/employee/company/${companyId}`, { 
    params,
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('access_token')}` 
    }
  });
}
