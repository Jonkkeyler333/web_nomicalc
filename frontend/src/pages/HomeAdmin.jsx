import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate} from 'react-router-dom';
import { getEmployeesByCompany } from '../services/employeeService';
import { getCompanyById } from '../services/companyService';
import { getBank } from '../services/bankService';
import LogoutButton from '../components/logout';
import './HomeAdmin.css'; 

export default function HomeAdmin() {
    const { currentUser, companyId, isAdmin, loading } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const [bankInfo, setBankInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (companyId) {
            setError(null);
            try {
                getEmployeesByCompany(companyId).then(res => setEmployees(res.data));
            } catch (err) {
                setError(err.message);
            }
        }
    }, [companyId]);

    const handleManagePayslip = (employeeId) => {
        console.log("Administrar nómina del empleado:", employeeId);
        navigate(`/payslip/${employeeId}`);
    };

    const handleEditEmployee = (employeeId) => {
        console.log("Editar empleado:", employeeId);
        navigate(`/employees/edit/${employeeId}`);
    };

    const fetchBankInfo = async (employeeId) => {
        try {
            const res = await getBank(employeeId);
            setBankInfo(prev => ({
                ...prev,
                [employeeId]: res.data
            }));
        } catch (err) {
            setBankInfo(prev => ({
                ...prev,
                [employeeId]: { error: 'No disponible' }
            }));
        }
    };

    useEffect(() => {
        const loadCompanyData = async () => {
            if (companyId) {
                try {
                    const response = await getCompanyById(companyId);
                    setCompany(response.data);
                } catch (err) {
                    console.error("Error al cargar datos de la compañía:", err);
                }
            }
        };
        loadCompanyData();
    },[companyId]);

    if (error) {
        return <p className="error-message">Error: {error}</p>;
    }
    
    if (loading) return <p className="loading">Cargando...</p>;

    return (
        <div className="admin-dashboard">
        <header className="dashboard-header">
            <h1>Bienvenido, {currentUser?.name}</h1>
            <LogoutButton />
            <p className="company-name">Empresa: {company?.name || "Tu Compañía"}</p>
            {isAdmin && <span className="admin-badge">Administrador</span>}
        </header>

        <section className="employees-section">
            <div className="section-header">
            <h2>Gestión de Empleados</h2>
            <p>Recuerda que los empleados se registran usando tu código de empresa : <strong>{company?.code || "Tu codigo"}</strong></p>
            </div>

            {employees.length === 0 ? (
            <p className="no-data">No hay empleados registrados.</p>
            ) : (
            <div className="table-container">
                <table className="employees-table">
                <thead>
                    <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>NUIP</th>
                    <th>Teléfono</th>
                    <th>Banco</th>
                    <th>Tipo de Cuenta</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                    <tr key={emp.id}>
                        <td>{emp.name} {emp.last_name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.nuip}</td>
                        <td>{emp.phone || "N/A"}</td>
                        <td>
                            {bankInfo[emp.id]?.bank_name ? (
                                bankInfo[emp.id].bank_name
                            ) : bankInfo[emp.id]?.error ? (
                                <span className="bank-error">{bankInfo[emp.id].error}</span>
                            ) : (
                                <button className="action-button bank" onClick={() => fetchBankInfo(emp.id)}>
                                    Ver Banco
                                </button>
                            )}
                        </td>
                        <td>
                            {bankInfo[emp.id]?.account_type ? (
                                bankInfo[emp.id].account_type
                            ) : bankInfo[emp.id]?.error ? (
                                <span className="bank-error">-</span>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td className="actions">
                        <button 
                            className="action-button payslip" 
                            onClick={() => handleManagePayslip(emp.id)}
                        >
                            Nóminas
                        </button>
                        <button 
                            className="action-button edit" 
                            onClick={() => handleEditEmployee(emp.id)}
                        >
                            Editar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </section>
        </div>
    );
}