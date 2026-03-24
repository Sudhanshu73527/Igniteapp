import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import User from '../models/User.js';

const normalizeStudentResponse = (studentDoc, userDoc) => ({
   id: studentDoc._id,
   studentId: studentDoc.studentId || '',
   userId: userDoc?._id || studentDoc.user,
   firstName: userDoc?.firstName || studentDoc.firstName || '',
   lastName: userDoc?.lastName || studentDoc.lastName || '',
   email: userDoc?.email || studentDoc.email || '',
   age: userDoc?.age,
   role: userDoc?.role || 'student',
   rollNumber: studentDoc.rollNumber || '',
   fatherName: studentDoc.fatherName || '',
   institutionName: studentDoc.institutionName || '',
   institutionAddress: studentDoc.institutionAddress || '',
   passingYear: studentDoc.passingYear || '',
   phone: studentDoc.phone || '',
   address: studentDoc.address || '',
   dob: studentDoc.dob || '',
   degree: studentDoc.degree || '',
   major: studentDoc.major || '',
   grade: studentDoc.grade || '',
   course: studentDoc.course || '',
   createdAt: studentDoc.createdAt,
   updatedAt: studentDoc.updatedAt,
});

const normalizeUserOnlyStudentResponse = (userDoc) => ({
   id: userDoc._id,
   studentId: '',
   userId: userDoc._id,
   firstName: userDoc.firstName || '',
   lastName: userDoc.lastName || '',
   email: userDoc.email || '',
   age: userDoc.age,
   role: userDoc.role || 'student',
   rollNumber: '',
   fatherName: '',
   institutionName: '',
   institutionAddress: '',
   passingYear: '',
   phone: '',
   address: '',
   dob: '',
   degree: '',
   major: '',
   grade: '',
   course: '',
   createdAt: userDoc.createdAt,
   updatedAt: userDoc.updatedAt,
});

export const createStudent = async (req, res) => {
   try {
      const {
         firstName,
         lastName,
         email,
         password,
         age,
         rollNumber,
         fatherName,
         institutionName,
         institutionAddress,
         passingYear,
         phone,
         address,
         dob,
         degree,
         major,
         grade,
         course,
         username,
         studentId,
      } = req.body;

      if (!firstName || !lastName || !email || !password || age === undefined) {
         return res.status(400).json({
            success: false,
            message:
               'firstName, lastName, email, password and age are required',
            data: {},
         });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: 'Email already exists',
            data: {},
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const generatedStudentId =
         studentId ||
         `IGN-${Date.now().toString().slice(-6)}-${Math.floor(
            100 + Math.random() * 900,
         )}`;

      const existingStudentId = await Student.findOne({
         studentId: generatedStudentId,
      });
      if (existingStudentId) {
         return res.status(400).json({
            success: false,
            message: 'studentId already exists',
            data: {},
         });
      }

      const user = await User.create({
         firstName,
         lastName,
         email: normalizedEmail,
         password: hashedPassword,
         age,
         role: 'student',
      });

      const student = await Student.create({
         user: user._id,
         studentId: generatedStudentId,
         username: username || normalizedEmail.split('@')[0],
         email: normalizedEmail,
         firstName,
         lastName,
         rollNumber,
         fatherName,
         institutionName,
         institutionAddress,
         passingYear,
         phone,
         address,
         dob,
         degree,
         major,
         grade,
         course,
      });

      return res.status(201).json({
         success: true,
         message: 'Student created successfully',
         data: {
            student: normalizeStudentResponse(student, user),
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error creating student',
         data: {},
      });
   }
};

export const getStudents = async (req, res) => {
   try {
      const students = await Student.find().populate(
         'user',
         'firstName lastName email age role createdAt updatedAt',
      );

      const studentUserIds = new Set(
         students
            .filter((student) => student?.user?._id)
            .map((student) => String(student.user._id)),
      );

      const usersWithoutStudentProfile = await User.find({
         role: 'student',
         _id: {
            $nin: Array.from(studentUserIds),
         },
      }).select('firstName lastName email age role createdAt updatedAt');

      const mappedStudents = students.map((student) =>
         normalizeStudentResponse(student, student.user),
      );

      const mappedUsers = usersWithoutStudentProfile.map(
         normalizeUserOnlyStudentResponse,
      );

      const data = [...mappedStudents, ...mappedUsers].sort(
         (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      return res.json({
         success: true,
         message: 'Students fetched successfully',
         data: {
            students: data,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching students',
         data: {},
      });
   }
};

export const getSingleStudent = async (req, res) => {
   try {
      const { id } = req.params;

      let student = await Student.findById(id).populate(
         'user',
         'firstName lastName email age role createdAt updatedAt',
      );

      if (!student) {
         student = await Student.findOne({ user: id }).populate(
            'user',
            'firstName lastName email age role createdAt updatedAt',
         );
      }

      if (!student) {
         const user = await User.findOne({ _id: id, role: 'student' }).select(
            'firstName lastName email age role createdAt updatedAt',
         );

         if (user) {
            return res.json({
               success: true,
               message: 'Student fetched successfully',
               data: {
                  student: normalizeUserOnlyStudentResponse(user),
               },
            });
         }
      }

      if (!student) {
         return res.status(404).json({
            success: false,
            message: 'Student not found',
            data: {},
         });
      }

      return res.json({
         success: true,
         message: 'Student fetched successfully',
         data: {
            student: normalizeStudentResponse(student, student.user),
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error fetching student',
         data: {},
      });
   }
};

export const updateStudent = async (req, res) => {
   try {
      const { id } = req.params;
      let student = await Student.findById(id);

      const {
         firstName,
         lastName,
         email,
         age,
         rollNumber,
         fatherName,
         institutionName,
         institutionAddress,
         passingYear,
         phone,
         address,
         dob,
         degree,
         major,
         grade,
         course,
         studentId,
      } = req.body;

      let user = null;

      if (student) {
         user = await User.findById(student.user);
      } else {
         user = await User.findOne({ _id: id, role: 'student' });

         if (user) {
            student = await Student.create({
               user: user._id,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName,
               studentId:
                  studentId ||
                  `IGN-${Date.now().toString().slice(-6)}-${Math.floor(
                     100 + Math.random() * 900,
                  )}`,
            });
         }
      }

      if (!student) {
         return res.status(404).json({
            success: false,
            message: 'Student not found',
            data: {},
         });
      }

      if (!user && student.user) {
         user = await User.findById(student.user);
      }

      if (user) {
         const normalizedIncomingEmail = email
            ? String(email).trim().toLowerCase()
            : null;
         const normalizedCurrentEmail = user.email
            ? String(user.email).trim().toLowerCase()
            : '';

         if (
            normalizedIncomingEmail &&
            normalizedIncomingEmail !== normalizedCurrentEmail
         ) {
            const existingEmail = await User.findOne({
               email: normalizedIncomingEmail,
               _id: { $ne: user._id },
            });

            if (existingEmail) {
               return res.status(400).json({
                  success: false,
                  message: 'Email already exists',
                  data: {},
               });
            }
            user.email = normalizedIncomingEmail;
            student.email = user.email;
         }

         if (firstName !== undefined) user.firstName = firstName;
         if (lastName !== undefined) user.lastName = lastName;
         if (age !== undefined) user.age = age;
         await user.save();
      }

      if (studentId !== undefined) {
         const existingStudentId = await Student.findOne({
            studentId,
            _id: { $ne: student._id },
         });

         if (existingStudentId) {
            return res.status(400).json({
               success: false,
               message: 'studentId already exists',
               data: {},
            });
         }

         student.studentId = studentId;
      }

      if (rollNumber !== undefined) student.rollNumber = rollNumber;
      if (fatherName !== undefined) student.fatherName = fatherName;
      if (institutionName !== undefined)
         student.institutionName = institutionName;
      if (institutionAddress !== undefined)
         student.institutionAddress = institutionAddress;
      if (passingYear !== undefined) student.passingYear = passingYear;
      if (phone !== undefined) student.phone = phone;
      if (address !== undefined) student.address = address;
      if (dob !== undefined) student.dob = dob;
      if (degree !== undefined) student.degree = degree;
      if (major !== undefined) student.major = major;
      if (grade !== undefined) student.grade = grade;
      if (course !== undefined) student.course = course;
      if (firstName !== undefined) student.firstName = firstName;
      if (lastName !== undefined) student.lastName = lastName;

      await student.save();

      return res.json({
         success: true,
         message: 'Student updated successfully',
         data: {
            student: normalizeStudentResponse(student, user),
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error updating student',
         data: {},
      });
   }
};

export const deleteStudent = async (req, res) => {
   try {
      const { id } = req.params;

      let student = await Student.findById(id);

      if (!student) {
         student = await Student.findOne({ user: id });
      }

      if (student) {
         if (student.user) {
            await User.findByIdAndDelete(student.user);
         }
         await Student.findByIdAndDelete(student._id);
      } else {
         const user = await User.findOne({ _id: id, role: 'student' });
         if (!user) {
            return res.status(404).json({
               success: false,
               message: 'Student not found',
               data: {},
            });
         }

         await User.findByIdAndDelete(user._id);
      }

      return res.json({
         success: true,
         message: 'Student deleted successfully',
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: 'Error deleting student',
         data: {},
      });
   }
};
