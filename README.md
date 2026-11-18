# MERN Task Manager

A beginner-friendly full-stack Task Manager built with MongoDB, Express, React (Vite), Node.js, and Mongoose.

## Features
- Create, list, edit, complete/uncomplete, and delete tasks
- MongoDB persistence through Mongoose
- React frontend with loading and error states
- Express REST API
- Environment-based configuration

## Requirements
- Node.js and npm
- MongoDB locally, or a MongoDB Atlas connection string

## Folder structure
```text
mern-task-manager/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── server/                 # Express API
    ├── controllers/
    ├── models/
    ├── routes/
    ├── .env.example
    ├── server.js
    └── package.json
```

## 1. Configure MongoDB
Copy `server/.env.example` to `server/.env` and set `MONGO_URI`.

Example for a local MongoDB installation:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_task_manager
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, use your Atlas connection string instead. Keep `.env` private and do not commit it to GitHub.

## 2. Start the backend
Open a terminal in the `server` folder:
```bash
npm install
npm run dev
```
The API runs at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to check it.

## 3. Start the frontend
Open another terminal in the `client` folder:
```bash
npm install
npm run dev
```
Open the URL Vite prints, usually `http://localhost:5173`.

The frontend expects the API at `http://localhost:5000/api` by default. To change it, copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update title/completed |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/health` | Health check |

## Troubleshooting
- If `npm` itself errors, fix the Node.js/npm installation before running `npm install`.
- If the backend cannot connect to MongoDB, verify that MongoDB is running and that `MONGO_URI` is correct.
- If the frontend cannot reach the API, check that the backend is running and `VITE_API_URL` is correct.
- Run `npm install` separately inside both `client` and `server`.
