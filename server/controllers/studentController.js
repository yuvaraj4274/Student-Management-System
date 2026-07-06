const Student = require("../models/Student");
const Course = require("../models/Course");

// @route  GET /api/students
// @desc   Returns students, optionally filtered by search query 
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter = {
        $or: [{ name: regex }, { studentId: regex }],
      };
    }

    let students = await Student.find(filter).populate("course", "courseName duration").sort({ createdAt: -1 });

    // Allow searching course name too, since course is a reference field
    if (search) {
      const regex = new RegExp(search, "i");
      const byCourseName = await Student.find()
        .populate("course", "courseName duration")
        .then((all) => all.filter((s) => s.course && regex.test(s.course.courseName)));

      const merged = [...students, ...byCourseName].filter(
        (student, index, arr) => arr.findIndex((item) => item._id.toString() === student._id.toString()) === index
      );
      students = merged;
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// @route  GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("course", "courseName duration description");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student", error: error.message });
  }
};

// @route  POST /api/students
const createStudent = async (req, res) => {
  try {
    const existing = await Student.findOne({ studentId: req.body.studentId });

    if (existing) {
      return res.status(400).json({ message: "A student with this Student ID already exists" });
    }

    if (req.body.course) {
      const courseExists = await Course.findById(req.body.course);
      if (!courseExists) {
        return res.status(400).json({ message: "Selected course does not exist" });
      }
    }

    const student = await Student.create(req.body);
    const populated = await student.populate("course", "courseName duration");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Failed to create student", error: error.message });
  }
};

// @route  PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("course", "courseName duration");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: "Failed to update student", error: error.message });
  }
};

// @route  DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
