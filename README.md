# FixIt · Smart Campus Maintenance System 🛠️
> **"Scan it. Report it. Fix it."**

A modern, full-stack, enterprise-grade Campus Maintenance System built for **CampusOS Hackathon**. Designed strictly following the **CampusOS API Guide (FixIt Table & Specifications)**, the UI/UX mockups, and handwritten architectural wireframes.

---

## 🌟 The 6 Impressive Innovative Features

1. **Smart QR Code + Zero-Friction Location Reporting**
   - **Slogan:** *"Scan it. Report it. Fix it."*
   - Students can scan physical classroom QR stickers to report issues **without logging in** or within the student portal.
   - Automatically decodes and pre-populates `Building`, `Floor`, and `Room` (e.g. *Classroom 203, Block B, 2nd Floor*) without relying on inaccurate GPS/Geolocation APIs.
   - Includes a built-in **Classroom QR Generator** for campus maintenance staff to generate, download, and print stickers for every campus room.

2. **Smart Priority Detection Engine**
   - Real-time heuristic AI analysis classifies safety hazards as user types:
     - ⚡ **CRITICAL** (SLA 2-4h): Exposed wire, electrical shock, spark, smoke, fire hazard.
     - ⚠️ **HIGH** (SLA 12h): Water pipeline burst, fan failure, elevator malfunction.
     - 🕒 **MEDIUM** (SLA 24h): Flickering light, projector display glitch, broken desk.
     - 🟢 **LOW** (SLA 48h): Wall paint, routine dusting, loose latch.
   - Generates an instant AI Priority Badge with safety rationale and response target.

3. **Duplication Detection & "Me Too" Engine**
   - Automatically cross-checks open issues in the same classroom/hall (e.g. *Classroom 203*).
   - If a duplicate exists, alerts the student: *"Ticket #FIX-1008 already reported for Classroom 203. Status: In Progress."*
   - Provides a **"Me Too! / Upvote"** button that increments urgency without creating duplicate ticket clutter for technicians.

4. **Maintenance Response Time & Turnaround Time (TAT) Countdown**
   - Dynamic SLA countdown timer running on ticket cards and details.
   - Automatically calculates remaining time based on priority SLA or supervisor's custom TAT target (`expected_by`).
   - Flashes an urgent **"OVERDUE"** badge when deadline is exceeded.

5. **Proof of Repair (Before & After Photos) + Student Feedback**
   - Maintenance technicians upload **"After Repair"** verification photos upon marking an issue resolved.
   - Interactive draggable **Before/After Image Slider** for split-screen inspection.
   - Students inspect the visual proof, rate workmanship (1-5 Stars), and submit verification feedback upon closing (`acknowledged`).

6. **Interactive Campus Maintenance Heatmap**
   - High-tech, live visual representation of campus blocks: *Block A, Block B (Engineering), Science Block, Central Library, Food Court/Canteen, Admin Block*.
   - Color-coded hazard density:
     - 🔴 **Critical Hotspot:** Active safety hazards or 5+ open complaints (e.g. Block B).
     - 🟠 **High:** 3-4 open complaints.
     - 🟡 **Moderate:** 1-2 open complaints.
     - 🟢 **Clear / Healthy:** 0 open complaints.
   - 1-click filtering by building block.

---

## ⚡ Classroom 203 Scenario Simulation (1-Click Walkthrough)

The exact scenario from the competition brief is built into the top navigation:
> **Scenario:** *Classroom 203 ka electrical wire exposed hai.*
1. **Step 1:** Student scans Classroom 203 QR tag.
2. **Step 2:** Location auto-fills as *Classroom 203, Block B, 2nd Floor*.
3. **Step 3:** Student uploads exposed wire hazard photo.
4. **Step 4:** System priority engine flags it as **CRITICAL**.
5. **Step 5:** Maintenance dashboard triggers urgent audio-visual alert.
6. **Step 6:** Maintenance accepts ticket and sets emergency 2-hour TAT.
7. **Step 7:** Technician repairs wire and uploads Before/After proof photos.
8. **Step 8:** Student verifies repair on split slider and acknowledges with 5-star feedback.
9. **Step 9:** Admin and Maintenance dashboards update in real time.

Click **"Classroom 203 Scenario"** in the top navigation bar to run this interactive live simulation anytime!

---

## 👥 3 Separate Role Portals & Credentials

| Role | Permitted Login Email | OTP | Policy & Access |
|---|---|---|---|
| **Administrator (Restricted)** | `admin@team29.com` | `004712` | **Strictly Admin Only:** Sirf `admin@team29.com` aur OTP `004712` ko Administrator control panel access karne ki authority hai. |
| **Student** | Any Gmail / Email (e.g. `mahesh@gmail.com`) | Apki Marji / `123456` | **Open Student Portal:** Students apna personal Gmail ya college email freely use karke complaint raise, QR scan, aur verification kar sakte hain. |
| **Maintenance Staff** | Any Gmail / Staff Email (e.g. `kumar.staff@gmail.com`) | Apki Marji / `730792` | **Open Staff Portal:** Maintenance staff apne kisi bhi Gmail/email se work order dashboard, TAT aur repair photos manage kar sakte hain. |

*(You can also use the **1-Click Fast Login** buttons on the Login page or the persona switcher pill in the top bar to jump between roles instantly!)*

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Backend:** Node.js, Express.js, Multer (multipart file upload support), CORS.
- **API Spec:** CampusOS REST API (`/api/v1/auth/*`, `/api/v1/fixit/*`, `/api/v1/admin/*`).
- **Storage:** Dual-mode architecture (Seamless fallback between local persistent browser storage and real CampusOS HTTP backend).

---

## 🚀 Running the Project

### Recommended: start frontend + backend together
```bash
npm run dev
```
This runs the Express API on [http://localhost:5000](http://localhost:5000) and the Vite app on [http://localhost:5173](http://localhost:5173) (open that in your browser).

> If only the frontend is running, every `/api/*` request fails with **500 Internal Server Error** because the Vite proxy has nothing to forward to on port 5000.

### Run them separately (two terminals)
```bash
npm run dev:web   # frontend only (Vite)
npm run dev:api   # backend only (Express)
```
Server runs on [http://localhost:5000](http://localhost:5000) and exposes the full CampusOS API endpoints.

---

## 📜 CampusOS API Endpoints Implemented

- `GET /api/v1/health` (Health check / live-backend indicator)
- `POST /api/v1/auth/login` (Student, Faculty, Maintenance login)
- `POST /api/v1/auth/admin/login` (Admin login)
- `GET /api/v1/users/me` & `GET /api/v1/admin/me` (Profile retrieval)
- `GET /api/v1/admin/users` (List users with OTPs)
- `POST /api/v1/admin/users` (Register users with role validation)
- `POST /api/v1/admin/users/{email_id}/regenerate-otp` (Regenerate OTP)
- `DELETE /api/v1/admin/users/{email_id}` (Delete user)
- `GET /api/v1/fixit/issue-types` (List issue categories)
- `POST /api/v1/fixit/issue-types` (Add category - Maintenance only)
- `DELETE /api/v1/fixit/issue-types/{id}` (Delete category - Maintenance only)
- `GET /api/v1/fixit/tickets` (List tickets with status, issue_type_id, mine filters)
- `GET /api/v1/fixit/tickets/{ticket_id}` (Ticket details)
- `POST /api/v1/fixit/tickets` (Create ticket with photo, title, room, priority)
- `PUT /api/v1/fixit/tickets/{ticket_id}/status` (Update status to open/resolved with notes & before/after proof)
- `PUT /api/v1/fixit/tickets/{ticket_id}/tat` (Set expected completion date)
- `POST /api/v1/fixit/tickets/{ticket_id}/acknowledge` (Student confirmation and closure)
- `DELETE /api/v1/fixit/tickets/{ticket_id}` (Delete ticket)

