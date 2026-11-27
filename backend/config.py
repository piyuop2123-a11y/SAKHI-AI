
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")

DATABASE_PATH = BASE_DIR / "data" / "sakhi.db"

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "sakhi-ai-development-key-change-before-deployment"
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

SQLALCHEMY_DATABASE_URI = f"sqlite:///{DATABASE_PATH.as_posix()}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
