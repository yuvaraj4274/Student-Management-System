export default function StatCard({ label, value, hint, icon }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value mono">{value}</div>
      {hint && <div className="stat-card-hint">{hint}</div>}
    </div>
  );
}
