import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_quiz(text):
    prompt = f"""
    Generate 3 MCQ questions from the following text.

    Return ONLY valid JSON.

    Format:
    [
      {{
        "question": "...",
        "options": ["A","B","C","D"],
        "answer": "..."
      }}
    ]

    Text:
    {text}
    """

    try:
        response = model.generate_content(prompt)
        cleaned = response.text.replace("```json", "").replace("```", "")
        return json.loads(cleaned)

    except Exception as e:
        return {"error": str(e)}