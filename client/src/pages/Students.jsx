import { useCallback, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import StudentForm from "./StudentForm.jsx";
import api from "../api/axios";
import "../styles/components.css";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadStudents = useCallback(async (query) => {
    setLoading(true);
    try {
      const { data } = await api.get("/students", { params: query ? { search: query } : {} });
      setStudents(data);
      setError("");
    } catch (err) {
      setError("Could not load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      // Course dropdown will simply be empty; the students list error covers the main failure case
    }
  }, []);

  useEffect(() => {
    loadStudents("");
    loadCourses();
  }, [loadStudents, loadCourses]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStudents(search);
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, loadStudents]);

  const openAddForm = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const openEditForm = (student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editingStudent) {
      await api.put(`/students/${editingStudent._id}`, form);
    } else {
      await api.post("/students", form);
    }
    setFormOpen(false);
    loadStudents(search);
  };

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await api.delete(`/students/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadStudents(search);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete this student.");
      setDeleteTarget(null);
    }
  };

  return (
    <AppLayout>
      <Topbar title="Students" subtitle="Add, search, and manage student records" />
      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}
        {deleteError && <div className="alert alert-error">{deleteError}</div>}

        <div className="page-header-row">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, ID, or course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={openAddForm}>
            Add student
          </button>
        </div>

        <div className="card">
          <div className="table-wrap">
            {loading ? (
              <div className="loading-state">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <strong>No students found</strong>
                {search ? "Try a different search term." : "Add your first student to get started."}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="mono">{student.studentId}</td>
                      <td className="cell-name">{student.name}</td>
                      <td>{student.course?.courseName || "Not assigned"}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>
                        <span className={`badge ${student.status === "Active" ? "badge-active" : "badge-inactive"}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <div className="cell-actions">
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => openEditForm(student)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(student)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <StudentForm
        open={formOpen}
        initialData={editingStudent}
        courses={courses}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
}
