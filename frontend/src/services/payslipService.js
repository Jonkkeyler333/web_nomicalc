import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getAllPayslips() {
  return axios.get(`${API_URL}/api/payslip/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}

export function getPayslipsByEmployee(employeeId) {
  return axios.get(`${API_URL}/api/payslip/?employee_id=${employeeId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}

export function getPayslipById(payslipId) {
  return axios.get(`${API_URL}/api/payslip/${payslipId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}

export function createPayslip(payslipData) {
  return axios.post(`${API_URL}/api/payslip/`, payslipData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}

export function updatePayslip(payslipId, payslipData) {
  return axios.patch(`${API_URL}/api/payslip/${payslipId}`, payslipData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}


export function deletePayslip(payslipId) {
  return axios.delete(`${API_URL}/api/payslip/${payslipId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}


export function calculateNetSalary(payslipId) {
  return axios.get(`${API_URL}/api/payslip/calculate/${payslipId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
}

export function generatePayslipPDF(payslipId) {
  return axios.get(`${API_URL}/api/payslip/pdf/${payslipId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    responseType: 'blob'
  });
}