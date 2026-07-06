import { useEffect, useState } from "react";

const emptyForm = { courseName: "", duration: "", description: "" };

export default function CourseForm({ open, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialData || emptyForm);
      setErrors({});
      setServerError("");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.courseName.trim()) nextErrors.courseName = "Course name is required";
    if (!form.duration.trim()) nextErrors.duration = "Duration is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not save this course.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-panel-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-panel">
        <div className="form-panel-header">
          <div>
            <h3>{initialData ? "Edit course" : "Add course"}</h3>
            <p>{initialData ? "Update the details for this course." : "Create a new course students can be assigned to."}</p>
          </div>
          <button type="button" className="form-panel-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="courseName">Course name</label>
            <input
              id="courseName"
              value={form.courseName}
              onChange={handleChange("courseName")}
              placeholder="MERN Stack Development"
            />
            {errors.courseName && <span className="field-error">{errors.courseName}</span>}
          </div>

          <div className="field">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              value={form.duration}
              onChange={handleChange("duration")}
              placeholder="e.g. 12 weeks"
            />
            {errors.duration && <span className="field-error">{errors.duration}</span>}
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={handleChange("description")}
              placeholder="What this course covers"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : initialData ? "Save changes" : "Create course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
