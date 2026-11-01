import sys
import os

# Ensure backend root is on Python sys.path so app modules import cleanly on Vercel
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.api.routes import app
