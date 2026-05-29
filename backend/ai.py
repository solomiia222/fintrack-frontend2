import os
import random
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# =========================
# 1. LOAD API KEYS
# =========================
API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
    os.getenv("GEMINI_API_KEY_4"),
    os.getenv("GEMINI_API_KEY_5"),
    os.getenv("GEMINI_API_KEY_6"),
]

# remove invalid keys
API_KEYS = [k for k in API_KEYS if k]


# =========================
# 2. MODEL POOL
# =========================
MODELS = [
        # BEST QUALITY (use sparingly)
    "gemini-2.5-pro",

    # BALANCED (MAIN WORKHORSE)
    "gemini-2.5-flash",

    # FAST / CHEAP (fallback)
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",

    # STABLE LEGACY FALLBACK
    "gemini-pro-latest",
]


# =========================
# 3. KEY STATE (cooldown system)
# =========================
key_state = {
    key: {"cooldown": 0}
    for key in API_KEYS
}


# =========================
# 4. GET AVAILABLE KEY
# =========================
def get_available_key():
    now = time.time()

    available = [
        k for k in API_KEYS
        if key_state[k]["cooldown"] <= now
    ]

    if not available:
        # reset all if everything is blocked
        for k in API_KEYS:
            key_state[k]["cooldown"] = 0
        return random.choice(API_KEYS)

    return random.choice(available)


# =========================
# 5. MAIN AI FUNCTION
# =========================
def generate_ai_response(prompt: str) -> str:
    last_error = None

    # try multiple combinations
    for _ in range(len(API_KEYS) * 2):

        key = get_available_key()
        model_name = random.choice(MODELS)

        try:
            # configure API key
            genai.configure(api_key=key)

            # create model dynamically
            model = genai.GenerativeModel(model_name)

            response = model.generate_content(prompt)

            return response.text

        except Exception as e:
            print("🔥 AI ERROR:", repr(e))  # IMPORTANT

            last_error = repr(e)
            key_state[key]["cooldown"] = time.time() + 30
            continue

    return f"AI service unavailable. Last error: {last_error}"
