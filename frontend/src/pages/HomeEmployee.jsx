import { useEffect, useState } from "react";
import { getEmployeeById } from "../services/employeeService";
import { useAuth } from "../context/authContext";
import LogoutButton from "../components/logout";
import { useNavigate } from "react-router-dom";
import { getPayslipsByEmployee, generatePayslipPDF, calculateNetSalary } from '../services/payslipService';
import { getBank } from '../services/bankService';
import FormSection from '../components/FormSection';

import './HomeAdmin.css';

export default function HomeEmployee() {
    const { currentUser } = useAuth();
    const employeeId = currentUser?.id;
    const [employee, setEmployee] = useState(null);
    const [bankInfo, setBankInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Estados para manejar las nóminas
    const [payslips, setPayslips] = useState([]);
    const [payslipLoading, setPayslipLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [calculating, setCalculating] = useState(null);

    useEffect(() => {
        if (employeeId) {
            getEmployeeById(employeeId)
                .then(res => {
                    setEmployee(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('No se pudo cargar la información del empleado');
                    setLoading(false);
                    console.error(err);
                });
                
            getBank(employeeId)
                .then(res => {
                    setBankInfo(res.data);
                })
                .catch(err => {
                    console.log("No se pudo cargar la información bancaria", err);
                });
                
            getPayslipsByEmployee(employeeId)
                .then(res => {
                    setPayslips(res.data);
                    setPayslipLoading(false);
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        setPayslips([]);
                    } else {
                        console.error('Error al cargar nóminas:', err);
                    }
                    setPayslipLoading(false);
                });
        }
    }, [employeeId]);

    const handleDownloadPDF = async (payslipId) => {
        setDownloading(payslipId);
        try {
            const res = await generatePayslipPDF(payslipId);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payslip_${payslipId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Error al descargar el PDF');
        }
        setDownloading(null);
    };

    const handleCalculateNetSalary = async (payslipId) => {
        setCalculating(payslipId);
        try {
            const response = await calculateNetSalary(payslipId);
            setPayslips(prevPayslips => 
                prevPayslips.map(p => 
                    p.id === payslipId ? {...p, net_salary: response.data.net_salary} : p
                )
            );
            alert(`Salario neto calculado: $${response.data.net_salary.toLocaleString()}`);
        } catch (err) {
            alert('Error al calcular el salario neto');
        }
        setCalculating(null);
    };

    if (loading) return <div>Cargando información del empleado...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="employee-dashboard">
            <header className="dashboard-header">
                    <h1>Bienvenido, {currentUser?.name}</h1>
                    <LogoutButton />
                {employee?.company_id && <p className="company-name">Empresa ID: {employee.company_id}</p>}
            </header>

            <section className="employee-info-section">
                <FormSection title="Mi Información Personal">
                    <div className="employee-card">
                        <div className="employee-field">
                            <span className="field-label">Nombre completo:</span>
                            <span className="field-value">{employee?.name} {employee?.last_name}</span>
                        </div>
                        <div className="employee-field">
                            <span className="field-label">Email:</span>
                            <span className="field-value">{employee?.email}</span>
                        </div>
                        <div className="employee-field">
                            <span className="field-label">NUIP:</span>
                            <span className="field-value">{employee?.nuip}</span>
                        </div>
                        <div className="employee-field">
                            <span className="field-label">Teléfono:</span>
                            <span className="field-value">{employee?.phone || "No registrado"}</span>
                        </div>
                        {/* Información bancaria */}
                        {bankInfo ? (
                            <>
                                <div className="employee-field">
                                    <span className="field-label">Banco:</span>
                                    <span className="field-value">{bankInfo.bank_name}</span>
                                </div>
                                <div className="employee-field">
                                    <span className="field-label">Tipo de cuenta:</span>
                                    <span className="field-value">{bankInfo.account_type}</span>
                                </div>
                                <div className="employee-field">
                                    <span className="field-label">Número de cuenta:</span>
                                    <span className="field-value">{bankInfo.account_number}</span>
                                </div>
                            </>
                        ) : (
                            <p>No hay información bancaria disponible</p>
                        )}
                    </div>
                </FormSection>
            </section>

            <section className="payslips-section">
                <h2>Mis Nóminas</h2>
                {payslipLoading ? (
                    <div>Cargando nóminas...</div>
                ) : payslips.length === 0 ? (
                    <p>No tienes nóminas registradas.</p>
                ) : (
                    <table className="payslip-table">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Año</th>
                                <th>Sueldo Básico</th>
                                <th>Auxilios</th>
                                <th>Deducciones</th>
                                <th>Salario Neto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payslips.map(p => (
                            <tr key={p.id}>
                                <td>{p.month}</td>
                                <td>{p.year}</td>
                                <td>${p.basic_salary?.toLocaleString()}</td>
                                <td>${p.allowances?.toLocaleString()}</td>
                                <td>${p.deductions?.toLocaleString()}</td>
                                <td>${(p.basic_salary + p.allowances - p.deductions)?.toLocaleString()}</td>
                                <td className="actions">
                                    <button onClick={() => handleDownloadPDF(p.id)} disabled={downloading === p.id}>
                                        {downloading === p.id ? 'Descargando...' : 'Descargar PDF'}
                                    </button>
                                    <button onClick={() => handleCalculateNetSalary(p.id)} disabled={calculating === p.id} style={{ marginLeft: '8px' }}>
                                        {calculating === p.id ? 'Calculando...' : 'Calcular Neto'}
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <style jsx>{`
                .employee-dashboard {
                    padding: 1rem;
                }
                .employee-card {
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                }
                .employee-field {
                    display: flex;
                    margin-bottom: 0.75rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 0.5rem;
                }
                .field-label {
                    font-weight: bold;
                    min-width: 150px;
                }
                .field-value {
                    flex-grow: 1;
                }
                .payslip-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .payslip-table th, .payslip-table td {
                    border: 1px solid #ddd;
                    padding: 0.5rem;
                    text-align: left;
                }
                .payslip-table th {
                    background-color: #f2f2f2;
                }
                .actions button {
                    padding: 0.25rem 0.5rem;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .actions button:disabled {
                    background-color: #cccccc;
                }
            `}</style>
        </div>
    );
}