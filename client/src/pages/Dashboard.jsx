import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../api/axios";
import "../styles/components.css";

const StudentsGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M4.5 20c0-3.6 3.4-6.2 7.5-6.2s7.5 2.6 7.5 6.2" strokeLinecap="round" />
  </svg>
);

const CoursesGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 5.2C4 4.4 4.6 4 5.4 4H11v16H5.4c-.8 0-1.4-.4-1.4-1.2V5.2Z" />
    <path d="M20 5.2c0-.8-.6-1.2-1.4-1.2H13v16h5.6c.8 0 1.4-.4 1.4-1.2V5.2Z" />
  </svg>
);

const ActiveGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 12.5l4.5 4.5L20 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, activeStudents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data);
      } catch (err) {
        setError("Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AppLayout>
      <Topbar title="Dashboard" subtitle="An overview of students and courses" />
      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="stats-grid">
          <StatCard
            label="Total students"
            value={loading ? "..." : stats.totalStudents}
            hint="All students on record"
            icon={<StudentsGlyph />}
          />
          <StatCard
            label="Total courses"
            value={loading ? "..." : stats.totalCourses}
            hint="Courses currently offered"
            icon={<CoursesGlyph />}
          />
          <StatCard
            label="Active students"
            value={loading ? "..." : stats.activeStudents}
            hint="Students marked active"
            icon={<ActiveGlyph />}
          />
        </div>

        <div className="card" style={{ padding: "24px 26px" }}>
          <h3 style={{ marginBottom: 10 }}>Getting started</h3>
          <p style={{ color: "var(--color-text-muted)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
            Use the Courses page to set up the classes you offer, then add students from the
            Students page and assign each one to a course. The counts above update automatically
            as records change.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
