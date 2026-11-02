"""
Top-level entrypoint for local execution and serverless runtimes.
"""

import sys
import os

backend_root = os.path.dirname(os.path.abspath(__file__))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.api.routes import app

__all__ = ["app"]
