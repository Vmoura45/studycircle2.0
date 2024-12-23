from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from fastapi import UploadFile, File

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)  # Senha com no mínimo 8 caracteres

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)

class User(UserBase):
    id: int
    is_active: bool
    stripe_subscription_id: Optional[str] = None
    is_subscriber: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Esquemas para Materiais (Criação Futura) ---
class MaterialCreate(BaseModel):
    title: str
    description: str
    file: UploadFile = File(...)

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    file: Optional[UploadFile] = File(None)

class Material(BaseModel):
    id: int
    title: str
    description: str
    file_path: str
    owner_id: int

    class Config:
        orm_mode = True