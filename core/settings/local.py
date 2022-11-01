from .base import *

DEBUG = env("DEBUG")


ALLOWED_HOSTS = ["*"]


DATABASES = {
    "default": env.db("DATABASE_URL", default="postgres:///ecommerceDB"),
}

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
]
