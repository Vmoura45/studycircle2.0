from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, LargeBinary  # Importe LargeBinary aqui
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    stripe_subscription_id = Column(String, nullable=True)  # Armazena o ID da assinatura do Stripe (será usado posteriormente)
    is_subscriber = Column(Boolean, default=False)  # Indica se o usuário é um assinante (será usado posteriormente)

    # Relacionamento com os materiais (um usuário pode ter vários materiais)
    materials = relationship("Material", back_populates="owner")

# Modelo para os materiais (ainda sem o relacionamento com o Supabase Storage)
# (Criação Futura, quando formos implementar o upload e gerenciamento de arquivos)
class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    file_path = Column(String)  # Futuramente, será alterado para a URL do Supabase Storage
    file_data = Column(LargeBinary)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="materials")