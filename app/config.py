from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    secret_key: str = "1e151247309bee52230fab44f73af6d3e8c8bd3eacc36eda514912e2d62a97b4"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()

