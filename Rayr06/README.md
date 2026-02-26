# ⚡ RAYR Skills — AI Agent Skills for Mobile Game QA

> **The only AI skills collection built by a game QA engineer, for game QA engineers.**  
> 6 battle-tested skills from real experience testing AAA mobile titles.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-6-brightgreen.svg)](skills_index.json)
[![Works With](https://img.shields.io/badge/Works%20With-Claude%20Code%20%7C%20Cursor%20%7C%20Gemini%20CLI-purple.svg)]()

---

## What Are RAYR Skills?

Skills are markdown instruction files that make your AI agent an expert in a specific domain.
Install once. Use in any AI coding assistant that supports the SKILL.md format.

**What makes RAYR Skills different from other skill collections:**

| Other Skills | RAYR Skills |
|---|---|
| Generic AWS/React/Stripe tutorials | Mobile game QA from real experience |
| Written by generalists | Written by a game QA engineer (2+ years, AAA titles) |
| No game engine knowledge | Unity-specific crash patterns, canvas behaviour |
| No device automation | Complete ADB workflows that actually work |
| No business angle | How to run a QA business with an agentic team |

---

## Install

```bash
# Quickstart (installs to .agent/skills/)
npx rayr-skills

# For Claude Code
npx rayr-skills --claude

# For Cursor
npx rayr-skills --cursor

# Manual
git clone https://github.com/adithyasharma/rayr-skills.git .agent/skills/rayr-skills
```

---

## The Skills

### 🎮 `@rayr-mobile-game-qa`
Complete QA workflow for mobile games. Test planning, test case categories,
feature analysis, risk ranking, and the full execution checklist.

```
Use when: writing test cases, planning a QA cycle, analysing a new feature,
          or needing to know what to test for a mobile game release.
```

### 📱 `@rayr-adb-automation`
Every ADB command you need, with the right patterns and the common mistakes
clearly labelled. Dynamic screen size, proper screenshot capture, reliable
tap logic with UIAutomator fallback.

```
Use when: writing device automation scripts, debugging ADB issues,
          setting up a test device, or building a test runner.
```

### 🎲 `@rayr-unity-testing`
Why UIAutomator fails on Unity games. How to detect Unity-specific crashes
in logcat. Performance monitoring for Unity. Computer vision for when
accessibility is disabled.

```
Use when: testing any Unity mobile game, debugging why your automation
          isn't finding buttons, or monitoring performance.
```

### 🐛 `@rayr-bug-classifier`
P0/P1/P2/P3 severity framework for mobile games. JIRA-ready bug report
template. Logcat-to-severity mapping. Post-test-run triage checklist.

```
Use when: writing a bug report, triaging a list of issues,
          or deciding what to fix before a release.
```

### 👁️ `@rayr-visual-testing`
Three levels of visual verification: OpenCV diff (did it change?), region
analysis (where?), and AI vision (was it correct?). Screenshot evidence
organisation and toaster verification checklist.

```
Use when: comparing screenshots, detecting UI regressions,
          verifying toaster placement, or building visual evidence for bugs.
```

### 💼 `@rayr-qa-business`
How to run a QA-as-a-Service business with an AI agentic team. Service
tiers, pricing, proposal templates, client acquisition, and the full
workflow for delivering QA at scale as a solo operator.

```
Use when: scoping a QA engagement, pricing your services, writing a
          client proposal, or figuring out how to scale without hiring.
```

---

## Usage Examples

```bash
# Claude Code
>> /rayr-mobile-game-qa write test cases for the Level Up feature
>> /rayr-bug-classifier write a JIRA bug report for this crash

# Cursor
@rayr-adb-automation my screenshot function keeps failing
@rayr-unity-testing why is UIAutomator returning nothing

# Any agent
Use @rayr-qa-business to help me price a QA engagement for a mobile game studio
```

---

## The Full RAYR System

These skills are part of a larger open source QA automation system:

```
rayr-skills/          ← You are here (AI agent skills)
├── RAYR Test Runner  → Reads test cases, executes on device
├── RAYR Brain        → AI vision layer (Claude/Gemini)
└── RAYR Navigator    → Handles popups, MOTDs, offers automatically
```

**Full tool:** [github.com/adithyasharma/rayr](https://github.com/adithyasharma/rayr)

---

## Works With

| Tool | How to Use |
|---|---|
| **Claude Code** | `>> /rayr-skill-name your task` |
| **Cursor** | `@rayr-skill-name your task` |
| **Gemini CLI** | `Use rayr-skill-name for your task` |
| **Any SKILL.md agent** | Reference skill name in your prompt |

---

## Why I Built This

I'm a Game QA Engineer. I've spent 2+ years testing AAA mobile titles —
slot games, casual games, feature releases with complex EOS configurations.

I built RAYR because I was tired of:
- Automation tools that break when a popup appears
- Generic QA guides that don't understand Unity games
- Test runners that hardcode coordinates and break on every device

These skills encode what I actually know, not what a textbook says.

---

## Contributing

Found a bug pattern I missed? Have a game engine not covered?  
PRs welcome. Open an issue first to discuss.

---

## License

MIT — use freely, commercially or otherwise.

---

*Built by Adithya Sharma — Game QA Engineer*  
*"No more guessing. No more broken coordinates. Just results."*
