/**
 * seed.js – populates the DB with demo users, routes, books and fee records
 * Run: node utils/seed.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');


// ── Models ────────────────────────────────────────────────────────────────────
const User = require('../models/User');
const { TransportRoute } = require('../models/Transport');
const { Book } = require('../models/Library');
const Fee = require('../models/Fees');

// ── DB Connection ─────────────────────────────────────────────────────────────
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/schoolerp';
  await mongoose.connect(uri);
  console.log(`\n✅  Connected to MongoDB: ${uri}\n`);
};

// ── Seed Users ────────────────────────────────────────────────────────────────
const seedUsers = async () => {
  await User.deleteMany({});
  console.log('🗑️  Cleared User collection');

  const usersData = [
    {
      name: 'Alice Johnson',
      loginId: 'STU001',
      role: 'student',
      department: 'Computer Science',
      mustChangePassword: false,
      isActive: true,
      password: 'STU001',
    },
    {
      name: 'Bob Smith',
      loginId: 'TCH001',
      role: 'teacher',
      department: 'Computer Science',
      mustChangePassword: false,
      isActive: true,
      password: 'TCH001',
    },
    {
      name: 'Dr. Carol White',
      loginId: 'PRN001',
      role: 'principal',
      department: 'Administration',
      mustChangePassword: false,
      isActive: true,
      password: 'PRN001',
    },
    {
      name: 'David Admin',
      loginId: 'ADM001',
      role: 'admin',
      department: 'Administration',
      mustChangePassword: false,
      isActive: true,
      password: 'ADM001',
    },
    {
      name: 'Eva Coordinator',
      loginId: 'CRD001',
      role: 'coordinator',
      department: 'Academic',
      mustChangePassword: false,
      isActive: true,
      password: 'CRD001',
    },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    // Pass plain password — the User model pre-save hook will hash it
    const user = await User.create(userData);
    createdUsers.push(user);
    console.log(`👤  Created user: ${user.loginId} / ${userData.password}  (${user.role})`);
  }

  return createdUsers;
};

// ── Seed Transport Routes ─────────────────────────────────────────────────────
const seedRoutes = async () => {
  await TransportRoute.deleteMany({});
  console.log('\n🗑️  Cleared TransportRoute collection');

  const routes = [
    {
      routeNumber: 'R001',
      routeName: 'North Campus Route',
      busNumber: 'MH12AB1234',
      stops: [
        { name: 'Market Square', time: '07:30' },
        { name: 'Green Park', time: '07:45' },
        { name: 'North Colony', time: '08:00' },
      ],
      driverName: 'Rajesh Kumar',
      driverPhone: '9876543210',
      isActive: true,
    },
    {
      routeNumber: 'R002',
      routeName: 'South Campus Route',
      busNumber: 'MH12CD5678',
      stops: [
        { name: 'Bus Stand', time: '07:20' },
        { name: 'City Centre', time: '07:35' },
        { name: 'South Extension', time: '07:55' },
      ],
      driverName: 'Suresh Yadav',
      driverPhone: '9876501234',
      isActive: true,
    },
    {
      routeNumber: 'R003',
      routeName: 'East Campus Route',
      busNumber: 'MH12EF9012',
      stops: [
        { name: 'Railway Station', time: '07:15' },
        { name: 'Sector 5', time: '07:30' },
        { name: 'East Suburb', time: '07:50' },
      ],
      driverName: 'Mohan Lal',
      driverPhone: '9123456789',
      isActive: true,
    },
    {
      routeNumber: 'R004',
      routeName: 'West Campus Route',
      busNumber: 'MH12GH3456',
      stops: [
        { name: 'Airport Road', time: '07:25' },
        { name: 'Industrial Area', time: '07:40' },
        { name: 'West Town', time: '08:00' },
      ],
      driverName: 'Deepak Singh',
      driverPhone: '9000011111',
      isActive: true,
    },
    {
      routeNumber: 'R005',
      routeName: 'Central Route',
      busNumber: 'MH12IJ7890',
      stops: [
        { name: 'Clock Tower', time: '07:10' },
        { name: 'Gandhi Chowk', time: '07:25' },
        { name: 'Central Bazaar', time: '07:45' },
      ],
      driverName: 'Amit Verma',
      driverPhone: '9988776655',
      isActive: true,
    },
  ];

  for (const route of routes) {
    await TransportRoute.create(route);
    console.log(`🚌  Created route: ${route.routeNumber} – ${route.routeName}`);
  }
};

// ── Seed Books ────────────────────────────────────────────────────────────────
const seedBooks = async () => {
  await Book.deleteMany({});
  console.log('\n🗑️  Cleared Book collection');

  const books = [
    { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '978-0-262-03384-8', category: 'Computer Science', totalCopies: 5, availableCopies: 5, publisher: 'MIT Press', publishedYear: 2022 },
    { title: 'Data Structures and Algorithms', author: 'Mark Allen Weiss', isbn: '978-0-13-284737-7', category: 'Computer Science', totalCopies: 4, availableCopies: 4, publisher: 'Pearson', publishedYear: 2020 },
    { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0-13-212695-3', category: 'Computer Science', totalCopies: 3, availableCopies: 3, publisher: 'Pearson', publishedYear: 2021 },
    { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1-118-06333-0', category: 'Computer Science', totalCopies: 6, availableCopies: 6, publisher: 'Wiley', publishedYear: 2021 },
    { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0-07-352332-3', category: 'Computer Science', totalCopies: 4, availableCopies: 4, publisher: 'McGraw Hill', publishedYear: 2019 },
    { title: 'Engineering Mathematics Vol I', author: 'H.K. Dass', isbn: '978-81-219-1669-2', category: 'Mathematics', totalCopies: 8, availableCopies: 8, publisher: 'S. Chand', publishedYear: 2020 },
    { title: 'Engineering Physics', author: 'S.K. Garg', isbn: '978-81-219-0079-0', category: 'Physics', totalCopies: 5, availableCopies: 5, publisher: 'S. Chand', publishedYear: 2019 },
    { title: 'Engineering Chemistry', author: 'Jain & Jain', isbn: '978-81-224-2856-9', category: 'Chemistry', totalCopies: 5, availableCopies: 5, publisher: 'Dhanpat Rai', publishedYear: 2020 },
    { title: 'English for Engineers', author: 'Sanjay Kumar', isbn: '978-0-19-806726-6', category: 'English', totalCopies: 7, availableCopies: 7, publisher: 'Oxford', publishedYear: 2018 },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '978-0-13-595705-9', category: 'Computer Science', totalCopies: 3, availableCopies: 3, publisher: 'Addison-Wesley', publishedYear: 2019 },
  ];

  for (const book of books) {
    await Book.create(book);
    console.log(`📚  Created book: "${book.title}" by ${book.author}`);
  }
};

// ── Seed Fees ─────────────────────────────────────────────────────────────────
const seedFees = async (users) => {
  await Fee.deleteMany({});
  console.log('\n🗑️  Cleared Fee collection');

  const student = users.find(u => u.role === 'student');
  if (!student) {
    console.log('⚠️  No student found to seed fees');
    return;
  }

  const fees = [
    {
      studentId: student._id,
      feeType: 'tuition',
      amount: 25000,
      dueDate: new Date('2024-07-31'),
      status: 'paid',
      paidAt: new Date('2024-07-15'),
      paymentMethod: 'netbanking',
      receiptNumber: 'REC-2024-0001',
      academicYear: '2024-25',
      semester: 1,
    },
    {
      studentId: student._id,
      feeType: 'library',
      amount: 1500,
      dueDate: new Date('2024-11-15'),
      status: 'pending',
      academicYear: '2024-25',
      semester: 1,
    },
    {
      studentId: student._id,
      feeType: 'hostel',
      amount: 8500,
      dueDate: new Date('2024-07-31'),
      status: 'overdue',
      academicYear: '2024-25',
      semester: 1,
    },
  ];

  for (const fee of fees) {
    await Fee.create(fee);
    console.log(`💰  Created fee: ${fee.feeType} – ₹${fee.amount} (${fee.status})`);
  }
};

// ── Main ──────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();

    const users = await seedUsers();
    await seedRoutes();
    await seedBooks();
    await seedFees(users);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  Seed complete! Demo credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Role        | Login ID | Password');
    console.log('  ------------|----------|----------');
    console.log('  Student     | STU001   | STU001');
    console.log('  Teacher     | TCH001   | TCH001');
    console.log('  Principal   | PRN001   | PRN001');
    console.log('  Admin       | ADM001   | ADM001');
    console.log('  Coordinator | CRD001   | CRD001');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
