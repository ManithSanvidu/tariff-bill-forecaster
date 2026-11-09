"""
Top-level entrypoint for local execution and serverless runtimes.
"""

import sys
import os
from dotenv import load_dotenv

backend_root = os.path.dirname(os.path.abspath(__file__))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

# Load environment variables
load_dotenv()
root_env = os.path.abspath(os.path.join(backend_root, "..", ".env"))
if os.path.exists(root_env):
    load_dotenv(root_env)

from app.api.routes import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    is_dev = os.getenv("ENVIRONMENT", "development").lower() == "development"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=is_dev)

__all__ = ["app"]
