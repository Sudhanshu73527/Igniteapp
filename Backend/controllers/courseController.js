import Course from "../models/Course.js";

// ✅ ADD COURSE
export const addCourse = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      duration,
    });

    res.status(201).json({
      message: "Course Added Successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.json({
      count: courses.length,
      courses,
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Course Updated Successfully",
      course: updated,
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// ✅ DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await Course.findByIdAndDelete(id);

    res.json({
      message: "Course Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};