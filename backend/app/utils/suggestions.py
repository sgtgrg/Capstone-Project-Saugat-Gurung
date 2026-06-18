"""Rule-based stress suggestions.

Deterministic, explainable tips derived from a PSS-10 result and the four
daily factors (sleep, workload, focus, mood). No external services — fully
private and reproducible, which suits the project's privacy-first goal and
makes the logic easy to justify in the evaluation.

Each suggestion is a dict: {"tag", "title", "body"}.

`suggest_for_assessment` -> tips for a single just-completed assessment.
`suggest_for_trend`      -> tips based on averages over recent history
                            (used by the dashboard later). Both share helpers
                            so the logic stays consistent.

Note: these are general wellbeing tips, not medical advice.
"""

# Thresholds (kept in one place so they're easy to tune / cite).
LOW_FACTOR = 4   # 1-10 factor at or below this is a concern
HIGH_WORKLOAD = 7  # workload at or above this is a concern


def suggest_for_assessment(pss_category, factors):
    """Return a list of suggestions for one assessment.

    pss_category: "low" | "moderate" | "high"
    factors: dict with sleep, workload, focus, mood (1-10)
    """
    tips = []

    # --- Overall stress level ------------------------------------------------
    if pss_category == "high":
        tips.append({
            "tag": "stress",
            "title": "Your perceived stress is high right now",
            "body": "Consider a short reset today — a 10-minute walk, slow "
                    "breathing (try 4 seconds in, 6 out), or stepping away from "
                    "screens. If high stress persists for weeks, talking to "
                    "someone you trust or a counsellor can really help.",
        })
    elif pss_category == "moderate":
        tips.append({
            "tag": "stress",
            "title": "You're carrying a moderate amount of stress",
            "body": "A good moment to protect your downtime. Small, regular "
                    "breaks tend to help more than one long one.",
        })
    else:
        tips.append({
            "tag": "stress",
            "title": "Your stress level looks well-managed",
            "body": "Nice — whatever you're doing is working. Keeping a steady "
                    "routine helps maintain this.",
        })

    # --- Specific factors ----------------------------------------------------
    _maybe_add_factor_tips(tips, factors)

    # Always leave them with one gentle, general nudge if nothing else fired.
    if len(tips) == 1 and pss_category == "low":
        tips.append({
            "tag": "general",
            "title": "Keep checking in",
            "body": "Logging how you feel regularly is the best way to spot "
                    "patterns early. Try to assess around the same time each day.",
        })

    return tips


def suggest_for_trend(stats):
    """Return suggestions from aggregate stats (dashboard).

    stats: {count, average_score, average_factors}
    """
    tips = []
    if not stats or not stats.get("count"):
        return tips

    avg_score = stats.get("average_score")
    if avg_score is not None:
        if avg_score > 26:
            category = "high"
        elif avg_score > 13:
            category = "moderate"
        else:
            category = "low"

        if category == "high":
            tips.append({
                "tag": "trend",
                "title": "Your average stress has been high lately",
                "body": "Over your recent check-ins, perceived stress has stayed "
                        "elevated. It may be worth looking at what's been most "
                        "draining and whether anything can be reduced or shared.",
            })
        elif category == "low":
            tips.append({
                "tag": "trend",
                "title": "You've kept stress low over time",
                "body": "Your recent average is in a healthy range. Great "
                        "consistency.",
            })

    _maybe_add_factor_tips(tips, stats.get("average_factors") or {}, trend=True)
    return tips


def _maybe_add_factor_tips(tips, factors, trend=False):
    """Add factor-specific tips. Shared by single + trend paths."""
    prefix = "On average your" if trend else "Your"

    sleep = factors.get("sleep")
    if isinstance(sleep, (int, float)) and sleep <= LOW_FACTOR:
        tips.append({
            "tag": "sleep",
            "title": f"{prefix} sleep quality is low",
            "body": "Poor sleep and stress feed each other. A consistent wind-down "
                    "(dim lights, no screens for 30 min, same bedtime) often makes "
                    "the biggest difference.",
        })

    workload = factors.get("workload")
    if isinstance(workload, (int, float)) and workload >= HIGH_WORKLOAD:
        tips.append({
            "tag": "workload",
            "title": f"{prefix} workload is heavy",
            "body": "Try breaking work into focused blocks with short breaks "
                    "between them, and protect at least one no-work window today. "
                    "Listing tasks and picking the top three can reduce overwhelm.",
        })

    focus = factors.get("focus")
    if isinstance(focus, (int, float)) and focus <= LOW_FACTOR:
        tips.append({
            "tag": "focus",
            "title": f"{prefix} focus has been low",
            "body": "Low focus is a common stress symptom. A 25-minute focus / "
                    "5-minute break cycle, and silencing notifications, can help "
                    "you get traction.",
        })

    mood = factors.get("mood")
    if isinstance(mood, (int, float)) and mood <= LOW_FACTOR:
        tips.append({
            "tag": "mood",
            "title": f"{prefix} mood has been low",
            "body": "Be kind to yourself today. Light movement, sunlight, or "
                    "connecting with someone you like can lift mood. If low mood "
                    "lasts more than two weeks, consider reaching out for support.",
        })
