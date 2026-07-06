const Course = require("../models/Course");
const Student = require("../models/Student");

// @route  GET /api/courses
const getCourses = async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// @route  GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

// @route  POST /api/courses
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: "Failed to create course", error: error.message });
  }
};

// @route  PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: "Failed to update course", error: error.message });
  }
};

// @route  DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const inUse = await Student.findOne({ course: req.params.id });

    if (inUse) {
      return res.status(400).json({
        message: "This course is assigned to one or more students and cannot be deleted",
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
