import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lecture from '../models/Lecture.js';
import User from '../models/User.js';

const extractYouTubeId = (value = '') => {
   const input = String(value).trim();
   if (!input) return '';

   try {
      const url = new URL(input);
      const host = url.hostname.toLowerCase();

      if (host === 'youtu.be') {
         return url.pathname.replace('/', '').trim();
      }

      if (
         host.includes('youtube.com') ||
         host.includes('youtube-nocookie.com')
      ) {
         if (url.searchParams.get('v')) {
            return String(url.searchParams.get('v')).trim();
         }

         const parts = url.pathname.split('/').filter(Boolean);
         const embedIndex = parts.findIndex((part) => part === 'embed');
         if (embedIndex !== -1 && parts[embedIndex + 1]) {
            return parts[embedIndex + 1].trim();
         }

         const shortsIndex = parts.findIndex((part) => part === 'shorts');
         if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
            return parts[shortsIndex + 1].trim();
         }

         const liveIndex = parts.findIndex((part) => part === 'live');
         if (liveIndex !== -1 && parts[liveIndex + 1]) {
            return parts[liveIndex + 1].trim();
         }
      }
   } catch (_error) {
      // fallback to regex parsing below
   }

   const fallback = input.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
   );
   return fallback?.[1] ? String(fallback[1]).trim() : '';
};

const toYoutubeEmbedUrl = (value = '') => {
   const input = String(value).trim();
   if (!input) return '';
   if (input.includes('/embed/')) return input;

   const videoId = extractYouTubeId(input);
   if (!videoId) return input;
   return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
};

const toYoutubeThumbnailUrl = (value = '') => {
   const videoId = extractYouTubeId(value);
   if (!videoId) return '';
   return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const hasStudentCourseAccess = async (userId, courseId) => {
   const [enrollment, user] = await Promise.all([
      Enrollment.findOne({
         user: userId,
         course: courseId,
         paymentStatus: 'paid',
      }),
      User.findById(userId).select('enrolledCourses'),
   ]);

   if (enrollment) return true;
   return Boolean(
      user?.enrolledCourses?.some((id) => id.toString() === String(courseId)),
   );
};

export const addCourse = async (req, res) => {
   try {
      const { title, description, price, duration, videoUrl, imageUrl } =
         req.body;

      const resolvedVideoUrl = toYoutubeEmbedUrl(videoUrl || '');
      const rawImageUrl = String(imageUrl || '').trim();
      const resolvedImageUrl =
         toYoutubeThumbnailUrl(rawImageUrl) ||
         rawImageUrl ||
         toYoutubeThumbnailUrl(resolvedVideoUrl);

      if (
         !title ||
         !description ||
         price === undefined ||
         !duration ||
         !String(resolvedImageUrl || '').trim()
      ) {
         return res.status(400).json({
            success: false,
            message:
               'title, description, imageUrl, price and duration are required',
            data: {},
         });
      }

      const course = await Course.create({
         title,
         description,
         price,
         duration,
         imageUrl: String(resolvedImageUrl).trim(),
         videoUrl: resolvedVideoUrl,
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

export const getCourseDetail = async (req, res) => {
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

      const lectures = await Lecture.find({ course: course._id }).sort({
         order: 1,
         createdAt: 1,
      });

      let hasAccess = req.user?.role === 'admin';
      if (!hasAccess && req.user?.role === 'student') {
         hasAccess = await hasStudentCourseAccess(req.user._id, course._id);
      }

      const safeLectures = lectures.map((lecture) => {
         if (hasAccess || lecture.isPreview) return lecture;

         return {
            _id: lecture._id,
            course: lecture.course,
            title: lecture.title,
            description: lecture.description,
            order: lecture.order,
            duration: lecture.duration,
            isPreview: lecture.isPreview,
            locked: true,
         };
      });

      return res.json({
         success: true,
         message: 'Course detail fetched successfully',
         data: {
            course,
            hasAccess,
            lectures: safeLectures,
         },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching course detail',
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
      } else {
         updatePayload.videoUrl = toYoutubeEmbedUrl(updatePayload.videoUrl);
      }
      if (updatePayload.imageUrl === undefined) {
         delete updatePayload.imageUrl;
      } else {
         const resolvedImageFromField =
            toYoutubeThumbnailUrl(updatePayload.imageUrl) ||
            String(updatePayload.imageUrl).trim();
         updatePayload.imageUrl = resolvedImageFromField;
      }

      if (!updatePayload.imageUrl && updatePayload.videoUrl) {
         const fallbackThumb = toYoutubeThumbnailUrl(updatePayload.videoUrl);
         if (fallbackThumb) {
            updatePayload.imageUrl = fallbackThumb;
         }
      }

      const updated = await Course.findByIdAndUpdate(id, updatePayload, {
         returnDocument: 'after',
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
   return res.status(403).json({
      success: false,
      message:
         'Direct enrollment is disabled. Complete payment verification first.',
      data: {},
   });
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
