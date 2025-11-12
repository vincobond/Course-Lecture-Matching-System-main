# Course-Lecturer-Student Matching System

A comprehensive web-based academic platform built with React, Vite, Tailwind CSS, and Convex (BaaS) for efficient course management and automatic lecturer-student matching.

## 🎯 Features

- **Role-based Authentication**: Admin, Lecturer, and Student dashboards
- **Automatic Matching**: AI-powered course-lecturer matching based on specialization
- **Course Management**: Add, edit, and manage courses with detailed information
- **Student Registration**: Students can register for courses and view assigned lecturers
- **Real-time Updates**: Live data synchronization using Convex
- **Academic Theme**: Clean, professional design optimized for educational institutions

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Convex (Backend-as-a-Service)
- **Authentication**: Convex Auth
- **Icons**: Lucide React
- **UI Components**: Custom components with ShadCN UI patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-lecturer-matching-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project.

4. **Configure environment variables**
   Create a `.env.local` file with your Convex deployment URL:
   ```
   VITE_CONVEX_URL=your_convex_deployment_url_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── forms/           # Form components
│   ├── tables/          # Table components  
│   └── dashboard/       # Dashboard-specific components
├── pages/
│   ├── AdminDashboard.jsx
│   ├── LecturerDashboard.jsx
│   ├── StudentDashboard.jsx
│   └── Login.jsx
├── convex/
│   ├── functions/       # Convex backend functions
│   └── schema.js       # Database schema
├── lib/
│   └── convexClient.js # Convex client configuration
├── routes/
│   └── AppRoutes.jsx   # Application routing
├── App.jsx
├── main.jsx
└── index.css          # Global styles with academic theme
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Academic Blue (#1E3A8A)
- **Accent**: Bright Blue (#2563EB)
- **Background**: Light Gray (#F9FAFB)
- **Success**: Green (#16A34A)
- **Error**: Red (#DC2626)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Inter Bold
- **Body**: Inter Regular

## 🔧 Key Components

### Admin Dashboard
- **Lecturers Tab**: Manage lecturer information and specializations
- **Courses Tab**: Add/edit courses with detailed metadata
- **Students Tab**: Student management and registration tracking
- **Matches Tab**: View and manage course-lecturer assignments

### Lecturer Dashboard
- View assigned courses
- See registered students
- Update availability and specialization
- Course management tools

### Student Dashboard
- Browse available courses
- Register for courses
- View assigned lecturers
- Track academic progress

## 🤖 Auto-Matching Algorithm

The system automatically matches courses to lecturers based on:

1. **Specialization Matching**: Exact match between course and lecturer specialization
2. **Availability**: Only available lecturers are considered
3. **Experience Priority**: More experienced lecturers are preferred
4. **Manual Override**: Admins can manually adjust matches

## 📊 Database Schema

### Core Tables
- **users**: Authentication and basic user info
- **lecturers**: Lecturer-specific information
- **students**: Student-specific information  
- **courses**: Course details and metadata
- **matches**: Course-lecturer assignments
- **registrations**: Student course enrollments

## 🔐 Authentication

The system uses Convex Auth for secure, role-based authentication:

- **Admin**: Full system access
- **Lecturer**: Course and student management
- **Student**: Course registration and viewing

## 🚀 Deployment

### Convex Deployment
```bash
npx convex deploy
```

### Frontend Deployment
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the Convex documentation for backend-related questions

---

Built with ❤️ for educational institutions


