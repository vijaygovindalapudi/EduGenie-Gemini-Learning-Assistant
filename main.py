from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from explanation_module import explain_topic
from quiz_module import generate_quiz
from learning_path import get_learning_recommendations
from summary_module import summarize_text
from fastapi import FastAPI
from pydantic import BaseModel
from qna import get_answer
app = FastAPI(
    title="EduGenie AI Learning Assistant",
    description="AI Powered Educational Learning Assistant using Gemini and LaMini-Flan-T5",
    version="1.0.0"
)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
@app.get("/")
async def home(request: Request):
   return templates.TemplateResponse(
    request=request,
    name="index.html"
)
class QuestionRequest(BaseModel):
    question: str
class SummaryRequest(BaseModel):
    text: str
class LearningPathRequest(BaseModel):
    topic: str
class QuizRequest(BaseModel):
    text: str
class ExplanationRequest(BaseModel):
    topic: str
@app.post("/qa")
def qa(request: QuestionRequest):
    answer = get_answer(request.question)
    return {"answer": answer}
@app.post("/summary")
def summary(request: SummaryRequest):
    result = summarize_text(request.text)
    return {"summary": result}
@app.post("/learning-path")
def learning_path(request: LearningPathRequest):

    result = get_learning_recommendations(
        request.topic
    )

    return {"learning_path": result}
@app.post("/quiz")
def quiz(request: QuizRequest):

    result = generate_quiz(request.text)
    return {"quiz": result}
@app.post("/explain")
def explain(request: ExplanationRequest):
    result = explain_topic(request.topic)
    return {"explanation": result}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
