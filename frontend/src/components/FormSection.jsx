export default function FormSection({ title, children }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
