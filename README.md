# Employee Performance Analytics & Recommendation System

A full-stack MERN application for HR teams to manage employees, track performance, and get AI-powered recommendations for promotions, training, and skill development.

---

## What it does

HR/Admin users can sign up and log in securely. Once logged in, they can add employees with details like department, skills, performance score, and years of experience. The dashboard shows overall stats and ranks all employees by performance. The AI recommendation feature sends employee data to an AI model and returns a detailed analysis — whether the employee is ready for promotion, what training they need, and an overall development roadmap.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenRouter API |

---

## Screenshots

> Dashboard, Employee List, Add Employee form, and AI Recommendation output.

*(Add your screenshots here)*

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register a new HR/Admin user |
| POST | /api/auth/login | Login and receive a JWT token |
| GET | /api/auth/me | Get the currently logged-in user |

### Employees *(all protected — require JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/employees | Add a new employee |
| GET | /api/employees | Get all employees |
| GET | /api/employees/search?department=X&name=Y | Search/filter employees |
| GET | /api/employees/:id | Get a single employee by ID |
| PUT | /api/employees/:id | Update employee details |
| DELETE | /api/employees/:id | Delete an employee |

### AI *(protected)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/recommend | Get AI recommendation for one or all employees |

---

## Employee Data Model

```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

---

## AI Recommendation Output

Given an employee's data, the AI returns:

- **Promotion Recommendation** — yes/no with detailed reasoning
- **Training Suggestions** — specific courses and resources tailored to skill gaps
- **Overall Feedback** — a 12-month development roadmap

For multiple employees, it returns a ranked list with individual feedback for each.

---

## Running Locally

### Requirements
- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`. API calls are proxied to `http://localhost:5000`.

---

## Deployment

This project is deployed on [Render](https://render.com).

- **Backend** — Node.js Web Service, root: `backend/`
- **Frontend** — Static Site, root: `frontend/`, build command: `npm run build`
- **Database** — MongoDB Atlas (cloud)

| | URL |
|-|-----|
| Live Frontend | `https://your-frontend.onrender.com` |
| Backend API | `https://your-backend.onrender.com` |

---

## Project Structure

```
employee-analytics/
├── backend/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth guard, error handler
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   └── server.js
└── frontend/
    └── src/
        ├── components/     # Navbar, PrivateRoute
        ├── context/        # Auth state (JWT)
        ├── pages/          # Login, Signup, Dashboard, Employees, AI
        └── services/       # Axios API calls
```

---


