from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users

app = FastAPI()

# Configuração do CORS - Permitindo todas as origens *APENAS PARA TESTES*
# Em produção, restrinja para as origens do seu frontend
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "StudyCircle API is running!"}