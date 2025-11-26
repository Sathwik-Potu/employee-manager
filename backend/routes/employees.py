from fastapi import APIRouter, HTTPException, Body, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List
from backend.models import EmployeeModel, UpdateEmployeeModel
from backend.database import db
from bson import ObjectId

router = APIRouter()

def serialize_employee(employee):
    """Convert MongoDB document to dict with proper ID serialization"""
    if employee and "_id" in employee:
        return {
            "id": str(employee["_id"]),
            "_id": str(employee["_id"]),
            "name": employee.get("name"),
            "email": employee.get("email"),
            "role": employee.get("role"),
            "department": employee.get("department")
        }
    return employee

@router.post("/", response_description="Add new employee", status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeModel = Body(...)):
    employee = jsonable_encoder(employee)
    employee.pop("id", None)
    employee.pop("_id", None)
    new_employee = await db["employees"].insert_one(employee)
    created_employee = await db["employees"].find_one({"_id": new_employee.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=serialize_employee(created_employee))

@router.get("/", response_description="List all employees")
async def list_employees():
    employees = await db["employees"].find().to_list(1000)

    serialized_employees = [serialize_employee(emp) for emp in employees if emp.get("_id")]
    return JSONResponse(content=serialized_employees)

@router.get("/{id}", response_description="Get a single employee")
async def show_employee(id: str):
    if (employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
        return JSONResponse(content=serialize_employee(employee))
    raise HTTPException(status_code=404, detail=f"Employee {id} not found")

@router.put("/{id}", response_description="Update an employee")
async def update_employee(id: str, employee: UpdateEmployeeModel = Body(...)):
    employee = {k: v for k, v in employee.dict().items() if v is not None}
    if len(employee) >= 1:
        update_result = await db["employees"].update_one({"_id": ObjectId(id)}, {"$set": employee})
        if update_result.modified_count == 1:
            if (updated_employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
                return JSONResponse(content=serialize_employee(updated_employee))
    if (existing_employee := await db["employees"].find_one({"_id": ObjectId(id)})) is not None:
        return JSONResponse(content=serialize_employee(existing_employee))
    raise HTTPException(status_code=404, detail=f"Employee {id} not found")

@router.delete("/{id}", response_description="Delete an employee")
async def delete_employee(id: str):
    delete_result = await db["employees"].delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        from fastapi import Response
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"Employee {id} not found")
