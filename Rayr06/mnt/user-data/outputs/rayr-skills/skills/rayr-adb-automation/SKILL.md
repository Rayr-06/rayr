---
name: rayr-adb-automation
version: 1.0.0
description: >
  Complete ADB (Android Debug Bridge) automation for mobile game testing.
  Use when connecting devices, capturing screenshots, tapping coordinates,
  reading logcat, installing APKs, scripting test flows, or automating
  repetitive QA tasks on Android devices. Works with real devices and
  emulators.
author: Adithya Sharma
license: MIT
tags: [adb, android, automation, mobile, qa, testing, logcat, screenshot]
---

# RAYR ADB Automation Skill

You are an Android automation expert. You know every ADB command, when to use
it, what can go wrong, and how to recover. You write clean, reliable automation
scripts and never hardcode values that should be dynamic.

---

## Device Setup (Do This First, Every Time)

```bash
# 1. Check what's connected
adb devices
# Expected: "device" next to serial — NOT "unauthorized" or "offline"

# 2. If unauthorized — phone needs approval
#    Look at phone screen → tap "Allow USB Debugging" → tick "Always allow"

# 3. If multiple devices, always specify serial
adb -s <SERIAL> shell ...

# 4. Keep screen on during test runs (prevents disconnects)
adb shell svc power stayon true
# Restore after: adb shell svc power stayon false

# 5. Clear logcat before test (clean slate)
adb logcat -c
```

---

## Essential Commands

### App Management
```bash
# Install APK
adb install -r "path/to/app.apk"          # -r = replace existing

# Find package name if you don't know it
adb shell pm list packages | grep zynga   # swap "zynga" for your app

# Launch app
adb shell monkey -p com.package.name 1

# Force stop
adb shell am force-stop com.package.name

# Get current foreground app
adb shell dumpsys activity activities | grep mResumedActivity
```

### Screenshots & Screen Info
```bash
# Screenshot — save directly to computer (no temp file on device)
adb exec-out screencap -p > screenshot.png

# Get screen resolution (do this, never hardcode)
adb shell wm size
# Output: "Physical size: 1440x3120"

# Record screen (max 3 min by default)
adb shell screenrecord /sdcard/test.mp4
# Pull it: adb pull /sdcard/test.mp4
```

### Tapping & Input
```bash
# Tap at coordinates
adb shell input tap 720 1560

# Long press
adb shell input swipe 720 1560 720 1560 1000   # swipe to same spot = long press

# Swipe (scroll down)
adb shell input swipe 540 1500 540 500 300     # x1 y1 x2 y2 duration_ms

# Hardware back button
adb shell input keyevent KEYCODE_BACK

# Home button
adb shell input keyevent KEYCODE_HOME

# Enter text
adb shell input text "hello123"
```

### Logcat (Crash Detection)
```bash
# Read all errors (most useful for crash hunting)
adb shell logcat -d *:E

# Filter by package (best for targeted testing)
adb shell logcat -d | grep "com.your.package"

# Watch live (good during manual testing)
adb logcat | grep -E "FATAL|Exception|ANR|crash"

# Save to file for analysis
adb logcat -d > session_log.txt

# Key patterns that mean BUGS:
# FATAL EXCEPTION  → app crashed
# ANR in           → app not responding (main thread blocked)
# NullPointerException → null reference crash
# Unity : Crash    → Unity engine crash
# SIGSEGV          → native crash
```

### UI Hierarchy (Smarter Than Coordinate Tapping)
```bash
# Dump UI tree to device
adb shell uiautomator dump /sdcard/uidump.xml

# Pull and read it
adb pull /sdcard/uidump.xml
# Now parse XML for: bounds, text, content-desc, clickable

# Find a button by text in one line (grep)
adb shell uiautomator dump /sdcard/dump.xml && \
adb shell cat /sdcard/dump.xml | grep -o 'text="[^"]*"'
```

### Performance Monitoring
```bash
# CPU + memory snapshot
adb shell dumpsys meminfo com.package.name
adb shell top -n 1 | grep package.name

# FPS (frame timing)
adb shell dumpsys gfxinfo com.package.name

# Battery drain during test
adb shell dumpsys battery
```

---

## Scripting Patterns

### Never Do This ❌
```python
# Hardcoded resolution — breaks on every device
adb.tap(720, 1560)

# Not checking if screenshot actually worked
subprocess.run(["adb", "exec-out", "screencap", "-p"],
               stdout=open("shot.png", "wb"))  # file handle leak!

# Device check that always passes
if "device" in result.stdout:  # "List of devices attached" always has "device"!
    proceed()
```

### Always Do This ✅
```python
# Dynamic resolution
out = subprocess.run(["adb", "shell", "wm", "size"],
                     capture_output=True, text=True).stdout
w, h = out.split(":")[-1].strip().split("x")
screen_w, screen_h = int(w), int(h)

# Proper screenshot with file close
result = subprocess.run(["adb", "exec-out", "screencap", "-p"],
                        capture_output=True, timeout=15)
with open("shot.png", "wb") as f:
    f.write(result.stdout)

# Correct device detection
lines = result.stdout.strip().splitlines()
devices = [l.split()[0] for l in lines[1:] if len(l.split()) == 2 and l.split()[1] == "device"]
if not devices:
    raise RuntimeError("No device connected")
```

### Reliable Tap Flow
```python
def smart_tap(text_to_find: str, fallback_x: int, fallback_y: int):
    """Try UIAutomator text search first, fallback to coords."""
    # 1. Dump UI hierarchy
    subprocess.run(["adb", "shell", "uiautomator", "dump", "/sdcard/d.xml"])
    xml = subprocess.run(["adb", "shell", "cat", "/sdcard/d.xml"],
                         capture_output=True).stdout.decode("utf-8", errors="ignore")
    # 2. Find text
    import re
    m = re.search(rf'text="{re.escape(text_to_find)}"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', xml)
    if m:
        x1, y1, x2, y2 = map(int, m.groups())
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
    else:
        cx, cy = fallback_x, fallback_y
    subprocess.run(["adb", "shell", "input", "tap", str(cx), str(cy)])
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `device not found` | Unplug + replug, toggle USB debugging off/on |
| `unauthorized` | Tap "Allow" on phone screen |
| `offline` | `adb kill-server` then `adb start-server` |
| Screenshot is black | Screen might be off — `adb shell input keyevent KEYCODE_WAKEUP` |
| Logcat empty | Run `adb logcat -c` first, then re-run your test |
| Tap not working | Game might be using OpenGL canvas — try UIAutomator dump first |
| App crashes on install | Use `-r` flag: `adb install -r app.apk` |

---

## Related Skills
- `@rayr-mobile-game-qa` — full QA workflow
- `@rayr-unity-testing` — Unity-specific patterns
- `@rayr-visual-testing` — screenshot comparison
