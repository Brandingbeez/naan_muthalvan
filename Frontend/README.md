# LMS Frontend

React + Vite frontend application for the BrandingBeez Learning Management System.

## 🚀 Tech Stack

- **Framework**: React 19.x
- **Build Tool**: Vite 7.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 5.x
- **Video Player**: React Player
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v18 or higher)
- Backend API running (see `backend/README.md`)

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The app will open at `http://localhost:5173` (or the next available port).

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── AppNavbar.jsx
│   │   ├── Breadcrumb.jsx
│   │   └── Loading.jsx
│   ├── pages/             # Page components
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Courses/
│   │   │   ├── CourseList.jsx
│   │   │   └── CourseDetails.jsx
│   │   ├── Learning/
│   │   │   ├── SessionOverview.jsx
│   │   │   ├── SessionMaterial.jsx
│   │   │   ├── SessionPpt.jsx
│   │   │   └── SessionVideo.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AddCourse.jsx
│   │       ├── AddSection.jsx
│   │       └── AddSession.jsx
│   ├── routes/            # Route protection components
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── services/          # API service functions
│   │   ├── api.js         # Axios instance
│   │   ├── authService.js
│   │   ├── lmsService.js
│   │   └── uploadService.js
│   ├── state/             # Global state management
│   │   └── AuthContext.jsx
│   ├── App.jsx            # Main app component
│   ├── App.css            # App-specific styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (gitignored)
├── .env.example           # Example environment variables
├── package.json
└── vite.config.js        # Vite configuration
```

## 🎨 Features

### Authentication
- User registration with role selection (User/Admin)
- Login with JWT token
- Protected routes (require authentication)
- Admin-only routes
- Automatic token refresh on page reload

### Course Management
- Hierarchical course structure (Academy → Categories → Courses)
- Course listing with folder-style navigation
- Course details with sections and sessions
- Breadcrumb navigation

### Learning Experience
- Session overview with three content types:
  - 📄 Study Material (PDF viewer)
  - 📊 Classroom PPT (Office online viewer)
  - 🎥 Video Lecture (React Player with fullscreen)
- Responsive design for all screen sizes

### Admin Dashboard
- Create courses with thumbnail upload
- Create sections for courses
- Create sessions with file uploads:
  - Video files (MP4, WebM, MOV)
  - PDF study materials
  - PowerPoint presentations
- Real-time upload progress indicators

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Authentication Flow

1. User registers/logs in via `/login` or `/register`
2. JWT token is stored in `localStorage`
3. Token is automatically attached to API requests via Axios interceptor
4. Protected routes check authentication status
5. Admin routes additionally check for admin role

## 📡 API Integration

The frontend communicates with the backend API through service functions:

- **authService.js**: Login, register
- **lmsService.js**: Courses, sections, sessions CRUD
- **uploadService.js**: File uploads (thumbnail, PDF, PPT, video)

All API calls use the Axios instance configured in `services/api.js` with:
- Base URL from environment variables
- Automatic JWT token attachment
- Error handling for 401 (unauthorized) responses

## 🎯 Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)
- `/courses` - Course list
- `/courses/:courseId` - Course details
- `/courses/:courseId/:subCourseId` - Sub-course details
- `/learn/:sessionId` - Session overview
- `/learn/:sessionId/material` - PDF viewer
- `/learn/:sessionId/ppt` - PPT viewer
- `/learn/:sessionId/video` - Video player

### Admin Routes (Require Admin Role)
- `/admin` - Admin dashboard
- `/admin/courses/new` - Create course
- `/admin/sections/new` - Create section
- `/admin/sessions/new` - Create session

## 🎨 Styling

- **Bootstrap 5**: Responsive grid system, components, utilities
- **Custom CSS**: Brand colors, gradients, animations
- **Responsive Design**: Mobile-first approach

### Color Scheme
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Gradient backgrounds for cards and buttons

## 📱 Responsive Breakpoints

- Mobile: < 576px
- Tablet: 576px - 992px
- Desktop: > 992px

## 🔄 State Management

Uses React Context API for global state:

- **AuthContext**: Authentication state, user info, login/logout functions
- Accessed via `useAuth()` hook throughout the app

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy
The `dist/` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

**Important**: Update `VITE_API_URL` in `.env` to point to your production API URL before building.

## 🐛 Troubleshooting

### API Connection Issues
- Verify `VITE_API_URL` in `.env` matches your backend URL
- Check backend server is running
- Verify CORS is configured correctly on backend

### Authentication Issues
- Clear `localStorage` and try logging in again
- Check browser console for errors
- Verify JWT token is being stored correctly

### File Upload Issues
- Check file size limits (backend enforces limits)
- Verify Cloudinary credentials are set on backend
- Check browser console for detailed error messages

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (requires v18+)

## 📚 Key Dependencies

- **react**: ^19.2.0 - UI library
- **react-dom**: ^19.2.0 - React DOM renderer
- **react-router-dom**: ^7.12.0 - Client-side routing
- **axios**: ^1.13.2 - HTTP client
- **bootstrap**: ^5.3.8 - CSS framework
- **react-player**: ^3.4.0 - Video player component

## 🔒 Security Notes

- JWT tokens stored in `localStorage` (consider httpOnly cookies for production)
- API URLs should use HTTPS in production
- Environment variables should never be committed to git

## 📄 License

ISC
