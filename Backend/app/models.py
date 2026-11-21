from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReelClipBase(BaseModel):
    title: str = Field(..., description="Title of the reel clip")
    source_type: str = Field("youtube", description="Source of video: youtube, local, or ai")
    source_url: Optional[str] = Field(None, description="Original source video URL or path")
    video_id: Optional[str] = Field(None, description="Video ID if from YouTube")
    duration: float = Field(..., description="Duration of reel in seconds (e.g. 30, 60)")
    aspect_ratio: str = Field("9:16", description="Strictly reel format (default 9:16)")
    start_time: Optional[float] = Field(0.0, description="Start timestamp in source video")
    end_time: Optional[float] = Field(None, description="End timestamp in source video")
    clip_url: Optional[str] = Field(None, description="File path or URL to rendered reel clip")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail URL for the reel")
    tags: List[str] = Field(default_factory=list, description="Tags or labels for the reel")
    status: str = Field("completed", description="Status: completed, processing, or pending")

class ReelClipCreate(ReelClipBase):
    pass

class ReelClipResponse(ReelClipBase):
    id: str = Field(..., description="MongoDB Document ID")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
