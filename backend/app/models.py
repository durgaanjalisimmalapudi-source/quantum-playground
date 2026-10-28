"""
SQLAlchemy ORM models for Quantum Playground.
Persists student accounts, cumulative XP, completed missions, and leaderboard ranks.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from .database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Student(Base):
    __tablename__ = "students"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), unique=True, index=True, nullable=False)
    school = Column(String(128), default="Student Visitor")
    avatar = Column(String(16), default="⚛️")
    score = Column(Integer, default=0, index=True)
    level = Column(String(64), default="Qubit Novice")
    badge = Column(String(64), default="Active Hacker")
    streak = Column(Integer, default=1)
    completed_missions = Column(Text, default="[1]")  # JSON-encoded array of mission IDs
    is_seed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    def to_dict(self, rank: int = None):
        return {
            "id": self.id,
            "name": self.name,
            "school": self.school or "Student Visitor",
            "avatar": self.avatar or "⚛️",
            "score": self.score,
            "level": self.level or "Qubit Novice",
            "badge": self.badge or "Active Hacker",
            "streak": self.streak or 1,
            "completed_missions": self.completed_missions,
            "timestamp": self.updated_at.isoformat() if self.updated_at else utc_now().isoformat(),
            "is_seed": bool(self.is_seed),
            "rank": rank,
        }
