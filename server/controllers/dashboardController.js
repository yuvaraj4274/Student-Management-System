const Student = require("../models/Student");
const Course = require("../models/Course");

// @route  GET /api/dashboard/stats
// @desc   Returns counts shown on dashboard cards
const getStats = async (_req, res) => {
  try {
    const [totalStudents, totalCourses, activeStudents] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Student.countDocuments({ status: "Active" }),
    ]);

    res.status(200).json({ totalStudents, totalCourses, activeStudents });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { getStats };
