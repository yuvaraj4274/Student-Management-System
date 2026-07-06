export default function Topbar({ title, subtitle, action }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
