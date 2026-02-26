---
name: rayr-unity-testing
version: 1.0.0
description: >
  Unity mobile game testing expertise. Use when testing games built on the
  Unity engine — detecting crashes, understanding why UIAutomator fails on
  Unity canvases, finding performance issues, testing across different
  Unity render pipelines, and knowing which logcat patterns mean what.
author: Adithya Sharma
license: MIT
tags: [unity, game, mobile, testing, qa, crash, opengl, canvas, android]
---

# RAYR Unity Testing Skill

Unity games behave differently from native Android apps. If you use normal
Android testing approaches on a Unity game, you'll get wrong results. This
skill covers everything that's different.

---

## Why Unity Games Break Normal Testing Tools

### The Canvas Problem
Unity games render everything onto a single **OpenGL/Vulkan canvas**. From
Android's perspective, the entire game screen is ONE view — a `SurfaceView`
or `TextureView`. This means:

```
Normal Android app:          Unity game:
┌──────────────────┐         ┌──────────────────┐
│ TextView (Login) │         │                  │
│ Button (Submit)  │         │  [One big canvas] │
│ ImageView (Logo) │         │  Everything drawn │
│ EditText (Email) │         │  by Unity engine  │
└──────────────────┘         └──────────────────┘

UIAutomator sees 3 elements   UIAutomator sees 1 element
```

**Consequence:** `uiautomator dump` returns almost nothing useful for pure
Unity games. You need CV (computer vision) or coordinate-based tapping.

### Exception: Unity UI (uGUI) with Accessibility
If the developer enabled Unity's accessibility layer (`AccessibilityManager`),
UIAutomator CAN see buttons. Always test this first:

```bash
adb shell uiautomator dump /sdcard/dump.xml
adb shell cat /sdcard/dump.xml | grep -c "clickable=\"true\""
# If count > 5: accessibility is on, use UIAutomator
# If count < 3: pure canvas, use CV or coordinates
```

---

## Unity Crash Patterns in Logcat

These are Unity-specific. Normal Android crash detectors miss them:

```bash
# Unity engine crash
"Unity   : Crash"
"Unity   : Aborting batchmode"
"EXCEPTION: SIGSEGV"

# Unity C# exception (game code crash)
"FATAL EXCEPTION: UnityMain"
"UnhandledException"
"System.NullReferenceException"
"IndexOutOfRangeException"

# Unity memory issues
"Unity   : Out of memory!"
"GC_CONCURRENT freed"  # excessive GC = memory pressure
"Skipped X frames"     # frame skipping = performance issue

# Unity ANR patterns
"ANR in com.package.name"
"Input dispatching timed out"  # Unity blocking main thread
```

**How to monitor during test:**
```bash
adb logcat -d | grep -E "Unity|FATAL|ANR|Crash|Exception" | grep -v "^--"
```

---

## Performance Testing for Unity Games

### Frame Rate Check
```bash
# Capture gfxinfo before test action
adb shell dumpsys gfxinfo com.package.name reset

# Do your action (spin, level up, etc.)

# Read results
adb shell dumpsys gfxinfo com.package.name

# Look for:
# "Janky frames" — anything > 0 is a potential issue
# "Total frames rendered" — baseline
# "98th percentile" — worst frame time in ms (>16ms = jank at 60fps)
```

### Memory Pressure
```bash
adb shell dumpsys meminfo com.package.name

# Key values:
# "TOTAL" row → total memory used
# "Native Heap" → Unity's memory (usually largest)
# "Graphics" → GPU textures
# Warning signs: Native Heap > 500MB on mid-range devices
```

### Texture / Asset Loading
Unity loads assets at runtime. After transitions (lobby → slot → bonus):
```bash
# Check if memory went up and stayed up (memory leak)
# Run 3 times: before, after enter, after exit
adb shell dumpsys meminfo com.package.name | grep "TOTAL"
```

---

## Unity-Specific Test Cases

### Level Up Toaster (Unity uGUI overlay)
The toaster is likely a Unity Canvas overlay on the game canvas.
Test for:
- Z-order conflicts (toaster behind game elements)
- Canvas scaling on different screen densities
- Toaster persisting across scene transitions
- Memory not freed after toaster dismissed

### Slot Machine Reels (Unity Animator)
- Spin animation driven by `Animator` component
- Test: does level up toaster block reel area?
- Test: does performance degrade after 100+ spins?
- Test: does ANR occur when multiple animations play simultaneously?

### Bonus Game Interruption
Unity scenes often do async load. A level up during scene transition:
- Can leave toaster in wrong scene
- Can cause null reference (scene objects destroyed mid-animation)
- Always test level up at the exact moment of scene change

---

## Computer Vision for Unity Games

Since UIAutomator fails, use OpenCV to find buttons:

```python
import cv2
import numpy as np

def find_unity_buttons(screenshot_path: str) -> list:
    img = cv2.imread(screenshot_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Unity buttons: bright rectangles with good solidity
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 180, 255, cv2.THRESH_BINARY)

    # Morphological close to fill gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 5))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    buttons = []
    h, w = img.shape[:2]
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if (w * h * 0.002) < area < (w * h * 0.15):
            x, y, bw, bh = cv2.boundingRect(cnt)
            aspect = bw / bh if bh > 0 else 0
            solidity = area / (bw * bh)
            if 0.8 < aspect < 8 and solidity > 0.4:
                # Exclude status bar and nav bar
                if y > h * 0.05 and (y + bh) < h * 0.95:
                    buttons.append({"x": x + bw // 2, "y": y + bh // 2})
    return buttons
```

---

## Device Compatibility for Unity Games

Unity games render differently across:

| Device Type | Common Issues |
|---|---|
| High-end (Pixel 7 Pro) | Generally fine, good baseline |
| Mid-range | Frame drops during heavy animations |
| Low-end | Texture compression issues, OOM crashes |
| Tablets | Canvas scaling wrong, UI elements misplaced |
| Small screens | Toasters overlap important UI |

Always test on at least: high-end + mid-range + one tablet.

---

## Related Skills
- `@rayr-mobile-game-qa` — full QA workflow
- `@rayr-adb-automation` — ADB commands
- `@rayr-visual-testing` — CV screenshot comparison
- `@rayr-bug-classifier` — classifying Unity crashes
