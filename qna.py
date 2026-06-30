import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def get_answer(question):
    try:
        response = model.generate_content(question)
        return response.text
    except Exception as e:
        return f"ERROR: {str(e)}"