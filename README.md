# HireHub 🚀

**HireHub** is a cutting-edge, real-time recruitment platform designed to bridge the gap between recruiters and job seekers. Built with a focus on speed, user experience, and aesthetic excellence, HireHub provides a premium "Hiring Command Center" for modern teams.

## ✨ Key Features

### 💬 Real-time Messaging System

- **Instant Communication**: Seamless, low-latency chat interface between recruiters and job seekers.
- **Mobile Responsive**: Fully optimized chat experience that works perfectly on all device sizes.
- **Real-time Updates**: Powered by Supabase real-time subscriptions for instant message delivery.

### 📋 Intelligent Kanban Pipeline

- **Visual Application Tracking**: Manage candidates through a professional Kanban-style board.
- **Header Actions**: Quick access to Resumes, Cover Letters, and Messaging directly from the card header.
- **Dynamic Status Updates**: Smooth drag-and-drop-like interface for moving applicants through hiring stages.

### 🌓 Premium User Experience

- **Glassmorphic Design**: A stunning, modern UI with polished transparency and blur effects.
- **Dark/Light Mode**: Full theme customization with smooth animated transitions.
- **AI Profile Auto-fill**: Simulated AI-powered resume scanning to instantly fill in skills and bio details.

### 👤 Profile & Portfolio Management

- **Avatar Customization**: Support for custom image uploads and professional initials-based fallback avatars.
- **Resume Hosting**: Centralized storage for candidate resumes and cover letters.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hirehub.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌍 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Connect your GitHub repository to Vercel.
2. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables.
3. Deploy!

## 📜 Database Setup

To enable all features, run the following SQL scripts in your Supabase SQL Editor:

1. `setup_messaging.sql`: Creates conversations and messages tables.
2. `setup_avatars_bucket.sql`: Configures storage for profile pictures.

---

Built with ❤️ for modern recruiters and job seekers.
