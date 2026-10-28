import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_reset_and_get_leaderboard():
    reset_res = client.post("/api/leaderboard/reset")
    assert reset_res.status_code == 200
    assert len(reset_res.json()["entries"]) >= 5

    res = client.get("/api/leaderboard")
    assert res.status_code == 200
    data = res.json()
    assert "entries" in data
    assert "total_players" in data
    assert len(data["entries"]) >= 5
    assert data["entries"][0]["rank"] == 1
    assert data["entries"][0]["score"] >= data["entries"][1]["score"]

def test_submit_student_score():
    payload = {
        "name": "Test_Student_Expo",
        "score": 3000,
        "level": "Grand Quantum Master",
        "badge": "CHSH Champion",
        "streak": 5,
        "school": "Quantum High School"
    }
    res = client.post("/api/leaderboard/submit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["rank"] == 1  # 3000 should be #1
    assert data["entry"]["name"] == "Test_Student_Expo"
    assert data["entry"]["score"] == 3000

def test_export_leaderboard_csv():
    res = client.get("/api/leaderboard/export")
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")
    assert "Rank,Student Name,Score (XP)" in res.text

def test_clear_leaderboard():
    clear_res = client.post("/api/leaderboard/clear")
    assert clear_res.status_code == 200
    data = clear_res.json()
    assert data["entries"] == []
    assert data["total_players"] == 0
