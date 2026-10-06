"""
Main Application for Interactive Infix-to-Prefix DSA Lab.

A modern, presentation-ready desktop GUI built with Tkinter.
Implements:
  - Step-by-Step Stack Visualization
  - "Why Did This Happen?" Pedagogical Reasoning Engine
  - Algorithm Time Machine (Replay, Scrub, Step, Play/Pause)
  - What-If Expression Comparison Mode
  - Interactive Challenge Mode with Score Tracking
  - Viva Examination Prep and Quick Flashcards
  - High-visibility Presentation Mode for Teachers & Classrooms
"""

import sys
import tkinter as tk
from tkinter import ttk, messagebox
from typing import Optional, List, Dict, Any

from stack import Stack
from models import (
    AlgorithmStep,
    ConversionResult,
    OPERATOR_PRECEDENCE,
    OPERATOR_ASSOCIATIVITY,
)
from validator import ExpressionValidator
from converter import InfixToPrefixConverter
from challenge import ChallengeEngine
from viva import VivaBank, VivaQuestion
from visualizer import (
    StackCanvas,
    PipelineWidget,
    StackActivityView,
    BG_DARK,
    BG_CARD,
    BG_CONTAINER,
    ACCENT_BLUE,
    ACCENT_CYAN,
    ACCENT_GREEN,
    ACCENT_ORANGE,
    ACCENT_YELLOW,
    ACCENT_RED,
    TEXT_PRIMARY,
    TEXT_MUTED,
    BORDER_COLOR,
)


class InfixToPrefixApp(tk.Tk):
    """
    Main Application Window managing themes, screens, and global controllers.
    """

    def __init__(self):
        super().__init__()
        self.title("Interactive Infix-to-Prefix DSA Lab")
        self.geometry("1180x780")
        self.minsize(980, 680)
        self.configure(bg=BG_DARK)

        # State Variables
        self.current_screen_name: str = "home"
        self.is_presentation_mode: bool = False
        self.conversion_result: Optional[ConversionResult] = None
        self.current_step_index: int = 0
        self.is_playing: bool = False
        self.play_speed_ms: int = 1200
        self.play_after_id: Optional[str] = None

        # Challenge & Viva Engines
        self.challenge_engine = ChallengeEngine()
        self.viva_bank = VivaBank()
        self.current_flashcard: Optional[VivaQuestion] = None

        # Configure TTK Styles for modern dark appearance
        self._configure_styles()

        # Build UI Structure
        self._build_top_navbar()
        self.container = tk.Frame(self, bg=BG_DARK)
        self.container.pack(fill="both", expand=True)

        # Dictionary of Screens
        self.screens: Dict[str, tk.Frame] = {}
        self._create_all_screens()

        # Show Home screen initially
        self.show_screen("home")

    def _configure_styles(self) -> None:
        style = ttk.Style(self)
        style.theme_use("clam")

        # Treeview Dark Theme
        style.configure(
            "Treeview",
            background=BG_CONTAINER,
            foreground=TEXT_PRIMARY,
            fieldbackground=BG_CONTAINER,
            rowheight=24,
            font=("Segoe UI", 9)
        )
        style.configure(
            "Treeview.Heading",
            background="#2b2b3d",
            foreground=ACCENT_CYAN,
            font=("Segoe UI", 9, "bold")
        )
        style.map(
            "Treeview",
            background=[("selected", ACCENT_BLUE)],
            foreground=[("selected", "#11111b")]
        )

        # Modern Horizontal Scale / Slider
        style.configure(
            "Horizontal.TScale",
            troughcolor=BG_CONTAINER,
            background=ACCENT_CYAN
        )

        # Notebook tabs
        style.configure(
            "TNotebook",
            background=BG_DARK,
            tabmargins=[2, 5, 2, 0]
        )
        style.configure(
            "TNotebook.Tab",
            background=BG_CARD,
            foreground=TEXT_PRIMARY,
            padding=[12, 4],
            font=("Segoe UI", 9, "bold")
        )
        style.map(
            "TNotebook.Tab",
            background=[("selected", BG_CONTAINER)],
            foreground=[("selected", ACCENT_CYAN)]
        )

    def _build_top_navbar(self) -> None:
        nav = tk.Frame(self, bg="#11111b", height=52)
        nav.pack(side="top", fill="x")

        # App Brand & Title
        brand_frame = tk.Frame(nav, bg="#11111b")
        brand_frame.pack(side="left", padx=16, pady=8)

        lbl_logo = tk.Label(
            brand_frame,
            text="DSA LAB",
            font=("Consolas", 11, "bold"),
            bg=ACCENT_CYAN,
            fg="#11111b",
            padx=6,
            pady=2
        )
        lbl_logo.pack(side="left", padx=(0, 10))

        title_box = tk.Frame(brand_frame, bg="#11111b")
        title_box.pack(side="left")

        lbl_title = tk.Label(
            title_box,
            text="INFIX TO PREFIX CONVERTER",
            font=("Segoe UI", 11, "bold"),
            bg="#11111b",
            fg=TEXT_PRIMARY
        )
        lbl_title.pack(anchor="w")

        lbl_sub = tk.Label(
            title_box,
            text="Stack-Based Expression Engine with Visual LIFO",
            font=("Segoe UI", 8),
            bg="#11111b",
            fg=TEXT_MUTED
        )
        lbl_sub.pack(anchor="w")

        # Presentation Mode Button on Right
        self.btn_pres = tk.Button(
            nav,
            text="📽 PRESENTATION MODE",
            font=("Segoe UI", 9, "bold"),
            bg=ACCENT_YELLOW,
            fg="#11111b",
            activebackground="#ffe8a3",
            relief="flat",
            padx=10,
            pady=4,
            cursor="hand2",
            command=self.toggle_presentation_mode
        )
        self.btn_pres.pack(side="right", padx=16, pady=10)

        # Navigation Buttons Frame
        btn_box = tk.Frame(nav, bg="#11111b")
        btn_box.pack(side="right", padx=10)

        nav_items = [
            ("HOME", "home"),
            ("CONVERTER", "converter"),
            ("WHAT-IF?", "whatif"),
            ("CHALLENGE", "challenge"),
            ("VIVA PREP", "viva"),
            ("ABOUT", "about"),
        ]

        self.nav_buttons: Dict[str, tk.Button] = {}
        for label, screen_id in nav_items:
            b = tk.Button(
                btn_box,
                text=label,
                font=("Segoe UI", 9, "bold"),
                bg="#11111b",
                fg=TEXT_PRIMARY,
                activebackground=BG_CONTAINER,
                activeforeground=ACCENT_CYAN,
                relief="flat",
                padx=10,
                pady=6,
                cursor="hand2",
                command=lambda s=screen_id: self.show_screen(s)
            )
            b.pack(side="left", padx=2)
            self.nav_buttons[screen_id] = b

    def _create_all_screens(self) -> None:
        self.screens["home"] = self._create_home_screen()
        self.screens["converter"] = self._create_converter_screen()
        self.screens["whatif"] = self._create_whatif_screen()
        self.screens["challenge"] = self._create_challenge_screen()
        self.screens["viva"] = self._create_viva_screen()
        self.screens["about"] = self._create_about_screen()
        self.screens["presentation"] = self._create_presentation_screen()

        for f in self.screens.values():
            f.place(x=0, y=0, relwidth=1, relheight=1)

    def show_screen(self, screen_name: str) -> None:
        """Switch visible screen and update navbar active state."""
        self.current_screen_name = screen_name
        frame = self.screens[screen_name]
        frame.tkraise()

        # Update navbar buttons style
        for s_id, b in self.nav_buttons.items():
            if s_id == screen_name:
                b.configure(fg=ACCENT_CYAN, bg=BG_CARD)
            else:
                b.configure(fg=TEXT_PRIMARY, bg="#11111b")

        # Specific screen refresh hooks
        if screen_name == "challenge":
            self._refresh_challenge_ui()
        elif screen_name == "viva":
            self._load_next_flashcard()
        elif screen_name == "presentation":
            self._sync_presentation_view()

    def toggle_presentation_mode(self) -> None:
        """Toggle between standard workbench and teacher presentation mode."""
        self.is_presentation_mode = not self.is_presentation_mode
        if self.is_presentation_mode:
            self.btn_pres.configure(text="✕ EXIT PRESENTATION", bg=ACCENT_RED)
            self.show_screen("presentation")
        else:
            self.btn_pres.configure(text="📽 PRESENTATION MODE", bg=ACCENT_YELLOW)
            self.show_screen("converter")

    # =========================================================================
    # SCREEN 1: HOME DASHBOARD
    # =========================================================================
    def _create_home_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        # Header Hero
        hero = tk.Frame(scr, bg=BG_DARK)
        hero.pack(pady=(35, 20))

        tk.Label(
            hero,
            text="INTERACTIVE INFIX TO PREFIX DSA LAB",
            font=("Segoe UI", 24, "bold"),
            bg=BG_DARK,
            fg=ACCENT_CYAN
        ).pack()

        tk.Label(
            hero,
            text='"Understand the Stack. Don\'t Just Get the Answer."',
            font=("Segoe UI", 12, "italic"),
            bg=BG_DARK,
            fg=ACCENT_YELLOW
        ).pack(pady=(4, 8))

        tk.Label(
            hero,
            text=(
                "An educational laboratory for Data Structures & Algorithms.\n"
                "Visualizes LIFO stack operations, resolves operator precedence & associativity,\n"
                "and explains the mathematical reason behind every single transformation step."
            ),
            font=("Segoe UI", 10),
            bg=BG_DARK,
            fg=TEXT_MUTED,
            justify="center"
        ).pack(pady=4)

        # 3 Main Interactive Cards
        cards_frame = tk.Frame(scr, bg=BG_DARK)
        cards_frame.pack(pady=20)

        card_defs = [
            ("STACK", "Visualize LIFO Operations",
             "Watch push, pop, and peek actions live in a custom Stack beaker.\n"
             "Strict LIFO ordering is maintained throughout conversion.",
             ACCENT_CYAN, lambda: self.show_screen("converter")),
            ("ALGORITHM", "Understand Every Step",
             "Step-by-step trace of Infix -> Reverse -> Swap -> Postfix -> Prefix.\n"
             "Our 'Why Did This Happen?' engine explains each decision.",
             ACCENT_GREEN, lambda: self.show_screen("converter")),
            ("LEARN", "Practice & Viva Exam Prep",
             "Test your understanding with 10 interactive challenge quizzes\n"
             "and review 15 in-depth college viva questions with flashcards.",
             ACCENT_ORANGE, lambda: self.show_screen("challenge")),
        ]

        for title, subtitle, desc, col, cmd in card_defs:
            card = tk.Frame(cards_frame, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1, width=280, height=190)
            card.pack(side="left", padx=14, pady=5)
            card.pack_propagate(False)

            tk.Label(card, text=title, font=("Segoe UI", 13, "bold"), bg=BG_CARD, fg=col).pack(anchor="w", padx=16, pady=(16, 2))
            tk.Label(card, text=subtitle, font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=TEXT_PRIMARY).pack(anchor="w", padx=16, pady=(0, 6))
            tk.Label(card, text=desc, font=("Segoe UI", 9), bg=BG_CARD, fg=TEXT_MUTED, justify="left", wraplength=245).pack(anchor="w", padx=16, pady=(0, 10))

            b = tk.Button(
                card, text="Explore ->", font=("Segoe UI", 8, "bold"),
                bg=BG_CONTAINER, fg=col, activebackground=col, activeforeground="#11111b",
                relief="flat", cursor="hand2", command=cmd
            )
            b.pack(anchor="e", padx=16, pady=(0, 10))

        # Complexity Badges Bar
        badge_frame = tk.Frame(scr, bg=BG_CONTAINER, highlightbackground=BORDER_COLOR, highlightthickness=1)
        badge_frame.pack(pady=15, padx=30, fill="x")

        badges = [
            ("Data Structure:", "Custom Stack (LIFO)"),
            ("Time Complexity:", "O(n) - Linear Time"),
            ("Space Complexity:", "O(n) - Linear Space"),
            ("Supported Operators:", "^, *, /, %, +, -, ( )"),
        ]
        for label, val in badges:
            item = tk.Frame(badge_frame, bg=BG_CONTAINER)
            item.pack(side="left", expand=True, pady=10)
            tk.Label(item, text=label, font=("Segoe UI", 9), bg=BG_CONTAINER, fg=TEXT_MUTED).pack(anchor="center")
            tk.Label(item, text=val, font=("Segoe UI", 10, "bold"), bg=BG_CONTAINER, fg=ACCENT_CYAN).pack(anchor="center")

        # Action Buttons
        btn_action_box = tk.Frame(scr, bg=BG_DARK)
        btn_action_box.pack(pady=(15, 0))

        tk.Button(
            btn_action_box, text="🚀 START CONVERTER LAB", font=("Segoe UI", 10, "bold"),
            bg=ACCENT_BLUE, fg="#11111b", activebackground=ACCENT_CYAN,
            relief="flat", padx=16, pady=8, cursor="hand2",
            command=lambda: self.show_screen("converter")
        ).pack(side="left", padx=8)

        tk.Button(
            btn_action_box, text="🎯 CHALLENGE QUIZ", font=("Segoe UI", 10, "bold"),
            bg=BG_CARD, fg=ACCENT_GREEN, activebackground=BG_CONTAINER,
            relief="flat", padx=16, pady=8, cursor="hand2",
            command=lambda: self.show_screen("challenge")
        ).pack(side="left", padx=8)

        tk.Button(
            btn_action_box, text="🎓 VIVA QUESTIONS", font=("Segoe UI", 10, "bold"),
            bg=BG_CARD, fg=ACCENT_YELLOW, activebackground=BG_CONTAINER,
            relief="flat", padx=16, pady=8, cursor="hand2",
            command=lambda: self.show_screen("viva")
        ).pack(side="left", padx=8)

        return scr

    # =========================================================================
    # SCREEN 2: CONVERTER LAB (THE HEART OF THE SYSTEM)
    # =========================================================================
    def _create_converter_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        # Top Control Bar: Expression Input and Buttons
        top_bar = tk.Frame(scr, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        top_bar.pack(fill="x", padx=12, pady=(8, 4))

        input_row = tk.Frame(top_bar, bg=BG_CARD)
        input_row.pack(fill="x", padx=12, pady=6)

        tk.Label(
            input_row, text="Infix Expression:", font=("Segoe UI", 10, "bold"),
            bg=BG_CARD, fg=ACCENT_CYAN
        ).pack(side="left", padx=(0, 8))

        self.entry_expr = tk.Entry(
            input_row, font=("Consolas", 12), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            insertbackground=ACCENT_CYAN, relief="flat", highlightbackground=BORDER_COLOR,
            highlightthickness=1
        )
        self.entry_expr.pack(side="left", fill="x", expand=True, padx=(0, 10), ipady=3)
        self.entry_expr.insert(0, "(A+B)*C")
        self.entry_expr.bind("<Return>", lambda e: self.run_conversion())

        tk.Button(
            input_row, text="▶ CONVERT", font=("Segoe UI", 9, "bold"),
            bg=ACCENT_BLUE, fg="#11111b", activebackground=ACCENT_CYAN,
            relief="flat", padx=14, pady=4, cursor="hand2",
            command=self.run_conversion
        ).pack(side="left", padx=4)

        tk.Button(
            input_row, text="↺ RESET", font=("Segoe UI", 9),
            bg=BG_CONTAINER, fg=TEXT_PRIMARY, activebackground="#38384f",
            relief="flat", padx=10, pady=4, cursor="hand2",
            command=self.reset_converter
        ).pack(side="left", padx=4)

        # Quick Demo Buttons
        tk.Button(
            input_row, text="Demo: (A+B)*C", font=("Segoe UI", 8),
            bg=BG_CONTAINER, fg=ACCENT_GREEN, relief="flat", padx=8, pady=4,
            cursor="hand2", command=lambda: self.load_sample("(A+B)*C")
        ).pack(side="left", padx=4)

        tk.Button(
            input_row, text="Demo: Teacher Expr", font=("Segoe UI", 8),
            bg=BG_CONTAINER, fg=ACCENT_YELLOW, relief="flat", padx=8, pady=4,
            cursor="hand2", command=lambda: self.load_sample("A+B*(C^D-E)^(F+G*H)-I")
        ).pack(side="left", padx=4)

        # Sample Expression Chips Row
        samples_row = tk.Frame(top_bar, bg=BG_CARD)
        samples_row.pack(fill="x", padx=12, pady=(0, 6))

        tk.Label(samples_row, text="Samples:", font=("Segoe UI", 8), bg=BG_CARD, fg=TEXT_MUTED).pack(side="left", padx=(0, 6))

        samples = [
            "A+B*C",
            "(A+B)*C",
            "A*(B+C)",
            "(A-B)/(C+D)",
            "A^B^C",
            "total + price * 2",
        ]
        for s in samples:
            tk.Button(
                samples_row, text=s, font=("Consolas", 8),
                bg=BG_CONTAINER, fg=TEXT_PRIMARY, relief="flat", padx=6, pady=1,
                cursor="hand2", command=lambda expr=s: self.load_sample(expr)
            ).pack(side="left", padx=3)

        # Conversion Pipeline Indicator
        self.pipeline_widget = PipelineWidget(scr, height=44)
        self.pipeline_widget.pack(fill="x", padx=12, pady=2)

        # Main Workspace Panes: Left = Visual Stack, Center/Right = Current Operation & Result
        workspace = tk.Frame(scr, bg=BG_DARK)
        workspace.pack(fill="both", expand=True, padx=12, pady=4)

        # Left Column: Stack Canvas + Operator Reference
        left_col = tk.Frame(workspace, bg=BG_DARK, width=280)
        left_col.pack(side="left", fill="y", padx=(0, 8))

        # Stack Frame
        stack_frame = tk.Frame(left_col, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        stack_frame.pack(fill="both", expand=True)

        tk.Label(
            stack_frame, text="LIFO STACK VISUALIZER", font=("Segoe UI", 9, "bold"),
            bg=BG_CARD, fg=ACCENT_CYAN
        ).pack(anchor="w", padx=10, pady=(6, 2))

        self.stack_canvas = StackCanvas(stack_frame, width=260, height=260)
        self.stack_canvas.pack(fill="both", expand=True, padx=8, pady=4)

        # Operator Reference Table
        op_ref_frame = tk.Frame(left_col, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        op_ref_frame.pack(fill="x", pady=(6, 0))

        tk.Label(
            op_ref_frame, text="OPERATOR REFERENCE", font=("Segoe UI", 8, "bold"),
            bg=BG_CARD, fg=TEXT_MUTED
        ).pack(anchor="w", padx=8, pady=(4, 2))

        ref_grid = tk.Frame(op_ref_frame, bg=BG_CARD)
        ref_grid.pack(fill="x", padx=8, pady=(0, 4))

        ref_headers = ["Operator", "Precedence", "Associativity"]
        for c, h in enumerate(ref_headers):
            tk.Label(ref_grid, text=h, font=("Segoe UI", 7, "bold"), bg=BG_CARD, fg=TEXT_PRIMARY).grid(row=0, column=c, sticky="w", padx=4)

        ref_rows = [
            ("^", "3 (Highest)", "Right-Associative"),
            ("* / %", "2", "Left-Associative"),
            ("+ -", "1 (Lowest)", "Left-Associative"),
        ]
        self.ref_labels: List[List[tk.Label]] = []
        for r, (op_t, pr_t, as_t) in enumerate(ref_rows, start=1):
            lbl_op = tk.Label(ref_grid, text=op_t, font=("Consolas", 8, "bold"), bg=BG_CARD, fg=ACCENT_YELLOW)
            lbl_pr = tk.Label(ref_grid, text=pr_t, font=("Segoe UI", 7), bg=BG_CARD, fg=TEXT_PRIMARY)
            lbl_as = tk.Label(ref_grid, text=as_t, font=("Segoe UI", 7), bg=BG_CARD, fg=TEXT_MUTED)
            lbl_op.grid(row=r, column=0, sticky="w", padx=4)
            lbl_pr.grid(row=r, column=1, sticky="w", padx=4)
            lbl_as.grid(row=r, column=2, sticky="w", padx=4)
            self.ref_labels.append([lbl_op, lbl_pr, lbl_as])

        # Center/Right Column: Current Operation + Why Engine + Time Machine + Tabs
        right_col = tk.Frame(workspace, bg=BG_DARK)
        right_col.pack(side="left", fill="both", expand=True)

        # Upper Card: Current Operation & "Why Did This Happen?"
        op_card = tk.Frame(right_col, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        op_card.pack(fill="x", pady=(0, 6))

        tk.Label(
            op_card, text="CURRENT OPERATION & ALGORITHM STATE", font=("Segoe UI", 9, "bold"),
            bg=BG_CARD, fg=ACCENT_CYAN
        ).pack(anchor="w", padx=12, pady=(6, 4))

        # Metrics Row
        metrics_row = tk.Frame(op_card, bg=BG_CARD)
        metrics_row.pack(fill="x", padx=12, pady=2)

        # Box 1: Current Token
        b1 = tk.Frame(metrics_row, bg=BG_CONTAINER, padx=10, pady=4, highlightbackground=BORDER_COLOR, highlightthickness=1)
        b1.pack(side="left", padx=(0, 6))
        tk.Label(b1, text="CURRENT TOKEN", font=("Segoe UI", 7, "bold"), bg=BG_CONTAINER, fg=TEXT_MUTED).pack(anchor="w")
        self.lbl_curr_token = tk.Label(b1, text="—", font=("Consolas", 13, "bold"), bg=BG_CONTAINER, fg=ACCENT_YELLOW)
        self.lbl_curr_token.pack(anchor="w")

        # Box 2: Action
        b2 = tk.Frame(metrics_row, bg=BG_CONTAINER, padx=10, pady=4, highlightbackground=BORDER_COLOR, highlightthickness=1)
        b2.pack(side="left", padx=6, fill="x", expand=True)
        tk.Label(b2, text="ACTION PERFORMED", font=("Segoe UI", 7, "bold"), bg=BG_CONTAINER, fg=TEXT_MUTED).pack(anchor="w")
        self.lbl_curr_action = tk.Label(b2, text="Press Convert to begin", font=("Segoe UI", 10, "bold"), bg=BG_CONTAINER, fg=ACCENT_GREEN)
        self.lbl_curr_action.pack(anchor="w")

        # Box 3: Output State
        b3 = tk.Frame(metrics_row, bg=BG_CONTAINER, padx=10, pady=4, highlightbackground=BORDER_COLOR, highlightthickness=1)
        b3.pack(side="left", padx=(6, 0), fill="x", expand=True)
        tk.Label(b3, text="OUTPUT BUFFER", font=("Segoe UI", 7, "bold"), bg=BG_CONTAINER, fg=TEXT_MUTED).pack(anchor="w")
        self.lbl_curr_output = tk.Label(b3, text="[ ]", font=("Consolas", 10, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY)
        self.lbl_curr_output.pack(anchor="w")

        # "Why Did This Happen?" Box
        why_box = tk.Frame(op_card, bg=BG_CONTAINER, highlightbackground="#3d59a1", highlightthickness=1)
        why_box.pack(fill="x", padx=12, pady=(6, 8))

        tk.Label(
            why_box, text="💡 WHY DID THIS HAPPEN?", font=("Segoe UI", 9, "bold"),
            bg=BG_CONTAINER, fg=ACCENT_YELLOW
        ).pack(anchor="w", padx=8, pady=(4, 1))

        self.lbl_why_text = tk.Label(
            why_box,
            text="The explanation engine describes the DSA reason behind every single push, pop, and output action.",
            font=("Segoe UI", 9),
            bg=BG_CONTAINER,
            fg=TEXT_PRIMARY,
            justify="left",
            wraplength=620
        )
        self.lbl_why_text.pack(anchor="w", padx=8, pady=(0, 6))

        # Algorithm Time Machine / Replay Bar
        time_machine = tk.Frame(right_col, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        time_machine.pack(fill="x", pady=(0, 6))

        tm_inner = tk.Frame(time_machine, bg=BG_CARD)
        tm_inner.pack(fill="x", padx=12, pady=6)

        # Buttons
        tk.Button(
            tm_inner, text="|<<", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=6, pady=2, cursor="hand2", command=self.step_first
        ).pack(side="left", padx=2)

        tk.Button(
            tm_inner, text="< Prev", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=8, pady=2, cursor="hand2", command=self.step_prev
        ).pack(side="left", padx=2)

        self.btn_play_pause = tk.Button(
            tm_inner, text="▶ Play", font=("Segoe UI", 8, "bold"), bg=ACCENT_BLUE, fg="#11111b",
            relief="flat", padx=12, pady=2, cursor="hand2", command=self.toggle_play
        )
        self.btn_play_pause.pack(side="left", padx=4)

        tk.Button(
            tm_inner, text="Next >", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=8, pady=2, cursor="hand2", command=self.step_next
        ).pack(side="left", padx=2)

        tk.Button(
            tm_inner, text=">>|", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=6, pady=2, cursor="hand2", command=self.step_last
        ).pack(side="left", padx=2)

        # Step Indicator
        self.lbl_step_counter = tk.Label(
            tm_inner, text="Step 0 / 0", font=("Segoe UI", 9, "bold"),
            bg=BG_CARD, fg=ACCENT_CYAN
        )
        self.lbl_step_counter.pack(side="left", padx=10)

        # Scrub Slider
        self.scale_var = tk.DoubleVar(value=0)
        self.scrub_scale = ttk.Scale(
            tm_inner, from_=0, to=1, orient="horizontal",
            variable=self.scale_var, command=self._on_slider_scrub,
            style="Horizontal.TScale"
        )
        self.scrub_scale.pack(side="left", fill="x", expand=True, padx=8)

        # Final Result Banner
        self.result_card = tk.Frame(right_col, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.result_card.pack(fill="x", pady=(0, 6))

        res_inner = tk.Frame(self.result_card, bg=BG_CARD)
        res_inner.pack(fill="x", padx=12, pady=5)

        tk.Label(res_inner, text="INFIX:", font=("Segoe UI", 8, "bold"), bg=BG_CARD, fg=TEXT_MUTED).pack(side="left")
        self.lbl_res_infix = tk.Label(res_inner, text="—", font=("Consolas", 9, "bold"), bg=BG_CARD, fg=TEXT_PRIMARY)
        self.lbl_res_infix.pack(side="left", padx=(4, 14))

        tk.Label(res_inner, text="INTERMEDIATE POSTFIX:", font=("Segoe UI", 8, "bold"), bg=BG_CARD, fg=TEXT_MUTED).pack(side="left")
        self.lbl_res_postfix = tk.Label(res_inner, text="—", font=("Consolas", 9, "bold"), bg=BG_CARD, fg=ACCENT_YELLOW)
        self.lbl_res_postfix.pack(side="left", padx=(4, 14))

        tk.Label(res_inner, text="FINAL PREFIX:", font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=ACCENT_GREEN).pack(side="left")
        self.lbl_res_prefix = tk.Label(res_inner, text="—", font=("Consolas", 11, "bold"), bg=BG_CARD, fg=ACCENT_GREEN)
        self.lbl_res_prefix.pack(side="left", padx=(4, 10))

        self.lbl_res_status = tk.Label(res_inner, text="", font=("Segoe UI", 8, "bold"), bg=BG_CARD, fg=ACCENT_GREEN)
        self.lbl_res_status.pack(side="right")

        # Bottom Notebook: Step Table and Activity View
        notebook = ttk.Notebook(right_col)
        notebook.pack(fill="both", expand=True)

        # Tab 1: Step-by-Step Table
        tab_table = tk.Frame(notebook, bg=BG_CONTAINER)
        notebook.add(tab_table, text="  Step-by-Step Table  ")

        columns = ("step", "stage", "token", "action", "stack", "output")
        self.tree = ttk.Treeview(tab_table, columns=columns, show="headings", selectmode="browse")
        self.tree.heading("step", text="Step")
        self.tree.heading("stage", text="Stage")
        self.tree.heading("token", text="Token")
        self.tree.heading("action", text="Action")
        self.tree.heading("stack", text="Stack State")
        self.tree.heading("output", text="Output Buffer")

        self.tree.column("step", width=50, anchor="center")
        self.tree.column("stage", width=140, anchor="w")
        self.tree.column("token", width=65, anchor="center")
        self.tree.column("action", width=160, anchor="w")
        self.tree.column("stack", width=130, anchor="w")
        self.tree.column("output", width=160, anchor="w")

        tree_scroll = ttk.Scrollbar(tab_table, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll.set)
        self.tree.pack(side="left", fill="both", expand=True)
        tree_scroll.pack(side="right", fill="y")
        self.tree.bind("<<TreeviewSelect>>", self._on_tree_row_select)

        # Tab 2: Stack Activity
        tab_activity = tk.Frame(notebook, bg=BG_CONTAINER)
        notebook.add(tab_activity, text="  Stack Activity Analytics  ")
        self.activity_view = StackActivityView(tab_activity)
        self.activity_view.pack(fill="both", expand=True, padx=4, pady=4)

        return scr

    # -------------------------------------------------------------------------
    # Converter Controller Methods
    # -------------------------------------------------------------------------
    def load_sample(self, expression: str) -> None:
        self.entry_expr.delete(0, tk.END)
        self.entry_expr.insert(0, expression)
        self.run_conversion()

    def run_conversion(self) -> None:
        expr = self.entry_expr.get().strip()
        if not expr:
            messagebox.showwarning("Empty Expression", "Please enter an infix expression to convert.")
            return

        self.stop_play()
        res = InfixToPrefixConverter.convert(expr)
        self.conversion_result = res

        if not res.is_valid:
            messagebox.showerror("Validation Error", res.error_message)
            self.lbl_curr_action.configure(text=f"Error: {res.error_message}", fg=ACCENT_RED)
            self.lbl_why_text.configure(text=res.error_message)
            return

        # Populate Step Table
        for row in self.tree.get_children():
            self.tree.delete(row)

        for step in res.all_steps:
            stk_str = step.stack_display
            out_str = step.output_display
            self.tree.insert("", "end", iid=str(step.step_number), values=(
                step.step_number,
                step.stage,
                step.token,
                step.action,
                stk_str,
                out_str,
            ))

        # Update Activity View
        self.activity_view.update_activity(res.stack_activity)

        # Update Result Card
        self.lbl_res_infix.configure(text=res.original_infix)
        self.lbl_res_postfix.configure(text=res.postfix_expression)
        self.lbl_res_prefix.configure(text=res.prefix_expression)
        self.lbl_res_status.configure(text="✓ Conversion Successful")

        # Configure Scrub Slider bounds
        total_steps = len(res.all_steps)
        if total_steps > 0:
            self.scrub_scale.configure(from_=1, to=total_steps)
            self.jump_to_step(1)

    def reset_converter(self) -> None:
        self.stop_play()
        self.conversion_result = None
        self.current_step_index = 0
        self.entry_expr.delete(0, tk.END)
        self.entry_expr.insert(0, "(A+B)*C")
        self.stack_canvas.update_state([])
        self.pipeline_widget.set_stage("INFIX")
        self.lbl_curr_token.configure(text="—")
        self.lbl_curr_action.configure(text="Ready")
        self.lbl_curr_output.configure(text="[ ]")
        self.lbl_why_text.configure(text="Enter an expression and click Convert.")
        self.lbl_step_counter.configure(text="Step 0 / 0")
        self.lbl_res_infix.configure(text="—")
        self.lbl_res_postfix.configure(text="—")
        self.lbl_res_prefix.configure(text="—")
        self.lbl_res_status.configure(text="")
        for row in self.tree.get_children():
            self.tree.delete(row)
        self.activity_view.update_activity({})

    def jump_to_step(self, step_number: int) -> None:
        if not self.conversion_result or not self.conversion_result.all_steps:
            return

        total = len(self.conversion_result.all_steps)
        step_number = max(1, min(step_number, total))
        self.current_step_index = step_number - 1
        step: AlgorithmStep = self.conversion_result.all_steps[self.current_step_index]

        # Update State Displays
        self.lbl_step_counter.configure(text=f"Step {step.step_number} / {total}")
        self.scale_var.set(step.step_number)

        self.lbl_curr_token.configure(text=step.token)
        self.lbl_curr_action.configure(text=step.action)
        self.lbl_curr_output.configure(text=step.output_display if step.output_display else "[EMPTY]")
        self.lbl_why_text.configure(text=step.reason)

        # Update Canvas and Pipeline
        self.stack_canvas.update_state(
            step.stack_state,
            operation_type=step.operation_type,
            highlight=step.top_element
        )
        self.pipeline_widget.set_stage(step.stage)

        # Highlight Table Row
        if self.tree.exists(str(step.step_number)):
            self.tree.selection_set(str(step.step_number))
            self.tree.see(str(step.step_number))

        # Sync Presentation Mode if initialized
        if hasattr(self, "lbl_pres_step_num"):
            self._sync_presentation_view()

    def _on_slider_scrub(self, val_str: str) -> None:
        try:
            val = int(round(float(val_str)))
            if self.conversion_result and 1 <= val <= len(self.conversion_result.all_steps):
                if val != self.current_step_index + 1:
                    self.jump_to_step(val)
        except (ValueError, TypeError):
            pass

    def _on_tree_row_select(self, event) -> None:
        selected = self.tree.selection()
        if selected:
            step_num = int(selected[0])
            self.jump_to_step(step_num)

    def step_next(self) -> None:
        if not self.conversion_result:
            return
        if self.current_step_index + 1 < len(self.conversion_result.all_steps):
            self.jump_to_step(self.current_step_index + 2)
        else:
            self.stop_play()

    def step_prev(self) -> None:
        if not self.conversion_result:
            return
        if self.current_step_index > 0:
            self.jump_to_step(self.current_step_index)

    def step_first(self) -> None:
        if self.conversion_result:
            self.jump_to_step(1)

    def step_last(self) -> None:
        if self.conversion_result:
            self.jump_to_step(len(self.conversion_result.all_steps))

    def toggle_play(self) -> None:
        if self.is_playing:
            self.stop_play()
        else:
            self.start_play()

    def start_play(self) -> None:
        if not self.conversion_result:
            self.run_conversion()
            if not self.conversion_result:
                return

        self.is_playing = True
        self.btn_play_pause.configure(text="❚❚ Pause", bg=ACCENT_ORANGE)
        self._play_loop()

    def stop_play(self) -> None:
        self.is_playing = False
        self.btn_play_pause.configure(text="▶ Play", bg=ACCENT_BLUE)
        if self.play_after_id:
            self.after_cancel(self.play_after_id)
            self.play_after_id = None

    def _play_loop(self) -> None:
        if not self.is_playing or not self.conversion_result:
            return

        if self.current_step_index + 1 < len(self.conversion_result.all_steps):
            self.step_next()
            self.play_after_id = self.after(self.play_speed_ms, self._play_loop)
        else:
            self.stop_play()

    # =========================================================================
    # SCREEN 3: WHAT-IF MODE (EXPRESSION COMPARISON)
    # =========================================================================
    def _create_whatif_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        header = tk.Frame(scr, bg=BG_DARK)
        header.pack(pady=(16, 8))
        tk.Label(
            header, text="WHAT-IF? EXPRESSION COMPARISON LAB",
            font=("Segoe UI", 18, "bold"), bg=BG_DARK, fg=ACCENT_CYAN
        ).pack()
        tk.Label(
            header, text="Analyze how modifying parentheses, operators, and associativity alters the evaluation pipeline.",
            font=("Segoe UI", 9), bg=BG_DARK, fg=TEXT_MUTED
        ).pack()

        # Preset Selector
        preset_bar = tk.Frame(scr, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        preset_bar.pack(fill="x", padx=16, pady=6)

        tk.Label(preset_bar, text="Compare Presets:", font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=TEXT_PRIMARY).pack(side="left", padx=12, pady=6)

        presets = [
            ("Precedence vs Parentheses", "A+B*C", "(A+B)*C"),
            ("Right-Associative Power", "A^B^C", "(A^B)^C"),
            ("Subtraction Associativity", "A-B-C", "A-(B-C)"),
        ]
        for name, exp1, exp2 in presets:
            tk.Button(
                preset_bar, text=name, font=("Segoe UI", 8),
                bg=BG_CONTAINER, fg=ACCENT_YELLOW, relief="flat", padx=8, pady=3,
                cursor="hand2", command=lambda e1=exp1, e2=exp2: self._set_whatif_inputs(e1, e2)
            ).pack(side="left", padx=4)

        # Dual Input Row
        input_container = tk.Frame(scr, bg=BG_DARK)
        input_container.pack(fill="x", padx=16, pady=6)

        # Input A
        box_a = tk.Frame(input_container, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        box_a.pack(side="left", fill="x", expand=True, padx=(0, 6), pady=4)
        tk.Label(box_a, text="EXPRESSION A:", font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=ACCENT_CYAN).pack(anchor="w", padx=10, pady=(6, 2))
        self.entry_whatif_a = tk.Entry(box_a, font=("Consolas", 11), bg=BG_CONTAINER, fg=TEXT_PRIMARY, relief="flat")
        self.entry_whatif_a.pack(fill="x", padx=10, pady=(0, 8), ipady=3)
        self.entry_whatif_a.insert(0, "A+B*C")

        # Input B
        box_b = tk.Frame(input_container, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        box_b.pack(side="left", fill="x", expand=True, padx=(6, 0), pady=4)
        tk.Label(box_b, text="EXPRESSION B:", font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=ACCENT_GREEN).pack(anchor="w", padx=10, pady=(6, 2))
        self.entry_whatif_b = tk.Entry(box_b, font=("Consolas", 11), bg=BG_CONTAINER, fg=TEXT_PRIMARY, relief="flat")
        self.entry_whatif_b.pack(fill="x", padx=10, pady=(0, 8), ipady=3)
        self.entry_whatif_b.insert(0, "(A+B)*C")

        tk.Button(
            scr, text="⚖ COMPARE EXPRESSIONS", font=("Segoe UI", 10, "bold"),
            bg=ACCENT_BLUE, fg="#11111b", relief="flat", padx=16, pady=6,
            cursor="hand2", command=self.run_whatif_comparison
        ).pack(pady=4)

        # Side-by-Side Results Display
        self.whatif_results_frame = tk.Frame(scr, bg=BG_DARK)
        self.whatif_results_frame.pack(fill="both", expand=True, padx=16, pady=6)

        # Card A
        self.card_whatif_a = tk.Frame(self.whatif_results_frame, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.card_whatif_a.pack(side="left", fill="both", expand=True, padx=(0, 6))

        tk.Label(self.card_whatif_a, text="Results: Expression A", font=("Segoe UI", 11, "bold"), bg=BG_CARD, fg=ACCENT_CYAN).pack(anchor="w", padx=12, pady=(10, 6))
        self.lbl_wa_infix = tk.Label(self.card_whatif_a, text="Infix: A+B*C", font=("Consolas", 10), bg=BG_CARD, fg=TEXT_PRIMARY)
        self.lbl_wa_infix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wa_postfix = tk.Label(self.card_whatif_a, text="Intermediate Postfix: —", font=("Consolas", 10), bg=BG_CARD, fg=ACCENT_YELLOW)
        self.lbl_wa_postfix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wa_prefix = tk.Label(self.card_whatif_a, text="Final Prefix: —", font=("Consolas", 12, "bold"), bg=BG_CARD, fg=ACCENT_GREEN)
        self.lbl_wa_prefix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wa_steps = tk.Label(self.card_whatif_a, text="Total Algorithm Steps: —", font=("Segoe UI", 9), bg=BG_CARD, fg=TEXT_MUTED)
        self.lbl_wa_steps.pack(anchor="w", padx=12, pady=2)

        # Card B
        self.card_whatif_b = tk.Frame(self.whatif_results_frame, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.card_whatif_b.pack(side="left", fill="both", expand=True, padx=(6, 0))

        tk.Label(self.card_whatif_b, text="Results: Expression B", font=("Segoe UI", 11, "bold"), bg=BG_CARD, fg=ACCENT_GREEN).pack(anchor="w", padx=12, pady=(10, 6))
        self.lbl_wb_infix = tk.Label(self.card_whatif_b, text="Infix: (A+B)*C", font=("Consolas", 10), bg=BG_CARD, fg=TEXT_PRIMARY)
        self.lbl_wb_infix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wb_postfix = tk.Label(self.card_whatif_b, text="Intermediate Postfix: —", font=("Consolas", 10), bg=BG_CARD, fg=ACCENT_YELLOW)
        self.lbl_wb_postfix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wb_prefix = tk.Label(self.card_whatif_b, text="Final Prefix: —", font=("Consolas", 12, "bold"), bg=BG_CARD, fg=ACCENT_GREEN)
        self.lbl_wb_prefix.pack(anchor="w", padx=12, pady=2)
        self.lbl_wb_steps = tk.Label(self.card_whatif_b, text="Total Algorithm Steps: —", font=("Segoe UI", 9), bg=BG_CARD, fg=TEXT_MUTED)
        self.lbl_wb_steps.pack(anchor="w", padx=12, pady=2)

        # Difference & Pedagogical Explanation Box
        diff_card = tk.Frame(scr, bg=BG_CARD, highlightbackground="#3d59a1", highlightthickness=1)
        diff_card.pack(fill="x", padx=16, pady=(6, 12))

        tk.Label(diff_card, text="💡 WHY DID THE RESULT CHANGE?", font=("Segoe UI", 10, "bold"), bg=BG_CARD, fg=ACCENT_YELLOW).pack(anchor="w", padx=12, pady=(8, 2))
        self.lbl_whatif_reason = tk.Label(
            diff_card,
            text="Click 'Compare Expressions' to analyze differences in grouping, operator order, and prefix structure.",
            font=("Segoe UI", 9),
            bg=BG_CARD,
            fg=TEXT_PRIMARY,
            justify="left",
            wraplength=850
        )
        self.lbl_whatif_reason.pack(anchor="w", padx=12, pady=(0, 10))

        return scr

    def _set_whatif_inputs(self, exp1: str, exp2: str) -> None:
        self.entry_whatif_a.delete(0, tk.END)
        self.entry_whatif_a.insert(0, exp1)
        self.entry_whatif_b.delete(0, tk.END)
        self.entry_whatif_b.insert(0, exp2)
        self.run_whatif_comparison()

    def run_whatif_comparison(self) -> None:
        expr_a = self.entry_whatif_a.get().strip()
        expr_b = self.entry_whatif_b.get().strip()

        res_a = InfixToPrefixConverter.convert(expr_a)
        res_b = InfixToPrefixConverter.convert(expr_b)

        if not res_a.is_valid:
            messagebox.showerror("Expression A Error", res_a.error_message)
            return
        if not res_b.is_valid:
            messagebox.showerror("Expression B Error", res_b.error_message)
            return

        # Update Card A
        self.lbl_wa_infix.configure(text=f"Infix: {res_a.original_infix}")
        self.lbl_wa_postfix.configure(text=f"Intermediate Postfix: {res_a.postfix_expression}")
        self.lbl_wa_prefix.configure(text=f"Final Prefix: {res_a.prefix_expression}")
        self.lbl_wa_steps.configure(text=f"Total Algorithm Steps: {len(res_a.all_steps)}")

        # Update Card B
        self.lbl_wb_infix.configure(text=f"Infix: {res_b.original_infix}")
        self.lbl_wb_postfix.configure(text=f"Intermediate Postfix: {res_b.postfix_expression}")
        self.lbl_wb_prefix.configure(text=f"Final Prefix: {res_b.prefix_expression}")
        self.lbl_wb_steps.configure(text=f"Total Algorithm Steps: {len(res_b.all_steps)}")

        # Pedagogical Comparison Analysis
        if res_a.prefix_expression == res_b.prefix_expression:
            explanation = (
                f"Both expressions produced identical prefix notation: '{res_a.prefix_expression}'.\n"
                f"Parentheses in Expression B did not alter operator precedence because the natural evaluation "
                f"order already evaluated those sub-expressions in the same sequence."
            )
        else:
            explanation = (
                f"Expression A produced '{res_a.prefix_expression}', while Expression B produced '{res_b.prefix_expression}'.\n"
                f"Reason: Parentheses in Expression B changed operator evaluation priority. In expression conversion, "
                f"parentheses act as isolation boundaries, forcing inner operators to be popped to the output buffer "
                f"before outer operators, fundamentally restructuring the resulting Polish notation."
            )

        self.lbl_whatif_reason.configure(text=explanation)

    # =========================================================================
    # SCREEN 4: CHALLENGE MODE (QUIZ WITH REAL-TIME SCORE)
    # =========================================================================
    def _create_challenge_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        header = tk.Frame(scr, bg=BG_DARK)
        header.pack(pady=(16, 6))

        tk.Label(
            header, text="CHALLENGE MODE: DSA STACK MASTERY",
            font=("Segoe UI", 18, "bold"), bg=BG_DARK, fg=ACCENT_CYAN
        ).pack()

        # Score & Progress Tracker Bar
        tracker = tk.Frame(scr, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        tracker.pack(fill="x", padx=20, pady=4)

        t_inner = tk.Frame(tracker, bg=BG_CARD)
        t_inner.pack(fill="x", padx=16, pady=8)

        self.lbl_q_progress = tk.Label(
            t_inner, text="Question 1 / 10", font=("Segoe UI", 10, "bold"),
            bg=BG_CARD, fg=ACCENT_YELLOW
        )
        self.lbl_q_progress.pack(side="left")

        self.lbl_q_category = tk.Label(
            t_inner, text="Category: Next Operation", font=("Segoe UI", 9),
            bg=BG_CARD, fg=TEXT_MUTED
        )
        self.lbl_q_category.pack(side="left", padx=20)

        self.lbl_q_score = tk.Label(
            t_inner, text="Score: 0 / 0 (0%)", font=("Segoe UI", 10, "bold"),
            bg=BG_CARD, fg=ACCENT_GREEN
        )
        self.lbl_q_score.pack(side="right")

        # Question Card
        self.q_card = tk.Frame(scr, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.q_card.pack(fill="both", expand=True, padx=20, pady=8)

        # Context box
        self.lbl_q_context = tk.Label(
            self.q_card, text="Context Info", font=("Consolas", 10),
            bg=BG_CONTAINER, fg=ACCENT_CYAN, padx=12, pady=6, anchor="w"
        )
        self.lbl_q_context.pack(fill="x", padx=16, pady=(12, 8))

        # Question Text
        self.lbl_q_text = tk.Label(
            self.q_card, text="Question Text Goes Here...", font=("Segoe UI", 12, "bold"),
            bg=BG_CARD, fg=TEXT_PRIMARY, wraplength=800, justify="left"
        )
        self.lbl_q_text.pack(anchor="w", padx=16, pady=(4, 12))

        # Options Container
        self.options_frame = tk.Frame(self.q_card, bg=BG_CARD)
        self.options_frame.pack(fill="x", padx=16, pady=4)

        self.option_buttons: List[tk.Button] = []
        for i in range(4):
            btn = tk.Button(
                self.options_frame, text=f"Option {i + 1}", font=("Segoe UI", 10),
                bg=BG_CONTAINER, fg=TEXT_PRIMARY, activebackground="#363654",
                relief="flat", anchor="w", padx=12, pady=8, cursor="hand2",
                command=lambda opt_idx=i: self._on_select_option(opt_idx)
            )
            btn.pack(fill="x", pady=3)
            self.option_buttons.append(btn)

        # Answer Feedback Box
        self.feedback_box = tk.Frame(self.q_card, bg=BG_CONTAINER, highlightthickness=1)
        self.feedback_box.pack(fill="x", padx=16, pady=(8, 12))

        self.lbl_feedback_title = tk.Label(
            self.feedback_box, text="", font=("Segoe UI", 10, "bold"),
            bg=BG_CONTAINER, fg=ACCENT_GREEN
        )
        self.lbl_feedback_title.pack(anchor="w", padx=10, pady=(6, 2))

        self.lbl_feedback_reason = tk.Label(
            self.feedback_box, text="", font=("Segoe UI", 9),
            bg=BG_CONTAINER, fg=TEXT_PRIMARY, justify="left", wraplength=760
        )
        self.lbl_feedback_reason.pack(anchor="w", padx=10, pady=(0, 6))

        # Bottom Challenge Actions
        self.challenge_bottom_bar = tk.Frame(scr, bg=BG_DARK)
        self.challenge_bottom_bar.pack(fill="x", padx=20, pady=(0, 12))

        self.btn_next_question = tk.Button(
            self.challenge_bottom_bar, text="NEXT QUESTION ->", font=("Segoe UI", 9, "bold"),
            bg=ACCENT_BLUE, fg="#11111b", relief="flat", padx=16, pady=6,
            cursor="hand2", state="disabled", command=self._on_next_question
        )
        self.btn_next_question.pack(side="right")

        tk.Button(
            self.challenge_bottom_bar, text="↺ RESTART QUIZ", font=("Segoe UI", 9),
            bg=BG_CARD, fg=TEXT_PRIMARY, relief="flat", padx=12, pady=6,
            cursor="hand2", command=self._restart_challenge
        ).pack(side="left")

        return scr

    def _refresh_challenge_ui(self) -> None:
        q = self.challenge_engine.current_question()
        stats = self.challenge_engine.get_stats()

        self.lbl_q_progress.configure(text=f"Question {self.challenge_engine.current_index + 1} / {stats['total']}")
        self.lbl_q_category.configure(text=f"Category: {q.category}")
        self.lbl_q_score.configure(text=f"Score: {stats['correct']} / {stats['answered_count']} ({stats['score_percent']}%)")

        self.lbl_q_context.configure(text=f"Context: {q.context}")
        self.lbl_q_text.configure(text=q.question_text)

        # Check if already answered
        is_answered = q.id in self.challenge_engine.answers

        for i, opt_btn in enumerate(self.option_buttons):
            opt_text = q.options[i] if i < len(q.options) else ""
            opt_btn.configure(
                text=f"{chr(65 + i)}. {opt_text}",
                state="disabled" if is_answered else "normal",
                bg=BG_CONTAINER,
                fg=TEXT_PRIMARY
            )

        if is_answered:
            chosen = self.challenge_engine.answers[q.id]
            is_correct = (chosen == q.correct_index)
            # Highlight chosen and correct
            self.option_buttons[q.correct_index].configure(bg="#234637", fg=ACCENT_GREEN)
            if not is_correct and chosen < len(self.option_buttons):
                self.option_buttons[chosen].configure(bg="#4d222e", fg=ACCENT_RED)

            self.feedback_box.configure(highlightbackground=ACCENT_GREEN if is_correct else ACCENT_RED)
            self.lbl_feedback_title.configure(
                text="✓ CORRECT" if is_correct else "✗ INCORRECT",
                fg=ACCENT_GREEN if is_correct else ACCENT_RED
            )
            self.lbl_feedback_reason.configure(text=q.explanation)
            self.btn_next_question.configure(state="normal")
        else:
            self.feedback_box.configure(highlightbackground=BG_CONTAINER)
            self.lbl_feedback_title.configure(text="")
            self.lbl_feedback_reason.configure(text="Select an option above to see the educational explanation.")
            self.btn_next_question.configure(state="disabled")

    def _on_select_option(self, opt_idx: int) -> None:
        is_correct, explanation = self.challenge_engine.answer(opt_idx)
        self._refresh_challenge_ui()

    def _on_next_question(self) -> None:
        if self.challenge_engine.next_question():
            self._refresh_challenge_ui()
        else:
            stats = self.challenge_engine.get_stats()
            messagebox.showinfo(
                "Quiz Completed!",
                f"You finished all {stats['total']} questions!\n\n"
                f"Final Score: {stats['correct']} / {stats['total']} ({stats['score_percent']}%)\n\n"
                "Excellent job practicing Stack conversion mechanics!"
            )

    def _restart_challenge(self) -> None:
        self.challenge_engine.restart()
        self._refresh_challenge_ui()

    # =========================================================================
    # SCREEN 5: VIVA PREP (QUESTIONS & QUICK FLASHCARDS)
    # =========================================================================
    def _create_viva_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        header = tk.Frame(scr, bg=BG_DARK)
        header.pack(pady=(16, 6))

        tk.Label(
            header, text="COLLEGE VIVA & ORAL EXAM PREPARATION",
            font=("Segoe UI", 18, "bold"), bg=BG_DARK, fg=ACCENT_CYAN
        ).pack()

        # Tabs: Question Catalog vs Viva Quick Mode
        viva_notebook = ttk.Notebook(scr)
        viva_notebook.pack(fill="both", expand=True, padx=20, pady=8)

        # Tab 1: Comprehensive Catalog
        tab_catalog = tk.Frame(viva_notebook, bg=BG_DARK)
        viva_notebook.add(tab_catalog, text="  Viva Question Catalog (All 15)  ")

        # Split: Listbox on left, Card on right
        cat_split = tk.Frame(tab_catalog, bg=BG_DARK)
        cat_split.pack(fill="both", expand=True, padx=8, pady=8)

        left_list = tk.Frame(cat_split, bg=BG_CARD, width=320, highlightbackground=BORDER_COLOR, highlightthickness=1)
        left_list.pack(side="left", fill="y", padx=(0, 8))

        tk.Label(left_list, text="Select Viva Question:", font=("Segoe UI", 9, "bold"), bg=BG_CARD, fg=ACCENT_CYAN).pack(anchor="w", padx=10, pady=6)

        self.viva_listbox = tk.Listbox(
            left_list, font=("Segoe UI", 9), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            selectbackground=ACCENT_BLUE, selectforeground="#11111b",
            relief="flat", highlightthickness=0
        )
        self.viva_listbox.pack(fill="both", expand=True, padx=8, pady=(0, 8))
        self.viva_listbox.bind("<<ListboxSelect>>", self._on_viva_list_select)

        # Populate Listbox
        for q in self.viva_bank.get_all():
            self.viva_listbox.insert(tk.END, f"{q.id}. {q.question}")

        # Right Detail Pane
        self.viva_detail_card = tk.Frame(cat_split, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.viva_detail_card.pack(side="left", fill="both", expand=True)

        self.lbl_viva_cat = tk.Label(self.viva_detail_card, text="Category: General", font=("Segoe UI", 8, "bold"), bg=BG_CARD, fg=TEXT_MUTED)
        self.lbl_viva_cat.pack(anchor="w", padx=16, pady=(12, 2))

        self.lbl_viva_q = tk.Label(
            self.viva_detail_card, text="Select a question from the left.",
            font=("Segoe UI", 12, "bold"), bg=BG_CARD, fg=ACCENT_YELLOW,
            justify="left", wraplength=520
        )
        self.lbl_viva_q.pack(anchor="w", padx=16, pady=(2, 10))

        # Short Answer Box
        sa_box = tk.Frame(self.viva_detail_card, bg=BG_CONTAINER, highlightbackground=BORDER_COLOR, highlightthickness=1)
        sa_box.pack(fill="x", padx=16, pady=4)
        tk.Label(sa_box, text="DIRECT VIVA ANSWER:", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=ACCENT_GREEN).pack(anchor="w", padx=8, pady=(6, 2))
        self.lbl_viva_sa = tk.Label(sa_box, text="—", font=("Segoe UI", 10), bg=BG_CONTAINER, fg=TEXT_PRIMARY, justify="left", wraplength=500)
        self.lbl_viva_sa.pack(anchor="w", padx=8, pady=(0, 8))

        # Deep Explanation Box
        de_box = tk.Frame(self.viva_detail_card, bg=BG_CONTAINER, highlightbackground=BORDER_COLOR, highlightthickness=1)
        de_box.pack(fill="both", expand=True, padx=16, pady=(4, 12))
        tk.Label(de_box, text="DEEP CONCEPTUAL EXPLANATION (WHY):", font=("Segoe UI", 8, "bold"), bg=BG_CONTAINER, fg=ACCENT_CYAN).pack(anchor="w", padx=8, pady=(6, 2))
        self.lbl_viva_de = tk.Label(de_box, text="—", font=("Segoe UI", 9), bg=BG_CONTAINER, fg=TEXT_PRIMARY, justify="left", wraplength=500)
        self.lbl_viva_de.pack(anchor="w", padx=8, pady=(0, 8))

        # Tab 2: Viva Quick Mode (Random Flashcards)
        tab_flashcard = tk.Frame(viva_notebook, bg=BG_DARK)
        viva_notebook.add(tab_flashcard, text="  ⚡ Viva Quick Mode (Flashcards)  ")

        fc_container = tk.Frame(tab_flashcard, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        fc_container.pack(fill="both", expand=True, padx=30, pady=16)

        tk.Label(fc_container, text="RANDOM VIVA FLASHCARD", font=("Segoe UI", 10, "bold"), bg=BG_CARD, fg=ACCENT_CYAN).pack(anchor="w", padx=20, pady=(16, 4))

        self.lbl_fc_q = tk.Label(
            fc_container, text="Flashcard question...", font=("Segoe UI", 13, "bold"),
            bg=BG_CARD, fg=ACCENT_YELLOW, justify="left", wraplength=700
        )
        self.lbl_fc_q.pack(anchor="w", padx=20, pady=(4, 12))

        # Revealed Answer Card
        self.fc_ans_frame = tk.Frame(fc_container, bg=BG_CONTAINER, highlightbackground="#3d59a1", highlightthickness=1)
        self.fc_ans_frame.pack(fill="both", expand=True, padx=20, pady=4)

        self.lbl_fc_ans = tk.Label(
            self.fc_ans_frame, text="Click '[SHOW ANSWER]' below to reveal the answer.",
            font=("Segoe UI", 10), bg=BG_CONTAINER, fg=TEXT_MUTED, justify="left", wraplength=680
        )
        self.lbl_fc_ans.pack(anchor="w", padx=12, pady=12)

        fc_actions = tk.Frame(fc_container, bg=BG_CARD)
        fc_actions.pack(fill="x", padx=20, pady=16)

        self.btn_fc_show = tk.Button(
            fc_actions, text="👀 SHOW ANSWER", font=("Segoe UI", 9, "bold"),
            bg=ACCENT_BLUE, fg="#11111b", relief="flat", padx=14, pady=6,
            cursor="hand2", command=self._reveal_flashcard
        )
        self.btn_fc_show.pack(side="left", padx=(0, 8))

        tk.Button(
            fc_actions, text="🎲 ANOTHER QUESTION", font=("Segoe UI", 9, "bold"),
            bg=BG_CONTAINER, fg=TEXT_PRIMARY, relief="flat", padx=14, pady=6,
            cursor="hand2", command=self._load_next_flashcard
        ).pack(side="left")

        return scr

    def _on_viva_list_select(self, event) -> None:
        sel = self.viva_listbox.curselection()
        if sel:
            idx = sel[0]
            q = self.viva_bank.get_all()[idx]
            self.lbl_viva_cat.configure(text=f"Category: {q.category}")
            self.lbl_viva_q.configure(text=f"Q{q.id}: {q.question}")
            self.lbl_viva_sa.configure(text=q.short_answer)
            self.lbl_viva_de.configure(text=q.deep_explanation)

    def _load_next_flashcard(self) -> None:
        exclude = self.current_flashcard.id if self.current_flashcard else None
        self.current_flashcard = self.viva_bank.get_random_question(exclude_id=exclude)
        self.lbl_fc_q.configure(text=f"QUESTION: {self.current_flashcard.question}")
        self.lbl_fc_ans.configure(
            text="Answer hidden. Click '[SHOW ANSWER]' to test your memory.",
            fg=TEXT_MUTED
        )
        self.btn_fc_show.configure(state="normal")

    def _reveal_flashcard(self) -> None:
        if self.current_flashcard:
            ans_text = (
                f"ANSWER:\n{self.current_flashcard.short_answer}\n\n"
                f"WHY IT MATTERS:\n{self.current_flashcard.deep_explanation}"
            )
            self.lbl_fc_ans.configure(text=ans_text, fg=TEXT_PRIMARY)
            self.btn_fc_show.configure(state="disabled")

    # =========================================================================
    # SCREEN 6: PRESENTATION MODE (TEACHER / PROJECTOR READY)
    # =========================================================================
    def _create_presentation_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg="#0d0d15")

        # Top Presentation Header
        pres_top = tk.Frame(scr, bg="#11111b", height=60)
        pres_top.pack(fill="x")

        tk.Label(
            pres_top, text="CLASSROOM PRESENTATION MODE", font=("Segoe UI", 14, "bold"),
            bg="#11111b", fg=ACCENT_YELLOW
        ).pack(side="left", padx=20, pady=10)

        # Quick Demo Buttons
        tk.Button(
            pres_top, text="Demo 1: (A+B)*C", font=("Segoe UI", 9, "bold"),
            bg=BG_CONTAINER, fg=ACCENT_GREEN, relief="flat", padx=10, pady=4,
            cursor="hand2", command=lambda: self._pres_load_demo("(A+B)*C")
        ).pack(side="left", padx=8)

        tk.Button(
            pres_top, text="Demo 2: Teacher Complex", font=("Segoe UI", 9, "bold"),
            bg=BG_CONTAINER, fg=ACCENT_CYAN, relief="flat", padx=10, pady=4,
            cursor="hand2", command=lambda: self._pres_load_demo("A+B*(C^D-E)^(F+G*H)-I")
        ).pack(side="left", padx=8)

        tk.Button(
            pres_top, text="Demo 3: A^B^C", font=("Segoe UI", 9, "bold"),
            bg=BG_CONTAINER, fg=ACCENT_YELLOW, relief="flat", padx=10, pady=4,
            cursor="hand2", command=lambda: self._pres_load_demo("A^B^C")
        ).pack(side="left", padx=8)

        # Giant Content Layout
        pres_body = tk.Frame(scr, bg="#0d0d15")
        pres_body.pack(fill="both", expand=True, padx=20, pady=10)

        # Left: Giant Stack Canvas
        p_left = tk.Frame(pres_body, bg="#141420", highlightbackground=BORDER_COLOR, highlightthickness=1, width=320)
        p_left.pack(side="left", fill="both", padx=(0, 12))

        tk.Label(p_left, text="STACK (LIFO)", font=("Segoe UI", 12, "bold"), bg="#141420", fg=ACCENT_CYAN).pack(pady=(10, 4))
        self.pres_stack_canvas = StackCanvas(p_left, width=280, height=380)
        self.pres_stack_canvas.pack(fill="both", expand=True, padx=10, pady=10)

        # Right: Giant Operation & Step Flow
        p_right = tk.Frame(pres_body, bg="#0d0d15")
        p_right.pack(side="left", fill="both", expand=True)

        # Step Indicator
        self.lbl_pres_step_num = tk.Label(
            p_right, text="STEP 1 OF 9", font=("Segoe UI", 14, "bold"),
            bg="#0d0d15", fg=ACCENT_ORANGE
        )
        self.lbl_pres_step_num.pack(anchor="w")

        # Giant Metrics Cards
        cards_row = tk.Frame(p_right, bg="#0d0d15")
        cards_row.pack(fill="x", pady=8)

        # Token
        c_tok = tk.Frame(cards_row, bg="#1e1e30", padx=16, pady=8, highlightbackground=BORDER_COLOR, highlightthickness=1)
        c_tok.pack(side="left", padx=(0, 10))
        tk.Label(c_tok, text="CURRENT TOKEN", font=("Segoe UI", 9, "bold"), bg="#1e1e30", fg=TEXT_MUTED).pack()
        self.lbl_pres_token = tk.Label(c_tok, text="C", font=("Consolas", 22, "bold"), bg="#1e1e30", fg=ACCENT_YELLOW)
        self.lbl_pres_token.pack()

        # Action
        c_act = tk.Frame(cards_row, bg="#1e1e30", padx=16, pady=8, highlightbackground=BORDER_COLOR, highlightthickness=1)
        c_act.pack(side="left", fill="x", expand=True, padx=10)
        tk.Label(c_act, text="ACTION", font=("Segoe UI", 9, "bold"), bg="#1e1e30", fg=TEXT_MUTED).pack(anchor="w")
        self.lbl_pres_action = tk.Label(c_act, text="Output operand 'C'", font=("Segoe UI", 15, "bold"), bg="#1e1e30", fg=ACCENT_GREEN)
        self.lbl_pres_action.pack(anchor="w")

        # Output
        c_out = tk.Frame(p_right, bg="#1e1e30", padx=16, pady=10, highlightbackground=BORDER_COLOR, highlightthickness=1)
        c_out.pack(fill="x", pady=6)
        tk.Label(c_out, text="OUTPUT BUFFER", font=("Segoe UI", 9, "bold"), bg="#1e1e30", fg=TEXT_MUTED).pack(anchor="w")
        self.lbl_pres_output = tk.Label(c_out, text="C", font=("Consolas", 15, "bold"), bg="#1e1e30", fg=TEXT_PRIMARY)
        self.lbl_pres_output.pack(anchor="w")

        # Giant Why Reason
        c_why = tk.Frame(p_right, bg="#1e1e30", padx=16, pady=10, highlightbackground="#3d59a1", highlightthickness=2)
        c_why.pack(fill="both", expand=True, pady=6)
        tk.Label(c_why, text="💡 WHY DID THIS HAPPEN?", font=("Segoe UI", 11, "bold"), bg="#1e1e30", fg=ACCENT_YELLOW).pack(anchor="w")
        self.lbl_pres_why = tk.Label(
            c_why, text="Explanation text...", font=("Segoe UI", 12),
            bg="#1e1e30", fg=TEXT_PRIMARY, justify="left", wraplength=600
        )
        self.lbl_pres_why.pack(anchor="w", pady=6)

        # Presentation Replay Controls
        pres_ctrl = tk.Frame(scr, bg="#11111b", height=50)
        pres_ctrl.pack(fill="x", side="bottom")

        p_inner = tk.Frame(pres_ctrl, bg="#11111b")
        p_inner.pack(pady=8)

        tk.Button(
            p_inner, text="⏮ FIRST", font=("Segoe UI", 10, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=12, pady=4, cursor="hand2", command=self.step_first
        ).pack(side="left", padx=6)

        tk.Button(
            p_inner, text="◀ PREVIOUS STEP", font=("Segoe UI", 11, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=16, pady=4, cursor="hand2", command=self.step_prev
        ).pack(side="left", padx=6)

        self.btn_pres_play = tk.Button(
            p_inner, text="▶ PLAY", font=("Segoe UI", 11, "bold"), bg=ACCENT_BLUE, fg="#11111b",
            relief="flat", padx=18, pady=4, cursor="hand2", command=self.toggle_play
        )
        self.btn_pres_play.pack(side="left", padx=8)

        tk.Button(
            p_inner, text="NEXT STEP ▶", font=("Segoe UI", 11, "bold"), bg=ACCENT_GREEN, fg="#11111b",
            relief="flat", padx=18, pady=4, cursor="hand2", command=self.step_next
        ).pack(side="left", padx=6)

        tk.Button(
            p_inner, text="LAST ⏭", font=("Segoe UI", 10, "bold"), bg=BG_CONTAINER, fg=TEXT_PRIMARY,
            relief="flat", padx=12, pady=4, cursor="hand2", command=self.step_last
        ).pack(side="left", padx=6)

        return scr

    def _pres_load_demo(self, expr: str) -> None:
        self.load_sample(expr)
        self._sync_presentation_view()

    def _sync_presentation_view(self) -> None:
        if not self.conversion_result or not self.conversion_result.all_steps:
            self.load_sample("(A+B)*C")

        if self.conversion_result and self.conversion_result.all_steps:
            step = self.conversion_result.all_steps[self.current_step_index]
            total = len(self.conversion_result.all_steps)
            self.lbl_pres_step_num.configure(text=f"STEP {step.step_number} OF {total} : {step.stage}")
            self.lbl_pres_token.configure(text=step.token)
            self.lbl_pres_action.configure(text=step.action)
            self.lbl_pres_output.configure(text=step.output_display if step.output_display else "[EMPTY]")
            self.lbl_pres_why.configure(text=step.reason)
            self.pres_stack_canvas.update_state(
                step.stack_state,
                operation_type=step.operation_type,
                highlight=step.top_element
            )
            self.btn_pres_play.configure(text="❚❚ PAUSE" if self.is_playing else "▶ PLAY")


    # =========================================================================
    # SCREEN 7: ABOUT PAGE
    # =========================================================================
    def _create_about_screen(self) -> tk.Frame:
        scr = tk.Frame(self.container, bg=BG_DARK)

        card = tk.Frame(scr, bg=BG_CARD, highlightbackground=BORDER_COLOR, highlightthickness=1)
        card.pack(fill="both", expand=True, padx=40, pady=25)

        tk.Label(
            card, text="ABOUT: INTERACTIVE INFIX TO PREFIX DSA LAB",
            font=("Segoe UI", 16, "bold"), bg=BG_CARD, fg=ACCENT_CYAN
        ).pack(anchor="w", padx=24, pady=(20, 8))

        specs = [
            ("Project Name", "Interactive Infix-to-Prefix DSA Lab"),
            ("Domain", "Data Structures & Algorithms (DSA) / Compiler Lexing & Parsing"),
            ("Primary Language", "Python 3.11+ Standard Library (Zero External Dependencies)"),
            ("GUI Framework", "Tkinter & TTK"),
            ("Core Data Structure", "Custom Stack ADT (Strict LIFO Semantics)"),
            ("Primary Concept", "Expression Conversion via Infix -> Reverse -> Swap -> Postfix -> Prefix"),
            ("Primary Differentiator", "'Why Did This Happen?' Pedagogical Real-Time Reasoning Engine"),
            ("Time Complexity", "O(n) - Linear Time"),
            ("Space Complexity", "O(n) - Linear Space"),
            ("GitHub Repository", "https://github.com/shreyaskhakal/infix-to-prefix-converter"),
        ]

        specs_table = tk.Frame(card, bg=BG_CONTAINER, highlightbackground=BORDER_COLOR, highlightthickness=1)
        specs_table.pack(fill="x", padx=24, pady=10)

        for r, (k, v) in enumerate(specs):
            tk.Label(specs_table, text=k, font=("Segoe UI", 9, "bold"), bg=BG_CONTAINER, fg=ACCENT_YELLOW).grid(row=r, column=0, sticky="w", padx=12, pady=4)
            tk.Label(specs_table, text=v, font=("Segoe UI", 9), bg=BG_CONTAINER, fg=TEXT_PRIMARY).grid(row=r, column=1, sticky="w", padx=12, pady=4)

        tk.Label(
            card,
            text=(
                "Educational Value:\n"
                "Standard conversion tools act as black boxes, outputting a final answer without explaining\n"
                "the mechanics of operator deferral. This laboratory exposes the internal state transitions\n"
                "of the stack at every token boundary, equipping students and teachers with complete visual and\n"
                "conceptual clarity for viva exams and technical interviews."
            ),
            font=("Segoe UI", 9),
            bg=BG_CARD,
            fg=TEXT_MUTED,
            justify="left"
        ).pack(anchor="w", padx=24, pady=12)

        return scr


def main():
    """Application entry point."""
    app = InfixToPrefixApp()
    app.mainloop()


if __name__ == "__main__":
    main()
