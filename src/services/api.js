// FixIt API Service
// Connects to local Express backend / CampusOS API endpoints, with automatic in-memory persistence fallback.

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Initial seed data in case running in purely static browser mode
const INITIAL_SEED = {
  users: [
    { role: 'student', name: 'Mahesh Sharma', usn: '1CF24CS042', dept: 'CSE', email_id: 'mahesh@team1.com', phone_number: '9876543210', otp: '123456' },
    { role: 'student', name: 'Rahul Kumar', usn: '1CF24CS089', dept: 'ECE', email_id: 'rahul@team1.com', phone_number: '9876543211', otp: '123456' },
    { role: 'student', name: 'Asha Kumar', usn: '1CF24CS001', dept: 'CSE', email_id: 'asha@team1.com', phone_number: '9876543212', otp: '730792' },
    { role: 'office_staff', name: 'Kumar Gowda', dept: 'Campus Maintenance', designation: 'Supervisor', email_id: 'kumar@team1.com', phone_number: '9876543215', otp: '730792' },
    { role: 'faculty', name: 'Dr. Meera Rao', designation: 'Professor', email_id: 'meera@team1.com', phone_number: '9876543218', otp: '730792' },
  ],
  admin: {
    role: 'admin',
    team_id: 'team29',
    institution_name: 'National Institute of Engineering',
    name: 'Administrator',
    email_id: 'admin@team29.com',
    phone_number: '9876543200',
    otp: '004712',
  },
  issueTypes: [
    { issue_type_id: 'ITY-101', name: 'Electrical', description: 'Fans, lights, switches, sockets, exposed wiring' },
    { issue_type_id: 'ITY-102', name: 'Plumbing', description: 'Taps, leaks, blocked drains, washrooms' },
    { issue_type_id: 'ITY-103', name: 'Furniture', description: 'Broken benches, chairs, desks, doors' },
    { issue_type_id: 'ITY-104', name: 'IT & Network', description: 'Wi-Fi, projectors, lab computers' },
    { issue_type_id: 'ITY-105', name: 'Cleaning & Facilities', description: 'Sanitation, dustbins, hygiene maintenance' }
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
      description: 'Room 203, Block B: ceiling fan does not start and makes buzzing sound',
      priority: 'high',
      status: 'open',
      upvotes: 2,
      upvoted_by: ['1CF24CS042'],
      photo: { file_id: 'PHO-1', url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60' },
      before_photo: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: { expected_by: '2026-11-05', note: 'Electrician assigned with capacitor replacement', updated_by: 'kumar@team1.com' },
      overdue: false,
      update: { note: 'Electrician assigned for inspection', updated_by_name: 'Kumar Gowda' },
      reported_by: 'mahesh@team1.com',
      reported_by_name: 'Mahesh Sharma',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      created_at: '2026-10-30T09:30:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-11928a41',
      custom_id: 'FIX-1007',
      issue_type_id: 'ITY-102',
      issue_type_name: 'Plumbing',
      title: 'Water leakage',
      location: 'Block B - 2nd Floor Washroom',
      building: 'Block B',
      floor: '2nd Floor',
      room: 'Washroom B2',
      description: 'Under-basin water pipe cracked, causing water pool on tiles',
      priority: 'medium',
      status: 'resolved',
      upvotes: 1,
      upvoted_by: ['1CF24CS089'],
      photo: { file_id: 'PHO-2', url: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=60' },
      before_photo: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=60',
      after_photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      tat: { expected_by: '2026-10-29', note: 'Replaced rubber gasket and tightened fittings' },
      overdue: false,
      update: { note: 'Repair completed and water flow tested', updated_by_name: 'Kumar Gowda' },
      reported_by: 'rahul@team1.com',
      reported_by_name: 'Rahul Kumar',
      reported_by_role: 'student',
      reported_by_dept: 'ECE',
      created_at: '2026-10-28T08:15:00Z',
      acknowledged_at: null,
      feedback: null,
    },
    {
      ticket_id: 'TKT-8206727421084-33827b12',
      custom_id: 'FIX-1006',
      issue_type_id: 'ITY-101',
      issue_type_name: 'Electrical',
      title: 'Tube light not working',
      location: 'Lab 2, Science Block',
      building: 'Science Block',
      floor: '1st Floor',
      room: 'Lab 2',
      description: 'Tube light near lab station 4 is blinking violently',
      priority: 'medium',
      status: 'open',
      upvotes: 0,
      upvoted_by: [],
      photo: { file_id: 'PHO-3', url: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=60' },
      before_photo: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: null,
      overdue: false,
      update: null,
      reported_by: 'asha@team1.com',
      reported_by_name: 'Asha Kumar',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      created_at: '2026-10-29T10:45:00Z',
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
      description: 'HDMI color tint is distorted with green lines during presentation',
      priority: 'high',
      status: 'acknowledged',
      upvotes: 0,
      upvoted_by: [],
      photo: { file_id: 'PHO-4', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60' },
      before_photo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60',
      after_photo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60',
      tat: { expected_by: '2026-10-28', note: 'HDMI cable and port replaced' },
      overdue: false,
      update: { note: 'Port recalibrated, display verified with laptop', updated_by_name: 'Kumar Gowda' },
      reported_by: 'mahesh@team1.com',
      reported_by_name: 'Mahesh Sharma',
      reported_by_role: 'student',
      reported_by_dept: 'CSE',
      created_at: '2026-10-27T09:00:00Z',
      acknowledged_at: '2026-10-28T17:00:00Z',
      feedback: { rating: 5, comment: 'Prompt response before national symposium!', submitted_at: '2026-10-28T17:00:00Z' }
    }
  ]
};

// Local storage persistent fallback store
const getStorageData = () => {
  try {
    const raw = localStorage.getItem('FIXIT_STORE');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-migrate admin to admin@team29.com / 004712
      if (parsed.admin?.email_id !== 'admin@team29.com') {
        parsed.admin = INITIAL_SEED.admin;
        saveStorageData(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  localStorage.setItem('FIXIT_STORE', JSON.stringify(INITIAL_SEED));
  return JSON.parse(JSON.stringify(INITIAL_SEED));
};

const saveStorageData = (data) => {
  try {
    localStorage.setItem('FIXIT_STORE', JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

// API Client Class
class FixItAPI {
  constructor() {
    this.token = localStorage.getItem('FIXIT_TOKEN') || null;
    this.customBaseUrl = localStorage.getItem('FIXIT_API_URL') || '';
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('FIXIT_TOKEN', token);
    else localStorage.removeItem('FIXIT_TOKEN');
  }

  setBaseUrl(url) {
    this.customBaseUrl = url.trim();
    if (url) localStorage.setItem('FIXIT_API_URL', url.trim());
    else localStorage.removeItem('FIXIT_API_URL');
  }

  getBaseUrl() {
    const configuredUrl = this.customBaseUrl || DEFAULT_BASE_URL;
    // A previously saved frontend origin (for example localhost:5174) is not
    // an API server. Use Vite's same-origin proxy for local development.
    if (/^https?:\/\/localhost:517[34](?:\/|$)/i.test(configuredUrl)) {
      return DEFAULT_BASE_URL;
    }
    return configuredUrl.replace(/\/+$/, '');
  }

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  // --- AUTHENTICATION ---

  async login(email_id, otp, role = 'student') {
    const baseUrl = this.getBaseUrl();
    const cleanEmail = email_id.trim().toLowerCase();

    if (cleanEmail === 'admin@team29.com') {
      throw {
        error: {
          code: 'USE_ADMIN_LOGIN',
          message: 'admin@team29.com sirf Administrator ke liye hai. Kripya Admin portal login use karein.'
        }
      };
    }

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: cleanEmail, otp, role })
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.access_token);
        return data;
      }
      const err = await res.json();
      throw err;
    } catch (err) {
      if (err.error?.code === 'USE_ADMIN_LOGIN') throw err;

      // Offline / Local storage fallback:
      // Allow students and staff to log in with their Gmail ("unki marji")
      const store = getStorageData();
      let user = store.users.find(u => u.email_id.toLowerCase() === cleanEmail);

      // On-the-fly registration for any Gmail entered
      if (!user) {
        const isStaff = role === 'maintenance' || role === 'office_staff' || cleanEmail.includes('staff') || cleanEmail.includes('maint');
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (isStaff) {
          user = {
            role: 'office_staff',
            name: namePart || 'Maintenance Staff',
            dept: 'Campus Maintenance',
            designation: 'Staff Technician',
            email_id: cleanEmail,
            phone_number: '98765432' + Math.floor(10 + Math.random() * 89),
            otp: otp || '123456',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        } else {
          user = {
            role: 'student',
            name: namePart || 'Campus Student',
            usn: '1CF24CS' + Math.floor(100 + Math.random() * 900),
            dept: 'CSE',
            email_id: cleanEmail,
            phone_number: '98765432' + Math.floor(10 + Math.random() * 89),
            otp: otp || '123456',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        store.users.push(user);
        saveStorageData(store);
      }

      const token = btoa(JSON.stringify({ email: user.email_id, role: user.role, time: Date.now() }));
      this.setToken(token);
      return {
        access_token: token,
        token_type: 'bearer',
        expires_in: 43200,
        profile: user,
      };
    }
  }

  async adminLogin(email_id, otp) {
    const baseUrl = this.getBaseUrl();
    const cleanEmail = email_id.trim().toLowerCase();
    const cleanOtp = otp.trim();

    // Sirf admin@team29.com aur 004712 allow hai
    if (cleanEmail !== 'admin@team29.com' || cleanOtp !== '004712') {
      throw {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Sirf admin@team29.com aur OTP 004712 ko Admin panel use karne ki authorization hai.'
        }
      };
    }

    try {
      const res = await fetch(`${baseUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: cleanEmail, otp: cleanOtp })
      });
      if (res.ok) {
        const data = await res.json();
        this.setToken(data.access_token);
        return data;
      }
      const err = await res.json();
      throw err;
    } catch (err) {
      // Offline fallback strictly for admin@team29.com / 004712
      const store = getStorageData();
      const adminProfile = {
        role: 'admin',
        team_id: 'team29',
        institution_name: 'National Institute of Engineering',
        name: 'Chief Administrator',
        email_id: 'admin@team29.com',
        phone_number: '9876543200',
        otp: '004712',
      };
      const token = btoa(JSON.stringify({ email: 'admin@team29.com', role: 'admin', time: Date.now() }));
      this.setToken(token);
      return {
        access_token: token,
        token_type: 'bearer',
        expires_in: 43200,
        profile: adminProfile,
      };
    }
  }

  async getMyProfile() {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/users/me`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }
    return null;
  }

  // --- ADMIN USER MANAGEMENT ---

  async listUsers(role = '') {
    const baseUrl = this.getBaseUrl();
    try {
      const url = role ? `${baseUrl}/admin/users?role=${role}` : `${baseUrl}/admin/users`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    let list = store.users;
    if (role) list = list.filter(u => u.role === role);
    return { items: list, count: list.length, next_cursor: null };
  }

  async createUser(userData) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/admin/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const newUser = {
      ...userData,
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStorageData(store);
    return newUser;
  }

  async regenerateOtp(email_id) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/admin/users/${email_id}/regenerate-otp`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const user = store.users.find(u => u.email_id.toLowerCase() === email_id.toLowerCase());
    if (user) {
      user.otp = Math.floor(100000 + Math.random() * 900000).toString();
      saveStorageData(store);
      return { message: 'OTP regenerated', otp: user.otp };
    }
    throw new Error('User not found');
  }

  async deleteUser(email_id) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/admin/users/${email_id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    store.users = store.users.filter(u => u.email_id.toLowerCase() !== email_id.toLowerCase());
    saveStorageData(store);
    return { message: 'User deleted' };
  }

  async updateUser(email_id, updateData) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/admin/users/${encodeURIComponent(email_id)}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const userIndex = store.users.findIndex(u => u.email_id.toLowerCase() === email_id.toLowerCase());
    if (userIndex !== -1) {
      store.users[userIndex] = {
        ...store.users[userIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      saveStorageData(store);
      return store.users[userIndex];
    }
    return updateData;
  }

  // --- ISSUE TYPES ---

  async getIssueTypes() {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/issue-types`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    return { items: store.issueTypes, count: store.issueTypes.length, next_cursor: null };
  }

  async createIssueType(name, description) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/issue-types`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const newType = {
      issue_type_id: `ITY-${Date.now().toString().slice(-4)}`,
      name,
      description,
      created_at: new Date().toISOString(),
    };
    store.issueTypes.push(newType);
    saveStorageData(store);
    return newType;
  }

  async deleteIssueType(id) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/issue-types/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    store.issueTypes = store.issueTypes.filter(it => it.issue_type_id !== id);
    saveStorageData(store);
    return { message: 'Issue type deleted' };
  }

  // --- TICKETS ---

  async getTickets(params = {}) {
    const baseUrl = this.getBaseUrl();
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets?${query}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    let list = [...store.tickets];
    if (params.status) list = list.filter(t => t.status === params.status);
    if (params.issue_type_id) list = list.filter(t => t.issue_type_id === params.issue_type_id);
    if (params.mine === 'true' && params.email) {
      list = list.filter(t => t.reported_by?.toLowerCase() === params.email.toLowerCase());
    }
    return { items: list, count: list.length, next_cursor: null };
  }

  async getTicket(id) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets/${id}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const t = store.tickets.find(item => item.ticket_id === id || item.custom_id === id);
    if (t) return t;
    throw new Error('Ticket not found');
  }

  async raiseTicketWithFile(formData, userProfile) {
    // formData is a browser FormData object (with possible 'photo' file field)
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }, // NO Content-Type — let browser set multipart boundary
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    // Offline fallback: extract text fields from FormData
    const store = getStorageData();
    const nextIdx = store.tickets.length + 1001;
    const customId = `FIX-${nextIdx}`;
    const uniqueId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    const issue_type_id = formData.get('issue_type_id');
    const title = formData.get('title');
    const description = formData.get('description');
    const building = formData.get('building') || 'Block B';
    const floor = formData.get('floor') || '2nd Floor';
    const room = formData.get('room') || '203';
    const priority = formData.get('priority') || 'medium';
    const photoFile = formData.get('photo');

    const issueType = store.issueTypes.find(it => it.issue_type_id === issue_type_id) || { name: 'General' };

    // Convert uploaded file to data-URL for offline storage
    let photoUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60';
    if (photoFile && photoFile.size > 0) {
      try {
        photoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
      } catch {}
    }

    const newTicket = {
      ticket_id: uniqueId,
      custom_id: customId,
      issue_type_id,
      issue_type_name: issueType.name,
      title,
      description,
      location: `${building} - Room ${room}`,
      building,
      floor,
      room,
      priority,
      status: 'open',
      upvotes: 0,
      upvoted_by: [],
      photo: { file_id: `PHO-${Date.now().toString().slice(-4)}`, filename: photoFile?.name || 'issue.jpg', url: photoUrl },
      before_photo: photoUrl,
      after_photo: null,
      tat: null,
      overdue: false,
      update: null,
      reported_by: userProfile?.email_id || 'student@team1.com',
      reported_by_name: userProfile?.name || 'Student Reporter',
      reported_by_role: userProfile?.role || 'student',
      reported_by_dept: userProfile?.dept || 'CSE',
      reported_by_phone_number: userProfile?.phone_number || '9876543210',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      acknowledged_at: null,
      feedback: null,
    };

    store.tickets.unshift(newTicket);
    saveStorageData(store);
    return newTicket;
  }

  async raiseTicket(ticketData, userProfile) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(ticketData),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    // Offline / fallback storage save
    const store = getStorageData();
    const nextIdx = store.tickets.length + 1001;
    const customId = `FIX-${nextIdx}`;
    const uniqueId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    const issueType = store.issueTypes.find(it => it.issue_type_id === ticketData.issue_type_id) || { name: 'General' };

    const newTicket = {
      ticket_id: uniqueId,
      custom_id: customId,
      issue_type_id: ticketData.issue_type_id,
      issue_type_name: issueType.name,
      title: ticketData.title,
      description: ticketData.description,
      location: ticketData.location || `${ticketData.building} - Room ${ticketData.room}`,
      building: ticketData.building || 'Block B',
      floor: ticketData.floor || '2nd Floor',
      room: ticketData.room || '203',
      priority: ticketData.priority || 'medium',
      status: 'open',
      upvotes: 0,
      upvoted_by: [],
      photo: {
        file_id: `PHO-${Date.now().toString().slice(-4)}`,
        filename: 'issue.jpg',
        url: ticketData.photo_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
      },
      before_photo: ticketData.photo_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
      after_photo: null,
      tat: null,
      overdue: false,
      update: null,
      reported_by: userProfile?.email_id || 'student@team1.com',
      reported_by_name: userProfile?.name || 'Student Reporter',
      reported_by_role: userProfile?.role || 'student',
      reported_by_dept: userProfile?.dept || 'CSE',
      reported_by_phone_number: userProfile?.phone_number || '9876543210',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      acknowledged_at: null,
      feedback: null,
    };

    store.tickets.unshift(newTicket);
    saveStorageData(store);
    return newTicket;
  }

  async updateTicketStatus(ticketId, status, note, after_photo_file_or_url = null, userProfile) {
    const baseUrl = this.getBaseUrl();
    const isFile = after_photo_file_or_url instanceof File;
    try {
      let body, headers;
      if (isFile) {
        body = new FormData();
        body.append('status', status);
        body.append('note', note);
        body.append('after_photo', after_photo_file_or_url);
        headers = { 'Authorization': `Bearer ${this.token}` };
      } else {
        body = JSON.stringify({ status, note, after_photo_url: after_photo_file_or_url });
        headers = this.getHeaders();
      }
      const res = await fetch(`${baseUrl}/fixit/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers,
        body,
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const ticket = store.tickets.find(t => t.ticket_id === ticketId || t.custom_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.status = status;
    ticket.update = {
      note,
      updated_by: userProfile?.email_id || 'kumar@team1.com',
      updated_by_name: userProfile?.name || 'Kumar Gowda',
      updated_at: new Date().toISOString(),
    };

    if (isFile) {
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(after_photo_file_or_url);
        });
        ticket.after_photo = dataUrl;
      } catch {}
    } else if (after_photo_file_or_url) {
      ticket.after_photo = after_photo_file_or_url;
    } else if (status === 'resolved' && !ticket.after_photo) {
      ticket.after_photo = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60';
    }
    ticket.updated_at = new Date().toISOString();
    saveStorageData(store);
    return ticket;
  }

  async setTurnaroundTime(ticketId, expected_by, note, userProfile) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets/${ticketId}/tat`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ expected_by, note }),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const ticket = store.tickets.find(t => t.ticket_id === ticketId || t.custom_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.tat = {
      expected_by,
      note: note || 'Work scheduled with technician',
      updated_by: userProfile?.email_id || 'kumar@team1.com',
      updated_at: new Date().toISOString(),
    };
    ticket.updated_at = new Date().toISOString();
    saveStorageData(store);
    return ticket;
  }

  async acknowledgeTicket(ticketId, rating = null, comment = null) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets/${ticketId}/acknowledge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const ticket = store.tickets.find(t => t.ticket_id === ticketId || t.custom_id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.status = 'acknowledged';
    ticket.acknowledged_at = new Date().toISOString();
    if (rating) {
      ticket.feedback = {
        rating: Number(rating),
        comment: comment || 'Verified and approved',
        submitted_at: new Date().toISOString(),
      };
    }
    saveStorageData(store);
    return ticket;
  }

  async deleteTicket(ticketId) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    store.tickets = store.tickets.filter(t => t.ticket_id !== ticketId && t.custom_id !== ticketId);
    saveStorageData(store);
    return { message: 'Ticket deleted' };
  }

  async updateTicket(ticketId, updateData) {
    const baseUrl = this.getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/fixit/tickets/${ticketId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const store = getStorageData();
    const t = store.tickets.find(item => item.ticket_id === ticketId || item.custom_id === ticketId);
    if (t) {
      Object.assign(t, updateData, { updated_at: new Date().toISOString() });
      saveStorageData(store);
      return t;
    }
    return null;
  }

  // --- INNOVATION FEATURES ---

  // Check Duplicates in same Location
  checkDuplicates(location, building, room, issue_type_id) {
    const store = getStorageData();
    const locString = (location || `${building} ${room}`).toLowerCase();

    const matches = store.tickets.filter(t => {
      if (t.status === 'acknowledged') return false;
      const tLoc = (t.location || `${t.building} ${t.room}`).toLowerCase();
      const locMatch = tLoc.includes(locString) || locString.includes(tLoc) || (room && t.room === room);
      const catMatch = !issue_type_id || t.issue_type_id === issue_type_id;
      return locMatch && catMatch;
    });

    return {
      has_duplicates: matches.length > 0,
      count: matches.length,
      duplicates: matches,
    };
  }

  // Upvote an existing duplicate ticket (Me Too!)
  upvoteTicket(ticketId, userKey) {
    const store = getStorageData();
    const ticket = store.tickets.find(t => t.ticket_id === ticketId || t.custom_id === ticketId);
    if (ticket) {
      if (!ticket.upvoted_by) ticket.upvoted_by = [];
      if (!ticket.upvoted_by.includes(userKey)) {
        ticket.upvoted_by.push(userKey);
        ticket.upvotes = (ticket.upvotes || 0) + 1;
        if (ticket.upvotes >= 3 && ticket.priority === 'medium') ticket.priority = 'high';
        if (ticket.upvotes >= 5 && ticket.priority === 'high') ticket.priority = 'critical';
        saveStorageData(store);
      }
      return ticket;
    }
    return null;
  }

  // Smart Priority Engine
  detectSmartPriority(title = '', description = '') {
    const text = `${title} ${description}`.toLowerCase();
    if (/(exposed|wire|shock|spark|smoke|fire|gas|flame|collapse|hazard|live wire|short circuit)/i.test(text)) {
      return {
        priority: 'critical',
        label: 'CRITICAL',
        color: 'red',
        rationale: '⚡ Immediate safety/electrical hazard detected. Urgent dispatch required (SLA: 2-4 Hours).',
        slaHours: 4,
      };
    }
    if (/(leak|burst|flood|broken pipe|no power|fan not working|lift|elevator|switch board broke)/i.test(text)) {
      return {
        priority: 'high',
        label: 'HIGH',
        color: 'amber',
        rationale: '⚠️ Significant classroom or facility disruption (SLA: 12 Hours).',
        slaHours: 12,
      };
    }
    if (/(tube light|projector|flicker|chair|bench|desk|door lock|wi-fi)/i.test(text)) {
      return {
        priority: 'medium',
        label: 'MEDIUM',
        color: 'blue',
        rationale: 'Standard maintenance issue to be resolved within regular shift (SLA: 24 Hours).',
        slaHours: 24,
      };
    }
    return {
      priority: 'low',
      label: 'LOW',
      color: 'slate',
      rationale: 'Minor routine maintenance or cosmetic touchup (SLA: 48 Hours).',
      slaHours: 48,
    };
  }

  // Campus Maintenance Heatmap calculation
  getCampusHeatmapData() {
    const store = getStorageData();
    const blocks = [
      { id: 'Block A', name: 'Academic Block A', code: 'BLK-A', x: 22, y: 32, floors: 4, rooms: ['101', '102', '201', '202', '301'] },
      { id: 'Block B', name: 'Engineering Block B', code: 'BLK-B', x: 50, y: 32, floors: 4, rooms: ['203', '204', '301', '302', 'Lab 1'] },
      { id: 'Science Block', name: 'Science & Lab Wing', code: 'SCI-W', x: 78, y: 32, floors: 3, rooms: ['Lab 1', 'Lab 2', 'Chem Lab', 'Physics Lab'] },
      { id: 'Library', name: 'Central Library', code: 'LIB-C', x: 30, y: 72, floors: 3, rooms: ['Reading Hall', '2nd Floor', 'Digital Library'] },
      { id: 'Canteen', name: 'Food Court & Canteen', code: 'FOOD-C', x: 55, y: 75, floors: 2, rooms: ['Main Dining', 'Kitchen Area', 'Faculty Lounge'] },
      { id: 'Admin Block', name: 'Administrative Building', code: 'ADM-B', x: 82, y: 72, floors: 3, rooms: ['Seminar Hall 1', 'Office 104', 'Boardroom'] },
    ];

    return blocks.map(block => {
      const tickets = store.tickets.filter(t => t.building === block.id || (t.location && t.location.includes(block.id)));
      const open = tickets.filter(t => t.status === 'open');
      const critical = open.filter(t => t.priority === 'critical');
      const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'acknowledged');

      let heat = 'low';
      if (critical.length > 0 || open.length >= 5) heat = 'critical';
      else if (open.length >= 3) heat = 'high';
      else if (open.length >= 1) heat = 'moderate';

      return {
        ...block,
        total: tickets.length,
        open: open.length,
        critical: critical.length,
        resolved: resolved.length,
        heat,
      };
    });
  }

  // Reset to default seed
  resetData() {
    localStorage.removeItem('FIXIT_STORE');
    return getStorageData();
  }
}

export const downloadPhoto = async (url, defaultName = 'campus-photo.jpg') => {
  if (!url) return;
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const api = new FixItAPI();
export default api;

