import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export function checkCompany(code){
    return axios.get(`${API_URL}/api/company/code/${code}`);
}

// debo añadir registro para verificar que una compañia existe a partir de su codigo que se le da al empleado
// por el jefe , este codgio es generado automaticamente cuando el jefe crea la compañia
