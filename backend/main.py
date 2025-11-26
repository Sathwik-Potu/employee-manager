from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import employees, tasks

app = FastAPI(title="ProU Assignment API")


origins = ["*"]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, tags=["Employees"], prefix="/employees")
app.include_router(tasks.router, tags=["Tasks"], prefix="/tasks")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to ProU Assignment API"}
