import Course from '../models/Course.js';
import User from '../models/User.js';

export const addCourse = async (req, res) => {
   try {
      const { title, description, price, duration, videoUrl } = req.body;

      if (!title || !description || price === undefined || !duration) {
         return res.status(400).json({
            success: false,
            message: 'title, description, price and duration are required',
            data: {},
         });
      }

      const course = await Course.create({
         title,
         description,
         price,
         duration,
         videoUrl: videoUrl || '',
      });

      return res.status(201).json({
         success: true,
         message: 'Course added successfully',
         data: { course },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error adding course',
         data: {},
      });
   }
};

export const getCourses = async (_req, res) => {
   try {
      const courses = await Course.find().sort({ createdAt: -1 });

      return res.json({
         success: true,
         message: 'Courses fetched successfully',
         data: {
            count: courses.length,
            courses,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching courses',
         data: {},
      });
   }
};

export const getCourseById = async (req, res) => {
   try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Course fetched successfully',
         data: { course },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching course',
         data: {},
      });
   }
};

export const updateCourse = async (req, res) => {
   try {
      const { id } = req.params;

      const updatePayload = {
         ...req.body,
      };

      if (updatePayload.videoUrl === undefined) {
         delete updatePayload.videoUrl;
      }

      const updated = await Course.findByIdAndUpdate(id, updatePayload, {
         new: true,
         runValidators: true,
      });

      if (!updated) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Course updated successfully',
         data: { course: updated },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating course',
         data: {},
      });
   }
};

export const deleteCourse = async (req, res) => {
   try {
      const { id } = req.params;

      const deleted = await Course.findByIdAndDelete(id);
      if (!deleted) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Course deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting course',
         data: {},
      });
   }
};

export const enrollCourse = async (req, res) => {
   try {
      const { courseId } = req.body;
      if (!courseId) {
         return res.status(400).json({
            success: false,
            message: 'courseId is required',
            data: {},
         });
      }

      const course = await Course.findById(courseId);
      if (!course) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            data: {},
         });
      }

      if (!user.enrolledCourses.some((id) => id.toString() === courseId)) {
         user.enrolledCourses.push(course._id);
         await user.save();
      }

      return res.json({
         success: true,
         message: 'Course enrollment successful',
         data: { course },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error enrolling course',
         data: {},
      });
   }
};

export const getMyCourses = async (req, res) => {
   try {
      const user = await User.findById(req.user._id).populate(
         'enrolledCourses',
      );
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'My courses fetched successfully',
         data: {
            courses: user.enrolledCourses,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching enrolled courses',
         data: {},
      });
   }
};
