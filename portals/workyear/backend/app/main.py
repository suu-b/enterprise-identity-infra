from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .workyear_data import (
    BENEFITS,
    INTEGRATIONS,
    NAVIGATION,
    PAY_ITEMS,
    SERVICE,
    TASKS,
    TIME_OFF,
    WORKER,
)

app = FastAPI(
    title="WorkYear External Portal API",
    description="No-auth workforce SaaS spoof API for the simulated enterprise identity project.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "workyear-api"}


@app.get("/api/overview")
def get_overview():
    return {
        "service": SERVICE,
        "navigation": NAVIGATION,
        "worker": WORKER,
        "tasks": TASKS,
        "pay_items": PAY_ITEMS,
        "integrations": INTEGRATIONS,
        "time_off": TIME_OFF,
        "benefits": BENEFITS,
    }
