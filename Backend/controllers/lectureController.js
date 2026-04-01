import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lecture from '../models/Lecture.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const youtubeEmbedFromInput = (value = '') => {
   const input = String(value).trim();
   if (!input) return '';

   if (input.includes('/embed/')) return input;

   try {
      const url = new URL(input);
      const host = url.hostname.toLowerCase();

      let videoId = '';
      if (host === 'youtu.be') {
         videoId = url.pathname.replace('/', '').trim();
      } else if (
         host.includes('youtube.com') ||
         host.includes('youtube-nocookie.com')
      ) {
         videoId = String(url.searchParams.get('v') || '').trim();

         if (!videoId) {
            const parts = url.pathname.split('/').filter(Boolean);
            const embedIndex = parts.findIndex((part) => part === 'embed');
            if (embedIndex !== -1 && parts[embedIndex + 1]) {
               videoId = parts[embedIndex + 1].trim();
            }

            const shortsIndex = parts.findIndex((part) => part === 'shorts');
            if (!videoId && shortsIndex !== -1 && parts[shortsIndex + 1]) {
               videoId = parts[shortsIndex + 1].trim();
            }

            const liveIndex = parts.findIndex((part) => part === 'live');
            if (!videoId && liveIndex !== -1 && parts[liveIndex + 1]) {
               videoId = parts[liveIndex + 1].trim();
            }
         }
      }

      if (videoId) {
         return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
   } catch (_error) {
      // fallback regex below
   }

   const fallback = input.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
   );

   if (fallback?.[1]) {
      return `https://www.youtube.com/embed/${fallback[1]}?rel=0&modestbranding=1`;
   }

   return input;
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

export const addLecturesBulk = async (req, res) => {
   try {
      const { courseId, lectures } = req.body;

      if (!courseId || !Array.isArray(lectures) || lectures.length === 0) {
         return res.status(400).json({
            success: false,
            message: 'courseId and lectures[] are required',
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

      const prepared = lectures.map((lecture, index) => ({
         course: course._id,
         title: String(lecture.title || '').trim() || `Lecture ${index + 1}`,
         description: String(lecture.description || '').trim(),
         videoUrl: youtubeEmbedFromInput(lecture.videoUrl),
         order: Number(lecture.order || index + 1),
         duration: String(lecture.duration || '').trim(),
         isPreview: Boolean(lecture.isPreview),
      }));

      if (prepared.some((lecture) => !lecture.videoUrl)) {
         return res.status(400).json({
            success: false,
            message: 'Each lecture requires a videoUrl',
            data: {},
         });
      }

      await Lecture.deleteMany({ course: course._id });
      const inserted = await Lecture.insertMany(prepared);
      await Course.findByIdAndUpdate(course._id, {
         lectures: inserted.map((lecture) => lecture._id),
      });

      return res.status(201).json({
         success: true,
         message: 'Lectures saved successfully',
         data: { lectures: inserted },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error saving lectures',
         data: {},
      });
   }
};

export const getLecturesByCourse = async (req, res) => {
   try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId);
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
         const normalizedUrl = youtubeEmbedFromInput(lecture.videoUrl);

         if (hasAccess || lecture.isPreview) {
            return {
               _id: lecture._id,
               id: lecture._id,
               course: lecture.course,
               title: lecture.title,
               description: lecture.description,
               order: lecture.order,
               duration: lecture.duration,
               videoUrl: normalizedUrl,
               isPreview: lecture.isPreview,
               locked: false,
               createdAt: lecture.createdAt,
            };
         }

         return {
            _id: lecture._id,
            id: lecture._id,
            course: lecture.course,
            title: lecture.title,
            description: lecture.description,
            order: lecture.order,
            duration: lecture.duration,
            videoUrl: '',
            isPreview: lecture.isPreview,
            locked: true,
            createdAt: lecture.createdAt,
         };
      });

      return res.json({
         success: true,
         message: 'Lectures fetched successfully',
         data: {
            course,
            hasAccess,
            lectures: safeLectures,
         },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching lectures',
         data: {},
      });
   }
};

export const markLectureWatched = async (req, res) => {
   try {
      const { lectureId } = req.params;

      const lecture = await Lecture.findById(lectureId);
      if (!lecture) {
         return res.status(404).json({
            success: false,
            message: 'Lecture not found',
            data: {},
         });
      }

      const hasAccess = await hasStudentCourseAccess(
         req.user._id,
         lecture.course,
      );
      if (!hasAccess && !lecture.isPreview) {
         return res.status(403).json({
            success: false,
            message: 'You do not have access to this lecture',
            data: {},
         });
      }

      const courseId = lecture.course;
      const course = await Course.findById(courseId).populate('lectures');

      let progress = await Progress.findOne({
         user: req.user._id,
         course: courseId,
      });

      if (!progress) {
         progress = new Progress({
            user: req.user._id,
            course: courseId,
            totalLectures: course.lectures.length,
            completedLectures: [],
         });
      }

      if (
         !progress.completedLectures.some(
            (id) => id.toString() === String(lectureId),
         )
      ) {
         progress.completedLectures.push(lectureId);
      }

      progress.lastWatchedLecture = lectureId;
      progress.lastWatchedAt = new Date();
      progress.progressPercentage = Math.round(
         (progress.completedLectures.length / (course.lectures.length || 1)) *
            100,
      );

      await progress.save();

      return res.json({
         success: true,
         message: 'Lecture marked as watched',
         data: {
            progress: {
               courseId: progress.course,
               completedCount: progress.completedLectures.length,
               totalCount: course.lectures.length,
               progressPercentage: progress.progressPercentage,
            },
         },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error marking lecture as watched',
         data: {},
      });
   }
};

export const getProgress = async (req, res) => {
   try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId).populate('lectures');
      if (!course) {
         return res.status(404).json({
            success: false,
            message: 'Course not found',
            data: {},
         });
      }

      let progress = await Progress.findOne({
         user: req.user._id,
         course: courseId,
      });

      if (!progress) {
         progress = new Progress({
            user: req.user._id,
            course: courseId,
            totalLectures: course.lectures.length,
            completedLectures: [],
            progressPercentage: 0,
         });
         await progress.save();
      }

      return res.json({
         success: true,
         message: 'Progress fetched successfully',
         data: {
            progress: {
               courseId: progress.course,
               completedCount: progress.completedLectures.length,
               totalCount: course.lectures.length,
               progressPercentage: progress.progressPercentage,
               lastWatchedLecture: progress.lastWatchedLecture,
               completedLectures: progress.completedLectures,
            },
         },
      });
   } catch (_error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching progress',
         data: {},
      });
   }
};
