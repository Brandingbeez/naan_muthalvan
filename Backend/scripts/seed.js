const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../src/models/AdminUser');
const Center = require('../src/models/Center');
const Course = require('../src/models/Course');
const Subject = require('../src/models/Subject');
const Session = require('../src/models/Session');
const Resource = require('../src/models/Resource');
const { MONGODB_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = require('../src/config/env');

const seed = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.log('Seeding only in development');
    return;
  }

  await mongoose.connect(MONGODB_URI);

  // Seed admin
  const hashed = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
  await AdminUser.findOneAndUpdate(
    { email: SEED_ADMIN_EMAIL },
    { email: SEED_ADMIN_EMAIL, passwordHash: hashed },
    { upsert: true }
  );

  // Seed sample data
  const center = await Center.findOneAndUpdate(
    { name: 'Sample Center' },
    { name: 'Sample Center', description: 'A sample center', isActive: true },
    { upsert: true, new: true }
  );

  const course = await Course.findOneAndUpdate(
    { courseCode: 'SAMPLE101' },
    {
      centerId: center._id,
      title: 'Sample Course',
      description: 'A sample course',
      courseCode: 'SAMPLE101',
      courseCodeLower: 'sample101',
      isPublished: true,
      objectives: [{ objective: 'Learn basics' }],
    },
    { upsert: true, new: true }
  );

  const subject = await Subject.findOneAndUpdate(
    { title: 'Sample Subject', courseId: course._id },
    { courseId: course._id, title: 'Sample Subject', content: 'Subject content' },
    { upsert: true, new: true }
  );

  const session = await Session.findOneAndUpdate(
    { title: 'Sample Session', subjectId: subject._id },
    { subjectId: subject._id, title: 'Sample Session', description: 'Session desc', sessionNumber: 1 },
    { upsert: true, new: true }
  );

  await Resource.findOneAndUpdate(
    { title: 'Sample Resource', sessionId: session._id },
    { sessionId: session._id, title: 'Sample Resource', type: 'youtube', url: 'https://youtube.com/watch?v=123' },
    { upsert: true, new: true }
  );

  console.log('Seeded successfully');
  process.exit(0);
};

seed().catch(console.error);