"""
Visualization Components for the Interactive Infix-to-Prefix DSA Lab.

Provides custom Tkinter Canvas widgets for:
  - Animated/State-driven LIFO Stack Container
  - Conversion Pipeline Stage Indicator
  - Stack Activity Analytics Panel
"""

import tkinter as tk
from tkinter import font as tkfont
from typing import List, Optional, Dict, Any


# Modern Academic Dark Color Palette
BG_DARK = "#181825"
BG_CARD = "#1e1e2e"
BG_CONTAINER = "#252538"
ACCENT_BLUE = "#89b4fa"
ACCENT_CYAN = "#74c7ec"
ACCENT_GREEN = "#a6e3a1"
ACCENT_ORANGE = "#fab387"
ACCENT_YELLOW = "#f9e2af"
ACCENT_RED = "#f38ba8"
TEXT_PRIMARY = "#cdd6f4"
TEXT_MUTED = "#9399b2"
BORDER_COLOR = "#45475a"


class StackCanvas(tk.Canvas):
    """
    A custom Tkinter Canvas that visually renders the LIFO Stack container.
    Renders elements stacked from the bottom upward, top indicator arrow,
    and 'STACK EMPTY' notice when appropriate.
    """

    def __init__(self, parent, width: int = 240, height: int = 340, **kwargs):
        super().__init__(
            parent,
            width=width,
            height=height,
            bg=BG_DARK,
            highlightthickness=0,
            **kwargs
        )
        self.stack_items: List[str] = []
        self.highlighted_item: Optional[str] = None
        self.operation_type: str = "INFO"
        self.bind("<Configure>", lambda e: self.redraw())

    def update_state(self, items: List[str], operation_type: str = "INFO", highlight: Optional[str] = None) -> None:
        """Update the stack contents and trigger a re-render."""
        self.stack_items = list(items)
        self.operation_type = operation_type
        self.highlighted_item = highlight
        self.redraw()

    def redraw(self) -> None:
        """Draw the stack container and all element blocks."""
        self.delete("all")
        w = self.winfo_width()
        h = self.winfo_height()
        if w <= 1 or h <= 1:
            w, h = 240, 340

        padding_x = 35
        bottom_y = h - 35
        top_y = 55
        box_width = w - 2 * padding_x
        block_height = 36
        block_gap = 4

        # Container boundary coordinates
        left_x = padding_x
        right_x = w - padding_x

        # Draw Stack Floor and Side Walls (LIFO Beaker)
        self.create_line(left_x, top_y, left_x, bottom_y, fill=BORDER_COLOR, width=3)
        self.create_line(right_x, top_y, right_x, bottom_y, fill=BORDER_COLOR, width=3)
        self.create_line(left_x, bottom_y, right_x, bottom_y, fill=ACCENT_CYAN, width=4)

        # Label for Stack Base
        self.create_text(
            w / 2, bottom_y + 18,
            text="STACK BASE (BOTTOM)",
            fill=TEXT_MUTED,
            font=("Segoe UI", 8, "bold")
        )

        num_items = len(self.stack_items)

        # Case: Empty Stack
        if num_items == 0:
            # Draw dashed inner placeholder
            center_y = (top_y + bottom_y) / 2
            self.create_rectangle(
                left_x + 10, center_y - 25,
                right_x - 10, center_y + 25,
                fill=BG_CONTAINER,
                outline=BORDER_COLOR,
                dash=(4, 4),
                width=1
            )
            self.create_text(
                w / 2, center_y,
                text="STACK EMPTY",
                fill=TEXT_MUTED,
                font=("Segoe UI", 11, "bold")
            )
            return

        # Max elements visible before scaling block height
        max_fit = int((bottom_y - top_y - 10) / (block_height + block_gap))
        curr_block_height = block_height
        if num_items > max_fit and max_fit > 0:
            curr_block_height = max(18, int((bottom_y - top_y - 10) / num_items) - block_gap)

        # Draw stacked blocks from bottom up
        for i, item in enumerate(self.stack_items):
            # item 0 is at the bottom
            y2 = bottom_y - 6 - (i * (curr_block_height + block_gap))
            y1 = y2 - curr_block_height

            is_top = (i == num_items - 1)

            # Color scheme depending on state and position
            if is_top:
                if self.operation_type == "PUSH":
                    fill_col = ACCENT_GREEN
                    text_col = "#11111b"
                    outline_col = "#a6e3a1"
                elif self.operation_type == "POP":
                    fill_col = ACCENT_RED
                    text_col = "#11111b"
                    outline_col = "#f38ba8"
                else:
                    fill_col = ACCENT_BLUE
                    text_col = "#11111b"
                    outline_col = ACCENT_CYAN
            else:
                fill_col = BG_CONTAINER
                text_col = TEXT_PRIMARY
                outline_col = BORDER_COLOR

            # Rounded block simulation
            self.create_rectangle(
                left_x + 8, y1,
                right_x - 8, y2,
                fill=fill_col,
                outline=outline_col,
                width=2
            )

            # Block Text
            font_size = 10 if curr_block_height < 25 else 12
            self.create_text(
                w / 2, (y1 + y2) / 2,
                text=str(item),
                fill=text_col,
                font=("Consolas", font_size, "bold")
            )

            # If this is the top element, draw the "TOP ↓" pointer
            if is_top:
                arrow_y = y1 - 10
                self.create_text(
                    w / 2, arrow_y - 12,
                    text="TOP (LIFO)",
                    fill=ACCENT_ORANGE,
                    font=("Segoe UI", 9, "bold")
                )
                self.create_line(
                    w / 2, arrow_y - 4,
                    w / 2, y1 - 1,
                    arrow=tk.LAST,
                    fill=ACCENT_ORANGE,
                    width=2,
                    arrowshape=(8, 10, 4)
                )


class PipelineWidget(tk.Canvas):
    """
    Renders the 6-stage transformation pipeline visually:
    [ INFIX ] -> [ REVERSE ] -> [ SWAP BRACKETS ] -> [ POSTFIX (STACK) ] -> [ REVERSE ] -> [ PREFIX ]
    with the current stage prominently highlighted.
    """

    STAGES = [
        ("INFIX", "Infix"),
        ("REVERSE", "Reverse Infix"),
        ("SWAP", "Swap Parens"),
        ("POSTFIX", "Postfix (Stack)"),
        ("REV_POST", "Reverse Postfix"),
        ("PREFIX", "Final Prefix"),
    ]

    def __init__(self, parent, height: int = 56, **kwargs):
        super().__init__(
            parent,
            height=height,
            bg=BG_DARK,
            highlightthickness=0,
            **kwargs
        )
        self.active_stage_idx: int = 0
        self.bind("<Configure>", lambda e: self.redraw())

    def set_stage(self, stage_name: str) -> None:
        """Determine which stage index to highlight from step info."""
        stage_upper = stage_name.upper()
        if "REVERSE INFIX" in stage_upper or "REVERSE_INPUT" in stage_upper:
            self.active_stage_idx = 1
        elif "SWAP" in stage_upper:
            self.active_stage_idx = 2
        elif "POSTFIX" in stage_upper or "STACK" in stage_upper:
            self.active_stage_idx = 3
        elif "REVERSE POSTFIX" in stage_upper or "REV_POST" in stage_upper:
            self.active_stage_idx = 4
        elif "COMPLETE" in stage_upper or "FINAL" in stage_upper or "PREFIX" in stage_upper:
            self.active_stage_idx = 5
        else:
            self.active_stage_idx = 0
        self.redraw()

    def redraw(self) -> None:
        self.delete("all")
        w = self.winfo_width()
        h = self.winfo_height()
        if w <= 10:
            return

        n = len(self.STAGES)
        box_w = min(130, int((w - (n - 1) * 20 - 40) / n))
        box_h = 32
        start_x = int((w - (n * box_w + (n - 1) * 20)) / 2)
        start_x = max(10, start_x)
        y = (h - box_h) / 2

        for i, (short_code, label) in enumerate(self.STAGES):
            x1 = start_x + i * (box_w + 20)
            x2 = x1 + box_w
            y1 = y
            y2 = y + box_h

            is_active = (i == self.active_stage_idx)

            if is_active:
                fill_col = ACCENT_CYAN
                text_col = "#11111b"
                outline_col = "#ffffff"
                width_border = 2
            else:
                fill_col = BG_CONTAINER
                text_col = TEXT_MUTED
                outline_col = BORDER_COLOR
                width_border = 1

            self.create_rectangle(
                x1, y1, x2, y2,
                fill=fill_col,
                outline=outline_col,
                width=width_border
            )

            font_weight = "bold" if is_active else "normal"
            self.create_text(
                (x1 + x2) / 2, (y1 + y2) / 2,
                text=label,
                fill=text_col,
                font=("Segoe UI", 8, font_weight)
            )

            # Draw connector arrow between stages
            if i < n - 1:
                arrow_x1 = x2 + 3
                arrow_x2 = x2 + 17
                arrow_y = (y1 + y2) / 2
                arrow_color = ACCENT_CYAN if (i < self.active_stage_idx) else TEXT_MUTED
                self.create_line(
                    arrow_x1, arrow_y, arrow_x2, arrow_y,
                    arrow=tk.LAST,
                    fill=arrow_color,
                    width=2,
                    arrowshape=(6, 8, 3)
                )


class StackActivityView(tk.Frame):
    """
    Renders analytics on stack activity:
    which operators were PUSHED, POPPED, and PEEKED during conversion.
    """

    def __init__(self, parent, **kwargs):
        super().__init__(parent, bg=BG_CARD, **kwargs)
        self.title_lbl = tk.Label(
            self,
            text="STACK ACTIVITY ANALYTICS",
            font=("Segoe UI", 9, "bold"),
            bg=BG_CARD,
            fg=ACCENT_CYAN
        )
        self.title_lbl.pack(anchor="w", padx=10, pady=(6, 2))

        self.table_frame = tk.Frame(self, bg=BG_CARD)
        self.table_frame.pack(fill="both", expand=True, padx=10, pady=(0, 6))

    def update_activity(
        self,
        activity_data: Dict[str, Dict[str, int]],
        overall_stats: Optional[Dict[str, Any]] = None
    ) -> None:
        for child in self.table_frame.winfo_children():
            child.destroy()

        if not activity_data and not overall_stats:
            empty_lbl = tk.Label(
                self.table_frame,
                text="No conversion activity recorded yet.",
                font=("Segoe UI", 9, "italic"),
                bg=BG_CARD,
                fg=TEXT_MUTED
            )
            empty_lbl.pack(pady=4)
            return

        # Summary Banner for Section 23 Requirements:
        # Pushes, Pops, Peeks, Maximum Stack Size, Total Steps
        if overall_stats:
            summary_frame = tk.Frame(self.table_frame, bg=BG_CONTAINER, padx=8, pady=4, highlightbackground=BORDER_COLOR, highlightthickness=1)
            summary_frame.pack(fill="x", pady=(0, 6))

            stat_items = [
                ("Pushes", overall_stats.get("pushes", 0), ACCENT_GREEN),
                ("Pops", overall_stats.get("pops", 0), ACCENT_RED),
                ("Peeks", overall_stats.get("peeks", 0), TEXT_MUTED),
                ("Max Stack Size", overall_stats.get("max_size", 0), ACCENT_CYAN),
                ("Total Steps", overall_stats.get("total_steps", 0), ACCENT_YELLOW),
            ]
            for label, val, col in stat_items:
                item_box = tk.Frame(summary_frame, bg=BG_CONTAINER)
                item_box.pack(side="left", expand=True, padx=4)
                tk.Label(item_box, text=label, font=("Segoe UI", 7, "bold"), bg=BG_CONTAINER, fg=TEXT_MUTED).pack()
                tk.Label(item_box, text=str(val), font=("Consolas", 10, "bold"), bg=BG_CONTAINER, fg=col).pack()

        # Detailed per-item grid
        grid_frame = tk.Frame(self.table_frame, bg=BG_CARD)
        grid_frame.pack(fill="both", expand=True)

        headers = ["Item", "Pushed", "Popped", "Peeked"]
        for col_idx, h in enumerate(headers):
            lbl = tk.Label(
                grid_frame,
                text=h,
                font=("Segoe UI", 8, "bold"),
                bg=BG_CARD,
                fg=TEXT_PRIMARY
            )
            lbl.grid(row=0, column=col_idx, padx=6, pady=2, sticky="w")

        row = 1
        for item, stats in sorted(activity_data.items()):
            tk.Label(
                grid_frame,
                text=f"'{item}'",
                font=("Consolas", 9, "bold"),
                bg=BG_CARD,
                fg=ACCENT_YELLOW
            ).grid(row=row, column=0, padx=6, pady=1, sticky="w")

            tk.Label(
                grid_frame,
                text=f"{stats.get('push', 0)} times",
                font=("Segoe UI", 8),
                bg=BG_CARD,
                fg=ACCENT_GREEN
            ).grid(row=row, column=1, padx=6, pady=1, sticky="w")

            tk.Label(
                grid_frame,
                text=f"{stats.get('pop', 0)} times",
                font=("Segoe UI", 8),
                bg=BG_CARD,
                fg=ACCENT_RED
            ).grid(row=row, column=2, padx=6, pady=1, sticky="w")

            tk.Label(
                grid_frame,
                text=f"{stats.get('peek', 0)} times",
                font=("Segoe UI", 8),
                bg=BG_CARD,
                fg=TEXT_MUTED
            ).grid(row=row, column=3, padx=6, pady=1, sticky="w")

            row += 1
