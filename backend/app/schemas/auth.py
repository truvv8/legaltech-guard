from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: str | None = None
    phone: str | None = None
    language: str = "ru"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_name: str | None
    role: str
    language: str
    is_verified: bool

    model_config = {"from_attributes": True}
