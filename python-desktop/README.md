# Infix to Prefix Converter — Python Desktop Companion

A native, zero-dependency Python desktop GUI implementation of the Interactive Infix-to-Prefix DSA Lab. Built with standard library `tkinter` and `ttk`.

---

## 🌟 Overview

The `python-desktop/` module serves as a standalone companion desktop application for local execution, classroom demonstrations, and offline presentations without requiring Node.js or a web browser.

### Key Features:
- **Zero External Dependencies:** Built 100% on Python standard libraries (`tkinter`, `ttk`, `re`, `unittest`).
- **LIFO Stack Instrumentation:** Real-time stack beaker animations and operation telemetry.
- **5-Stage Conversion Pipeline:** Exact parity with the web application's token reversal, parenthesis swapping, stack postfix conversion, and prefix reversal.
- **Interactive Practice & Viva Modes:** Built-in oral exam question bank (`viva.py`) and algorithmic challenge prediction (`challenge.py`).
- **Complete Test Suite:** 29 automated tests verifying stack invariants, conversion rules, and GUI workflows.

---

## 🚀 Running the Application

### Prerequisites:
- Python 3.11+ (Python 3.11, 3.12, 3.13 tested)
- Tkinter (pre-bundled with standard Python on Windows and macOS; on Linux Ubuntu/Debian: `sudo apt-get install python3-tk`)

### Launch Desktop GUI:
```bash
cd python-desktop
python main.py
```

Or from repository root:
```bash
python python-desktop/main.py
```

---

## 🧪 Running Unit Tests

Execute all 29 automated test cases:

```bash
# From repository root:
python -m unittest discover -s python-desktop/tests

# Or from python-desktop directory:
cd python-desktop
python -m unittest discover -s tests
```

---

## 📂 Architecture

- `main.py`: Tkinter application entrypoint and tabbed GUI interface.
- `converter.py`: 5-phase infix-to-prefix conversion engine with step-by-step instrumentation.
- `stack.py`: Custom LIFO stack data structure with telemetry (push/pop count, peak depth).
- `validator.py`: Expression syntax validator with error diagnostics.
- `models.py`: Data models (`Token`, `AlgorithmStep`, `ConversionResult`).
- `visualizer.py`: Canvas-based animated stack beaker and step rendering.
- `explanations.py`: Context-aware step explanation generator.
- `viva.py`: DSA oral examination question-and-answer module.
- `challenge.py`: Expression prediction and challenge arena.
- `tests/`: Automated unit tests covering conversion rules, edge cases, and GUI integration.
