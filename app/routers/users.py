from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# Removendo as dependências não utilizadas para este exemplo
# from sqlalchemy.orm import Session
# from app import models, schemas, utils
# from app.database import get_db
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.config import settings
from app import schemas, utils  # Ajuste para importar apenas o que é necessário

# Crie uma instância de OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # "token" é o seu endpoint de login

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Função para autenticar um usuário (removida a dependência do banco de dados)
def authenticate_user(email, password):
    # Esta função agora é apenas um placeholder
    # TODO: Implementar lógica de autenticação real
    return {"email": email, "is_active": True}

# Função para criar um token de acesso
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# Obter o usuário atual a partir do token JWT (removida a dependência do banco de dados)
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    # Substitua isso pela sua lógica de busca de usuário
    user = schemas.User(id=1, email=token_data.email, is_active=True)
    if user is None:
        raise credentials_exception
    return user

# Obter o usuário atual e verificar se ele está ativo
def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Criar um usuário
@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate):
    # Placeholder para a criação de usuário
    # TODO: Implementar a lógica de criação de usuário
    hashed_password = utils.get_password_hash(user.password)
    return schemas.User(id=1, email=user.email, is_active=True, hashed_password=hashed_password)

# Login e gerar token JWT
@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Autenticar o usuário
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Criar token JWT
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Obter usuário atual
@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user