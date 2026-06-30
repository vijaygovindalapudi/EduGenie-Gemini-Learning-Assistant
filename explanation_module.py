import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def explain_topic(topic):

    prompt = f"""
    Explain {topic} in very simple language.
    Give beginner-friendly explanation with examples.
    """

    response = model.generate_content(prompt)

    return response.text