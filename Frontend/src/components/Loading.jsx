export default function Loading({ label = "Loading..." }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary">
      <div className="spinner-border spinner-border-sm" role="status" />
      <span>{label}</span>
    </div>
  );
}

