
from groq import Groq
from config import GROQ_API_KEY

import re

# Initialize Groq
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

GROQ_MODEL = "openai/gpt-oss-20b"


SYSTEM_INSTRUCTION = """
You are SAKHI AI, a friendly, caring and conversational Indian
women's safety assistance companion.

PERSONALITY:
1. Be warm, friendly, empathetic and approachable.
2. Speak naturally, like a caring and trustworthy companion.
3. Never judge, blame, shame or lecture the user.
4. Be reassuring without making unrealistic promises.
5. Give practical and easy-to-understand advice.
6. Respect the user's choices and independence.

LANGUAGE:
1. Match the language the user is communicating in.
2. Follow the additional language instruction for the current message.
3. If the user writes in English, respond in natural English.
4. If the user writes in Hinglish, respond in natural Hinglish.
5. If the user writes Hindi in Devanagari, respond in Hindi
   using Devanagari.
6. Do not force Hindi words into English responses.
7. Preserve natural English words in Hinglish responses.
8. Never change the requested language or writing script.

INDIAN CONTEXT:
1. Understand Indian cities, towns, villages and communities.
2. Consider Indian transport such as metro, local trains,
   government buses, auto-rickshaws, Ola and Uber.
3. Understand eve-teasing, stalking, cyberstalking,
   domestic abuse and workplace harassment.
4. Do not assume every user lives in a metropolitan city.
5. Give locally relevant suggestions where appropriate.

EMERGENCY GUIDANCE:
1. India's emergency response number is 112.
2. Women's helpline 181 is available in many states,
   but availability varies.
3. Encourage contacting emergency services or a trusted person
   when someone faces immediate danger.
4. Never claim you can contact police, track someone,
   send SOS alerts or dispatch emergency assistance.

SAFETY AND PRIVACY:
1. Never blame or judge someone experiencing harassment.
2. Never claim to predict crimes or determine intentions.
3. Never guarantee anyone's safety.
4. Respect user privacy and autonomy.
5. Do not encourage dangerous confrontation.
6. Do not request unnecessary personal information.
7. For immediate danger, prioritise simple and practical
   steps to reach real-world help.

RESPONSE STYLE:
1. Give practical and actionable advice.
2. Keep simple answers concise.
3. Use numbered steps or bullet points when helpful.
4. Ask relevant follow-up questions when necessary.
5. Avoid overwhelming distressed users.
6. Use INR (₹) for Indian prices.
"""


def get_language_instruction(message):
    """Detect Hindi, Hinglish or English and guide the response."""

    # Detect Hindi written in Devanagari
    if re.search(r"[\u0900-\u097F]", message):
        return """
LANGUAGE OVERRIDE:
The user is writing Hindi using Devanagari script.

Reply in natural Hindi using Devanagari script.
Do not switch to English or Roman Hinglish unless requested.
"""

    # Common Hindi words written using Roman letters
    hinglish_words = {
        "mujhe", "mujh", "mera", "meri", "mere",
        "main", "mein", "hum", "hume", "hamara",
        "hai", "hain", "ho", "hua", "hoga",
        "nahi", "nahin", "mat", "kya", "kyun",
        "kaise", "kaisa", "kaisi", "kab", "kahan",
        "yahan", "wahan", "agar", "lekin", "kyunki",
        "aur", "ya", "bhi", "bahut", "bohot",
        "koi", "kuch", "kar", "karo", "karna",
        "sakta", "sakti", "sakte", "raha", "rahi",
        "rahe", "tha", "thi", "the", "hoon",
        "hun", "aap", "apka", "aapka", "tum",
        "tumhe", "tumhara", "please", "madad",
        "darr", "dar", "lagta", "lagti", "chahiye",
        "jaana", "jana", "akele", "akeli", "mereko",
        "ka", "ki", "ke", "se", "ko", "par"
    }

    words = set(
        re.findall(r"\b[a-zA-Z]+\b", message.lower())
    )

    hinglish_matches = words.intersection(hinglish_words)

    # Detect Roman Hinglish
    if len(hinglish_matches) >= 2 or (
        len(hinglish_matches) >= 1
        and len(words) <= 5
    ):
        return """
LANGUAGE OVERRIDE - HINGLISH:

The user is communicating in Hinglish using Roman letters.

You MUST reply in natural Hinglish using ONLY Roman letters.

IMPORTANT:
- Mix everyday Hindi and English naturally.
- Do not reply entirely in English.
- Do not use Devanagari characters.
- Do not translate the response into formal Hindi.
- Keep commonly used English words such as travel,
  safety, location and emergency when natural.

Example:

User: Mujhe raat ko akele travel karne mein darr lagta hai.

Correct:
Samajh sakti hoon. Raat ko akele travel karte waqt
thoda extra careful rehna helpful ho sakta hai.

Incorrect:
I understand. Travelling alone at night can feel scary.

Incorrect:
मैं समझ सकती हूँ। रात में अकेले यात्रा करना डरावना हो सकता है।
"""

    # Default to English
    return """
LANGUAGE OVERRIDE - ENGLISH:

The user is communicating in English.

Reply in natural, simple English.
Use ONLY Latin/Roman letters.
Do not use Devanagari characters.
Do not unnecessarily mix Hindi words into the response.
"""



def get_groq_response(message, chat_history=None):
    """Generate a language-aware SAKHI AI response using Groq."""

    if not message or not message.strip():
        return {
            "success": False,
            "error": "Please enter a message."
        }

    if client is None:
        return {
            "success": False,
            "error": "Groq API key not found."
        }

    try:
        language_instruction = get_language_instruction(message)

        messages = [
            {
                "role": "system",
                "content": SYSTEM_INSTRUCTION
            }
        ]

        # Include the latest conversation messages
        if isinstance(chat_history, list):
            for item in chat_history[-10:]:

                if not isinstance(item, dict):
                    continue

                role = item.get("role")
                content = item.get("content")

                if (
                    role in ("user", "assistant")
                    and isinstance(content, str)
                    and content.strip()
                ):
                    messages.append({
                        "role": role,
                        "content": content
                    })

        # Add the current message and its language instructions
        messages.append({
            "role": "user",
            "content": (
                language_instruction
                + "\n\nUSER'S CURRENT MESSAGE:\n"
                + message.strip()
            )
        })

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.6,
            max_tokens=3000
        )

        answer = response.choices[0].message.content

        if not answer:
            raise ValueError(
                "Groq returned an empty response."
            )

        # Warn if Groq ignores the requested writing script
        if (
            not re.search(r"[\u0900-\u097F]", message)
            and re.search(r"[\u0900-\u097F]", answer)
        ):
            print(
                "Warning: Groq returned Devanagari "
                "despite the Roman-script instruction."
            )

        return {
            "success": True,
            "provider": "Groq",
            "model": GROQ_MODEL,
            "response": answer
        }

    except Exception as error:
        print("Groq API error:", error)

        return {
            "success": False,
            "error": str(error)
        }


if __name__ == "__main__":

    print("SAKHI AI - Indian Language Test")
    print("--------------------------------")

    message = input("You: ")

    result = get_groq_response(message)

    if result["success"]:
        print("\nProvider used:", result["provider"])
        print("\nSAKHI AI:", result["response"])
    else:
        print("\nTest failed:", result["error"])
