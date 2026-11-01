import sys
import os
import traceback

# Add backend directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

try:
    from app.api.routes import app
except Exception as e:
    # If app fails to load, create a fallback FastAPI app that outputs the exact traceback
    # This prevents generic opaque 500 FUNCTION_INVOCATION_FAILED and displays the exact root cause
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    err_trace = traceback.format_exc()
    print("FATAL ERROR LOADING APP IN VERCEL:", err_trace)

    app = FastAPI()

    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"])
    def catch_all_error(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "FastAPI App Initialization Failed on Vercel",
                "exception": str(e),
                "traceback": err_trace.splitlines(),
            }
        )
