from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.clips import router as clips_router
from app.database import check_db_connection

app = FastAPI(
    title="Clipping Studio API",
    description="Backend service for storing and managing edited reel clips in MongoDB",
    version="1.0.0",
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clips_router, prefix="/api")

@app.get("/api/health")
def health_check():
    db_connected = check_db_connection()
    return {
        "status": "healthy" if db_connected else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "service": "Clipping Studio Reel API"
    }
