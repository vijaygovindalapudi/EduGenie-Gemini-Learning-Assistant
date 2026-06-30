from fastapi import FastAPI

app = FastAPI(
    title="EduGenie AI Learning Assistant",
    description="AI Powered Educational Learning Assistant using Gemini and LaMini-Flan-T5",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "project": "EduGenie",
        "status": "Active",
        "modules": [
            "Q&A",
            "Explanation",
            "Quiz",
            "Summary",
            "Learning Path"
        ]
    }