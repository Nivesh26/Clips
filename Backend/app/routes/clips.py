from fastapi import APIRouter, HTTPException, Query
from app.database import get_database
from app.models import ReelClipCreate, ReelClipResponse
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/clips", tags=["Reel Clips"])

def serialize_doc(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc

@router.post("", response_model=ReelClipResponse, status_code=201)
def create_reel_clip(clip_in: ReelClipCreate):
    """Save an edited reel clip to MongoDB"""
    # Enforce only reel clips (9:16)
    if clip_in.aspect_ratio != "9:16":
        clip_in.aspect_ratio = "9:16"

    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")

    clip_data = clip_in.model_dump()
    clip_data["created_at"] = datetime.utcnow()

    result = db.reel_clips.insert_one(clip_data)
    created_doc = db.reel_clips.find_one({"_id": result.inserted_id})
    if not created_doc:
        raise HTTPException(status_code=500, detail="Failed to save reel clip")

    return serialize_doc(created_doc)

@router.post("/batch", response_model=List[ReelClipResponse], status_code=201)
def create_batch_reel_clips(clips_in: List[ReelClipCreate]):
    """Save multiple edited reel clips at once (e.g. 5 generated reels from one video)"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")

    now = datetime.utcnow()
    docs = []
    for c in clips_in:
        c.aspect_ratio = "9:16"
        d = c.model_dump()
        d["created_at"] = now
        docs.append(d)

    if not docs:
        return []

    result = db.reel_clips.insert_many(docs)
    created_cursor = db.reel_clips.find({"_id": {"$in": result.inserted_ids}}).sort("created_at", -1)
    return [serialize_doc(doc) for doc in created_cursor]

@router.get("", response_model=List[ReelClipResponse])
def get_reel_clips(
    source_type: Optional[str] = Query(None, description="Filter by source (youtube, local, ai)"),
    limit: int = Query(50, ge=1, le=100),
):
    """Retrieve all saved edited reel clips, sorted newest first"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")

    query = {"aspect_ratio": "9:16"}
    if source_type:
        query["source_type"] = source_type

    cursor = db.reel_clips.find(query).sort("created_at", -1).limit(limit)
    return [serialize_doc(doc) for doc in cursor]

@router.get("/{clip_id}", response_model=ReelClipResponse)
def get_reel_clip(clip_id: str):
    """Get a single reel clip by its ID"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")

    if not ObjectId.is_valid(clip_id):
        raise HTTPException(status_code=400, detail="Invalid clip ID format")

    doc = db.reel_clips.find_one({"_id": ObjectId(clip_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Reel clip not found")

    return serialize_doc(doc)

@router.delete("/{clip_id}")
def delete_reel_clip(clip_id: str):
    """Delete a reel clip by ID"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")

    if not ObjectId.is_valid(clip_id):
        raise HTTPException(status_code=400, detail="Invalid clip ID format")

    result = db.reel_clips.delete_one({"_id": ObjectId(clip_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reel clip not found")

    return {"message": "Reel clip deleted successfully", "id": clip_id}
