export default function ToggleRole({ role, onSelect }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
      <button
        style={{ fontWeight: role === 'empleado' ? 'bold' : 'normal' }}
        onClick={() => onSelect('empleado')}
      >
        Empleado
      </button>
      <button
        style={{ fontWeight: role === 'admin' ? 'bold' : 'normal' }}
        onClick={() => onSelect('admin')}
      >
        Administrador
      </button>
    </div>
  );
}