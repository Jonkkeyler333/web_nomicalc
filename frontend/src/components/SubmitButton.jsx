export default function SubmitButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </button>
  );
}
