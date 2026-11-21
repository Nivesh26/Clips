# Clipping Studio - Python Backend

FastAPI backend connected to MongoDB for storing and retrieving edited 9:16 reel clips.

## Setup

1. **Create and activate Python virtual environment**:
   ```bash
   cd Backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and set your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=clipping_db
   PORT=8000
   ```
   > If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection URI (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

4. **Run the server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Endpoints

- `GET /api/health` - Health & MongoDB connection status
- `POST /api/clips` - Save a new edited reel clip (9:16 aspect ratio)
- `GET /api/clips` - Get all saved reel clips (sorted newest first)
- `GET /api/clips/{id}` - Get a single reel clip by ID
- `DELETE /api/clips/{id}` - Delete a reel clip
