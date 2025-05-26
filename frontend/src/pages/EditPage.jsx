import { useEffect , useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../services/employeeService";
import FormInput from "../components/FormInput";
import FormSection from "../components/FormSection";
import SubmitButton from "../components/SubmitButton";

export default function EditPage() {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        nuip: '',
        email: '',
        phone: '',
        address: ''
    });
    
    useEffect(() => {
        if (employeeId) {
        getEmployeeById(employeeId)
            .then(res => {
            setEmployee(res.data);
            setFormData({
                name: res.data.name,
                last_name: res.data.last_name,
                nuip: res.data.nuip,
                email: res.data.email,
                phone: res.data.phone,
                address: res.data.address
            });
            setLoading(false);
            })
            .catch(err => {
            setError('Error al cargar el empleado');
            setLoading(false);
            });
        }
    }, [employeeId]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await updateEmployee(employeeId, formData);
        alert('Empleado actualizado exitosamente');
        navigate('/home');
        } catch (err) {
        setError('Error al actualizar el empleado');
        }
    };
    
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="edit-page">
        <h1>Editar Empleado</h1>
        <h2>Solo completa los campos que se desean actualizar</h2>
        <form onSubmit={handleSubmit}>
            <FormSection>
            <FormInput label="Nombre" name="name" value={formData.name} onChange={handleChange} />
            <FormInput abel="Apellido" name="last_name"value={formData.last_name} onChange={handleChange} />
            <FormInput label="NUIP" name="nuip" value={formData.nuip} onChange={handleChange}/>
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <FormInput label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange}/>
            <FormInput label="Dirección"  name="address" value={formData.address} onChange={handleChange}/>
            </FormSection>
            <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Empleado'}
            </SubmitButton>
        </form>
        <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            Volver
        </button>
        </div>
    );
}