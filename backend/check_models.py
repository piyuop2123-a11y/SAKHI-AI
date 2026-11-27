
from google import genai
from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

for model in client.models.list():
    name = model.name or ""

    if "gemini-3.5-flash-lite" in name.lower():
        print("Model:", name)
        print("Supported actions:", model.supported_actions)
