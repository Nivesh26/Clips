from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.config import MONGO_URI, DB_NAME
import logging

logger = logging.getLogger(__name__)

client = None
db = None

def get_database():
    global client, db
    if db is None:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
            db = client[DB_NAME]
            # Verify connection
            client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Ensure indexes on reel_clips collection
            db.reel_clips.create_index([("created_at", -1)])
            db.reel_clips.create_index([("source_type", 1)])
        except ConnectionFailure as e:
            logger.warning(f"Could not connect to MongoDB at {MONGO_URI}: {e}")
        except Exception as e:
            logger.warning(f"MongoDB initialization warning: {e}")
            
    return db

def check_db_connection() -> bool:
    try:
        current_db = get_database()
        if current_db is not None and client is not None:
            client.admin.command('ping')
            return True
        return False
    except Exception:
        return False
