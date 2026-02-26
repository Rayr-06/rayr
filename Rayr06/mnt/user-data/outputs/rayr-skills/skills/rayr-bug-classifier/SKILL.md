---
name: rayr-bug-classifier
version: 1.0.0
description: >
  Classifies, prioritises, and writes bug reports for mobile game QA.
  Use when you have a bug to report, need to decide severity/priority,
  want a JIRA-ready bug report, or need to triage a set of issues found
  during a test run. Includes mobile game-specific severity rules.
author: Adithya Sharma
license: MIT
tags: [bugs, jira, qa, severity, priority, reporting, mobile, game]
---

# RAYR Bug Classifier Skill

A bug report is only useful if it has the right severity, clear reproduction
steps, and enough evidence for a developer to fix it without asking questions.
This skill produces JIRA-ready bug reports and helps you triage fast.

---

## Severity Framework (Mobile Games)

### P0 — Critical (Fix Before Ship, Block Release)
Game-breaking. Affects all or most players. Revenue or data at risk.
```
✗ Game crashes on launch
✗ IAP (purchase) succeeds but coins not delivered
✗ Double charge on purchase retry
✗ Player data loss (coins reset, level reset)
✗ Login impossible for large player segment
✗ Game stuck in infinite loading (no recovery)
```

### P1 — High (Fix This Sprint, Ship Risk)
Feature broken. Wrong visible behaviour. Many players affected.
```
✗ Level up does not trigger after XP threshold
✗ Auto-spin stops on level up (should continue)
✗ Wrong coin count displayed after spin win
✗ Toaster appears mid-bonus and blocks gameplay
✗ Spin button unresponsive after returning from shop
✗ Level header shows wrong level (caching bug)
```

### P2 — Medium (Fix Soon, Not a Blocker)
Visible but not game-breaking. Affects some players or some states.
```
✗ Toaster overlaps bet selector on small screens
✗ Wrong animation duration (too short or too long)
✗ Toaster appears twice after fast re-entry
✗ Orientation change causes toaster to shift
✗ Text truncated in toaster on certain locales
```

### P3 — Low (Backlog, Polish)
Minor, cosmetic, rare.
```
✗ Slight misalignment of toaster on tablet
✗ Animation frame drop on very old devices
✗ Console warning in logcat (no user impact)
✗ Toaster shadow rendering artifact on specific GPU
```

---

## Bug Report Template (JIRA Ready)

Fill this for every bug you find:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TITLE:
[Feature] Short description of WHAT is wrong
Example: [Level Up] Toaster duplicates on rapid back-to-back level ups

SEVERITY:     P0 / P1 / P2 / P3
PRIORITY:     Blocker / High / Medium / Low
FREQUENCY:    Always / Intermittent (X/10) / Once
STATUS:       New

ENVIRONMENT:
  Build:      [e.g. HIR-RC-ANDROID-7861]
  Device:     [e.g. Pixel 7 Pro, Android 13]
  OS:         [e.g. Android 13]
  EOS:        [e.g. Test variant, level-up-toaster=ON]
  Network:    [e.g. WiFi / 4G / Throttled]

STEPS TO REPRODUCE:
  1. Launch game and close MOTD
  2. Enter any slot machine
  3. Level up twice in rapid succession (within 1 second)
  4. Observe toaster behaviour

EXPECTED:
  Previous level toaster is cancelled.
  Only the latest level toaster appears.

ACTUAL:
  Both toasters appear simultaneously, overlapping each other.

EVIDENCE:
  Screenshot: [attach]
  Video: [attach]
  Logcat: [paste relevant lines]

LOGCAT SNIPPET (if applicable):
  E/Unity  : Duplicate toast triggered for level X
  W/RAYR   : Toast queue exceeded max (2 active)

ADDITIONAL CONTEXT:
  Reproducible on Pixel 7 Pro, not tested on other devices.
  Did not occur in holdout variant (old flow).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Logcat → Bug Classification

Given a logcat line, here's how to classify it:

```python
SEVERITY_MAP = {
    "FATAL EXCEPTION":        ("P0", "App crash"),
    "ANR in":                 ("P0", "App Not Responding"),
    "NullPointerException":   ("P1", "Null reference — likely feature broken"),
    "IndexOutOfRangeException": ("P1", "Array/list bounds error"),
    "OutOfMemoryError":       ("P0", "OOM — game will crash soon"),
    "Unity   : Crash":        ("P0", "Unity engine crash"),
    "SIGSEGV":                ("P0", "Native crash — segfault"),
    "IllegalStateException":  ("P1", "Wrong app state — feature broken"),
    "ClassCastException":     ("P1", "Type mismatch in game code"),
    "NetworkOnMainThreadException": ("P1", "Network call blocking UI"),
}
```

---

## Triage Checklist (After a Test Run)

When you have a list of bugs to hand to the team:

```
□ Every P0 is flagged and assigned immediately
□ Every P0 has reproduction steps verified twice
□ P1s grouped by feature (level up, toaster, purchase, etc.)
□ Duplicates merged (same bug = one ticket)
□ Each bug has: device + build + EOS state recorded
□ Screenshot/video attached to every P1 and above
□ Logcat snippet attached to every crash
□ "Old vs New behaviour" noted for regression bugs
□ Blocked items noted with what's needed to unblock
```

---

## When a Developer Says "Can't Reproduce"

Give them this:
1. Exact build number (not just "latest")
2. Exact EOS/config state
3. Exact account state (level, coins, first session vs returning)
4. Video evidence
5. Logcat from the exact session
6. Whether it happens on emulator vs real device

---

## Related Skills
- `@rayr-mobile-game-qa` — full QA workflow
- `@rayr-unity-testing` — Unity-specific crash patterns
- `@rayr-adb-automation` — getting logcat evidence
