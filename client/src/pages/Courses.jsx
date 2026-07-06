import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import CourseForm from "./CourseForm.jsx";
import api from "../api/axios";
import "../styles/components.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
      setError("");
    } catch (err) {
      setError("Could not load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddForm = () => {
    setEditingCourse(null);
    setFormOpen(true);
  };

  const openEditForm = (course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editingCourse) {
      await api.put(`/courses/${editingCourse._id}`, form);
    } else {
      await api.post("/courses", form);
    }
    setFormOpen(false);
    loadCourses();
  };

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await api.delete(`/courses/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadCourses();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete this course.");
      setDeleteTarget(null);
    }
  };

  return (
    <AppLayout>
      <Topbar title="Courses" subtitle="Manage the courses students can enroll in" />
      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}
        {deleteError && <div className="alert alert-error">{deleteError}</div>}

        <div className="page-header-row">
          <div />
          <button type="button" className="btn btn-primary" onClick={openAddForm}>
            Add course
          </button>
        </div>

        <div className="card">
          <div className="table-wrap">
            {loading ? (
              <div className="loading-state">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <strong>No courses yet</strong>
                Add your first course to start assigning students to it.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course name</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="cell-name">{course.courseName}</td>
                      <td>{course.duration}</td>
                      <td>{course.description || "-"}</td>
                      <td>
                        <div className="cell-actions">
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => openEditForm(course)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(course)}
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

      <CourseForm
        open={formOpen}
        initialData={editingCourse}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete course"
        message={`Are you sure you want to delete "${deleteTarget?.courseName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
}
