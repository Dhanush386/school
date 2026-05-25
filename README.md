# EduManage Pro — School ERP System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

A comprehensive, modern international school ERP management system with role-based access, real-time notifications, and a premium dark-mode UI.

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Configure environment
#    Edit server/.env with your MongoDB URI and JWT secret
#    (a template is already created at server/.env)

# 3. Seed demo data
npm run seed

# 4. Start development
npm run dev
```

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000

---

## 🔑 Demo Accounts

| Role | Login ID | Password |
|------|----------|----------|
| Student | STU001 | STU001 |
| Teacher | TCH001 | TCH001 |
| Principal | PRN001 | PRN001 |
| Admin | ADM001 | ADM001 |
| Coordinator | CRD001 | CRD001 |

> **Note:** All demo accounts have `mustChangePassword: false` so you can log in directly.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | SPA framework |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | Animations |
| Recharts | Data visualization |
| React Icons | Icon library |
| React Router v6 | Client-side routing |
| Socket.io-client | Real-time notifications |
| Axios | HTTP client |
| react-hot-toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| Socket.io | WebSocket server |
| JWT | Authentication |
| bcryptjs | Password hashing |
| node-cron | Scheduled jobs |
| pdf-lib | PDF generation |
| multer | File uploads |
| morgan | HTTP logging |

---

## 📁 Folder Structure

```
School/
├── client/                    # React frontend
│   └── src/
│       ├── animations/        # Framer Motion configs
│       ├── api/               # Axios instance
│       ├── components/        # Reusable components
│       │   ├── layout/        # Sidebar, Navbar, Layout
│       │   ├── ui/            # Badge, Spinner, StatCard
│       │   ├── tables/        # DataTable
│       │   └── modals/        # ConfirmModal
│       ├── constants/         # Roles, routes, menuConfig
│       ├── context/           # AuthContext, SocketContext
│       ├── pages/             # All page components
│       │   ├── auth/          # Login, ChangePassword
│       │   ├── dashboard/     # Per-role dashboards
│       │   ├── academic/      # Timetable, Attendance, QuestionBank
│       │   ├── fees/          # FeeOverview
│       │   ├── hostel/        # HostelApplication
│       │   ├── library/       # LibraryPage
│       │   ├── transport/     # RouteView
│       │   ├── feedback/      # SubmitFeedback
│       │   ├── core/          # ComplaintTracker
│       │   ├── admission/     # CertificateRequest
│       │   └── hrd/           # HRDPage
│       ├── routes/            # AppRouter, ProtectedRoute
│       ├── services/          # API service functions
│       └── styles/            # globals.css
└── server/                    # Express backend
    ├── config/db.js
    ├── controllers/           # Route handlers
    ├── cron/                  # Scheduled jobs
    ├── middleware/            # Auth, ErrorHandler, Upload
    ├── models/                # 12 Mongoose models
    ├── permissions/           # Centralized role permissions
    ├── routes/                # Express route files
    ├── socket/                # Socket.io handler
    ├── utils/                 # Seed, PDF generators, ID generator
    └── validators/            # Joi validation schemas
```

---

## ✨ Features

| Module | Features |
|---|---|
| **Auth** | Institutional Login IDs, bcrypt, JWT, forced first-login password change |
| **Dashboard** | Role-specific dashboards (Student, Teacher, Principal, Admin, Coordinator) |
| **Academic** | Timetable, Attendance marking, Question Bank with approval workflow |
| **Fees** | Fee overview, online payment (UPI/Card/Net Banking/QR), receipt PDF |
| **Hostel** | Application, room allocation, leave requests |
| **Library** | Book catalog, eBook reader, issue/return tracking, fine calculation |
| **Transport** | Route management, student subscription, stop-wise pickup |
| **Feedback** | Dynamic forms, star ratings, analytics for principal |
| **Grievances** | Complaint submission, admin response, status tracking |
| **Certificates** | Bonafide, Transfer, Character, Completion — with PDF generation |
| **HRD** | Staff directory, leave management |
| **Notifications** | Real-time via Socket.io |

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render)
1. Create a new **Web Service** on Render
2. Set environment variables from `server/.env`
3. Build command: `npm install`
4. Start command: `npm start`

### Database (MongoDB Atlas)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add your connection string to `server/.env` → `MONGO_URI`
3. Whitelist `0.0.0.0/0` in Network Access for cloud deployment

---

## 📄 License

MIT © EduManage Pro
