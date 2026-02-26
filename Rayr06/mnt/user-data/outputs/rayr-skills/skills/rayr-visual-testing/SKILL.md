---
name: rayr-visual-testing
version: 1.0.0
description: >
  Visual regression and screenshot comparison for mobile game testing.
  Use when comparing screenshots before/after a feature change, detecting
  UI regressions, verifying animation placement, checking toaster positions,
  validating layout on different screen sizes, or using AI vision to verify
  expected results from game screenshots.
author: Adithya Sharma
license: MIT
tags: [visual, screenshot, regression, cv, opencv, ai, vision, ui, layout]
---

# RAYR Visual Testing Skill

Screenshots are evidence. Visual comparison tells you if the screen changed.
AI vision tells you if what changed was correct. This skill covers both.

---

## Three Levels of Visual Testing

### Level 1 — Did the screen change? (OpenCV diff)
Fast, no AI needed. Just tells you: something changed vs nothing changed.
```python
import cv2, numpy as np

def screen_changed(before: str, after: str, threshold=0.02) -> bool:
    a = cv2.imread(before)
    b = cv2.imread(after)
    if a is None or b is None or a.shape != b.shape:
        return True  # assume changed if can't compare
    diff = cv2.absdiff(a, b)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)
    ratio = (mask > 0).sum() / mask.size
    return ratio > threshold  # True = screens are different
```

Use after every tap. If screen didn't change → tap probably didn't register.

### Level 2 — What changed and where? (Region analysis)
Tells you which part of the screen changed.
```python
def analyse_change_region(before: str, after: str) -> dict:
    a = cv2.imread(before)
    b = cv2.imread(after)
    h, w = a.shape[:2]

    diff = cv2.absdiff(a, b)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 15, 255, cv2.THRESH_BINARY)

    # Divide screen into zones
    zones = {
        "top":    mask[:h//4, :],
        "middle": mask[h//4:3*h//4, :],
        "bottom": mask[3*h//4:, :],
        "left":   mask[:, :w//2],
        "right":  mask[:, w//2:],
    }

    changed_zones = [z for z, m in zones.items() if (m > 0).sum() / m.size > 0.01]
    total_change = (mask > 0).sum() / mask.size

    return {
        "changed": total_change > 0.02,
        "change_ratio": total_change,
        "zones": changed_zones,
        "likely_toaster": "top" in changed_zones and total_change < 0.15,
        "likely_fullscreen": total_change > 0.5,
        "likely_popup": total_change > 0.15 and total_change < 0.5,
    }
```

### Level 3 — Is what I see correct? (AI Vision)
Sends screenshot to Claude/Gemini and asks "does this match the expected result?"

```python
def ai_verify(screenshot_path: str, expected: str, api_key: str) -> dict:
    import anthropic, base64
    with open(screenshot_path, "rb") as f:
        img_data = base64.standard_b64encode(f.read()).decode()

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=200,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": "image/png", "data": img_data}
                },
                {
                    "type": "text",
                    "text": f"""Look at this mobile game screenshot.
Expected: {expected}
Does the screenshot show this? Reply only with JSON:
{{"verified": true/false, "confidence": 0.0-1.0, "what_you_see": "..."}}"""
                }
            ]
        }]
    )
    import json
    return json.loads(response.content[0].text)
```

---

## Visual Regression: Before vs After a Build

To catch visual regressions between builds:

```python
# 1. Run through test flow on OLD build → save baseline screenshots
# 2. Install NEW build → run same flow → save new screenshots
# 3. Compare corresponding screenshots

def regression_compare(baseline_dir: str, new_dir: str) -> list[dict]:
    from pathlib import Path
    results = []

    for baseline_img in Path(baseline_dir).glob("*.png"):
        new_img = Path(new_dir) / baseline_img.name
        if not new_img.exists():
            results.append({"file": baseline_img.name, "status": "MISSING"})
            continue

        change = analyse_change_region(str(baseline_img), str(new_img))
        status = "CHANGED" if change["changed"] else "SAME"
        results.append({
            "file": baseline_img.name,
            "status": status,
            "change_ratio": f"{change['change_ratio']:.1%}",
            "zones": change["zones"],
        })

    return results
```

---

## Toaster Verification Checklist

When testing a toaster/notification UI element:

```
Visual checks (CV):
□ Toaster appeared (screen changed in top region)
□ Only one toaster visible (no overlap)
□ Toaster position: top of screen, not over reels or bet selector
□ Toaster auto-dismissed (screen reverted after N seconds)

AI vision checks:
□ Toaster shows correct level number
□ Toaster text matches configured text
□ No visual artifacts (truncation, overflow, wrong font)
□ Toaster doesn't appear when EOS toggle is OFF

Screenshot naming convention:
  TC001_step1_before.png    ← before tap
  TC001_step1_after.png     ← after tap
  TC001_step2_toaster.png   ← capture toaster visible
  TC001_step3_dismissed.png ← after toaster gone
```

---

## Saving Good Evidence

Screenshots are only useful if they're organised:

```
rayr_output/
├── TC001_level_up_spin/
│   ├── step1_launch_before.png
│   ├── step1_launch_after.png
│   ├── step4_spin_toaster_visible.png   ← KEY EVIDENCE
│   └── step5_toaster_dismissed.png
├── TC002_level_up_autospin/
│   └── ...
└── rayr_report_20250227.html
```

For bugs: always attach the **after** screenshot (shows the problem) AND the
**before** screenshot (shows what it looked like before the action).

---

## Related Skills
- `@rayr-mobile-game-qa` — full test workflow
- `@rayr-unity-testing` — CV-based button detection for Unity canvases
- `@rayr-bug-classifier` — turning visual evidence into bug reports
