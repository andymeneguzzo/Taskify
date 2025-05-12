# 📝 Taskify - Task Management Application

A full-stack Task Management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).  
Easily create, track, and manage your tasks — anytime, anywhere.

## 🌐 Live Demo
🔗 [https://taskify-frontend-weld.vercel.app/](#) (Add your Netlify/Vercel link here)

---

## 🚀 Features

- ✅ User Registration & Authentication with JWT
- 🔐 Secure password hashing with bcrypt
- 🗃️ Complete CRUD operations for tasks (Create, Read, Update, Delete)
- 📌 Task status management (complete/incomplete)
- 🔍 Filter tasks by status (All, Complete, Incomplete)
- 🏷️ Task categorization (Work, Personal, Study, etc.)
- 📱 Fully responsive design for mobile and desktop
- 🔄 Real-time updates with React state management
- 🎨 Clean and intuitive user interface
- 🔒 Protected routes for authenticated users

---

## ⚙️ Tech Stack

### 🧠 Frontend
- **React.js** (v19.1.0) - UI library
- **React Router** (v7.6.0) - For navigation and routing
- **Axios** (v1.9.0) - HTTP client for API requests
- **Context API** - For state management
- **CSS** - For styling components

### 🔐 Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **MongoDB** (v6.16.0) - NoSQL database
- **Mongoose** (v8.14.2) - MongoDB object modeling
- **JWT** (jsonwebtoken v9.0.2) - For authentication
- **Bcrypt** (v5.1.1) - For password hashing
- **CORS** - For cross-origin resource sharing
- **dotenv** - For environment variables

### 🧰 Development Tools
- **Nodemon** - For hot-reloading during development
- **React Testing Library** - For frontend testing

---

## 📸 Screenshots

   ![Task Creation - Light](./screenshots/task-creation-light.png)
   ![Task Creation - Dark](./screenshots/task-creation-dark.png)
   ![Task View - Light](./screenshots/task-view-light.png)
   ![Task View - Dark](./screenshots/task-view-dark.png)
   ![Custom Calendar](./screenshots/custom-calendar.png)
   ![Notifications](./screenshots/notifications.png)
---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

### 2. Set up backend
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
# Example:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify
# JWT_SECRET=your_jwt_secret
# PORT=5000
npm run dev
```

### 3. Set up frontend
```bash
cd frontend
npm install
npm start
```

### 4. Access the application
Open your browser and navigate to `http://localhost:3000`

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.