import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_text(text):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
        Summarize the following text in simple language:

        {text}
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return str(e)