
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

# Load local environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")

DATABASE_PATH = BASE_DIR / "data" / "sakhi.db"

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "sakhi-ai-development-key-change-before-deployment"
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Use PostgreSQL on Render and SQLite for local development.
database_url = os.environ.get("DATABASE_URL")

if database_url:
    # Render PostgreSQL URLs may use postgres://.
    if database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql://",
            1
        )

    # Explicitly use the psycopg driver.
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

    SQLALCHEMY_DATABASE_URI = database_url

else:
    SQLALCHEMY_DATABASE_URI = (
        f"sqlite:///{DATABASE_PATH.as_posix()}"
    )

SQLALCHEMY_TRACK_MODIFICATIONS = False
