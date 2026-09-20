from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag import ask_ai


# --------------------------------
# Create FastAPI application
# --------------------------------

app = FastAPI(title="SmartDesk AI")


# --------------------------------
# CORS
# Allows React frontend to call API
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# Request Models
# --------------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    question: str


# --------------------------------
# Home
# --------------------------------

@app.get("/")
def home():
    return {
        "message": "SmartDesk AI backend is running"
    }


# --------------------------------
# Health Check
# --------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------
# Login
# --------------------------------

@app.post("/api/login")
def login(data: LoginRequest):

    return {
        "message": "Login successful",
        "email": data.email
    }


# --------------------------------
# AI Chat
# --------------------------------

@app.post("/api/chat")
def chat(data: ChatRequest):

    if not data.question.strip():
        return {
            "error": "Question cannot be empty"
        }

    answer = ask_ai(data.question)

    return {
        "question": data.question,
        "answer": answer
    }