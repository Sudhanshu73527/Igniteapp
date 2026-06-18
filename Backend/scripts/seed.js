/**
 * Seed Script — Creates demo data for the Ignite LMS
 *
 * Usage:  node scripts/seed.js
 *
 * Creates:
 *   • 1 Admin user   (ignitefiresafety.in@gmail.com / 1+OH4d(oOrg9V5)
 *   • 1 Student user  (student@ignite.com / Student@123)
 *   • 8 Courses with fire-safety / industrial-safety themes
 *   • 2 Notices
 *   • 2 Sample quizzes with questions
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// ── Models ─────────────────────────────────────────────────────────
import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Notice from '../models/Notice.js';
import Quiz from '../models/Quiz.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
   console.error('❌  MONGO_URI is not set in .env');
   process.exit(1);
}

// ── Seed Data ──────────────────────────────────────────────────────

const adminUser = {
   firstName: 'Ignite',
   lastName: 'Admin',
   email: 'ignitefiresafety.in@gmail.com',
   password: '1+OH4d(oOrg9V5',
   age: 30,
   role: 'admin',
};

const studentUser = {
   firstName: 'Rahul',
   lastName: 'Sharma',
   email: 'student@ignite.com',
   password: 'Student@123',
   age: 22,
   role: 'student',
};

const courses = [
   {
      title: 'Fire Safety Fundamentals',
      description:
         'Learn the core principles of fire safety including the fire triangle, classes of fire, fire behavior, and basic prevention strategies. Essential knowledge for anyone working in industrial or commercial environments.',
      imageUrl: 'https://img.youtube.com/vi/LnhSTZgzKuY/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/LnhSTZgzKuY?rel=0&modestbranding=1',
      price: 2999,
      duration: '4 weeks',
   },
   {
      title: 'Industrial Fire Protection Systems',
      description:
         'Comprehensive course covering sprinkler systems, fire alarms, smoke detectors, fire suppression systems, and emergency evacuation planning for industrial facilities.',
      imageUrl: 'https://img.youtube.com/vi/8UVUnUnWfHI/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/8UVUnUnWfHI?rel=0&modestbranding=1',
      price: 4999,
      duration: '6 weeks',
   },
   {
      title: 'Fire Extinguisher Training',
      description:
         'Hands-on training on different types of fire extinguishers (ABC, CO2, Foam, Water), their applications, PASS technique, and maintenance requirements.',
      imageUrl: 'https://img.youtube.com/vi/gweUVhPetfQ/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/gweUVhPetfQ?rel=0&modestbranding=1',
      price: 1999,
      duration: '2 weeks',
   },
   {
      title: 'Electrical Safety & Fire Prevention',
      description:
         'Understanding electrical hazards, proper wiring practices, circuit protection, grounding, and how to prevent electrical fires in workplace environments.',
      imageUrl: 'https://img.youtube.com/vi/dcrY59nGSKk/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/dcrY59nGSKk?rel=0&modestbranding=1',
      price: 3499,
      duration: '5 weeks',
   },
   {
      title: 'Emergency Response & Evacuation',
      description:
         'Develop skills in emergency response planning, evacuation procedures, assembly point management, fire drill coordination, and crisis communication.',
      imageUrl: 'https://img.youtube.com/vi/CAew-ONyBqQ/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/CAew-ONyBqQ?rel=0&modestbranding=1',
      price: 2499,
      duration: '3 weeks',
   },
   {
      title: 'Hazardous Materials (HAZMAT) Safety',
      description:
         'Learn to identify, handle, store, and dispose of hazardous materials safely. Covers MSDS reading, PPE selection, spill response, and regulatory compliance.',
      imageUrl: 'https://img.youtube.com/vi/wkIpbMPpnfk/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/wkIpbMPpnfk?rel=0&modestbranding=1',
      price: 5499,
      duration: '8 weeks',
   },
   {
      title: 'First Aid & CPR Certification',
      description:
         'Essential first aid techniques, CPR procedures, AED usage, wound management, burn treatment, and emergency medical response in workplace settings.',
      imageUrl: 'https://img.youtube.com/vi/hizBdM1Ob68/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/hizBdM1Ob68?rel=0&modestbranding=1',
      price: 1499,
      duration: '2 weeks',
   },
   {
      title: 'Workplace Safety & OSHA Compliance',
      description:
         'Comprehensive guide to workplace safety regulations, OSHA standards, safety audits, risk assessment, incident reporting, and creating a safety culture.',
      imageUrl: 'https://img.youtube.com/vi/WFl0JBb-1cE/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/WFl0JBb-1cE?rel=0&modestbranding=1',
      price: 3999,
      duration: '6 weeks',
   },
];

const notices = [
   {
      title: 'Welcome to Ignite Fire Safety Academy',
      description:
         'We are thrilled to welcome all students to the Ignite Fire Safety Academy platform! Explore our courses, prepare for certifications, and build a rewarding career in fire safety. For any queries, raise a support ticket from the app.',
   },
   {
      title: 'New Batch Starting — July 2026',
      description:
         'Registrations are now open for the July 2026 batch. Enroll in any course before June 30 to avail an early-bird discount of 15%. Limited seats available!',
   },
];

// ── Quizzes (will be linked to courses after creation) ─────────────
const quizTemplates = [
   {
      title: 'Fire Safety Basics Quiz',
      courseIndex: 0,
      timeLimit: 15,
      passingScore: 60,
      questions: [
         {
            question: 'What are the three elements of the fire triangle?',
            options: [
               'Heat, Fuel, Oxygen',
               'Water, Fire, Air',
               'Smoke, Heat, Light',
               'Carbon, Hydrogen, Nitrogen',
            ],
            correctAnswer: 0,
         },
         {
            question:
               'Which class of fire involves flammable liquids?',
            options: ['Class A', 'Class B', 'Class C', 'Class D'],
            correctAnswer: 1,
         },
         {
            question: 'What does the "P" stand for in the PASS technique?',
            options: ['Push', 'Pull', 'Press', 'Point'],
            correctAnswer: 1,
         },
         {
            question:
               'What type of extinguisher is used for electrical fires?',
            options: ['Water', 'Foam', 'CO2', 'Wet Chemical'],
            correctAnswer: 2,
         },
         {
            question: 'Which gas is most commonly produced during a fire?',
            options: ['Nitrogen', 'Carbon Monoxide', 'Helium', 'Argon'],
            correctAnswer: 1,
         },
      ],
   },
   {
      title: 'Extinguisher Types Assessment',
      courseIndex: 2,
      timeLimit: 10,
      passingScore: 50,
      questions: [
         {
            question: 'ABC type extinguisher uses which agent?',
            options: [
               'Dry Chemical Powder',
               'Water',
               'Carbon Dioxide',
               'Halon',
            ],
            correctAnswer: 0,
         },
         {
            question: 'Which extinguisher should NOT be used on liquid fires?',
            options: ['Foam', 'CO2', 'Water', 'Dry Powder'],
            correctAnswer: 2,
         },
         {
            question:
               'What is the maximum distance from which you should start using an extinguisher?',
            options: ['2 feet', '6-8 feet', '15 feet', '20 feet'],
            correctAnswer: 1,
         },
         {
            question: 'How often should fire extinguishers be inspected?',
            options: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
            correctAnswer: 2,
         },
      ],
   },
];

// ── Main Seed Function ─────────────────────────────────────────────

async function seed() {
   try {
      console.log('🔌  Connecting to MongoDB...');
      await mongoose.connect(MONGO_URI);
      console.log('✅  Connected to MongoDB\n');

      // ── Admin ──────────────────────────────────────────────────
      let admin = await User.findOne({ email: adminUser.email });
      if (!admin) {
         const hashedPw = await bcrypt.hash(adminUser.password, 10);
         admin = await User.create({ ...adminUser, password: hashedPw });
         console.log(`👤  Admin created: ${admin.email}`);
      } else {
         console.log(`👤  Admin already exists: ${admin.email}`);
      }

      // ── Student ────────────────────────────────────────────────
      let student = await User.findOne({ email: studentUser.email });
      if (!student) {
         const hashedPw = await bcrypt.hash(studentUser.password, 10);
         student = await User.create({ ...studentUser, password: hashedPw });

         await Student.create({
            user: student._id,
            email: studentUser.email,
            firstName: studentUser.firstName,
            lastName: studentUser.lastName,
            studentId: `IGN-${Date.now().toString().slice(-6)}-${Math.floor(
               100 + Math.random() * 900,
            )}`,
         });
         console.log(`🎓  Student created: ${student.email}`);
      } else {
         console.log(`🎓  Student already exists: ${student.email}`);
      }

      // ── Courses ────────────────────────────────────────────────
      const existingCourseCount = await Course.countDocuments();
      let createdCourses = [];
      if (existingCourseCount >= courses.length) {
         console.log(`📚  Courses already seeded (${existingCourseCount} found)`);
         createdCourses = await Course.find().sort({ createdAt: 1 });
      } else {
         // Remove old courses and re-seed
         if (existingCourseCount > 0) {
            await Course.deleteMany({});
            console.log('🗑️   Cleared old courses');
         }
         createdCourses = await Course.insertMany(courses);
         console.log(`📚  ${createdCourses.length} courses created`);
      }

      // ── Notices ────────────────────────────────────────────────
      const existingNoticeCount = await Notice.countDocuments();
      if (existingNoticeCount === 0) {
         await Notice.insertMany(notices);
         console.log(`📢  ${notices.length} notices created`);
      } else {
         console.log(`📢  Notices already seeded (${existingNoticeCount} found)`);
      }

      // ── Quizzes ────────────────────────────────────────────────
      const existingQuizCount = await Quiz.countDocuments();
      if (existingQuizCount === 0) {
         for (const template of quizTemplates) {
            const linkedCourse = createdCourses[template.courseIndex];
            if (!linkedCourse) {
               console.warn(
                  `⚠️   Skipping quiz "${template.title}" — course index ${template.courseIndex} not found`,
               );
               continue;
            }

            await Quiz.create({
               title: template.title,
               course: linkedCourse._id,
               questions: template.questions,
               timeLimit: template.timeLimit,
               passingScore: template.passingScore,
            });
            console.log(`📝  Quiz created: "${template.title}" → ${linkedCourse.title}`);
         }
      } else {
         console.log(`📝  Quizzes already seeded (${existingQuizCount} found)`);
      }

      console.log('\n🎉  Seed complete!\n');
      console.log('─────────────────────────────────────────────');
      console.log('  Admin Login:');
      console.log(`    Email:    ${adminUser.email}`);
      console.log(`    Password: ${adminUser.password}`);
      console.log('');
      console.log('  Student Login:');
      console.log(`    Email:    ${studentUser.email}`);
      console.log(`    Password: ${studentUser.password}`);
      console.log('─────────────────────────────────────────────\n');
   } catch (error) {
      console.error('❌  Seed failed:', error.message);
   } finally {
      await mongoose.disconnect();
      console.log('🔌  Disconnected from MongoDB');
      process.exit(0);
   }
}

seed();
