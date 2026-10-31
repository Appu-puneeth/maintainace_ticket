import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

// Multer memory storage for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  storage: multer.memoryStorage(),
});

// In-Memory Database for CampusOS & FixIt System
let db = {
  institution: {
    domain: 'team29.com',
    name: 'National Institute of Engineering (NIE)',
  },
  admin: {
    role: 'admin',
    team_id: 'team29',
    institution_name: 'National Institute of Engineering',
    name: 'Chief Administrator',
    email_id: 'admin@team29.com',
    phone_number: '9876543200',
    otp: '004712',
  },
  users: [
    {
      role: 'student',
      name: 'Mahesh Sharma',
      usn: '1CF24CS042',
      dept: 'CSE',
      email_id: 'mahesh@team1.com',
      phone_number: '9876543210',
      otp: '123456',
      created_by: 'admin@team1.com',
      created_at: '2026-10-25T08:00:00Z',
      updated_at: '2026-10-25T08:00:00Z',
    },
    {
      role: 'student',
      name: 'Rahul Kumar',
      usn: '1CF24CS089',
      dept: 'ECE',
      email_id: 'rahul@team1.com',
      phone_number: '9876543211',
      otp: '123456',
      created_by: 'admin@team1.com',
      created_at: '2026-10-26T08:00:00Z',
      updated_at: '2026-10-26T08:00:00Z',
    },
    {
      role: 'student',
      name: 'Asha Kumar',
      usn: '1CF24CS001',
      dept: 'CSE',
      email_id: 'asha@team1.com',
      phone_number: '9876543212',
      otp: '730792',
      created_by: 'admin@team1.com',
      created_at: '2026-10-26T08:00:00Z',
      updated_at: '2026-10-26T08:00:00Z',
    },
    {
      role: 'office_staff',
      name: 'Kumar Gowda',
      dept: 'Campus Maintenance',
      designation: 'Supervisor',
      email_id: 'kumar@team1.com',
      phone_number: '9876543215',
      otp: '730792',
      created_by: 'admin@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      role: 'office_staff',
      name: 'Ravi Shetty',
      dept: 'Student Affairs',
      designation: 'Accountant',
      email_id: 'ravi@team1.com',
      phone_number: '9876543216',
      otp: '730792',
      created_by: 'admin@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      role: 'faculty',
      name: 'Dr. Meera Rao',
      designation: 'Professor',
      email_id: 'meera@team1.com',
      phone_number: '9876543218',
      otp: '730792',
      created_by: 'admin@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    }
  ],
  issueTypes: [
    {
      issue_type_id: 'ITY-101',
      name: 'Electrical',
      description: 'Fans, lights, switches, sockets, exposed wiring, breakers',
      created_by: 'kumar@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      issue_type_id: 'ITY-102',
      name: 'Plumbing',
      description: 'Taps, leaks, blocked drains, washrooms, pipeline burst',
      created_by: 'kumar@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      issue_type_id: 'ITY-103',
      name: 'Furniture',
      description: 'Broken benches, chairs, desks, doors, windows, whiteboards',
      created_by: 'kumar@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      issue_type_id: 'ITY-104',
      name: 'IT & Network',
      description: 'Wi-Fi access points, projectors, lab computers, podium mic',
      created_by: 'kumar@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    },
    {
      issue_type_id: 'ITY-105',
      name: 'Cleaning & Sanitation',
      description: 'Trash disposal, dustbins, hygiene maintenance, spills',
      created_by: 'kumar@team1.com',
      created_at: '2026-10-20T08:00:00Z',
      updated_at: '2026-10-20T08:00:00Z',
    }
  ],
  tickets: [
    {
      ticket_id: 'TKT-8206727421084-20448c93',
      custom_id: 'FIX-1008',
      issue_type_id: 'ITY-101',
      issue_type_name: 'Electrical',
      title: 'Fan not working',
      location: 'Classroom 203',
      building: 'Block B',
      floor: '2nd Floor',
      room: '203',
      description: 'Room 204/203, Block B: ceiling fan does not start, making humming noise',
      priority: 'high',
      status: 'open',
      upvotes: 2,
      upvoted_by: ['1CF24CS042', '1CF24CS089'],
      photo: {
        file_id: 'PHO-1008',
        filename: 'broken_fan.jpg',
        url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: {
        expected_by: '2026-11-05',
        note: 'Electrician assigned with replacement capacitor',
        updated_by: 'kumar@team1.com',
        updated_at: '2026-10-30T10:00:00Z',
      },
      overdue: false,
      update: {
        note: 'Electrician assigned',
        updated_by: 'kumar@team1.com',
        updated_by_name: 'Kumar Gowda',
        updated_at: '2026-10-30T10:00:00Z',
      },
      reported_by: 'mahesh@team1.com',
      reported_by_name: 'Mahesh Sharma',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      reported_by_phone_number: '9876543210',
      created_at: '2026-10-30T09:30:00Z',
      updated_at: '2026-10-30T10:00:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-11928a41',
      custom_id: 'FIX-1007',
      issue_type_id: 'ITY-102',
      issue_type_name: 'Plumbing',
      title: 'Water leakage',
      location: 'Washroom 2nd Floor, Block B',
      building: 'Block B',
      floor: '2nd Floor',
      room: 'Washroom B2',
      description: 'Major water leakage under the wash basin creating puddle on floor',
      priority: 'medium',
      status: 'resolved',
      upvotes: 1,
      upvoted_by: ['1CF24CS089'],
      photo: {
        file_id: 'PHO-1007',
        filename: 'leak.jpg',
        url: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=60',
      after_photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      tat: {
        expected_by: '2026-10-29',
        note: 'Pipe gasket repaired and tested',
        updated_by: 'kumar@team1.com',
        updated_at: '2026-10-29T14:00:00Z',
      },
      overdue: false,
      update: {
        note: 'Pipe washer replaced, valve sealed properly',
        updated_by: 'kumar@team1.com',
        updated_by_name: 'Kumar Gowda',
        updated_at: '2026-10-29T14:30:00Z',
      },
      reported_by: 'rahul@team1.com',
      reported_by_name: 'Rahul Kumar',
      reported_by_role: 'student',
      reported_by_dept: 'ECE',
      reported_by_phone_number: '9876543211',
      created_at: '2026-10-28T08:15:00Z',
      updated_at: '2026-10-29T14:30:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-33827b12',
      custom_id: 'FIX-1006',
      issue_type_id: 'ITY-101',
      issue_type_name: 'Electrical',
      title: 'Tube light damaged',
      location: 'Lab 2, Science Block',
      building: 'Science Block',
      floor: '1st Floor',
      room: 'Lab 2',
      description: 'Tube light near row 3 is flickering rapidly and making buzzing sound',
      priority: 'medium',
      status: 'open',
      upvotes: 0,
      upvoted_by: [],
      photo: {
        file_id: 'PHO-1006',
        filename: 'light.jpg',
        url: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: {
        expected_by: '2026-11-04',
        note: 'New LED tube requisitioned',
        updated_by: 'kumar@team1.com',
        updated_at: '2026-10-29T11:00:00Z',
      },
      overdue: false,
      update: {
        note: 'Technician inspected, ballast needs replacement',
        updated_by: 'kumar@team1.com',
        updated_by_name: 'Kumar Gowda',
        updated_at: '2026-10-29T11:00:00Z',
      },
      reported_by: 'asha@team1.com',
      reported_by_name: 'Asha Kumar',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      reported_by_phone_number: '9876543212',
      created_at: '2026-10-29T10:45:00Z',
      updated_at: '2026-10-29T11:00:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-44910c55',
      custom_id: 'FIX-1005',
      issue_type_id: 'ITY-102',
      issue_type_name: 'Plumbing',
      title: 'Washroom tap issue',
      location: 'Block A, Ground Floor',
      building: 'Block A',
      floor: 'Ground Floor',
      room: 'Washroom G1',
      description: 'Tap handle snapped off, continuous water flow causing water wastage',
      priority: 'high',
      status: 'open',
      upvotes: 4,
      upvoted_by: ['1CF24CS042', '1CF24CS001'],
      photo: {
        file_id: 'PHO-1005',
        filename: 'broken_tap.jpg',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: {
        expected_by: '2026-10-31',
        note: 'Main line shutoff and replacing tap unit',
        updated_by: 'kumar@team1.com',
        updated_at: '2026-10-30T12:00:00Z',
      },
      overdue: false,
      update: {
        note: 'Plumber dispatched on priority',
        updated_by: 'kumar@team1.com',
        updated_by_name: 'Kumar Gowda',
        updated_at: '2026-10-30T12:00:00Z',
      },
      reported_by: 'mahesh@team1.com',
      reported_by_name: 'Mahesh Sharma',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      reported_by_phone_number: '9876543210',
      created_at: '2026-10-30T11:20:00Z',
      updated_at: '2026-10-30T12:00:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-55019d88',
      custom_id: 'FIX-1004',
      issue_type_id: 'ITY-104',
      issue_type_name: 'IT & Network',
      title: 'Projector display distorted',
      location: 'Seminar Hall, 3rd Floor',
      building: 'Admin Block',
      floor: '3rd Floor',
      room: 'Seminar Hall 1',
      description: 'HDMI color tint is completely purple and lamp flickering',
      priority: 'high',
      status: 'acknowledged',
      upvotes: 0,
      upvoted_by: [],
      photo: {
        file_id: 'PHO-1004',
        filename: 'projector.jpg',
        url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60',
      after_photo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60',
      tat: {
        expected_by: '2026-10-28',
        note: 'Replaced HDMI splitter cable and tested',
        updated_by: 'kumar@team1.com',
        updated_at: '2026-10-28T16:00:00Z',
      },
      overdue: false,
      update: {
        note: 'Cable replaced and projector recalibrated',
        updated_by: 'kumar@team1.com',
        updated_by_name: 'Kumar Gowda',
        updated_at: '2026-10-28T16:30:00Z',
      },
      reported_by: 'mahesh@team1.com',
      reported_by_name: 'Mahesh Sharma',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      reported_by_phone_number: '9876543210',
      created_at: '2026-10-27T09:00:00Z',
      updated_at: '2026-10-28T17:00:00Z',
      acknowledged_at: '2026-10-28T17:00:00Z',
      feedback: {
        rating: 5,
        comment: 'Fixed rapidly right before seminar! Excellent service.',
        submitted_at: '2026-10-28T17:00:00Z',
      }
    }
  ]
};

// Helper: Token Generator
const createToken = (user) => {
  return Buffer.from(JSON.stringify({ email: user.email_id, role: user.role, time: Date.now() })).toString('base64');
};

// Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing, bad or expired token', details: null },
      request_id: 'req_' + Math.random().toString(36).substr(2, 9),
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    if (payload.role === 'admin') {
      req.user = db.admin;
    } else {
      const found = db.users.find(u => u.email_id.toLowerCase() === payload.email.toLowerCase());
      req.user = found || { email_id: payload.email, role: payload.role, name: 'Campus User' };
    }
    next();
  } catch (err) {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Token format is invalid', details: null },
      request_id: 'req_' + Math.random().toString(36).substr(2, 9),
    });
  }
};

// --- AUTH ENDPOINTS ---

// Admin Login: POST /api/v1/auth/admin/login
// Strictly restricted to admin@team29.com with OTP 004712
app.post('/api/v1/auth/admin/login', (req, res) => {
  const { email_id, otp } = req.body;
  if (!email_id || !otp) {
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'email_id and otp required', details: null },
    });
  }

  // Sirf admin@team29.com and OTP 004712 allowed
  if (email_id.toLowerCase() === 'admin@team29.com' && otp.trim() === '004712') {
    const access_token = createToken(db.admin);
    return res.status(200).json({
      access_token,
      token_type: 'bearer',
      expires_in: 43200,
      profile: db.admin,
    });
  }

  return res.status(401).json({
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Sirf admin@team29.com aur OTP 004712 ko Admin panel use karne ki permission hai.',
      details: null
    },
  });
});

// User Login: POST /api/v1/auth/login
// Students & Staff can log in with their Gmail / any email ("unki marji")
app.post('/api/v1/auth/login', (req, res) => {
  const { email_id, otp, role } = req.body;
  if (!email_id) {
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'email_id is required', details: null },
    });
  }

  // If someone enters admin@team29.com here, force them to use admin portal
  if (email_id.toLowerCase() === 'admin@team29.com') {
    return res.status(400).json({
      error: {
        code: 'USE_ADMIN_LOGIN',
        message: 'admin@team29.com sirf Admin role ke liye hai. Kripya Admin portal login use karein.',
        details: null
      },
    });
  }

  let user = db.users.find(u => u.email_id.toLowerCase() === email_id.toLowerCase());

  // Dynamic user onboarding: agar student ya staff koi bhi apna personal Gmail enter kare ("unki marji")
  if (!user) {
    const isStaff = role === 'maintenance' || role === 'office_staff' || email_id.toLowerCase().includes('staff') || email_id.toLowerCase().includes('maint');
    const namePart = email_id.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (isStaff) {
      user = {
        role: 'office_staff',
        name: namePart || 'Maintenance Staff',
        dept: 'Campus Maintenance',
        designation: 'Technician',
        email_id: email_id.toLowerCase(),
        phone_number: '98765432' + Math.floor(10 + Math.random() * 89),
        otp: otp || '123456',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      user = {
        role: 'student',
        name: namePart || 'Student User',
        usn: '1CF24CS' + Math.floor(100 + Math.random() * 900),
        dept: 'CSE',
        email_id: email_id.toLowerCase(),
        phone_number: '98765432' + Math.floor(10 + Math.random() * 89),
        otp: otp || '123456',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    db.users.push(user);
  }

  const access_token = createToken(user);
  return res.status(200).json({
    access_token,
    token_type: 'bearer',
    expires_in: 43200,
    profile: user,
  });
});

// Current User Profile: GET /api/v1/users/me
app.get('/api/v1/users/me', authenticate, (req, res) => {
  res.json(req.user);
});

// Admin Profile: GET /api/v1/admin/me
app.get('/api/v1/admin/me', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requires admin role' } });
  }
  res.json(db.admin);
});

// List Users: GET /api/v1/admin/users
app.get('/api/v1/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requires admin role' } });
  }
  const { role } = req.query;
  let items = db.users;
  if (role) {
    items = items.filter(u => u.role === role);
  }
  res.json({ items, count: items.length, next_cursor: null });
});

// Create User: POST /api/v1/admin/users
app.post('/api/v1/admin/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requires admin role' } });
  }

  const { role, name, email_id, phone_number, usn, dept, designation } = req.body;
  if (!role || !name || !email_id || !phone_number) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required user fields' } });
  }

  if (db.users.some(u => u.email_id.toLowerCase() === email_id.toLowerCase())) {
    return res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'Email is already registered' } });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser = {
    role,
    name,
    email_id: email_id.toLowerCase(),
    phone_number,
    otp: generatedOtp,
    created_by: req.user.email_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (role === 'student') {
    newUser.usn = (usn || '1CF24CS' + Math.floor(100 + Math.random() * 900)).toUpperCase();
    newUser.dept = dept || 'CSE';
  } else if (role === 'office_staff') {
    newUser.dept = dept || 'Campus Maintenance';
    newUser.designation = designation || 'Supervisor';
  } else if (role === 'faculty') {
    newUser.designation = designation || 'Professor';
  }

  db.users.push(newUser);
  res.status(201).json(newUser);
});

// Regenerate OTP: POST /api/v1/admin/users/:email_id/regenerate-otp
app.post('/api/v1/admin/users/:email_id/regenerate-otp', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requires admin role' } });
  }
  const email = req.params.email_id.toLowerCase();
  const user = db.users.find(u => u.email_id.toLowerCase() === email);
  if (!user) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  }
  user.otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.updated_at = new Date().toISOString();
  res.json({ message: 'OTP regenerated successfully', otp: user.otp });
});

// Delete User: DELETE /api/v1/admin/users/:email_id
app.delete('/api/v1/admin/users/:email_id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requires admin role' } });
  }
  const email = req.params.email_id.toLowerCase();
  const index = db.users.findIndex(u => u.email_id.toLowerCase() === email);
  if (index === -1) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  }
  db.users.splice(index, 1);
  res.json({ message: `User ${email} deleted successfully` });
});

// --- FIXIT ISSUE TYPES ---

// GET /api/v1/fixit/issue-types
app.get('/api/v1/fixit/issue-types', (req, res) => {
  res.json({ items: db.issueTypes, count: db.issueTypes.length, next_cursor: null });
});

// POST /api/v1/fixit/issue-types (Campus Maintenance only)
app.post('/api/v1/fixit/issue-types', authenticate, (req, res) => {
  if (req.user.role !== 'admin' && !(req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'))) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only Campus Maintenance can manage issue types' } });
  }
  const { name, description } = req.body;
  if (!name) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Name is required' } });
  }
  if (db.issueTypes.some(it => it.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'Issue type name already exists' } });
  }

  const newType = {
    issue_type_id: `ITY-${Date.now().toString().slice(-4)}`,
    name,
    description: description || '',
    created_by: req.user.email_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.issueTypes.push(newType);
  res.status(201).json(newType);
});

// DELETE /api/v1/fixit/issue-types/:id
app.delete('/api/v1/fixit/issue-types/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin' && !(req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'))) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only Campus Maintenance can delete issue types' } });
  }
  const idx = db.issueTypes.findIndex(it => it.issue_type_id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Issue type not found' } });
  }
  db.issueTypes.splice(idx, 1);
  res.json({ message: 'Issue type deleted successfully' });
});

// --- FIXIT TICKETS ---

// GET /api/v1/fixit/tickets
app.get('/api/v1/fixit/tickets', authenticate, (req, res) => {
  const { status, issue_type_id, mine } = req.query;
  const isMaintenanceOrAdmin = req.user.role === 'admin' || (req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'));

  let tickets = [...db.tickets];

  // If student or faculty and not explicitly requesting everyone's with permission, filter to their own
  if (!isMaintenanceOrAdmin || mine === 'true') {
    tickets = tickets.filter(t => t.reported_by?.toLowerCase() === req.user.email_id?.toLowerCase());
  }

  if (status) {
    tickets = tickets.filter(t => t.status === status);
  }
  if (issue_type_id) {
    tickets = tickets.filter(t => t.issue_type_id === issue_type_id);
  }

  res.json({
    items: tickets,
    count: tickets.length,
    next_cursor: null,
  });
});

// GET /api/v1/fixit/tickets/:ticket_id
app.get('/api/v1/fixit/tickets/:ticket_id', authenticate, (req, res) => {
  const ticket = db.tickets.find(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }
  res.json(ticket);
});

// POST /api/v1/fixit/tickets
// Supports both form-data with photo and application/json
app.post('/api/v1/fixit/tickets', authenticate, upload.single('photo'), (req, res) => {
  const { issue_type_id, title, description, location, building, floor, room, priority } = req.body;

  if (!issue_type_id || !title || !description) {
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'issue_type_id, title, and description are required' }
    });
  }

  const issueType = db.issueTypes.find(it => it.issue_type_id === issue_type_id) || { name: 'General' };

  // Smart Priority Auto-detection if not explicitly passed
  let calculatedPriority = priority || 'medium';
  const textToCheck = `${title} ${description}`.toLowerCase();
  if (textToCheck.includes('wire') || textToCheck.includes('shock') || textToCheck.includes('spark') || textToCheck.includes('fire') || textToCheck.includes('collapse') || textToCheck.includes('smoke')) {
    calculatedPriority = 'critical';
  } else if (textToCheck.includes('leak') || textToCheck.includes('flood') || textToCheck.includes('broken fan') || textToCheck.includes('no power')) {
    calculatedPriority = 'high';
  } else if (textToCheck.includes('paint') || textToCheck.includes('cleaning') || textToCheck.includes('dustbin')) {
    calculatedPriority = 'low';
  }

  const nextIndex = db.tickets.length + 1001;
  const customId = `FIX-${nextIndex}`;
  const uniqueTicketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  // Default image if none provided
  const photoUrl = req.file
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : (req.body.photo_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60');

  const newTicket = {
    ticket_id: uniqueTicketId,
    custom_id: customId,
    issue_type_id,
    issue_type_name: issueType.name,
    title,
    description,
    location: location || `${building || 'Block B'} - Room ${room || '203'}`,
    building: building || 'Block B',
    floor: floor || '2nd Floor',
    room: room || '203',
    priority: calculatedPriority,
    status: 'open',
    upvotes: 0,
    upvoted_by: [],
    photo: {
      file_id: `PHO-${Date.now().toString().slice(-4)}`,
      filename: req.file ? req.file.originalname : 'issue_photo.jpg',
      content_type: req.file ? req.file.mimetype : 'image/jpeg',
      url: photoUrl,
    },
    before_photo: photoUrl,
    after_photo: null,
    tat: null,
    overdue: false,
    update: null,
    reported_by: req.user.email_id,
    reported_by_name: req.user.name || 'Student Reporter',
    reported_by_role: req.user.role || 'student',
    reported_by_dept: req.user.dept || 'CSE',
    reported_by_phone_number: req.user.phone_number || '9876543210',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    acknowledged_at: null,
    feedback: null,
  };

  db.tickets.unshift(newTicket);
  res.status(201).json(newTicket);
});

// PUT /api/v1/fixit/tickets/:ticket_id/status (Campus Maintenance only)
// Updates status to resolved or open, and supports Before/After photo proof!
app.put('/api/v1/fixit/tickets/:ticket_id/status', authenticate, upload.single('after_photo'), (req, res) => {
  const isMaintenanceOrAdmin = req.user.role === 'admin' || (req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'));
  if (!isMaintenanceOrAdmin) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only Campus Maintenance can update ticket status' } });
  }

  const ticket = db.tickets.find(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }

  const { status, note, after_photo_url } = req.body;
  if (!status || !note) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'status and note are required' } });
  }

  ticket.status = status;
  ticket.update = {
    note,
    updated_by: req.user.email_id,
    updated_by_name: req.user.name || 'Maintenance Supervisor',
    updated_at: new Date().toISOString(),
  };
  ticket.updated_at = new Date().toISOString();

  // If proof of repair photo is provided
  if (req.file) {
    ticket.after_photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  } else if (after_photo_url) {
    ticket.after_photo = after_photo_url;
  } else if (status === 'resolved' && !ticket.after_photo) {
    // Default high-quality fixed photo if none provided in demo
    ticket.after_photo = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60';
  }

  res.json(ticket);
});

// PUT /api/v1/fixit/tickets/:ticket_id/tat (Turnaround Time)
app.put('/api/v1/fixit/tickets/:ticket_id/tat', authenticate, (req, res) => {
  const isMaintenance = req.user.role === 'admin' || (req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'));
  if (!isMaintenance) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only Campus Maintenance can set turnaround time' } });
  }

  const ticket = db.tickets.find(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }

  if (ticket.status !== 'open') {
    return res.status(409).json({ error: { code: 'TICKET_RESOLVED', message: 'Cannot set TAT for non-open ticket' } });
  }

  const { expected_by, note } = req.body;
  if (!expected_by) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'expected_by date is required' } });
  }

  ticket.tat = {
    expected_by,
    note: note || 'Work scheduled with technician',
    updated_by: req.user.email_id,
    updated_at: new Date().toISOString(),
  };
  ticket.updated_at = new Date().toISOString();

  res.json(ticket);
});

// POST /api/v1/fixit/tickets/:ticket_id/acknowledge (Reporter confirms repair & closes)
app.post('/api/v1/fixit/tickets/:ticket_id/acknowledge', authenticate, (req, res) => {
  const ticket = db.tickets.find(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }

  if (ticket.status !== 'resolved') {
    return res.status(409).json({ error: { code: 'NOT_RESOLVED', message: 'Only resolved tickets can be acknowledged' } });
  }

  ticket.status = 'acknowledged';
  ticket.acknowledged_at = new Date().toISOString();
  ticket.updated_at = new Date().toISOString();

  // If student provided feedback & star rating
  if (req.body.rating) {
    ticket.feedback = {
      rating: Number(req.body.rating),
      comment: req.body.comment || 'Verified repair. Thanks!',
      submitted_at: new Date().toISOString(),
    };
  }

  res.json(ticket);
});

// DELETE /api/v1/fixit/tickets/:ticket_id
app.delete('/api/v1/fixit/tickets/:ticket_id', authenticate, (req, res) => {
  const isMaintenanceOrAdmin = req.user.role === 'admin' || (req.user.role === 'office_staff' && req.user.dept?.toLowerCase().includes('maintenance'));
  const idx = db.tickets.findIndex(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (idx === -1) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }

  const ticket = db.tickets[idx];
  if (!isMaintenanceOrAdmin && ticket.reported_by.toLowerCase() !== req.user.email_id.toLowerCase()) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Cannot delete another user ticket' } });
  }

  db.tickets.splice(idx, 1);
  res.json({ message: 'Ticket deleted successfully' });
});

// --- INNOVATION ENDPOINTS ---

// 1. Duplication Detection Engine: POST /api/v1/fixit/check-duplicates
app.post('/api/v1/fixit/check-duplicates', (req, res) => {
  const { location, building, room, issue_type_id, title } = req.body;
  if (!location && (!building || !room)) {
    return res.json({ duplicates: [] });
  }

  const locString = (location || `${building} ${room}`).toLowerCase();

  const duplicates = db.tickets.filter(t => {
    if (t.status === 'acknowledged') return false; // Closed tickets don't block
    const ticketLoc = (t.location || `${t.building} ${t.room}`).toLowerCase();
    const locationMatch = ticketLoc.includes(locString) || locString.includes(ticketLoc) ||
      (room && t.room && t.room.toString() === room.toString());
    const categoryMatch = !issue_type_id || t.issue_type_id === issue_type_id;
    return locationMatch && categoryMatch;
  });

  res.json({
    has_duplicates: duplicates.length > 0,
    count: duplicates.length,
    duplicates,
  });
});

// 2. Upvote Existing Ticket (Me Too!): POST /api/v1/fixit/tickets/:ticket_id/upvote
app.post('/api/v1/fixit/tickets/:ticket_id/upvote', authenticate, (req, res) => {
  const ticket = db.tickets.find(t => t.ticket_id === req.params.ticket_id || t.custom_id === req.params.ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
  }

  const userKey = req.user.usn || req.user.email_id;
  if (!ticket.upvoted_by) ticket.upvoted_by = [];
  if (!ticket.upvoted_by.includes(userKey)) {
    ticket.upvoted_by.push(userKey);
    ticket.upvotes = (ticket.upvotes || 0) + 1;
    // Auto boost priority if multiple students report
    if (ticket.upvotes >= 3 && ticket.priority === 'medium') {
      ticket.priority = 'high';
    } else if (ticket.upvotes >= 5 && ticket.priority === 'high') {
      ticket.priority = 'critical';
    }
  }

  res.json(ticket);
});

// 3. Smart Priority Detection: POST /api/v1/fixit/smart-priority
app.post('/api/v1/fixit/smart-priority', (req, res) => {
  const { title, description } = req.body;
  const combined = `${title || ''} ${description || ''}`.toLowerCase();

  let priority = 'medium';
  let rationale = 'Standard maintenance issue scheduled during working hours.';
  let targetSLA = '24 Hours';

  if (/(wire|exposed|electric|shock|spark|fire|flame|smoke|gas|short circuit|live wire|collapse)/i.test(combined)) {
    priority = 'critical';
    rationale = 'Urgent hazard detected: Potential electrical/fire safety risk to students. Instant technician dispatch recommended.';
    targetSLA = '2-4 Hours';
  } else if (/(leak|burst|flood|broken pipe|no power|blackout|elevator|lift stuck|fan not working|broken tap)/i.test(combined)) {
    priority = 'high';
    rationale = 'High impact: Disrupts classroom learning or facility operation.';
    targetSLA = '12 Hours';
  } else if (/(paint|peel|dustbin|cleaning|stain|loose knob|squeaky)/i.test(combined)) {
    priority = 'low';
    rationale = 'Minor aesthetic or routine task. Can be batched with routine rounds.';
    targetSLA = '48 Hours';
  }

  res.json({ priority, rationale, targetSLA });
});

// 4. Campus Maintenance Heatmap: GET /api/v1/fixit/heatmap
app.get('/api/v1/fixit/heatmap', (req, res) => {
  const blocks = [
    { id: 'Block A', name: 'Academic Block A', x: 20, y: 30, floors: 4, rooms: ['101', '102', '201', '202', '301'] },
    { id: 'Block B', name: 'Engineering Block B', x: 50, y: 30, floors: 4, rooms: ['203', '204', '301', '302', 'Lab 1'] },
    { id: 'Science Block', name: 'Science & Research Block', x: 80, y: 30, floors: 3, rooms: ['Lab 2', 'Chem Lab', 'Physics Lab'] },
    { id: 'Library', name: 'Central Library', x: 30, y: 70, floors: 3, rooms: ['Reading Hall', '2nd Floor', 'Digital Library'] },
    { id: 'Canteen', name: 'Campus Food Court & Canteen', x: 60, y: 75, floors: 2, rooms: ['Kitchen', 'Dining Hall A', 'Dining Hall B'] },
    { id: 'Admin Block', name: 'Administrative Building', x: 85, y: 70, floors: 3, rooms: ['Seminar Hall 1', 'Dean Office', 'Finance'] },
  ];

  const heatmapData = blocks.map(block => {
    const blockTickets = db.tickets.filter(t => t.building === block.id || t.location.includes(block.id));
    const openTickets = blockTickets.filter(t => t.status === 'open');
    const criticalTickets = openTickets.filter(t => t.priority === 'critical');
    const resolvedTickets = blockTickets.filter(t => t.status === 'resolved' || t.status === 'acknowledged');

    let heatLevel = 'low'; // low, moderate, high, critical
    if (criticalTickets.length > 0 || openTickets.length >= 5) {
      heatLevel = 'critical';
    } else if (openTickets.length >= 3) {
      heatLevel = 'high';
    } else if (openTickets.length >= 1) {
      heatLevel = 'moderate';
    }

    return {
      ...block,
      total_tickets: blockTickets.length,
      open_tickets: openTickets.length,
      critical_tickets: criticalTickets.length,
      resolved_tickets: resolvedTickets.length,
      heat_level: heatLevel,
    };
  });

  res.json({ blocks: heatmapData });
});

// Health check (root + versioned API path, used by the frontend connection check)
const healthCheck = (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
};
app.get('/health', healthCheck);
app.get('/api/v1/health', healthCheck);

// Start Server
app.listen(PORT, () => {
  console.log(`FixIt API Server running on port ${PORT}`);
});

