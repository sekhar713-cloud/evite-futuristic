import sys
import os
import time
import logging
from collections import deque
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
import auth
import models

router = APIRouter(prefix="/api/debug", tags=["debug"])

_START_TIME = time.time()
_LOG_BUFFER: deque = deque(maxlen=200)


class _BufferHandler(logging.Handler):
    def emit(self, record: logging.LogRecord):
        _LOG_BUFFER.append({
            "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": self.format(record),
        })


_handler = _BufferHandler()
_handler.setFormatter(logging.Formatter("%(name)s: %(message)s"))
logging.getLogger().addHandler(_handler)
logging.getLogger("uvicorn").addHandler(_handler)
logging.getLogger("sqlalchemy.engine").addHandler(_handler)


@router.get("")
def debug_info(current_user: models.User = Depends(auth.get_current_user)):
    uptime_s = int(time.time() - _START_TIME)
    return {
        "uptime_seconds": uptime_s,
        "uptime_human": f"{uptime_s // 3600}h {(uptime_s % 3600) // 60}m {uptime_s % 60}s",
        "python": sys.version,
        "env": {
            "DATABASE_URL": "set" if os.getenv("DATABASE_URL") else "MISSING",
            "SECRET_KEY": "set" if os.getenv("SECRET_KEY") else "MISSING",
            "ALLOWED_ORIGINS": os.getenv("ALLOWED_ORIGINS", "(default)"),
            "PORT": os.getenv("PORT", "(default)"),
        },
        "log_buffer_size": len(_LOG_BUFFER),
    }


@router.get("/logs")
def debug_logs(
    n: int = 50,
    current_user: models.User = Depends(auth.get_current_user),
):
    entries = list(_LOG_BUFFER)
    return {"count": len(entries), "logs": entries[-n:]}
