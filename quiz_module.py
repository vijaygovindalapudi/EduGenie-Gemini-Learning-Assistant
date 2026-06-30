import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

print("API KEY =", os.getenv("GEMINI_API_KEY"))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_quiz(topic, num_questions=5):

    prompt = f"""
    Generate {num_questions} multiple choice questions about {topic}.

    Return ONLY valid JSON.

    Format:

    [
      {{
        "question": "...",
        "options": [
          "A. ...",
          "B. ...",
          "C. ...",
          "D. ..."
        ],
        "answer": "..."
      }}
    ]
    """

    try:
        response = model.generate_content(prompt)

        cleaned = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)

    except Exception as e:
        return {"error": str(e)}