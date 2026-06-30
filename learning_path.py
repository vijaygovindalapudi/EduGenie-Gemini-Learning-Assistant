import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def get_learning_recommendations(topic):

    prompt = f"""
    You are an AI tutor.

    Create a learning roadmap for {topic}.

    Include:
    1. Beginner Level
    2. Intermediate Level
    3. Advanced Level
    4. Resources
    """

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return str(e)