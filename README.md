# SkillShare Platform - Phase 2 🚀

SkillShare is a modern, full-stack MERN educational video learning platform built for discovering and sharing knowledge. In this latest Phase 2 version, the platform has been completely overhauled with a clean Light Theme SaaS aesthetic and now supports **Dual Storage** uploading (both external Telegram links and native Cloudinary video streaming).

## Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS v3, React Router DOM
* **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Auth, Bcrypt
* **Storage Processing:** Cloudinary SDK, Multer (Disk Storage proxying)
* **Styling:** Clean, modern Light Theme UI with `react-hot-toast` notifications.

## Key Features
* Secure JWT Authentication (Login/Register/Protected Dashboard)
* **Dual Upload Methods**: Let creators submit lightweight Telegram fallback links OR physically upload heavyweight MP4s & Custom Thumbnails natively parsing through the backend.
* **Smart Watch Engine**: Dynamically embeds native HTML5 video players for Cloudinary content while gracefully redirecting Telegram links.
* Clean and highly responsive UI suitable for professional portfolio demonstrations.

## Prerequisites
* Node.js (v18+)
* MongoDB (running locally on port `27017` or a valid Atlas URI)
* A free [Cloudinary](https://cloudinary.com/) account for API credentials

---

## Installation & Setup

### 1. Clone & Install Dependencies
First, install the library packages for both the backend server and frontend client.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
In the `backend` folder, duplicate the `.env.example` file and rename it to `.env`. Ensure your MongoDB and Cloudinary keys are active:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillshare
JWT_SECRET=supersecretjwtkeyforcodingproject123

# Cloudinary Setup for Native Video/Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed Database (Optional)
To test out the UI immediately, populate the local MongoDB database with dummy creators and educational videos:
```bash
cd backend
node seed.js
```

### 4. Run the Application
Open two separate terminals to boot up the environment.

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# The API will boot on http://localhost:5000
```

**Terminal 2 - Frontend Client:**
```bash
cd frontend
npm run dev
# The Client will boot on http://localhost:5173 
```

Navigate your browser to `http://localhost:5173` to explore SkillShare. Happy coding!
