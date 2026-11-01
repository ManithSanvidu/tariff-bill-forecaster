import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.api.routes import app

# Explicit top-level assignment for Vercel AST parser
app = app
