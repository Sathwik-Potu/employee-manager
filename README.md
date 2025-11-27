#  Employee & Task Management System

A full-stack application for managing Employees and Tasks, built with React (Frontend) and FastAPI (Backend).

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Python, FastAPI, Motor (Async MongoDB driver)
- **Database**: MongoDB

## Setup Steps

### Prerequisites
- Node.js and npm installed
- Python 3.8+ installed
- MongoDB 

### Backend Setup
1. Open a terminal in the main project folder.
2. Create a `.env` file in the `backend` folder and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Run the server (from the main folder):
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment (Render)

This project includes a `render.yaml` file for easy deployment on Render.

1. Create a new Web Service on Render connected to your GitHub repository.
2. Select "Blueprint" and use the `render.yaml` file.
3. **Important**: You must set the `MONGO_URL` environment variable in the Render dashboard for the backend service to connect to your MongoDB Atlas cluster.

## Features
- **Employee Management**: Add, List, Update, Delete employees.
- **Task Management**: Add, List, Update, Delete tasks with assignment to employees.
- **Dashboard**: Overview of total employees and tasks.
- **Responsive Design**: Clean UI built with Vanilla CSS.
