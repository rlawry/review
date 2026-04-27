#!/usr/bin/env python3
"""
NYSSLS HS-ESS Regents Practice — Auto-Scorer
---------------------------------------------
Reads every *_response.txt file in the same directory as this script,
scores the multiple-choice questions, and writes a summary to the console
and to scores.csv.

Short-response answers (Q4, Constructed Response) are excluded from scoring.

Usage:
    python score_responses.py
"""

import csv
import glob
import os
import re

# ---------------------------------------------------------------------------
# Answer key: standard -> {question_number (1-3) -> correct choice (1-4)}
# ---------------------------------------------------------------------------
ANSWER_KEY = {
    "HS-ESS1-1": {1: 2, 2: 2, 3: 3},
    "HS-ESS1-2": {1: 2, 2: 2, 3: 1},
    "HS-ESS1-3": {1: 3, 2: 2, 3: 2},
    "HS-ESS1-4": {1: 2, 2: 2, 3: 2},
    "HS-ESS1-5": {1: 1, 2: 2, 3: 3},
    "HS-ESS1-6": {1: 2, 2: 3, 3: 2},
    "HS-ESS2-1": {1: 2, 2: 2, 3: 3},
    "HS-ESS2-2": {1: 2, 2: 2, 3: 2},
    "HS-ESS2-3": {1: 2, 2: 2, 3: 2},
    "HS-ESS2-4": {1: 1, 2: 2, 3: 2},
    "HS-ESS2-5": {1: 2, 2: 2, 3: 2},
    "HS-ESS2-6": {1: 3, 2: 2, 3: 3},
    "HS-ESS2-7": {1: 2, 2: 1, 3: 2},
    "HS-ESS3-1": {1: 2, 2: 2, 3: 2},
    "HS-ESS3-2": {1: 3, 2: 2, 3: 3},
    "HS-ESS3-3": {1: 2, 2: 2, 3: 2},
    "HS-ESS3-4": {1: 2, 2: 2, 3: 2},
    "HS-ESS3-5": {1: 2, 2: 2, 3: 2},
    "HS-ESS3-6": {1: 2, 2: 2, 3: 2},
}

TOTAL_MC = sum(len(v) for v in ANSWER_KEY.values())  # 57


def extract_choice(text: str):
    """Return the integer choice number from a response like '(2) Fusion...'"""
    m = re.match(r"^\((\d)\)", text.strip())
    return int(m.group(1)) if m else None


def score_file(filepath: str):
    name = os.path.basename(filepath).replace("_response.txt", "").replace("_", " ")
    correct = 0
    answered = 0
    by_std = {}

    with open(filepath, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            # Use Name field if present
            if row.get("Name", "").strip():
                name = row["Name"].strip()

            if row.get("Type", "").strip() != "Multiple Choice":
                continue

            std = row.get("Standard", "").strip()
            q_match = re.match(r"Q(\d+)", row.get("Question", "").strip())
            if not q_match:
                continue
            q_num = int(q_match.group(1))
            response = row.get("Response", "").strip()

            if not response:
                continue

            answered += 1
            choice = extract_choice(response)

            std_key = ANSWER_KEY.get(std, {})
            is_correct = choice is not None and std_key.get(q_num) == choice

            if is_correct:
                correct += 1

            if std not in by_std:
                by_std[std] = {"correct": 0, "total": 0}
            by_std[std]["total"] += 1
            if is_correct:
                by_std[std]["correct"] += 1

    return name, correct, answered, by_std


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    files = sorted(glob.glob(os.path.join(script_dir, "*_response.txt")))

    if not files:
        print("No *_response.txt files found in:", script_dir)
        return

    results = [score_file(fp) for fp in files]

    # --- Console output ---
    name_w = max(len(r[0]) for r in results) + 2
    name_w = max(name_w, 14)
    header = f"{'Student Name':<{name_w}} {'Score':>9}  {'Answered':>10}"
    print("\n" + header)
    print("-" * len(header))
    for name, correct, answered, _ in results:
        score_str = f"{correct}/{TOTAL_MC}"
        ans_str = f"{answered}/{TOTAL_MC}"
        print(f"{name:<{name_w}} {score_str:>9}  {ans_str:>10}")
    print()

    # --- CSV output ---
    out_path = os.path.join(script_dir, "scores.csv")
    with open(out_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        # Header row: Name, Score, Answered, then one column per standard
        std_labels = sorted(ANSWER_KEY.keys())
        writer.writerow(
            ["Student Name", f"Score (/{TOTAL_MC})", f"Answered (/{TOTAL_MC})"]
            + std_labels
        )
        for name, correct, answered, by_std in results:
            std_scores = [
                f"{by_std.get(s, {}).get('correct', 0)}/3" for s in std_labels
            ]
            writer.writerow(
                [name, f"{correct}/{TOTAL_MC}", f"{answered}/{TOTAL_MC}"] + std_scores
            )

    print(f"Results written to: {out_path}\n")


if __name__ == "__main__":
    main()
