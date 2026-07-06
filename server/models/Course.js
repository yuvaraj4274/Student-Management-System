const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
