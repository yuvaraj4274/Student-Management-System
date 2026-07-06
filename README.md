# Student Management System

A full stack MERN application (MongoDB, Express, React, Node.js) for managing
students, courses, and enrollment. Built from the project specification with
a green and white visual theme.

## Project structure

```
student-management-system/
  server/     Express + MongoDB API (JWT authentication, students, courses)
  client/     React (Vite) frontend
```

## Features

- Admin login with JWT authentication and hashed passwords
- Dashboard with total students, total courses, and active students
- Student management: add, view, edit, delete, search by name/ID/course
- Course management: add, view, edit, delete
- Assign a course to a student when creating or editing a record
- Responsive layout with a sidebar, data tables, and slide-in forms

## Prerequisites

- Node.js 18 or newer
- A MongoDB database, either:
  - running locally (`mongodb://127.0.0.1:27017`), or
  - a free cluster on MongoDB Atlas

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set:

- `MONGO_URI` to your MongoDB connection string
- `JWT_SECRET` to any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` to the admin login you want to use

Create the default admin account:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default. You can confirm it is
running by visiting `http://localhost:5000/api/health`.

## 2. Frontend setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`. Log in with the admin email and
password you set in `server/.env`.

## API reference

| Method | Endpoint              | Description                  |
|--------|-----------------------|-------------------------------|
| POST   | /api/auth/login        | Log in and receive a token   |
| POST   | /api/auth/logout       | Log out                      |
| GET    | /api/auth/me           | Get the current admin        |
| GET    | /api/dashboard/stats    | Dashboard counts             |
| GET    | /api/students           | List students (supports ?search=) |
| GET    | /api/students/:id       | Get one student               |
| POST   | /api/students           | Create a student              |
| PUT    | /api/students/:id       | Update a student              |
| DELETE | /api/students/:id       | Delete a student              |
| GET    | /api/courses            | List courses                  |
| GET    | /api/courses/:id        | Get one course                |
| POST   | /api/courses            | Create a course                |
| PUT    | /api/courses/:id        | Update a course                |
| DELETE | /api/courses/:id        | Delete a course                |

All routes except `/api/auth/login` and `/api/auth/logout` require an
`Authorization: Bearer <token>` header, which the frontend attaches
automatically once you are logged in.

## Notes

- Passwords are hashed with bcrypt before being stored.
- Deleting a course that is still assigned to students is blocked until
  those students are reassigned or removed.
- The color theme (deep green, white, and off-white) is defined in
  `client/src/styles/index.css` if you want to adjust it.
