import { useEffect, useState } from "react";

const emptyForm = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  address: "",
  course: "",
  status: "Active",
};

export default function StudentForm({ open, initialData, courses, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          ...initialData,
          dob: initialData.dob ? initialData.dob.substring(0, 10) : "",
          course: initialData.course?._id || "",
        });
      } else {
        setForm(emptyForm);
      }
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
    if (!form.studentId.trim()) nextErrors.studentId = "Student ID is required";
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.gender) nextErrors.gender = "Gender is required";
    if (!form.dob) nextErrors.dob = "Date of birth is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { ...form, course: form.course || null };
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not save this student.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-panel-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-panel">
        <div className="form-panel-header">
          <div>
            <h3>{initialData ? "Edit student" : "Add student"}</h3>
            <p>{initialData ? "Update this student's information." : "Fill in the details to create a new student record."}</p>
          </div>
          <button type="button" className="form-panel-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="studentId">Student ID</label>
              <input id="studentId" value={form.studentId} onChange={handleChange("studentId")} placeholder="STU-1001" />
              {errors.studentId && <span className="field-error">{errors.studentId}</span>}
            </div>

            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={handleChange("name")} placeholder="John Doe" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={handleChange("email")} placeholder="john@example.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" value={form.phone} onChange={handleChange("phone")} placeholder="+91 98765 43210" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" value={form.gender} onChange={handleChange("gender")}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="field-error">{errors.gender}</span>}
            </div>

            <div className="field">
              <label htmlFor="dob">Date of birth</label>
              <input id="dob" type="date" value={form.dob} onChange={handleChange("dob")} />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>

            <div className="field field-full">
              <label htmlFor="address">Address</label>
              <textarea id="address" rows={2} value={form.address} onChange={handleChange("address")} placeholder="Street, city, state" />
            </div>

            <div className="field">
              <label htmlFor="course">Course</label>
              <select id="course" value={form.course} onChange={handleChange("course")}>
                <option value="">No course assigned</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={handleChange("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : initialData ? "Save changes" : "Create student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
