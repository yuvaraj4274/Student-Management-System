import Sidebar from "./Sidebar.jsx";
import "../styles/layout.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">{children}</div>
    </div>
  );
}
