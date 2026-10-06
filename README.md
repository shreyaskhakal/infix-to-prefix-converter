# Infix to Prefix Converter — Interactive DSA Lab

[![Tests](https://img.shields.io/badge/tests-31%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **"Understand the Stack. Don't Just Get the Answer."**

An interactive, production-quality Data Structures & Algorithms visualizer built to demonstrate exactly how stack frames transform mathematical expressions into Polish Prefix notation.

**Live GitHub Repository:** [https://github.com/shreyaskhakal/infix-to-prefix-converter](https://github.com/shreyaskhakal/infix-to-prefix-converter)

---

## 🌟 Key Features

1. **Deterministic 5-Phase Conversion Engine**
   - Real mathematical execution pipeline—**zero hardcoded mock data** and **zero `eval()`**.
   - Character-exact syntax validation with precise error position highlighting.
   - Comprehensive tokenization supporting multi-digit numbers (`123.45`), meaningful variable names (`price * tax`), decimal floats, and implicit multiplication (`A(B+C)` $\to$ `A*(B+C)`).

2. **Animated Stack Beaker (Strict LIFO)**
   - Framer Motion micro-animations representing push, pop, and peek operations.
   - Distinct visual state for the top-of-stack pointer (`TOP ↓`).
   - Live telemetry tracking peak stack depth, push counts, and pop counts.

3. **Time-Machine Playback Controls**
   - Step forward (`>`), step backward (`<`), first step (`|<<`), last step (`>>|`).
   - Auto-advance play/pause timer with variable speeds (**0.5x**, **1.0x**, **2.0x**).
   - Scrub timeline slider with percentage tracking.

4. **"Why Did This Happen?" Reason Engine**
   - Context-aware explanations for every single micro-operation.
   - Dynamic precedence checks (`Precedence(+) = 2 < Precedence(*) = 3`).
   - Clear rules explaining right-associative exponentiation (`^`) and parenthesis isolation.

5. **What-If Comparison Lab**
   - Side-by-side comparative analysis of two expressions (e.g. `A + B * C` vs `(A + B) * C`).
   - Visual explanation of how grouping modifies stack depth and operator execution trees.

6. **Interactive Practice Arena**
   - Real-time prediction challenges categorized by difficulty (*Beginner*, *Intermediate*, *Advanced*).
   - Immediate answer verification and score tracking saved in `localStorage`.

7. **DSA Concept Quiz Mode**
   - 10 comprehensive multiple-choice questions testing stack invariants, precedence hierarchy, and token reversal algorithms.
   - Detailed rationale displayed for each response.

8. **Conversion History Drawer**
   - Persists recent conversions in `localStorage`.
   - 1-click loading back into the visualizer or deletion.

9. **Export & Reporting**
   - Copy Prefix, copy all formats (`Infix`, `Prefix`, `Postfix`).
   - Export structured JSON telemetry report.
   - Export complete Step-by-Step Trace Matrix as CSV.

10. **Modern Responsive Design**
    - Dark mode by default with seamless Dark/Light theme switching.
    - Fully responsive across desktop, tablet, and mobile viewports.

---

## 🔬 How the Conversion Algorithm Works

Unlike simple AST evaluators, Infix expressions can be converted to Prefix via a systematic 5-phase stack process:

$$\text{Infix} \xrightarrow{\text{Reverse}} \text{Reversed Infix} \xrightarrow{\text{Swap ()}} \text{Modified Infix} \xrightarrow{\text{Stack Engine}} \text{Intermediate Postfix} \xrightarrow{\text{Reverse}} \text{Prefix}$$

### The 5 Stages:
1. **Tokenize & Validate:** Split input into structured tokens and verify parentheses balancing and operator adjacency.
2. **Reverse Tokens:** Reverse the order of tokens from right to left.
3. **Swap Parentheses:** Change every `'('` to `')'` and every `')'` to `'('` to restore proper nesting direction.
4. **Postfix Conversion via Stack:**
   - Operands are immediately emitted to the output stream.
   - `'('` is pushed to stack to create an isolated scope.
   - `')'` pops all operators to output until matching `'('`, then discards both.
   - **Precedence Rule:** Incoming operator pops operators from stack if top has higher precedence.
   - **Associativity Rule:** In the reversed stream, right-associative exponentiation (`^`) pops on *equal* precedence, whereas left-associative operators (`+`, `-`, `*`, `/`, `%`) do *not* pop on equal precedence.
5. **Reverse Output:** Reversing the intermediate postfix sequence yields the canonical Polish Prefix notation.

---

## 📊 Operator Precedence & Associativity Reference

| Operator | Operation | Precedence | Associativity | Example Evaluation |
|:---:|:---:|:---:|:---:|:---|
| `^` | Exponentiation | **4** | **Right-to-Left** | `A ^ B ^ C` $\to$ `A ^ (B ^ C)` $\to$ `^A^BC` |
| `*` | Multiplication | **3** | **Left-to-Right** | `(A * B) * C` |
| `/` | Division | **3** | **Left-to-Right** | `(A / B) / C` |
| `%` | Modulo | **3** | **Left-to-Right** | `(A % B)` |
| `+` | Addition | **2** | **Left-to-Right** | `(A + B) + C` |
| `-` | Subtraction | **2** | **Left-to-Right** | `(A - B) - C` |

---

## ⚡ Computational Complexity

| Metric | Complexity | Explanation |
|---|:---:|---|
| **Time Complexity** | $\mathcal{O}(N)$ | Every token is tokenized once, reversed in $\mathcal{O}(N)$, and pushed/popped from the stack at most once. Amortized $\mathcal{O}(1)$ time per token. |
| **Space Complexity** | $\mathcal{O}(N)$ | Auxiliary memory is bounded by the operator stack ($\le N$) and output buffers ($N$). |

---

## 📂 Project Architecture

```
infix-to-prefix-converter/
├── index.html                   # HTML entry with SEO, Open Graph & typography
├── package.json                 # Dependencies and build scripts
├── vite.config.ts               # Vite bundler & Tailwind CSS plugin configuration
├── vercel.json                  # Vercel deployment SPA rewrite routing
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root state orchestration & tab layout
│   ├── index.css                # Tailwind CSS v4 directives & theme styles
│   ├── types/
│   │   └── index.ts             # Strict TypeScript definitions & data models
│   ├── algorithms/
│   │   ├── stack.ts             # Generic LIFO Stack with telemetry tracking
│   │   ├── tokenizer.ts         # Lexical scanner for identifiers, floats & parens
│   │   ├── validator.ts         # Character-exact syntax validator
│   │   ├── whyEngine.ts         # Deterministic educational reasoning engine
│   │   └── converter.ts         # 5-phase Infix-to-Prefix state generator
│   ├── components/
│   │   ├── Navbar.tsx           # Brand header, navigation tabs & theme toggle
│   │   ├── StackVisualizer.tsx  # Animated Framer Motion stack beaker
│   │   ├── PipelineViewer.tsx   # 6-phase transformation pipeline display
│   │   ├── TokenRibbon.tsx      # Token stream viewer with active pulse
│   │   ├── OperationPanel.tsx   # "Why Did This Happen?" educational reason engine
│   │   ├── PlaybackControls.tsx # Scrub slider, speed buttons, and step transport
│   │   ├── StepTable.tsx        # Trace matrix table with CSV download
│   │   ├── ResultCard.tsx       # Infix, Prefix, Postfix display & JSON export
│   │   ├── WhatIfView.tsx       # Side-by-side operator comparison lab
│   │   ├── PracticeView.tsx     # Interactive predict-the-prefix challenge arena
│   │   ├── QuizView.tsx         # 10-question DSA proficiency quiz
│   │   ├── HistoryDrawer.tsx    # Slide-over recent conversions drawer
│   │   ├── LearnView.tsx        # Theory, pseudocode, and complexity analysis
│   │   └── AboutView.tsx        # Technical overview and author credits
│   ├── data/
│   │   └── constants.ts         # Example expressions, quizzes, and challenges
│   └── tests/
│       ├── converter.test.ts    # 15 tests covering stack invariants & conversions
│       └── validator_tokenizer.test.ts # 16 tests covering tokenization & edge cases
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
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
Executes all 31 Vitest unit tests.

### Production Build
```bash
npm run build
```
Compiles TypeScript and creates optimized assets in `dist/`.

---

## 🌐 Deployment to Vercel

This project is pre-configured for 1-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Go to **Vercel** $\to$ **Add New Project**.
3. Select `infix-to-prefix-converter`.
4. The build settings are auto-detected via `vercel.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

---

## 👨‍💻 Author

**Shreyas Khakal**
- GitHub: [@shreyaskhakal](https://github.com/shreyaskhakal)
- Repository: [infix-to-prefix-converter](https://github.com/shreyaskhakal/infix-to-prefix-converter)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
