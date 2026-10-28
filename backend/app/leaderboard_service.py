"""
Leaderboard and Student Profile Service for Quantum Playground - QExpo 2026.
Powered by SQLAlchemy ORM with persistent database storage (SQLite / PostgreSQL).
"""

import uuid
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import func

from .database import engine, Base, SessionLocal
from .models import Student

DEFAULT_SEEDS = [
    {
        "id": "seed-1",
        "name": "Alice_Qiskit",
        "score": 2850,
        "level": "Grand Quantum Master",
        "badge": "CHSH Champion",
        "streak": 12,
        "school": "MIT Quantum Lab",
        "avatar": "⚛️",
        "completed_missions": "[1, 2, 3, 4, 5, 6, 7]",
        "is_seed": True,
    },
    {
        "id": "seed-2",
        "name": "Erwin_Cat",
        "score": 2400,
        "level": "Circuit Architect",
        "badge": "Superposition King",
        "streak": 9,
        "school": "Vienna Quantum Group",
        "avatar": "🐱",
        "completed_missions": "[1, 2, 3, 4, 5, 6]",
        "is_seed": True,
    },
    {
        "id": "seed-3",
        "name": "Bob_Entangled",
        "score": 2150,
        "level": "Circuit Architect",
        "badge": "Teleport Pioneer",
        "streak": 7,
        "school": "Caltech IQIM",
        "avatar": "⚡",
        "completed_missions": "[1, 2, 3, 4, 5]",
        "is_seed": True,
    },
    {
        "id": "seed-4",
        "name": "John_Bell",
        "score": 1900,
        "level": "Entanglement Pioneer",
        "badge": "Spooky Action",
        "streak": 5,
        "school": "CERN Theory Group",
        "avatar": "🌀",
        "completed_missions": "[1, 2, 3, 4]",
        "is_seed": True,
    },
    {
        "id": "seed-5",
        "name": "Richard_Feynman",
        "score": 1750,
        "level": "Bloch Explorer",
        "badge": "Sim Universe",
        "streak": 8,
        "school": "Cornell Physics",
        "avatar": "🚀",
        "completed_missions": "[1, 2, 3]",
        "is_seed": True,
    },
    {
        "id": "seed-6",
        "name": "Priya_Sharma",
        "score": 1600,
        "level": "Entanglement Pioneer",
        "badge": "Active Hacker",
        "streak": 4,
        "school": "Delhi Public School",
        "avatar": "🌟",
        "completed_missions": "[1, 2, 3]",
        "is_seed": False,
    },
    {
        "id": "seed-7",
        "name": "Liam_Chen",
        "score": 1350,
        "level": "Gate Apprentice",
        "badge": "First Superposition",
        "streak": 3,
        "school": "Thomas Jefferson High",
        "avatar": "🔮",
        "completed_missions": "[1, 2]",
        "is_seed": False,
    },
]


def init_db():
    """Initializes database schema tables."""
    Base.metadata.create_all(bind=engine)


# Auto-initialize database tables on module import
init_db()


def get_all_entries() -> List[Dict[str, Any]]:
    """Loads all leaderboard entries from persistent database ordered by score descending."""
    db = SessionLocal()
    try:
        students = db.query(Student).order_by(Student.score.desc(), Student.updated_at.desc()).all()
        result = []
        for rank, s in enumerate(students, start=1):
            result.append(s.to_dict(rank=rank))
        return result
    finally:
        db.close()


def submit_student_score(
    name: str,
    score: int,
    level: Optional[str] = None,
    badge: Optional[str] = None,
    streak: Optional[int] = None,
    school: Optional[str] = None,
    avatar: Optional[str] = None,
    completed_missions: Optional[List[int]] = None,
) -> Dict[str, Any]:
    """
    Submits or updates a student's score and profile in the persistent database.
    """
    clean_name = name.strip()
    if not clean_name:
        clean_name = "Anonymous Student"

    db = SessionLocal()
    try:
        # Case-insensitive query
        student = db.query(Student).filter(func.lower(Student.name) == clean_name.lower()).first()

        school_val = (school or "").strip() or "Student Visitor"
        level_val = level or "Gate Apprentice"
        badge_val = badge or "Active Hacker"
        streak_val = streak if streak is not None and streak >= 1 else 1
        avatar_val = avatar or "⚛️"
        missions_json = json.dumps(completed_missions) if completed_missions else "[1]"

        if student:
            # Update high score and progress
            if score >= (student.score or 0):
                student.score = score
                student.level = level_val
                student.badge = badge_val
                student.streak = max(student.streak or 1, streak_val)
            if school_val:
                student.school = school_val
            if avatar:
                student.avatar = avatar_val
            if completed_missions:
                # Merge completed missions
                try:
                    existing = set(json.loads(student.completed_missions or "[]"))
                    existing.update(completed_missions)
                    student.completed_missions = json.dumps(sorted(list(existing)))
                except Exception:
                    student.completed_missions = missions_json
            student.updated_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(student)
            saved_student = student
        else:
            # Insert new student record
            new_student = Student(
                id=f"student-{uuid.uuid4().hex[:8]}",
                name=clean_name,
                school=school_val,
                avatar=avatar_val,
                score=score,
                level=level_val,
                badge=badge_val,
                streak=streak_val,
                completed_missions=missions_json,
                is_seed=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_student)
            db.commit()
            db.refresh(new_student)
            saved_student = new_student

        # Fetch re-ranked entries
        all_students = db.query(Student).order_by(Student.score.desc(), Student.updated_at.desc()).all()
        ranked_entries = []
        student_rank = 1
        for idx, s in enumerate(all_students, start=1):
            if s.id == saved_student.id:
                student_rank = idx
            ranked_entries.append(s.to_dict(rank=idx))

        return {
            "rank": student_rank,
            "entry": saved_student.to_dict(rank=student_rank),
            "entries": ranked_entries,
            "total_players": len(ranked_entries),
        }
    finally:
        db.close()


def get_student_profile(name: str) -> Optional[Dict[str, Any]]:
    """Retrieves a student's profile and progress from the database."""
    clean_name = name.strip()
    if not clean_name:
        return None

    db = SessionLocal()
    try:
        student = db.query(Student).filter(func.lower(Student.name) == clean_name.lower()).first()
        if not student:
            return None

        # Determine rank
        higher_count = db.query(Student).filter(Student.score > student.score).count()
        rank = higher_count + 1

        profile = student.to_dict(rank=rank)
        try:
            profile["completed_missions_list"] = json.loads(student.completed_missions or "[]")
        except Exception:
            profile["completed_missions_list"] = [1]
        return profile
    finally:
        db.close()


def clear_all_entries() -> List[Dict[str, Any]]:
    """Completely wipes all students from the persistent database."""
    db = SessionLocal()
    try:
        db.query(Student).delete()
        db.commit()
        return []
    finally:
        db.close()


def reset_to_defaults() -> List[Dict[str, Any]]:
    """Resets the persistent database with default benchmark seed entries."""
    db = SessionLocal()
    try:
        db.query(Student).delete()
        now = datetime.now(timezone.utc)
        for seed in DEFAULT_SEEDS:
            st = Student(
                id=seed["id"],
                name=seed["name"],
                school=seed.get("school", "Student Visitor"),
                avatar=seed.get("avatar", "⚛️"),
                score=seed["score"],
                level=seed.get("level", "Qubit Novice"),
                badge=seed.get("badge", "Active Hacker"),
                streak=seed.get("streak", 1),
                completed_missions=seed.get("completed_missions", "[1]"),
                is_seed=seed.get("is_seed", True),
                created_at=now,
                updated_at=now,
            )
            db.add(st)
        db.commit()

        # Re-fetch sorted
        students = db.query(Student).order_by(Student.score.desc(), Student.updated_at.desc()).all()
        return [s.to_dict(rank=i) for i, s in enumerate(students, start=1)]
    finally:
        db.close()


def generate_csv_export() -> str:
    """Exports full database leaderboard as CSV format."""
    entries = get_all_entries()
    lines = ["Rank,Student Name,Score (XP),Tier Level,Badge,Streak,School/Organization,Timestamp"]
    for e in entries:
        r = e.get("rank", "")
        n = f'"{e.get("name", "")}"'
        s = e.get("score", 0)
        l = f'"{e.get("level", "")}"'
        b = f'"{e.get("badge", "")}"'
        st = e.get("streak", 1)
        sc = f'"{e.get("school", "")}"'
        t = e.get("timestamp", "")
        lines.append(f"{r},{n},{s},{l},{b},{st},{sc},{t}")
    return "\n".join(lines)
