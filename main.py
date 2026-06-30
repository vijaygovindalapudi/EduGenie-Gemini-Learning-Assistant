from summary_module import summarize_text
from fastapi import FastAPI
from pydantic import BaseModel
from qna import get_answer
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
class QuestionRequest(BaseModel):
    question: str
class SummaryRequest(BaseModel):
    text: str

@app.post("/qa")
def qa(request: QuestionRequest):
    answer = get_answer(request.question)
    return {"answer": answer}
@app.post("/summary")
def summary(request: SummaryRequest):
    result = summarize_text(request.text)
    return {"summary": result}