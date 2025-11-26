from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class EmployeeModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    role: str
    department: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Sathwik Potu",
                "email": "sathwik@gmail.com",
                "role": "Software Engineer",
                "department": "Engineering"
            }
        }

class TaskModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    description: str
    assignee_id: Optional[str] = None
    status: str = "Pending"
    due_date: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Fix Login Bug",
                "description": "Resolve the issue with login timeout.",
                "assignee_id": "64b8f...",
                "status": "In Progress",
                "due_date": "2023-12-31T23:59:59"
            }
        }

class UpdateEmployeeModel(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    department: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UpdateTaskModel(BaseModel):
    title: Optional[str]
    description: Optional[str]
    assignee_id: Optional[str]
    status: Optional[str]
    due_date: Optional[datetime]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
