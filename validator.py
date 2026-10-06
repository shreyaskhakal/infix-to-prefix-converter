"""
Expression Validator for Interactive Infix-to-Prefix DSA Lab.

Validates infix expressions and produces clear, educational error messages
with the exact character index where the issue was detected.
"""

import re
from typing import Tuple, Optional, List


class ExpressionValidator:
    """
    Dedicated validator for arithmetic infix expressions.

    Validates:
      - Non-empty input
      - Supported character set (alphanumeric, identifiers, numbers, operators +, -, *, /, %, ^, parens)
      - Balanced and correctly nested parentheses
      - No empty parentheses ()
      - No consecutive operators (e.g., A++B, A*/B)
      - No operator at start (e.g., +A)
      - No operator at end (e.g., A+)
      - Proper operand and operator alternation
    """

    SUPPORTED_OPERATORS = {'+', '-', '*', '/', '%', '^'}

    @classmethod
    def validate(cls, expression: str) -> Tuple[bool, Optional[str], Optional[int]]:
        """
        Validate an infix expression string.

        Returns:
            (is_valid: bool, error_message: Optional[str], error_position: Optional[int])
        """
        if expression is None or not expression.strip():
            return False, "Invalid expression: input is empty. Please enter an infix expression.", 0

        expr = expression.strip()

        # 1. Check for illegal characters
        # Allowed: letters, digits, underscores, spaces, +, -, *, /, %, ^, (, )
        for idx, char in enumerate(expr):
            if not (char.isalnum() or char in {'_', ' ', '+', '-', '*', '/', '%', '^', '(', ')'}):
                return (
                    False,
                    f"Invalid character '{char}' at position {idx + 1}. "
                    "Only identifiers, numbers, parentheses, and operators (+, -, *, /, %, ^) are permitted.",
                    idx
                )

        # 2. Check for empty parentheses: e.g. "()" or "(   )"
        empty_paren_match = re.search(r'\(\s*\)', expr)
        if empty_paren_match:
            pos = empty_paren_match.start()
            return (
                False,
                f"Invalid expression at position {pos + 1}: empty parentheses '()' are not allowed.",
                pos
            )

        # 3. Check parenthesis balance and nesting
        paren_stack: List[int] = []
        for idx, char in enumerate(expr):
            if char == '(':
                paren_stack.append(idx)
            elif char == ')':
                if not paren_stack:
                    return (
                        False,
                        f"Mismatched closing parenthesis ')' at position {idx + 1} with no matching '('.",
                        idx
                    )
                paren_stack.pop()

        if paren_stack:
            unmatched_idx = paren_stack[-1]
            return (
                False,
                f"Mismatched opening parenthesis '(' at position {unmatched_idx + 1}: missing closing ')'.",
                unmatched_idx
            )

        # 4. Token-level structural validation
        raw_tokens = cls._raw_tokenize(expr)
        if not raw_tokens:
            return False, "Invalid expression: no valid tokens found.", 0

        # Filter out whitespace tokens for structural checks
        tokens = [t for t in raw_tokens if t[0].strip()]

        if not tokens:
            return False, "Invalid expression: only whitespace found.", 0

        # Check start token: cannot be a binary operator
        first_val, first_pos = tokens[0]
        if first_val in cls.SUPPORTED_OPERATORS:
            return (
                False,
                f"Invalid expression: cannot start with an operator ('{first_val}') at position {first_pos + 1}.",
                first_pos
            )

        # Check end token: cannot be an operator
        last_val, last_pos = tokens[-1]
        if last_val in cls.SUPPORTED_OPERATORS:
            return (
                False,
                f"Invalid expression: cannot end with an operator ('{last_val}') at position {last_pos + 1}.",
                last_pos
            )

        # Check token transitions
        for i in range(len(tokens) - 1):
            curr_val, curr_pos = tokens[i]
            next_val, next_pos = tokens[i + 1]

            # Case: Consecutive operators (e.g. A++B, A*/B)
            if curr_val in cls.SUPPORTED_OPERATORS and next_val in cls.SUPPORTED_OPERATORS:
                return (
                    False,
                    f"Invalid expression: consecutive operators '{curr_val}{next_val}' at position {curr_pos + 1}.",
                    curr_pos
                )

            # Case: Operator immediately followed by closing paren: e.g. "(A+)"
            if curr_val in cls.SUPPORTED_OPERATORS and next_val == ')':
                return (
                    False,
                    f"Invalid syntax: operator '{curr_val}' cannot be immediately followed by ')' at position {curr_pos + 1}.",
                    curr_pos
                )

            # Case: Opening paren immediately followed by operator: e.g. "(+A)"
            if curr_val == '(' and next_val in cls.SUPPORTED_OPERATORS:
                return (
                    False,
                    f"Invalid syntax: '(' cannot be immediately followed by operator '{next_val}' at position {next_pos + 1}.",
                    next_pos
                )

            # Case: Two consecutive operands with just space between them: e.g. "A B"
            if cls._is_operand(curr_val) and cls._is_operand(next_val):
                return (
                    False,
                    f"Invalid syntax: two consecutive operands '{curr_val}' and '{next_val}' without an operator at position {curr_pos + 1}.",
                    curr_pos
                )

        return True, None, None

    @classmethod
    def _is_operand(cls, token: str) -> bool:
        if token in cls.SUPPORTED_OPERATORS or token in ('(', ')'):
            return False
        return True

    @classmethod
    def _raw_tokenize(cls, expr: str) -> List[Tuple[str, int]]:
        """
        Tokenize into (token_text, start_index).
        """
        pattern = re.compile(r'([A-Za-z_][A-Za-z0-9_]*|[0-9]+|\^|\*|\/|\%|\+|\-|\(|\)|\S)')
        tokens = []
        for match in pattern.finditer(expr):
            tokens.append((match.group(1), match.start()))
        return tokens
