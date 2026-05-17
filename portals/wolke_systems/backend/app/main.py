from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .portal_data import COMPANY, DEPARTMENTS, PORTALS, USERS

app = FastAPI(
    title="Wolke Systems Internal Portals API",
    description="Starter API for simulated enterprise company portals. Auth is intentionally omitted.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "wolke-portals-api"}


@app.get("/api/company")
def get_company():
    return COMPANY


@app.get("/api/departments")
def get_departments():
    return DEPARTMENTS


@app.get("/api/users")
def get_users():
    return USERS


@app.get("/api/portals")
def get_portals():
    return PORTALS


@app.get("/api/portals/{portal_id}")
def get_portal(portal_id: str):
    portal = next((item for item in PORTALS if item["id"] == portal_id), None)
    if portal is None:
        raise HTTPException(status_code=404, detail=f"Portal '{portal_id}' was not found.")
    return portal
