"""
=============================================================================
INTERACTIVE INFIX-TO-PREFIX DSA LAB: STANDALONE PRESENTATION PROGRAM
=============================================================================
Author: DSA Lab Educator & Architect
Repository: https://github.com/shreyaskhakal/infix-to-prefix-converter
Description:
    A completely self-contained, presentation-ready Python program for college
    demonstrations, viva examinations, and teaching Data Structures & Algorithms.

    This single file includes:
      1. Pure Python custom Stack class (LIFO)
      2. Complete mathematical Infix-to-Prefix conversion pipeline
      3. Expression validator with pedagogical error diagnostics
      4. "Why Did This Happen?" Dynamic Explanation Engine
      5. Step-by-step terminal execution with visual ASCII stack
      6. Time and Space complexity analysis
      7. Interactive CLI menu with one-click teacher demos

Requirements:
    Python 3.11+ standard library only (Zero external packages required).
    Run with: python presentation_code.py
=============================================================================
"""

import sys
import re
from typing import List, Tuple, Optional, Dict, Any


# =============================================================================
# 1. CUSTOM STACK DATA STRUCTURE (LIFO: LAST IN, FIRST OUT)
# =============================================================================

class Stack:
    """
    A custom implementation of the Stack Abstract Data Type (ADT).

    Core Principle:
        LIFO (Last In, First Out). The element added most recently is the
        first one to be removed.

    Internal Representation:
        Uses a standard Python list, but enforces pure stack semantics through
        encapsulated methods: push, pop, peek, is_empty, size, clear, display.
    """

    def __init__(self) -> None:
        # Create an empty list to store stack elements internally.
        self._items: List[Any] = []

    def push(self, item: Any) -> None:
        """
        Push an element onto the top of the stack.
        Time Complexity: O(1)
        """
        self._items.append(item)

    def pop(self) -> Any:
        """
        Remove and return the top element from the stack.
        Raises IndexError if the stack is empty (Stack Underflow).
        Time Complexity: O(1)
        """
        if self.is_empty():
            raise IndexError("Stack Underflow: Cannot pop from an empty stack.")
        return self._items.pop()

    def peek(self) -> Any:
        """
        Return the top element without removing it.
        Raises IndexError if the stack is empty.
        Time Complexity: O(1)
        """
        if self.is_empty():
            raise IndexError("Stack Underflow: Cannot peek into an empty stack.")
        return self._items[-1]

    def is_empty(self) -> bool:
        """
        Return True if the stack has no items, False otherwise.
        Time Complexity: O(1)
        """
        return len(self._items) == 0

    def size(self) -> int:
        """
        Return the total number of elements currently in the stack.
        Time Complexity: O(1)
        """
        return len(self._items)

    def clear(self) -> None:
        """
        Remove all elements from the stack.
        Time Complexity: O(1)
        """
        self._items.clear()

    def to_list(self) -> List[Any]:
        """
        Return a copy of items from bottom to top for visual inspection.
        """
        return list(self._items)

    def display(self) -> str:
        """
        User-friendly string showing stack contents from bottom to top.
        """
        if self.is_empty():
            return "[EMPTY]"
        return "[" + ", ".join(str(x) for x in self._items) + "]"

    def __len__(self) -> int:
        return self.size()

    def __str__(self) -> str:
        return self.display()


# =============================================================================
# 2. OPERATOR PRECEDENCE AND ASSOCIATIVITY RULES
# =============================================================================

# Precedence table:
# Higher number = binds more tightly to operands.
PRECEDENCE: Dict[str, int] = {
    "^": 3,
    "*": 2,
    "/": 2,
    "%": 2,
    "+": 1,
    "-": 1,
    "(": 0,
    ")": 0,
}

# Associativity table:
# '^' is Right-associative: A^B^C = A^(B^C)
# '+', '-', '*', '/', '%' are Left-associative: A-B-C = (A-B)-C
ASSOCIATIVITY: Dict[str, str] = {
    "^": "Right",
    "*": "Left",
    "/": "Left",
    "%": "Left",
    "+": "Left",
    "-": "Left",
}


# =============================================================================
# 3. EXPRESSION VALIDATOR
# =============================================================================

class ExpressionValidator:
    """
    Validates arithmetic expressions with educational error reporting.
    """

    OPERATORS = {'+', '-', '*', '/', '%', '^'}

    @classmethod
    def validate(cls, expr_str: str) -> Tuple[bool, Optional[str]]:
        if not expr_str or not expr_str.strip():
            return False, "Input expression cannot be empty."

        clean = expr_str.strip()

        # Check illegal characters
        for i, ch in enumerate(clean):
            if not (ch.isalnum() or ch in {'_', ' ', '+', '-', '*', '/', '%', '^', '(', ')'}):
                return False, f"Illegal character '{ch}' detected at index {i + 1}."

        # Check empty parentheses ()
        if re.search(r'\(\s*\)', clean):
            return False, "Empty parentheses '()' are not permitted."

        # Check parenthesis balance using a stack
        paren_stack = []
        for i, ch in enumerate(clean):
            if ch == '(':
                paren_stack.append(i)
            elif ch == ')':
                if not paren_stack:
                    return False, f"Unmatched closing parenthesis ')' at index {i + 1}."
                paren_stack.pop()
        if paren_stack:
            return False, f"Unmatched opening parenthesis '(' at index {paren_stack[-1] + 1}."

        # Token extraction
        tokens = re.findall(r'([A-Za-z_][A-Za-z0-9_]*|[0-9]+|\^|\*|\/|\%|\+|\-|\(|\))', clean)
        if not tokens:
            return False, "No valid tokens found."

        # First and last token checks
        if tokens[0] in cls.OPERATORS:
            return False, f"Expression cannot begin with an operator ('{tokens[0]}')."
        if tokens[-1] in cls.OPERATORS:
            return False, f"Expression cannot end with an operator ('{tokens[-1]}')."

        # Adjacent token checks
        for i in range(len(tokens) - 1):
            curr, nxt = tokens[i], tokens[i + 1]
            if curr in cls.OPERATORS and nxt in cls.OPERATORS:
                return False, f"Consecutive operators '{curr}{nxt}' are invalid."
            if curr in cls.OPERATORS and nxt == ')':
                return False, f"Operator '{curr}' cannot be immediately followed by ')'."
            if curr == '(' and nxt in cls.OPERATORS:
                return False, f"'(' cannot be immediately followed by operator '{nxt}'."

        return True, None


# =============================================================================
# 4. "WHY DID THIS HAPPEN?" EXPLANATION ENGINE
# =============================================================================

class ExplanationEngine:
    """
    Generates real-time educational explanations for why the Stack pushed or popped.
    """

    @staticmethod
    def explain_operand(token: str) -> str:
        return f"'{token}' is an operand. In prefix/postfix notation, operands maintain order, so it goes directly to output."

    @staticmethod
    def explain_left_paren() -> str:
        return "'(' marks the start of a nested sub-expression. Pushed to stack as a boundary barrier."

    @staticmethod
    def explain_right_paren_pop(top_op: str) -> str:
        return f"')' encountered. Operator '{top_op}' is popped inside this parenthesized group to output."

    @staticmethod
    def explain_right_paren_discard() -> str:
        return "Matching '(' found and discarded. Both parentheses are removed (prefix notation is parenthesis-free)."

    @staticmethod
    def explain_higher_prec(top_op: str, top_p: int, in_op: str, in_p: int) -> str:
        return f"Stack top '{top_op}' (prec {top_p}) > incoming '{in_op}' (prec {in_p}). Higher precedence evaluates first, so '{top_op}' is popped."

    @staticmethod
    def explain_right_assoc_power(top_op: str, in_op: str) -> str:
        return f"Both operators are '^' (precedence 3, Right-Associative). In reversed expression, the rightmost evaluated operator comes first, so '{top_op}' is popped."

    @staticmethod
    def explain_left_assoc_hold(top_op: str, in_op: str) -> str:
        return f"Incoming '{in_op}' and top '{top_op}' have equal precedence and are Left-Associative. In reversed expression, top '{top_op}' is NOT popped."

    @staticmethod
    def explain_push(op: str, is_empty: bool) -> str:
        if is_empty:
            return f"Stack is empty. Pushing '{op}' onto stack."
        return f"Stack top has lower precedence. Pushing '{op}' onto stack to await higher priority operations."

    @staticmethod
    def explain_final_pop(op: str) -> str:
        return f"End of reversed expression reached. Popping remaining operator '{op}' to output."


# =============================================================================
# 5. CORE INFIX-TO-PREFIX CONVERSION PIPELINE
# =============================================================================

class InfixToPrefixPresentation:
    """
    Main conversion class executing:
    Infix -> Reverse Tokens -> Swap Parens -> Postfix with Stack -> Reverse Postfix -> Prefix.
    """

    @classmethod
    def tokenize(cls, expr: str) -> List[str]:
        # Handle identifiers, numbers, operators, parens
        pattern = re.compile(r'([A-Za-z_][A-Za-z0-9_]*|[0-9]+|\^|\*|\/|\%|\+|\-|\(|\))')
        tokens = pattern.findall(expr)
        processed: List[str] = []
        for i, tok in enumerate(tokens):
            if i > 0:
                prev = tokens[i - 1]
                prev_is_op = prev not in ('+', '-', '*', '/', '%', '^', '(', ')')
                curr_is_op = tok not in ('+', '-', '*', '/', '%', '^', '(', ')')
                # Auto insert multiplication for A(B) or (A)B
                if prev_is_op and tok == '(':
                    processed.append('*')
                elif prev == ')' and curr_is_op:
                    processed.append('*')
            processed.append(tok)
        return processed

    @classmethod
    def convert(cls, expression: str) -> Dict[str, Any]:
        valid, err = ExpressionValidator.validate(expression)
        if not valid:
            return {"success": False, "error": err}

        # Step 1: Tokenize
        tokens = cls.tokenize(expression)

        # Step 2: Reverse Infix Tokens
        reversed_tokens = list(reversed(tokens))

        # Step 3: Swap Parentheses '(' <-> ')'
        swapped_tokens = []
        for t in reversed_tokens:
            if t == '(':
                swapped_tokens.append(')')
            elif t == ')':
                swapped_tokens.append('(')
            else:
                swapped_tokens.append(t)

        # Step 4: Postfix Conversion using our custom Stack
        # Create a stack to store operators. Operators are processed according to precedence and associativity.
        stack = Stack()
        postfix_output: List[str] = []
        steps_record: List[Dict[str, Any]] = []
        step_num = 1

        for tok in swapped_tokens:
            is_operand = tok not in PRECEDENCE and tok not in ('(', ')')

            if is_operand:
                postfix_output.append(tok)
                steps_record.append({
                    "step": step_num,
                    "token": tok,
                    "action": f"Output operand '{tok}'",
                    "stack": stack.to_list(),
                    "output": list(postfix_output),
                    "reason": ExplanationEngine.explain_operand(tok)
                })
                step_num += 1

            elif tok == '(':
                stack.push(tok)
                steps_record.append({
                    "step": step_num,
                    "token": tok,
                    "action": "Push '('",
                    "stack": stack.to_list(),
                    "output": list(postfix_output),
                    "reason": ExplanationEngine.explain_left_paren()
                })
                step_num += 1

            elif tok == ')':
                while not stack.is_empty() and stack.peek() != '(':
                    popped = stack.pop()
                    postfix_output.append(popped)
                    steps_record.append({
                        "step": step_num,
                        "token": tok,
                        "action": f"POP '{popped}'",
                        "stack": stack.to_list(),
                        "output": list(postfix_output),
                        "reason": ExplanationEngine.explain_right_paren_pop(popped)
                    })
                    step_num += 1

                # Discard '('
                if not stack.is_empty() and stack.peek() == '(':
                    stack.pop()
                    steps_record.append({
                        "step": step_num,
                        "token": tok,
                        "action": "Discard matching '('",
                        "stack": stack.to_list(),
                        "output": list(postfix_output),
                        "reason": ExplanationEngine.explain_right_paren_discard()
                    })
                    step_num += 1

            else:
                # Operator (+, -, *, /, %, ^)
                incoming_p = PRECEDENCE[tok]
                incoming_assoc = ASSOCIATIVITY.get(tok, "Left")

                while not stack.is_empty() and stack.peek() != '(':
                    top_op = stack.peek()
                    top_p = PRECEDENCE.get(top_op, 0)

                    if top_p > incoming_p:
                        popped = stack.pop()
                        postfix_output.append(popped)
                        steps_record.append({
                            "step": step_num,
                            "token": tok,
                            "action": f"POP '{popped}'",
                            "stack": stack.to_list(),
                            "output": list(postfix_output),
                            "reason": ExplanationEngine.explain_higher_prec(top_op, top_p, tok, incoming_p)
                        })
                        step_num += 1
                    elif top_p == incoming_p and incoming_assoc == "Right":
                        # ^ is right-associative: in reversed expression, equal precedence pops!
                        popped = stack.pop()
                        postfix_output.append(popped)
                        steps_record.append({
                            "step": step_num,
                            "token": tok,
                            "action": f"POP '{popped}' (Right-assoc '^')",
                            "stack": stack.to_list(),
                            "output": list(postfix_output),
                            "reason": ExplanationEngine.explain_right_assoc_power(top_op, tok)
                        })
                        step_num += 1
                    else:
                        break

                stack_was_empty = stack.is_empty()
                stack.push(tok)
                steps_record.append({
                    "step": step_num,
                    "token": tok,
                    "action": f"PUSH '{tok}'",
                    "stack": stack.to_list(),
                    "output": list(postfix_output),
                    "reason": ExplanationEngine.explain_push(tok, stack_was_empty)
                })
                step_num += 1

        # Pop any remaining operators
        while not stack.is_empty():
            final_popped = stack.pop()
            postfix_output.append(final_popped)
            steps_record.append({
                "step": step_num,
                "token": "[END]",
                "action": f"POP '{final_popped}' (Final)",
                "stack": stack.to_list(),
                "output": list(postfix_output),
                "reason": ExplanationEngine.explain_final_pop(final_popped)
            })
            step_num += 1

        # Step 5: Reverse Postfix to get Final Prefix
        prefix_tokens = list(reversed(postfix_output))

        # Compact vs Spaced
        is_single = all(len(x) == 1 for x in tokens if x not in ('(', ')'))
        prefix_str = "".join(prefix_tokens) if is_single else " ".join(prefix_tokens)
        postfix_str = "".join(postfix_output) if is_single else " ".join(postfix_output)

        return {
            "success": True,
            "infix": expression,
            "tokens": tokens,
            "reversed_tokens": reversed_tokens,
            "swapped_tokens": swapped_tokens,
            "postfix_tokens": postfix_output,
            "prefix_tokens": prefix_tokens,
            "postfix_expression": postfix_str,
            "prefix_expression": prefix_str,
            "steps": steps_record,
        }


# =============================================================================
# 6. TERMINAL VISUALIZATION AND ASCII ART
# =============================================================================

def draw_ascii_stack(stack_items: List[str]) -> str:
    """Render a visual ASCII container for the stack."""
    if not stack_items:
        return "       | (EMPTY) | \n       +---------+"
    lines = []
    top_idx = len(stack_items) - 1
    for i in range(top_idx, -1, -1):
        item = str(stack_items[i]).center(7)
        if i == top_idx:
            lines.append(f" TOP-> | {item} |")
        else:
            lines.append(f"       | {item} |")
        lines.append("       +---------+")
    return "\n".join(lines)


def print_conversion_report(res: Dict[str, Any]) -> None:
    """Print the complete step-by-step conversion report in terminal."""
    print("\n" + "=" * 80)
    print("                    CONVERSION PIPELINE OVERVIEW")
    print("=" * 80)
    print(f" [1] Original Infix   :  {res['infix']}")
    print(f" [2] Reversed Tokens  :  {' '.join(res['reversed_tokens'])}")
    print(f" [3] Swapped Brackets :  {' '.join(res['swapped_tokens'])}")
    print(f" [4] Interm. Postfix  :  {res['postfix_expression']}")
    print(f" [5] Final PREFIX     :  {res['prefix_expression']}")
    print("=" * 80)

    print("\n" + "-" * 80)
    print(f"{'STEP':<5} | {'TOKEN':<7} | {'ACTION':<24} | {'STACK':<16} | {'OUTPUT':<18}")
    print("-" * 80)

    for st in res["steps"]:
        stk_str = "[" + ", ".join(st["stack"]) + "]"
        out_str = "".join(st["output"]) if len("".join(st["output"])) < 18 else " ".join(st["output"])
        print(f"{st['step']:<5} | {st['token']:<7} | {st['action']:<24} | {stk_str:<16} | {out_str:<18}")

    print("-" * 80)
    print("\n" + "=" * 80)
    print("                STEP-BY-STEP PEDAGOGICAL BREAKDOWN")
    print("=" * 80)

    for st in res["steps"]:
        print(f"\n--- STEP {st['step']}: Token = '{st['token']}' | Action = {st['action']} ---")
        print(f" Output Buffer : {' '.join(st['output'])}")
        print(" Stack State   :")
        print(draw_ascii_stack(st["stack"]))
        print(f" WHY HAPPENED? : {st['reason']}")


def print_complexity_analysis() -> None:
    """Print Time and Space complexity educational breakdown."""
    print("\n" + "=" * 80)
    print("                ALGORITHM COMPLEXITY & DSA ANALYSIS")
    print("=" * 80)
    print("""
 1. TIME COMPLEXITY: O(n)
    - Tokenization and Initial Reversal: O(n)
    - Parenthesis Swapping: O(n)
    - Postfix Stack Processing:
        Every token is processed once. Each operator is pushed onto the Stack
        at most once and popped at most once. Hence, total stack operations = O(n).
    - Final Output Reversal: O(n)
    - Total Time = O(n) + O(n) + O(n) + O(n) = O(n) [Linear Time]

 2. SPACE COMPLEXITY: O(n)
    - Custom Stack Storage:
        In the worst-case (e.g. A + B * C ^ D or nested parentheses), the stack
        stores up to n operator tokens.
    - Output Buffer and Token Lists: O(n) auxiliary memory.
    - Total Auxiliary Space = O(n) [Linear Space]

 3. CORE PRINCIPLE:
    - Stack (LIFO: Last In, First Out) naturally handles operational deferral.
    - Higher-precedence operations are popped first and attached before
      lower-precedence operations are resolved.
""")
    print("=" * 80)


# =============================================================================
# 7. INTERACTIVE CLI RUNNER FOR TEACHER DEMONSTRATIONS
# =============================================================================

def run_interactive_cli() -> None:
    """Main interactive terminal loop for viva and presentation."""
    print("""
 =============================================================================
           INTERACTIVE INFIX-TO-PREFIX DSA LAB (PRESENTATION PROGRAM)
       "Understand the Stack. Don't Just Get the Answer."
 =============================================================================
    """)

    while True:
        print("\nChoose an option:")
        print(" 1. Teacher Demo 1: Simpler Expression '(A+B)*C'")
        print(" 2. Teacher Demo 2: Complex Expression 'A+B*(C^D-E)^(F+G*H)-I'")
        print(" 3. Teacher Demo 3: Right-Associativity 'A^B^C'")
        print(" 4. Enter Custom Infix Expression")
        print(" 5. Display Algorithm Complexity & Theory Analysis")
        print(" 6. Exit")

        choice = input("\nEnter choice [1-6]: ").strip()

        if choice == "1":
            expr = "(A+B)*C"
            print(f"\n[Running Demo 1]: Expression = '{expr}'")
            res = InfixToPrefixPresentation.convert(expr)
            print_conversion_report(res)

        elif choice == "2":
            expr = "A+B*(C^D-E)^(F+G*H)-I"
            print(f"\n[Running Demo 2]: Expression = '{expr}'")
            res = InfixToPrefixPresentation.convert(expr)
            print_conversion_report(res)

        elif choice == "3":
            expr = "A^B^C"
            print(f"\n[Running Demo 3]: Expression = '{expr}'")
            res = InfixToPrefixPresentation.convert(expr)
            print_conversion_report(res)

        elif choice == "4":
            expr = input("\nEnter your Infix Expression (e.g. (A+B)*C or total+price*2): ").strip()
            res = InfixToPrefixPresentation.convert(expr)
            if not res["success"]:
                print(f"\n[ERROR]: {res['error']}")
            else:
                print_conversion_report(res)

        elif choice == "5":
            print_complexity_analysis()

        elif choice == "6":
            print("\nThank you for exploring the Interactive Infix-to-Prefix DSA Lab!\n")
            sys.exit(0)

        else:
            print("\nInvalid choice. Please choose 1, 2, 3, 4, 5, or 6.")


if __name__ == "__main__":
    # If run with command line arguments (e.g. python presentation_code.py "(A+B)*C")
    if len(sys.argv) > 1:
        custom_input = sys.argv[1]
        output = InfixToPrefixPresentation.convert(custom_input)
        if not output["success"]:
            print(f"Error: {output['error']}")
        else:
            print_conversion_report(output)
    else:
        run_interactive_cli()
