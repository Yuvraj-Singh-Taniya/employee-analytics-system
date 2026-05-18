# AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter (Llama 3.1 8B free model).

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: OpenRouter API (meta-llama/llama-3.1-8b-instruct:free)
- **Auth**: JWT + bcryptjs

## Project Structure

```
employee-analytics/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Employee.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   └── PrivateRoute.js
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── Dashboard.js
        │   ├── EmployeeList.js
        │   ├── AddEmployee.js
        │   └── AIRecommend.js
        ├── services/
        │   └── api.js
        ├── App.js
        └── index.js
```

## Setup & Run Locally

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user (protected) |

### Employees (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/employees | Add employee |
| GET | /api/employees | Get all employees |
| GET | /api/employees/search?department=X&name=Y | Search employees |
| GET | /api/employees/:id | Get single employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

### AI (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/recommend | Get AI recommendation |

## Sample Request Bodies

### Add Employee
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

### AI Recommend (single employee)
```json
{ "employeeId": "<mongodb_id>" }
```

### AI Recommend (all employees ranked)
```json
{}
```

## Deployment

- Backend: Render (Web Service, Node)
- Frontend: Render (Static Site, `npm run build`)
- Database: MongoDB Atlas

## Environment Variables (Backend)

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```
