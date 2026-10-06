# Interactive Infix-to-Prefix DSA Lab
### *Stack-Based Expression Conversion with Step-by-Step Visualization*

[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue.svg)](https://www.python.org/)
[![GUI](https://img.shields.io/badge/GUI-Tkinter%20%2F%20ttk-orange.svg)]()
[![Tests](https://img.shields.io/badge/tests-23%20passed-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()
[![Dependencies](https://img.shields.io/badge/dependencies-0%20external-brightgreen.svg)]()

> **Primary USP (Unique Selling Proposition):**  
> *"Unlike conventional converters that only return an answer, this project visualizes every stack operation and explains **why** the operation occurs."*

---

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Motivation](#motivation)
4. [Objectives](#objectives)
5. [Primary Differentiators](#primary-differentiators)
6. [Core Data Structure: Stack (LIFO)](#core-data-structure-stack-lifo)
7. [Algorithm Pipeline](#algorithm-pipeline)
8. [Operator Precedence & Associativity](#operator-precedence--associativity)
9. [The "Why Did This Happen?" Engine](#the-why-did-this-happen-engine)
10. [Application Architecture](#application-architecture)
11. [Project Structure](#project-structure)
12. [Installation & How to Run](#installation--how-to-run)
13. [Step-by-Step Worked Examples](#step-by-step-worked-examples)
14. [Features & Modes](#features--modes)
    - [Home Dashboard](#home-dashboard)
    - [Interactive Converter & Time Machine](#interactive-converter--time-machine)
    - [What-If? Expression Comparison Mode](#what-if-expression-comparison-mode)
    - [Challenge Mode (Quiz & Score Tracking)](#challenge-mode)
    - [Viva Mode (Exam Catalog & Flashcards)](#viva-mode)
    - [Teacher Presentation Mode](#teacher-presentation-mode)
    - [Standalone CLI Presentation Program](#standalone-cli-presentation-program)
15. [Automated Testing](#automated-testing)
16. [Complexity Analysis](#complexity-analysis)
17. [Screenshots & Visual Design](#screenshots--visual-design)
18. [Future Scope](#future-scope)
19. [Educational Value](#educational-value)

---

## 1. Project Overview

The **Interactive Infix-to-Prefix DSA Lab** is an offline, desktop educational laboratory designed for computer science students, teachers, and software engineers. Built completely from scratch using pure Python and Tkinter, it illuminates the inner mathematical and algorithmic mechanics of converting standard arithmetic **infix expressions** into **prefix notation** (Polish notation) using a custom **Stack** data structure.

The tool bridges the gap between theoretical Data Structures & Algorithms lectures and practical compiler design by demystifying how operator precedence, associativity rules, and parenthetical isolation determine execution order.

---

## 2. Problem Statement

Arithmetic expressions in human languages are commonly written in **infix notation** (e.g., `(A + B) * C`), where operators sit between operands. While intuitive to read, infix expressions are inherently ambiguous for computational evaluation because they depend on operator hierarchy, associativity, and explicit parentheses.

Compilers and runtime interpreters parse infix expressions into parenthesis-free representations—such as **Prefix** (Polish) notation (`* + A B C`) or **Postfix** (Reverse Polish) notation (`A B + C *`).

Most existing online converters function as black boxes: the student inputs an expression and receives the converted string instantaneously. This leaves students confused about:
- *When* an operator is pushed onto the stack.
- *Why* a stack top is popped when another operator arrives.
- *How* right-associativity (e.g., `^`) behaves under expression reversal.
- *Why* parentheses are swapped and how they act as boundaries.

---

## 3. Motivation

In college examinations, viva voce evaluations, and technical interviews, students are regularly required to trace stack states step-by-step on paper. Without an interactive step-by-step tool that explains the rationale behind each step, students often memorize rules mechanically without intuition.

This project was built to transform expression conversion into an interactive laboratory where students can move backward and forward in time, experiment with "What-If" scenarios, quiz their understanding, and master viva questions.

---

## 4. Objectives

1. **Implement a Strict Custom Stack ADT**: Build an encapsulated Stack class enforcing pure LIFO semantics (`push`, `pop`, `peek`, `is_empty`, `size`, `clear`, `display`).
2. **Mathematically Rigorous Conversion**: Implement the standard multi-stage Infix-to-Prefix algorithm supporting single-character operands, multi-character identifiers (`total_price`), integer literals, whitespace, and six arithmetic operators (`+`, `-`, `*`, `/`, `%`, `^`).
3. **Dynamic Pedagogical Explanations**: Provide human-readable, context-aware explanations of why every push, pop, discard, and output action occurs.
4. **Time-Travel Replay ("Algorithm Time Machine")**: Empower students to scrub forward and backward through steps with exact stack state reconstruction.
5. **Interactive Classroom Modes**: Include a Teacher Presentation Mode, What-If Comparison Mode, Challenge Mode with scoring, and Viva Examination Flashcards.
6. **Zero Dependencies**: Rely solely on the Python 3.11+ standard library for effortless execution on any machine.

---

## 5. Primary Differentiators

| Feature | Conventional Converters | Interactive DSA Lab (This Project) |
| :--- | :--- | :--- |
| **Output Type** | Final string answer only | Full step trace, visual stack, and intermediate postfix |
| **Reasoning** | None | Real-time **"Why Did This Happen?"** pedagogical engine |
| **Stack Visualization** | None or static text | Graphical LIFO beaker container with top pointer and animation states |
| **Replay & Scrubbing** | None | Full bidirectional step timeline with slider scrubber |
| **Associativity Handling** | Often fails on right-assoc (`^`) | Strictly correct handling of `A^B^C` -> `^A^BC` |
| **Expression Comparison** | One expression at a time | Side-by-side **What-If?** mode with automated difference analysis |
| **Classroom Presentation** | Low contrast, tiny text | High-visibility **Presentation Mode** for projectors and lecture halls |
| **Evaluation Prep** | None | Interactive **Challenge Quiz** and **15-Question Viva Flashcards** |
| **Standalone Code** | Monolithic or complex web setup | Self-contained single-file CLI (`presentation_code.py`) included |

---

## 6. Core Data Structure: Stack (LIFO)

The application models its internal state using a custom `Stack` class defined in [`stack.py`](file:///c:/Users/user5/Downloads/DS%20project/stack.py):

```python
class Stack:
    """
    A custom, robust Stack data structure adhering to the LIFO principle.
    All operations operate in O(1) time.
    """
    def __init__(self) -> None:
        self._items: List[Any] = []

    def push(self, item: Any) -> None: ...
    def pop(self) -> Any: ...
    def peek(self) -> Any: ...
    def is_empty(self) -> bool: ...
    def size(self) -> int: ...
    def clear(self) -> None: ...
    def display(self) -> str: ...
    def to_list(self) -> List[Any]: ...
```

### Why LIFO (Last In, First Out) is Essential
When converting an expression, operators cannot be output immediately upon discovery because subsequent operators might hold higher precedence. The stack functions as a deferral buffer. The most recently deferred operator—representing the innermost or highest-priority sub-expression—is positioned at the top and popped first when its right-hand operand is ready.

---

## 7. Algorithm Pipeline

The application implements the standard textbook 5-stage pipeline:

```
┌────────────────────────┐
│    INFIX EXPRESSION    │  e.g. (A + B) * C
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  STEP 1: REVERSE INFIX │  Tokens reversed: C * ) B + A (
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ STEP 2: SWAP BRACKETS  │  '(' <-> ')': C * ( B + A )
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ STEP 3: POSTFIX ENGINE │  Processed via custom Stack class
│     (STACK-BASED)      │  Yields intermediate postfix: C B A + *
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ STEP 4: REVERSE POSTFIX│  Reverses postfix buffer: * + A B C
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  FINAL PREFIX RESULT   │  *+ABC
└────────────────────────┘
```

---

## 8. Operator Precedence & Associativity

### Operator Specification Table

| Operator | Symbol | Precedence Level | Original Associativity | Behavior in Reversed Postfix |
| :---: | :---: | :---: | :---: | :--- |
| **Exponentiation** | `^` | **3 (Highest)** | **Right-to-Left** | Equal precedence **POPS** stack top |
| **Multiplication** | `*` | **2** | Left-to-Right | Pop only if stack top precedence > 2 |
| **Division** | `/` | **2** | Left-to-Right | Pop only if stack top precedence > 2 |
| **Modulo** | `%` | **2** | Left-to-Right | Pop only if stack top precedence > 2 |
| **Addition** | `+` | **1 (Lowest)** | Left-to-Right | Pop only if stack top precedence > 1 |
| **Subtraction** | `-` | **1 (Lowest)** | Left-to-Right | Pop only if stack top precedence > 1 |
| **Parentheses** | `(`, `)` | **0** | Grouping Barrier | Pushes `(`; pops until `(` upon reading `)` |

### The Mathematical Rule on Reversed Associativity
In a standard Infix-to-Postfix conversion, left-associative operators pop equal-precedence stack tops (`<=`), while right-associative operators do not pop equal precedence (`<`).

**When the Infix expression is REVERSED:**
- The order of incoming operators is mirrored.
- To preserve original **Left-to-Right** evaluation (e.g., `A - B - C` evaluating as `(A - B) - C`), equal-precedence left-associative operators must **NOT** be popped from the stack! Pushing them retains the top operator for later evaluation.
- Conversely, for **Right-Associative** operators like `^` (e.g., `A ^ B ^ C` evaluating as `A ^ (B ^ C)`), the rightmost operator arrives first in the reversed string. Thus, equal precedence **MUST POP** the stack top!

This guarantees that:
- `A - B - C` yields `- - A B C`
- `A ^ B ^ C` yields `^ A ^ B C`

---

## 9. The "Why Did This Happen?" Engine

Located in [`explanations.py`](file:///c:/Users/user5/Downloads/DS%20project/explanations.py), this subsystem inspects the current token, stack top precedence, and incoming operator associativity to generate precise explanations:

1. **Operands**:
   > *"'C' is an operand. In prefix/postfix notations, operands maintain their relative sequential order, so 'C' is directly appended to the output buffer."*
2. **Opening Parenthesis `(`**:
   > *"'(' is encountered. It marks the boundary of a grouped sub-expression. It is pushed onto the stack to act as a barrier so lower-precedence operators outside the group are not prematurely evaluated."*
3. **Closing Parenthesis `)`**:
   > *"')' encountered. All operators currently on the stack within this group are popped and added to output until the matching '(' is reached. Both parentheses are then discarded."*
4. **Higher Precedence on Stack**:
   > *"Stack top '*' has precedence 2, which is HIGHER than incoming '+' (precedence 1). The higher-precedence operation '*' must evaluate first, so '*' is popped to the output."*
5. **Right-Associativity Rule**:
   > *"Incoming '^' and stack top '^' are both exponentiation ('^') with equal precedence (3). Because '^' is RIGHT-ASSOCIATIVE and the expression was reversed, the rightmost operator must be evaluated first, requiring the stack top '^' to be popped now."*
6. **End of Expression**:
   > *"The end of the reversed expression has been reached. Remaining operator '*' is popped from the stack and appended to the output buffer in LIFO order."*

---

## 10. Application Architecture

The system decouples **Algorithm Event Generation** from **UI Presentation**:

```
 ┌──────────────────────┐         ┌───────────────────────────┐
 │   User Expression    │ ──────> │    ExpressionValidator    │
 └──────────────────────┘         └─────────────┬─────────────┘
                                                │ (if valid)
                                                ▼
                                  ┌───────────────────────────┐
                                  │  InfixToPrefixConverter   │
                                  │   (Stack ADT + Events)    │
                                  └─────────────┬─────────────┘
                                                │ produces
                                                ▼
                                  ┌───────────────────────────┐
                                  │     ConversionResult      │
                                  │ - Immutable AlgorithmStep │
                                  │ - Stack Activity Stats    │
                                  │ - Intermediate Postfix    │
                                  │ - Final Prefix String     │
                                  └─────────────┬─────────────┘
                                                │ consumed by
                    ┌───────────────────────────┴───────────────────────────┐
                    ▼                                                       ▼
      ┌───────────────────────────┐                           ┌───────────────────────────┐
      │     Desktop GUI App       │                           │ Standalone CLI Program    │
      │   (main.py / visualizer)  │                           │   (presentation_code.py)  │
      └───────────────────────────┘                           └───────────────────────────┘
```

Each step is recorded as an immutable `AlgorithmStep` snapshot containing:
- `step_number`
- `stage`
- `token`
- `action`
- `stack_state` (copied list)
- `output_state` (copied list)
- `reason` (educational explanation)
- `operation_type` (`PUSH`, `POP`, `OUTPUT`, `MATCH`, etc.)

This event log enables the **Algorithm Time Machine** to jump forward and backward without faking data or altering original state.

---

## 11. Project Structure

```
infix-to-prefix-converter/
│
├── main.py                     # Primary Desktop GUI Application (Tkinter / TTK)
├── presentation_code.py        # Standalone presentation & CLI tool (Zero dependencies)
├── stack.py                    # Custom Stack ADT (Strict LIFO implementation)
├── converter.py                # Core conversion engine & algorithm instrumentation
├── validator.py                # Syntax validator with educational diagnostic messages
├── models.py                   # Data models (Token, AlgorithmStep, ConversionResult)
├── explanations.py             # "Why Did This Happen?" Pedagogical Reasoning Engine
├── visualizer.py               # Custom Tkinter visual widgets (StackCanvas, Pipeline)
├── challenge.py                # Interactive quiz engine & score tracker
├── viva.py                     # College viva question bank & random flashcards
│
├── requirements.txt            # Dependency documentation (Zero external packages)
├── .gitignore                  # Git exclusions for Python artifacts
├── README.md                   # Complete architectural and educational guide
│
└── tests/
    ├── test_converter.py       # Unit tests for Stack, Validator, and Converter
    └── test_ui.py              # GUI integration tests for navigation and time machine
```

---

## 12. Installation & How to Run

### Prerequisites
- Python 3.11, 3.12, or 3.13
- Tkinter (standard in official Windows and macOS Python installers)

### Step 1: Clone or Navigate to the Repository
```bash
git clone https://github.com/shreyaskhakal/infix-to-prefix-converter.git
cd infix-to-prefix-converter
```

### Step 2: Run the Main Desktop GUI
```bash
python main.py
```

### Step 3: Run the Standalone CLI Presentation Tool
```bash
# Interactive menu:
python presentation_code.py

# Or with a direct expression:
python presentation_code.py "(A+B)*C"
```

### Step 4: Run the Complete Automated Test Suite
```bash
python -m unittest discover tests
```

---

## 13. Step-by-Step Worked Examples

### Example 1: `(A + B) * C`
1. **Reverse Infix**: `C * ) B + A (`
2. **Swap Parentheses**: `C * ( B + A )`
3. **Postfix Conversion via Stack**:
   - Token `C` -> Operand -> Output: `C`
   - Token `*` -> Operator -> Stack: `[*]`
   - Token `(` -> Open Paren -> Stack: `[*, (]`
   - Token `B` -> Operand -> Output: `C B`
   - Token `+` -> Operator -> Stack: `[*, (, +]`
   - Token `A` -> Operand -> Output: `C B A`
   - Token `)` -> Close Paren -> Pop until `(` -> Pop `+` -> Output: `C B A +`, Discard `(` -> Stack: `[*]`
   - End of input -> Pop remaining -> Pop `*` -> Output: `C B A + *`
4. **Intermediate Postfix**: `CBA+*`
5. **Reverse Postfix**: `*+ABC`
6. **Final Prefix**: `*+ABC`

---

### Example 2: `A + B * C`
1. **Reverse Infix**: `C * B + A`
2. **Postfix Conversion via Stack**:
   - Token `C` -> Output: `C`
   - Token `*` -> Stack: `[*]`
   - Token `B` -> Output: `C B`
   - Token `+` -> Top `*` has higher precedence (2 > 1) -> Pop `*` -> Output: `C B *` -> Push `+` -> Stack: `[+]`
   - Token `A` -> Output: `C B * A`
   - End -> Pop `+` -> Output: `C B * A +`
3. **Intermediate Postfix**: `CB*A+`
4. **Reverse Postfix**: `+A*BC`
5. **Final Prefix**: `+A*BC`

---

### Example 3: `A ^ B ^ C` (Right-Associativity)
1. **Reverse Infix**: `C ^ B ^ A`
2. **Postfix Conversion via Stack**:
   - Token `C` -> Output: `C`
   - Token `^` -> Stack: `[^]`
   - Token `B` -> Output: `C B`
   - Token `^` -> Top `^` is right-associative (equal precedence in reversed string triggers pop) -> Pop `^` -> Output: `C B ^` -> Push `^` -> Stack: `[^]`
   - Token `A` -> Output: `C B ^ A`
   - End -> Pop `^` -> Output: `C B ^ A ^`
3. **Reverse Postfix**: `^A^BC`
4. **Final Prefix**: `^A^BC` *(Equivalent to `A ^ (B ^ C)`)*

---

## 14. Features & Modes

### Home Dashboard
- High-level overview of the DSA Laboratory.
- Summary cards linking to Stack Visualization, Algorithm Trace, and Learn/Viva tools.
- Educational badges showcasing Time Complexity $O(n)$ and Space Complexity $O(n)$.

### Interactive Converter & Time Machine
- **Live Visual Stack**: Watch element blocks pushed into a beaker with dynamic `TOP ↓` indicators and empty notices.
- **Why Panel**: Rich explanation of the mathematical and algorithmic rationale at every step.
- **Time Controls**: `|<< First`, `< Prev`, `▶ Play`, `❚❚ Pause`, `Next >`, `>>| Last`, and a scrub slider.
- **Detailed Step Table**: Click any row in the table to instantly jump the visualization to that historical state.
- **Stack Activity Heatmap**: Inspect total pushes, pops, and peeks recorded for every operator.

### What-If? Expression Comparison Mode
- Compare two expressions side-by-side (e.g., `A+B*C` vs `(A+B)*C`).
- Immediate side-by-side cards showing Intermediate Postfix, Final Prefix, and Step Counts.
- Automated pedagogical analysis highlighting how parentheses reorder the syntax evaluation tree.

### Challenge Mode
- 10 comprehensive DSA multiple-choice questions testing operator precedence, stack prediction, and syntax validation.
- Live score tracker: `Questions: X / 10 | Correct: Y | Score: Z%`.
- Immediate feedback with color-coded answers and comprehensive explanations.

### Viva Mode
- **15 College Viva Questions** covering definition, LIFO, precedence, associativity, time complexity, and parenthetical swapping.
- **Viva Quick Mode (Flashcards)**: Randomizes questions with `[SHOW ANSWER]` and `[ANOTHER QUESTION]`.

### Teacher Presentation Mode
- Activated via the `📽 PRESENTATION MODE` button.
- Clean, high-contrast, large-font layout optimized for overhead projectors and lecture halls.
- One-click presets for simple demo `(A+B)*C` and teacher complex demo `A+B*(C^D-E)^(F+G*H)-I`.

### Standalone CLI Presentation Program
- Contained entirely in [`presentation_code.py`](file:///c:/Users/user5/Downloads/DS%20project/presentation_code.py).
- Interactive terminal menu with ASCII-art stack diagram and step table.

---

## 15. Automated Testing

The project includes 23 automated tests covering:
- Stack operations (push, pop, peek, LIFO order, underflow detection)
- Validation edge cases (empty strings, illegal symbols, consecutive operators, mismatched parentheses)
- Core conversions (`A+B`, `A+B*C`, `(A+B)*C`, `(A-B)/(C+D)`, `A^B^C`, complex expressions)
- Identifiers (`total + price * 2`) and spacing
- Full GUI lifecycle and time-machine integration

Run all tests:
```bash
python -m unittest discover tests -v
```

Expected output:
```
Ran 23 tests in 2.109s
OK
```

---

## 16. Complexity Analysis

### Time Complexity: $O(n)$
1. **Tokenization & Reverse Infix**: Scans $n$ characters and reverses the token list in $O(n)$ time.
2. **Parenthesis Swapping**: Single pass over tokens replacing `(` and `)` in $O(n)$ time.
3. **Postfix Conversion**: Every token is processed once. Each operator is pushed onto the stack at most once and popped at most once. All stack operations (`push`, `pop`, `peek`) run in $O(1)$ amortized time. Hence, the stack pass is strictly $O(n)$.
4. **Final Output Reversal**: Inverts the postfix token list in $O(n)$ time.
$$\text{Total Time} = O(n) + O(n) + O(n) + O(n) = O(n) \quad \text{(Linear Time)}$$

### Space Complexity: $O(n)$
1. **Custom Stack**: In the worst case (e.g., strictly increasing precedence or deeply nested parentheses), the stack holds up to $n$ operators.
2. **Buffers**: Token lists and output buffers store up to $n$ tokens.
$$\text{Auxiliary Space} = O(n) \quad \text{(Linear Space)}$$

---

## 17. Screenshots & Visual Design

The UI utilizes a curated academic dark theme inspired by the modern **Catppuccin Mocha** palette:
- **Background**: `#181825` (Deep Slate)
- **Cards & Panes**: `#1e1e2e` and `#252538`
- **Primary Highlights**: `#74c7ec` (Cyan) and `#89b4fa` (Blue)
- **Success / Final Prefix**: `#a6e3a1` (Emerald Green)
- **Operations / Tokens**: `#fab387` (Amber) and `#f9e2af` (Yellow)
- **Errors / Pops**: `#f38ba8` (Coral Red)

```
+-----------------------------------------------------------------------------------------+
|  [DSA LAB] INFIX TO PREFIX CONVERTER    [HOME] [CONVERTER] [WHAT-IF] ... [PRESENTATION] |
+-----------------------------------------------------------------------------------------+
|  Infix: [(A+B)*C               ]  [CONVERT] [RESET] [Demo: (A+B)*C] [Demo: Teacher Expr]|
+-----------------------------------------------------------------------------------------+
|  PIPELINE: [INFIX] -> [REVERSE] -> [SWAP] -> [POSTFIX (STACK)] -> [REV_POST] -> [PREFIX]|
+-----------------------------------------------------------------------------------------+
|  LIFO STACK VISUALIZER  |  CURRENT OPERATION & ALGORITHM STATE                          |
|  +-------------------+  |  [TOKEN: +] [ACTION: PUSH '+'] [OUTPUT: C B]                  |
|  | TOP -> |    +    | | |  +---------------------------------------------------------+  |
|  |        +---------+ | |  | WHY DID THIS HAPPEN?                                    |  |
|  |        |    (    | | |  | Stack top has lower precedence. '+' is pushed to await  |  |
|  |        +---------+ | |  | higher-precedence resolution.                           |  |
|  |        |    *    | | |  +---------------------------------------------------------+  |
|  |        +---------+ | |  [|<<] [< Prev] [▶ Play] [Next >] [>>|] Step 5 / 9 [====o====]|
|  | STACK BASE         | |  RESULT: INFIX: (A+B)*C | POSTFIX: CBA+* | PREFIX: *+ABC      |
|  +-------------------+  +---------------------------------------------------------------+
|  OPERATOR REFERENCE     |  STEP-BY-STEP TABLE                                           |
|  ^    3  Right          |  Step | Stage   | Token | Action   | Stack     | Output           |
|  * /  2  Left           |  5    | Postfix | +     | PUSH '+' | [*, (, +] | CB               |
+-----------------------------------------------------------------------------------------+
```

---

## 18. Future Scope

While the current laboratory strictly models stack-based expression conversion, future extensions could include:
1. **Binary Expression Tree Visualization**: Interactively constructing and rendering the parse tree from prefix/postfix notations.
2. **Expression Evaluator**: Providing numeric inputs for identifiers and evaluating the prefix expression using a second evaluation stack.
3. **Syntax Tree Export**: Exporting generated conversion logs and parse trees to LaTeX, Graphviz DOT, or SVG.
4. **Additional Operators**: Incorporating bitwise operators (`&`, `|`, `^`, `<<`, `>>`) and ternary conditional operators (`?:`).
5. **Cross-Platform Web Version**: Compiling the pure Python algorithm to WebAssembly (Pyodide) or building an equivalent React/Vite interface.

---

## 19. Educational Value

This project was built to serve as an exemplar college laboratory submission:
- **Demonstrable**: The teacher can open `main.py` or `presentation_code.py` and run one-click demos.
- **Examinable**: Students can defend every aspect of the project in a viva examination using the built-in Viva Mode.
- **Robust**: Never crashes on invalid expressions; instead, it educates the user with precise syntactic feedback.
- **Clean Architecture**: Follows software engineering best practices with strict modularity, data encapsulation, and comprehensive automated test coverage.
