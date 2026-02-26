---
name: rayr-qa-business
version: 1.0.0
description: >
  How to run a QA-as-a-Service business using AI agents. Use when scoping
  a QA engagement, pricing your services, writing proposals, building client
  reports, automating repetitive QA work, and scaling your business without
  hiring. Built for a solo QA engineer running an agentic team.
author: Adithya Sharma
license: MIT
tags: [business, freelance, qa, saas, agency, pricing, proposal, client]
---

# RAYR QA Business Skill

You are a QA engineer running a one-person agency powered by AI agents.
Your competitive advantage: you deliver the output of a 5-person QA team,
because your agents handle the repetitive work while you handle the thinking.

---

## Your Service Stack

### Tier 1 — Quick Audit ($200–500 per audit)
**What:** Single feature or build tested in 24–48 hours
**Deliverable:** HTML report with pass/fail, screenshots, bug list, confidence score
**Who buys:** Indie game studios, small mobile dev teams
**How you deliver it:** RAYR automated run + your manual verification of P0/P1 bugs
**Time investment:** 2–3 hours of your time

### Tier 2 — Regression Pack ($800–2000/month retainer)
**What:** Every release tested against a fixed test suite
**Deliverable:** Report per release + Slack/JIRA integration
**Who buys:** Studios with regular release cadence (weekly/biweekly)
**How you deliver it:** RAYR runs the regression automatically, you review and sign off
**Time investment:** 4–6 hours per release cycle

### Tier 3 — QA Partnership ($3000–8000/month)
**What:** Embedded QA on their team — test planning, execution, reporting, analytics review
**Deliverable:** Full QA coverage, Charles proxy analysis, EOS validation support
**Who buys:** Mid-size game companies (Zynga-tier) without in-house QA
**How you deliver it:** You + your agentic stack as their QA team
**Time investment:** 20–30 hours/month

---

## Client Proposal Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QA PROPOSAL — [Client Name]
Prepared by: Adithya Sharma / RAYR QA Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT I UNDERSTAND YOU NEED:
[1-2 sentences: their problem in their language]

WHAT I WILL DELIVER:
□ Test plan covering [X] features / [X] test cases
□ Automated regression run on [device/s]
□ Bug report with severity classification
□ Release confidence score (0–100%)
□ HTML report with screenshot evidence

TIMELINE:
  Day 1: Build received, test plan confirmed
  Day 2: Automated run + manual verification
  Day 3: Report delivered

INVESTMENT:
  [Tier 1 Audit]: $[X]
  [Optional monthly retainer]: $[X]/month

WHAT I NEED FROM YOU:
  • APK/build file
  • Feature spec or test cases (any format)
  • EOS/config state for test run
  • Any known issues to watch for

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Your Agentic Workflow (How You Work)

```
CLIENT SENDS BUILD + TEST CASES
           │
           ▼
    RAYR reads test cases
    (any Excel/CSV/text format)
           │
           ▼
    AI Brain looks at screen
    Clears popups automatically
           │
           ▼
    Executes test steps on device
    Takes screenshots every step
    Reads logcat for crashes
           │
           ▼
    AI verifies expected results
           │
           ▼
    YOU review P0/P1 bugs manually
    (15–30 min of your time)
           │
           ▼
    HTML report auto-generated
    Send to client
```

**Key insight:** You're not the tester anymore. You're the QA Lead.
Your agents do the execution. You do the thinking.

---

## Finding Clients

### Where game studios need QA:
1. **LinkedIn** — search "mobile game QA" or "game testing" + message leads
2. **Upwork/Toptal** — "mobile game QA" gigs, start with quick audits
3. **Game dev Discord servers** — offer a free audit to build credibility
4. **Indie dev communities** — itch.io developers, GameJam winners going commercial
5. **Direct outreach** — find studios that launched recently, offer pre-launch QA

### Cold outreach template:
```
Hi [Name],

I saw [game name] is launching soon. I'm a game QA engineer who's tested
mobile titles at [company] — I specialise in [feature area].

I can run a full regression test on your latest build and deliver a detailed
bug report in 48 hours. First audit is free for studios I want to work with.

Interested?

— Adithya Sharma
RAYR QA | adithya.sharma@email.com
```

---

## Pricing Your Work

| Scope | Hours (Your Time) | Agent Time | Price |
|---|---|---|---|
| Single feature audit | 2h | 3h automated | $300 |
| Full regression (50 TCs) | 4h | 6h automated | $800 |
| Release validation | 3h | 4h automated | $500 |
| Monthly retainer (weekly) | 12h/mo | 20h automated | $2000/mo |
| Embedded QA partner | 25h/mo | 40h automated | $5000/mo |

**Never compete on price alone.** Your value is:
- Speed (48h turnaround vs 2 weeks for hiring)
- Evidence (screenshot + logcat + AI verification, not just "I clicked it")
- Expertise (game QA is a niche — general testers don't know Unity, Charles, EOS)

---

## Building Your Public Profile

### GitHub (RAYR repo)
- Public code shows you can build tools, not just run them
- Stars = social proof
- Other QA engineers using your skills = community

### LinkedIn Posts That Get Attention
```
Post ideas:
→ "Found 3 P0 bugs in a slot game build using AI — here's the logcat"
→ "Why UIAutomator fails on Unity games (and what to use instead)"  
→ "Level Up flow testing: 8 test cases every mobile game needs"
→ "How I run QA on a new game build in under 2 hours"
```

### Niche = Trust
You're not "a QA engineer". You're "the QA engineer for mobile slot games".
That specificity makes you the obvious choice for every Zynga, Playtika,
SciPlay, and indie studio working in that space.

---

## Tools Your Agentic Team Uses

| Tool | Purpose | Cost |
|---|---|---|
| RAYR Test Runner | Automated test execution | Free (yours) |
| Claude API | Visual intelligence brain | ~$20/month |
| ADB + device | Real device testing | Hardware you have |
| Charles Proxy | Analytics verification | $50 one-time |
| JIRA/Linear | Bug tracking (client's tool) | Client pays |
| GitHub | Portfolio + skills repo | Free |

**Total running cost:** ~$30/month
**Revenue per client:** $300–5000/month

---

## Related Skills
- `@rayr-mobile-game-qa` — doing the actual QA work
- `@rayr-bug-classifier` — writing professional bug reports
- `@rayr-adb-automation` — the technical execution
