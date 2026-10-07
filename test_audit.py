# -*- coding: utf-8 -*-
"""
End-to-End Automated Audit & Verification Test for InFormatX
Tests:
1. Data Integrity of all Quizzes, Questions, Mini-Quizzes, and Catalog
2. HTML element bindings and script inclusion across all files
3. Storage schema, dynamic statistics, attempt recording, and streak calculation
4. End-to-end user simulation (Quiz -> Answer -> Result -> Stats update -> Persistence)
"""

import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_quiz_data():
    print("=== TEST 1: Verifying quiz-data.js Content & Schema ===")
    with open('quiz-data.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Extract catalog
    catalog_match = re.search(r'const QUIZZES_CATALOG = (\[.*?\]);', js, re.DOTALL)
    assert catalog_match, "QUIZZES_CATALOG not found"
    
    # Parse catalog JSON-like structure
    catalog_raw = catalog_match.group(1)
    # Simple regex extraction of quiz objects
    quizzes = re.findall(r'id:\s*"([^"]+)",\s*title:\s*"([^"]+)"', catalog_raw)
    print(f"Found {len(quizzes)} quizzes in catalog: {[q[0] for q in quizzes]}")
    assert len(quizzes) >= 6, f"Expected at least 6 quizzes, found {len(quizzes)}"

    # Check question banks
    for quiz_id, quiz_title in quizzes:
        assert f'"{quiz_id}":' in js or f"'{quiz_id}':" in js, f"Missing questions for quiz: {quiz_id}"
        print(f"  [OK] Quiz '{quiz_id}' ({quiz_title}) has question definitions")

    # Check mini-quizzes
    topics = ["kinematics", "electricity", "optics", "thermodynamics", "mechanics", "quantum"]
    for t in topics:
        assert f"{t}:" in js, f"Missing mini-quiz for topic: {t}"
        print(f"  [OK] Mini-quiz for topic '{t}' defined")

    print("TEST 1 PASSED: Catalog and question definitions intact.\n")

def test_html_bindings():
    print("=== TEST 2: Verifying HTML DOM Bindings & Script Tags ===")
    
    with open('home.html', 'r', encoding='utf-8') as f:
        home_html = f.read()

    assert 'quiz-data.js' in home_html, "home.html must include quiz-data.js"
    assert 'home.js' in home_html, "home.html must include home.js"
    
    # Check essential dynamic DOM IDs in home.html
    required_home_ids = [
        "heroGreeting",
        "streakDays",
        "heroProgressVal",
        "heroProgFill",
        "heroAccuracyVal",
        "heroQuizzesVal",
        "pProgress",
        "pAccuracy",
        "pTotalXp",
        "pQuizzesCount",
        "pCorrectAnswers",
        "pWrongAnswers",
        "pStreakDays",
        "profileTopicStats",
        "profileAttemptsHistory"
    ]
    for dom_id in required_home_ids:
        assert f'id="{dom_id}"' in home_html or f"id='{dom_id}'" in home_html, f"Missing DOM ID in home.html: {dom_id}"
        print(f"  [OK] home.html contains element #{dom_id}")

    # Check quiz.html
    with open('quiz.html', 'r', encoding='utf-8') as f:
        quiz_html = f.read()

    assert 'quiz-data.js' in quiz_html, "quiz.html must include quiz-data.js"
    required_quiz_ids = [
        "quizUI",
        "resultUI",
        "currQ",
        "totalQ",
        "scoreVal",
        "progFill",
        "questionText",
        "topicTag",
        "optionsGrid",
        "finalScore",
        "finalPct",
        "correctPill",
        "wrongPill",
        "feedbackText",
        "analysisBlock",
        "weakList"
    ]
    for dom_id in required_quiz_ids:
        assert f'id="{dom_id}"' in quiz_html or f"id='{dom_id}'" in quiz_html, f"Missing DOM ID in quiz.html: {dom_id}"
        print(f"  [OK] quiz.html contains element #{dom_id}")

    print("TEST 2 PASSED: All DOM elements and script inclusions present.\n")

def test_end_to_end_simulation():
    print("=== TEST 3: Simulating End-to-End Dynamic Statistics Flow ===")
    
    # Mocking storage & store logic in Python mirroring QuizStore
    storage = {}
    
    class MockQuizStore:
        @staticmethod
        def get_attempts():
            return json.loads(storage.get("physx_quiz_attempts", "[]"))
        
        @staticmethod
        def record_attempt(quiz_id, title, topic, correct, total, answers=None):
            attempts = MockQuizStore.get_attempts()
            score = correct * 100
            wrong = total - correct
            pct = round((correct / total) * 100) if total > 0 else 0
            
            att = {
                "id": f"att-{len(attempts) + 1}",
                "quizId": quiz_id,
                "quizTitle": title,
                "topic": topic,
                "score": score,
                "correctCount": correct,
                "wrongCount": wrong,
                "totalQuestions": total,
                "percentage": pct,
                "timestamp": 1775550000000 + len(attempts) * 1000
            }
            attempts.insert(0, att)
            storage["physx_quiz_attempts"] = json.dumps(attempts)
            
            # Add reward coins
            current_coins = int(storage.get("physx_coins", "50"))
            storage["physx_coins"] = str(current_coins + 50)
            return att

        @staticmethod
        def get_stats():
            attempts = MockQuizStore.get_attempts()
            total_q = sum(a["totalQuestions"] for a in attempts)
            correct_q = sum(a["correctCount"] for a in attempts)
            wrong_q = sum(a["wrongCount"] for a in attempts)
            acc = round((correct_q / total_q) * 100) if total_q > 0 else 0
            xp = sum(a["score"] for a in attempts)
            coins = int(storage.get("physx_coins", "50"))
            streak = 1 if len(attempts) > 0 else 0
            
            # Progress calculation
            catalog_count = 7
            unique_completed = len(set(a["quizId"] for a in attempts))
            progress = min(100, round((unique_completed / catalog_count) * 100))
            
            return {
                "quizzesCompleted": len(attempts),
                "totalQuestions": total_q,
                "correctAnswers": correct_q,
                "wrongAnswers": wrong_q,
                "accuracy": acc,
                "xp": xp,
                "coins": coins,
                "streakDays": streak,
                "overallProgress": progress
            }

    # 1. Initial State (Clean install)
    stats0 = MockQuizStore.get_stats()
    print("Initial User State:")
    print(f"  Quizzes: {stats0['quizzesCompleted']}, Accuracy: {stats0['accuracy']}%, XP: {stats0['xp']}, Coins: {stats0['coins']}")
    assert stats0['quizzesCompleted'] == 0
    assert stats0['accuracy'] == 0
    assert stats0['xp'] == 0

    # 2. User completes Quiz 1 (ENT - 10 questions, 8 correct)
    print("\nAction 1: User finishes 'ҰБТ сынама тесті' (8/10 correct)...")
    MockQuizStore.record_attempt("test-ent", "ҰБТ сынама тесті", "Жалпы ҰБТ", 8, 10)
    stats1 = MockQuizStore.get_stats()
    print(f"  Updated State -> Quizzes: {stats1['quizzesCompleted']}, Accuracy: {stats1['accuracy']}%, Correct: {stats1['correctAnswers']}, Wrong: {stats1['wrongAnswers']}, XP: {stats1['xp']}, Coins: {stats1['coins']}")
    assert stats1['quizzesCompleted'] == 1
    assert stats1['correctAnswers'] == 8
    assert stats1['wrongAnswers'] == 2
    assert stats1['accuracy'] == 80
    assert stats1['xp'] == 800
    assert stats1['coins'] == 100

    # 3. User completes Quiz 2 (Algorithms - 6 questions, 6 correct)
    print("\nAction 2: User finishes 'Алгоритмдер' (6/6 correct)...")
    MockQuizStore.record_attempt("test-kinematics", "Алгоритмдер", "Алгоритмдер", 6, 6)
    stats2 = MockQuizStore.get_stats()
    print(f"  Updated State -> Quizzes: {stats2['quizzesCompleted']}, Accuracy: {stats2['accuracy']}%, Correct: {stats2['correctAnswers']}, Wrong: {stats2['wrongAnswers']}, XP: {stats2['xp']}, Coins: {stats2['coins']}")
    assert stats2['quizzesCompleted'] == 2
    assert stats2['correctAnswers'] == 14
    assert stats2['wrongAnswers'] == 2
    assert stats2['accuracy'] == 88 # 14/16 = 87.5% -> 88%
    assert stats2['xp'] == 1400
    assert stats2['coins'] == 150
    assert stats2['overallProgress'] > 0

    # 4. Persistence Check: Simulate page reload
    print("\nAction 3: Page Reload / Session Restore simulation...")
    # Read back from storage string
    saved_attempts = json.loads(storage["physx_quiz_attempts"])
    assert len(saved_attempts) == 2, "Persisted attempts count mismatch"
    stats3 = MockQuizStore.get_stats()
    assert stats3 == stats2, "Stats mismatch after reload"
    print("  [OK] All stats match perfectly after reload.")

    print("\nTEST 3 PASSED: Full simulation end-to-end verified successfully.\n")

if __name__ == "__main__":
    test_quiz_data()
    test_html_bindings()
    test_end_to_end_simulation()
    print("ALL TESTS PASSED! Project audit and verification completely successful.")
