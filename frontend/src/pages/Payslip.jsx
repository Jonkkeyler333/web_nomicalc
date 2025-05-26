import { useEffect, useState} from 'react';
import { useAuth } from '../context/authContext';
import { getPayslipsByEmployee, createPayslip, generatePayslipPDF, calculateNetSalary } from '../services/payslipService';
import { getBank } from '../services/bankService';
import FormInput from '../components/FormInput';
import FormSection from '../components/FormSection';
import SubmitButton from '../components/SubmitButton';
import { useParams } from 'react-router-dom';

export default function Payslip() {
    const { isAdmin } = useAuth();
    const { employeeId } = useParams();
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null);
    const [calculating, setCalculating] = useState(null);
    const [bankInfo, setBankInfo] = useState(null);
    const [form, setForm] = useState({
        month: '',
        year: '',
        gross_salary: '',
        deductions: '',
        observations: '',
        allowances: '',
        account_number: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [bankLoading, setBankLoading] = useState(false);

    useEffect(() => {
        if (employeeId) {
            setLoading(true);
            setError(null);
            getPayslipsByEmployee(employeeId)
            .then(res => {
                setPayslips(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setPayslips([]);
                    setLoading(false);
                } else {
                    setError('No se pudieron cargar las nóminas');
                    setLoading(false);
                }
            });
            
            setBankLoading(true);
            getBank(employeeId)
                .then(res => {
                    setBankInfo(res.data);
                    setForm(prevForm => ({
                        ...prevForm,
                        account_number: res.data.account_number || ''
                    }));
                    setBankLoading(false);
                })
                .catch(err => {
                    console.log("No se pudo cargar la información bancaria", err);
                    setBankLoading(false);
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            const data = {
                ...form,
                employee_id: employeeId,
                gross_salary: parseFloat(form.gross_salary),
                deductions: parseFloat(form.deductions),
                allowances: parseFloat(form.allowances) || 0,
                account_number: form.account_number || (bankInfo?.account_number || '')
            };
            
            const createResponse = await createPayslip(data);
            const res = await getPayslipsByEmployee(employeeId);
            setPayslips(res.data);
            setForm({
                month: '',
                year: '',
                gross_salary: '',
                deductions: '',
                observations: '',
                allowances: '',
                account_number: bankInfo?.account_number || ''
            });
        } catch (err) {
            setFormError(err.response?.data?.error || 'Error al crear la nómina');
        }
        setSubmitting(false);
    };

    if (loading) return <div>Cargando nóminas...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="payslip-page">
            <FormSection title="Registrar nueva nómina para empleado">
                <form onSubmit={handleSubmit}>
                    <FormInput label="Mes" name="month" value={form.month} onChange={handleChange} required />
                    <FormInput label="Año" name="year" value={form.year} onChange={handleChange} required />
                    <FormInput label="Sueldo Básico" name="gross_salary" type="number" value={form.gross_salary} onChange={handleChange} required />
                    <FormInput label="Auxilios" name="allowances" type="number" value={form.allowances} onChange={handleChange} />
                    <FormInput label="Deducciones" name="deductions" type="number" value={form.deductions} onChange={handleChange} required />
                    <FormInput label="Observaciones" name="observations" value={form.observations} onChange={handleChange} />
                    
                    {/* Campo de número de cuenta, pre-llenado y con indicador de carga */}
                    <div style={{ position: 'relative' }}>
                        <FormInput 
                            label={`Número de Cuenta${bankInfo ? ' (Pre-llenado del banco)' : ''}`} 
                            name="account_number" 
                            value={form.account_number} 
                            onChange={handleChange}
                            disabled={bankLoading}
                        />
                        {bankLoading && (
                            <span style={{ position: 'absolute', right: '10px', top: '50%', color: '#666' }}>
                                Cargando...
                            </span>
                        )}
                        {bankInfo && (
                            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '-0.5rem' }}>
                                Banco: {bankInfo.bank_name} | Tipo: {bankInfo.account_type}
                            </div>
                        )}
                    </div>
                    
                    {formError && <div style={{ color: 'red' }}>{formError}</div>}
                    <SubmitButton disabled={submitting}>{submitting ? 'Guardando...' : 'Registrar Nómina'}</SubmitButton>
                </form>
            </FormSection>
    
            <h2>Nóminas del empleado</h2>
            {payslips.length === 0 ? (
                <p>No hay nóminas registradas.</p>
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
                                <button 
                                    onClick={() => handleDownloadPDF(p.id)}
                                    disabled={downloading === p.id}
                                >
                                    {downloading === p.id ? 'Descargando...' : 'Descargar PDF'}
                                </button>
                                <button
                                    onClick={() => handleCalculateNetSalary(p.id)}
                                    disabled={calculating === p.id}
                                    style={{ marginLeft: '8px' }}
                                >
                                    {calculating === p.id ? 'Calculando...' : 'Calcular Neto'}
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

