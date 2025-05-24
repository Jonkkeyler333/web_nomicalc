export default function FormInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      {label && <label style={{ display: 'block' }}>{label}</label>}
      <input {...props} style={{ width: '100%', padding: '0.5rem' }} />
    </div>
  );
}
