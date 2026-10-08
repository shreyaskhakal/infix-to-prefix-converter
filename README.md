# Infix to Prefix Converter — Interactive DSA Lab & Learning Platform

[![CI Pipeline](https://github.com/shreyaskhakal/infix-to-prefix-converter/actions/workflows/ci.yml/badge.svg)](https://github.com/shreyaskhakal/infix-to-prefix-converter/actions)
[![Tests](https://img.shields.io/badge/tests-119%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **"Understand the Stack. Don't Just Get the Answer."**

An interactive, production-grade Data Structures & Algorithms visualizer and learning platform engineered to demonstrate exactly how stack frames transform mathematical expressions into Polish Prefix notation.

**Live Repository:** [https://github.com/shreyaskhakal/infix-to-prefix-converter](https://github.com/shreyaskhakal/infix-to-prefix-converter)

---

## 🌟 Key Features

1. **Deterministic 5-Phase Conversion Engine**
   - Real mathematical execution pipeline—**zero hardcoded mock data** and **zero `eval()` or `Function()` calls**.
   - Character-exact syntax validation with precise error position pointers and human-readable diagnostics.
   - Comprehensive tokenization supporting:
     - Multi-digit numbers (`123.45`, `1000.001`)
     - Descriptive identifiers (`price`, `total_price`, `variable_1`, `student_marks`)
     - Unary operators (`+A`, `-A`, `-A+B`, `+A+B`, `A+(-B)`, `A*(-B)`, `-(A+B)`, `+(A+B)`, `A^-B`, `A+-B`, `A--B`, `A/-B`, `-(-A)`, `+(-A)`)
     - Implicit multiplication (`2(A+B)`, `A(B+C)`, `(A+B)(C+D)`)
     - Right-associative exponentiation (`A^B^C` $\to$ `^A^BC`)
     - Unary precedence interaction with exponentiation (`-A^B` $\to$ `^-AB`, `-(A^B)` $\to$ `-^AB`, `-(A+B)^C` $\to$ `^-+ABC`)

2. **Animated Stack Beaker (Strict LIFO)**
   - High-fidelity Framer Motion micro-animations representing push, pop, and peek operations.
   - Distinct visual state for the top-of-stack pointer (`TOP ↓`).
   - Live telemetry tracking peak stack depth, push counts, and pop counts.

3. **Time-Machine Playback Controls & Keyboard Navigation**
   - Step forward (`→`), step backward (`←`), first step (`Home`), last step (`End`).
   - Auto-advance play/pause transport (`Space`) with variable speeds (**0.5x**, **1.0x**, **1.5x**, **2.0x**).
   - Interactive timeline scrub slider with progress percentage.
   - Keyboard accessible navigation throughout.

4. **"Why Did This Happen?" Educational Reason Engine**
   - Context-aware explanations for every single micro-operation.
   - Dynamic precedence comparisons (`Precedence(+) = 2 < Precedence(*) = 3`).
   - Clear rules explaining right-associative exponentiation (`^`), unary operators, and parenthesis isolation.

5. **What-If Comparison Lab**
   - Side-by-side comparative analysis of two expressions (e.g. `A + B * C` vs `(A + B) * C`).
   - Visual explanation of how grouping and parentheses alter stack depth and operator execution trees.

6. **Interactive Practice Arena (4 Difficulty Tiers)**
   - Practice challenges categorized across **Easy**, **Medium**, **Hard**, and **Expert**.
   - Dynamic procedural challenge generator creating verified expression-to-prefix problems on demand.
   - Live accuracy percentage, correct answers count, and consecutive streak tracking.
   - Immediate answer verification and step-by-step breakdown.

7. **Comprehensive DSA Quiz System (52 Questions)**
   - 52 syllabus-aligned multiple choice questions across 10 core categories:
     - Stack Invariants & LIFO mechanics
     - Operator Precedence & Associativity
     - Prefix / Polish Notation & Postfix
     - Conversion Algorithm details
     - Parentheses Handling
     - Time & Space Complexity ($\mathcal{O}(N)$ bounds)
     - Tokenization & Lexical Analysis
     - Expression Trees & ASTs
   - Variable session lengths (10, 25, or all 52 questions) with question shuffling and detailed rationales.

8. **Conversion History Drawer**
   - Resilient `localStorage` persistence with defensive fallback handling.
   - Live instant search/filtering across previous conversions.
   - Displays original expression, prefix output, timestamp, and step count badge.
   - 1-click reloading into the visualizer or item deletion.

9. **Export & Reporting**
   - 1-click clipboard copy for Prefix, Infix, and Postfix notations.
   - Export structured JSON telemetry report with full conversion metadata.
   - Export complete Step-by-Step Trace Matrix as CSV for laboratory assignments or documentation.

10. **Modern Accessible & Responsive Design**
    - Seamless Dark/Light theme switching with tailored contrast palettes.
    - Full viewport responsiveness tested from mobile (320px) to ultra-wide displays.
    - Accessibility compliant: `:focus-visible` outlines, semantic ARIA labels, and `prefers-reduced-motion` animation support.

---

## 🔬 How the Conversion Algorithm Works

Unlike simple AST evaluators, Infix expressions can be converted to Prefix via a systematic 5-phase stack process:

$$\text{Infix} \xrightarrow{\text{Reverse Tokens}} \text{Reversed Stream} \xrightarrow{\text{Swap ()}} \text{Modified Stream} \xrightarrow{\text{Stack Engine}} \text{Intermediate Postfix} \xrightarrow{\text{Reverse}} \text{Prefix}$$

### The 5 Stages:
1. **Tokenize & Validate:** Split input into structured tokens, resolve unary vs binary operators, expand implicit multiplication, and verify parenthesis balancing.
2. **Reverse Tokens:** Reverse the order of tokens from right to left.
3. **Swap Parentheses:** Change every `'('` to `')'` and every `')'` to `'('` to maintain proper grouping semantics in the reversed stream.
4. **Postfix Conversion via Stack:**
   - Operands are immediately emitted to the intermediate output buffer.
   - `'('` is pushed to stack to create an isolated scope.
   - `')'` pops all operators to output until matching `'('`, then discards both.
   - **Precedence Rule:** Incoming operator pops operators from stack if top has higher precedence.
   - **Associativity Rule:** In the reversed stream, right-associative operators (`^`, Unary) pop on *equal* precedence, whereas left-associative operators (`+`, `-`, `*`, `/`, `%`) do *not* pop on equal precedence.
5. **Reverse Output Buffer:** Reversing the intermediate sequence produces the canonical Polish Prefix notation.

---

## 📊 Operator Precedence & Associativity Reference

| Operator | Representation | Operation | Precedence | Associativity | Example Evaluation |
|:---:|:---:|:---:|:---:|:---:|:---|
| `+` / `-` | `UNARY_PLUS` / `UNARY_MINUS` | Unary Sign | **5** | **Right-to-Left** | `-A + B` $\to$ `+ - A B` |
| `^` | `EXPONENT` | Exponentiation | **4** | **Right-to-Left** | `A ^ B ^ C` $\to$ `A ^ (B ^ C)` $\to$ `^ A ^ B C` |
| `*` | `MULTIPLY` | Multiplication | **3** | **Left-to-Right** | `(A * B) * C` |
| `/` | `DIVIDE` | Division | **3** | **Left-to-Right** | `(A / B) / C` |
| `%` | `MODULO` | Modulo | **3** | **Left-to-Right** | `(A % B)` |
| `+` | `ADD` | Binary Addition | **2** | **Left-to-Right** | `(A + B) + C` |
| `-` | `SUBTRACT` | Binary Subtraction| **2** | **Left-to-Right** | `(A - B) - C` |

---

## ⚡ Computational Complexity

| Metric | Complexity | Explanation |
|---|:---:|---|
| **Time Complexity** | $\mathcal{O}(N)$ | Linear single-pass tokenization, $\mathcal{O}(N)$ stream reversals, and each token is pushed and popped from the stack at most once. Amortized $\mathcal{O}(1)$ time per token. |
| **Space Complexity** | $\mathcal{O}(N)$ | Auxiliary memory is bounded by the operator stack ($\le N$) and intermediate token output buffers ($N$). |

---

## 📂 Project Architecture

```
infix-to-prefix-converter/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI matrix (Node 20, 22: lint, test, build)
├── index.html                   # HTML entry with SEO, Open Graph & typography
├── package.json                 # Dependencies and build scripts
├── vite.config.ts               # Vite bundler & Tailwind CSS plugin configuration
├── vercel.json                  # Vercel deployment SPA rewrite routing
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root state orchestration & tab layout
│   ├── App.css                  # Accessibility styles & reduced-motion queries
│   ├── index.css                # Tailwind CSS v4 directives & theme styles
│   ├── types/
│   │   └── index.ts             # Strict TypeScript definitions & data models
│   ├── algorithms/
│   │   ├── stack.ts             # Generic LIFO Stack with telemetry tracking
│   │   ├── tokenizer.ts         # Lexical scanner for identifiers, floats, unary & parens
│   │   ├── validator.ts         # Character-exact syntax validator with position tracking
│   │   ├── whyEngine.ts         # Deterministic educational reasoning engine
│   │   ├── converter.ts         # 5-phase Infix-to-Prefix state generator
│   │   └── practiceGenerator.ts # Procedural verified challenge generator
│   ├── components/
│   │   ├── Navbar.tsx           # Brand header, navigation tabs & theme toggle
│   │   ├── StackVisualizer.tsx  # Animated Framer Motion stack beaker
│   │   ├── PipelineViewer.tsx   # 6-phase transformation pipeline display
│   │   ├── TokenRibbon.tsx      # Token stream viewer with active pulse
│   │   ├── OperationPanel.tsx   # "Why Did This Happen?" educational reason engine
│   │   ├── PlaybackControls.tsx # Scrub slider, speed buttons, and step transport
│   │   ├── StepTable.tsx        # Trace matrix table with CSV download
│   │   ├── ResultCard.tsx       # Infix, Prefix, Postfix display, JSON & CSV export
│   │   ├── WhatIfView.tsx       # Side-by-side operator comparison lab
│   │   ├── PracticeView.tsx     # Interactive challenge arena with difficulty filters
│   │   ├── QuizView.tsx         # 52-question DSA proficiency quiz with categories
│   │   ├── HistoryDrawer.tsx    # Slide-over recent conversions drawer with search
│   │   ├── LearnView.tsx        # Theory, pseudocode, and complexity analysis
│   │   └── AboutView.tsx        # Technical overview and credits
│   ├── data/
│   │   └── constants.ts         # 52 quiz questions, challenges, and example expressions
│   └── tests/
│       ├── converter.test.ts          # 15 tests: core conversions & stack invariants
│       ├── validator_tokenizer.test.ts# 16 tests: lexical scanning & syntax validation
│       ├── unary_and_operators.test.ts# 43 tests: unary operators & complex expressions
│       ├── practice_and_quiz.test.ts  # 9 tests: practice generator & quiz verification
│       ├── property_and_stress.test.ts# 4 tests: property-based fuzzing & 5k stress test
│       └── export_and_features.test.ts# 13 tests: CSV/JSON export & history safety
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
|:---:|:---|:---|
| <kbd>Space</kbd> | Toggle Play / Pause playback | Converter View |
| <kbd>→</kbd> | Step forward | Converter View |
| <kbd>←</kbd> | Step backward | Converter View |
| <kbd>Home</kbd> | Jump to first step | Converter View |
| <kbd>End</kbd> | Jump to final result step | Converter View |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | Accessible element focus navigation | Global |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node 20.x and 22.x)
- npm `v9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/shreyaskhakal/infix-to-prefix-converter.git

# Navigate into project directory
cd infix-to-prefix-converter

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Running Tests
```bash
npm test
```
Executes all **100 automated Vitest unit, property, and stress tests** across the test suites.

### Code Quality & Linting
```bash
npm run lint
```
Runs high-speed linting with `oxlint` ensuring zero code defects.

### Production Build
```bash
npm run build
```
Compiles TypeScript and creates optimized bundles in `dist/`.

---

## 🌐 Deployment to Vercel

This project is pre-configured for 1-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import project into Vercel.
3. Build settings are auto-configured via `vercel.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

---

## 👨‍💻 Author

**Shreyas Khakal**
- GitHub: [@shreyaskhakal](https://github.com/shreyaskhakal)
- Repository: [infix-to-prefix-converter](https://github.com/shreyaskhakal/infix-to-prefix-converter)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
