from fastapi import APIRouter, HTTPException, Body, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List
from models import TaskModel, UpdateTaskModel
from database import db
from bson import ObjectId

router = APIRouter()

def serialize_task(task):
    """Convert MongoDB document to dict with proper ID serialization"""
    if task and "_id" in task:
        due_date = task.get("due_date")
        if due_date and hasattr(due_date, 'isoformat'):
            due_date = due_date.isoformat()
            
        return {
            "id": str(task["_id"]),
            "_id": str(task["_id"]),
            "title": task.get("title"),
            "description": task.get("description"),
            "assignee_id": task.get("assignee_id"),
            "status": task.get("status"),
            "due_date": due_date
        }
    return task

@router.post("/", response_description="Add new task", status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskModel = Body(...)):
    task = jsonable_encoder(task)
    task.pop("id", None)
    task.pop("_id", None)
    new_task = await db["tasks"].insert_one(task)
    created_task = await db["tasks"].find_one({"_id": new_task.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=serialize_task(created_task))

@router.get("/", response_description="List all tasks")
async def list_tasks():
    tasks = await db["tasks"].find().to_list(1000)

    serialized_tasks = [serialize_task(t) for t in tasks if t.get("_id")]
    return JSONResponse(content=serialized_tasks)

@router.get("/{id}", response_description="Get a single task")
async def show_task(id: str):
    if (task := await db["tasks"].find_one({"_id": ObjectId(id)})) is not None:
        return JSONResponse(content=serialize_task(task))
    raise HTTPException(status_code=404, detail=f"Task {id} not found")

@router.put("/{id}", response_description="Update a task")
async def update_task(id: str, task: UpdateTaskModel = Body(...)):
    task = {k: v for k, v in task.dict().items() if v is not None}
    if len(task) >= 1:
        update_result = await db["tasks"].update_one({"_id": ObjectId(id)}, {"$set": task})
        if update_result.modified_count == 1:
            if (updated_task := await db["tasks"].find_one({"_id": ObjectId(id)})) is not None:
                return JSONResponse(content=serialize_task(updated_task))
    if (existing_task := await db["tasks"].find_one({"_id": ObjectId(id)})) is not None:
        return JSONResponse(content=serialize_task(existing_task))
    raise HTTPException(status_code=404, detail=f"Task {id} not found")

@router.delete("/{id}", response_description="Delete a task")
async def delete_task(id: str):
    delete_result = await db["tasks"].delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        from fastapi import Response
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"Task {id} not found")
