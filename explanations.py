"""
The 'Why Did This Happen?' Pedagogical Explanation Engine.

Generates rich, dynamic, and scientifically accurate explanations
for every single stack and output operation in the Infix-to-Prefix algorithm.
"""

from typing import Optional


class ExplanationEngine:
    """
    Produces instructional text explaining algorithm decisions based on
    data structures principles: LIFO stack mechanics, operator precedence,
    and associativity under expression reversal.
    """

    @staticmethod
    def explain_operand(token: str) -> str:
        return (
            f"'{token}' is an operand. In prefix/postfix notations, operands maintain their "
            f"relative sequential order, so '{token}' is directly appended to the output buffer."
        )

    @staticmethod
    def explain_left_paren() -> str:
        return (
            "'(' is encountered. It marks the boundary of a grouped sub-expression. "
            "It is pushed onto the stack to act as a barrier so lower-precedence operators "
            "outside the group are not prematurely evaluated."
        )

    @staticmethod
    def explain_right_paren_pop(top_operator: str) -> str:
        return (
            f"')' encountered. In the reversed expression, ')' marks the end of a grouped sub-expression. "
            f"Operator '{top_operator}' is popped and added to output to resolve operations inside the parentheses."
        )

    @staticmethod
    def explain_right_paren_discard() -> str:
        return (
            "The matching opening parenthesis '(' was reached and popped from the stack. "
            "Both parentheses are now discarded because prefix notation requires no parentheses "
            "to denote evaluation order."
        )

    @staticmethod
    def explain_higher_precedence_pop(top_op: str, top_prec: int, incoming_op: str, incoming_prec: int) -> str:
        return (
            f"Stack top '{top_op}' has precedence {top_prec}, which is HIGHER than incoming "
            f"'{incoming_op}' (precedence {incoming_prec}). The higher-precedence operation '{top_op}' "
            f"must be evaluated first, so '{top_op}' is popped to the output."
        )

    @staticmethod
    def explain_equal_precedence_pop_right_assoc(top_op: str, incoming_op: str) -> str:
        return (
            f"Incoming '{incoming_op}' and stack top '{top_op}' are both exponentiation ('^') "
            f"with equal precedence (3). In standard arithmetic, '^' is RIGHT-ASSOCIATIVE. "
            f"Because the infix expression was reversed, the rightmost operator now appears first; "
            f"therefore, the existing stack operator '{top_op}' must be popped first."
        )

    @staticmethod
    def explain_equal_precedence_push_left_assoc(top_op: str, incoming_op: str) -> str:
        return (
            f"Incoming '{incoming_op}' has EQUAL precedence to stack top '{top_op}'. "
            f"Because the original operators are LEFT-ASSOCIATIVE and the input was reversed, "
            f"'{top_op}' must NOT be popped yet. Pushing '{incoming_op}' preserves original left-to-right evaluation."
        )

    @staticmethod
    def explain_push_operator(op: str, stack_was_empty: bool = False, top_op: Optional[str] = None) -> str:
        if stack_was_empty:
            return (
                f"The stack is currently empty. Operator '{op}' is pushed onto the stack "
                f"to await its subsequent operand."
            )
        if top_op == '(':
            return (
                f"The stack top is '('. Operator '{op}' is pushed onto the stack inside this "
                f"parenthesized group."
            )
        return (
            f"The stack top now has lower precedence than '{op}'. Operator '{op}' is pushed onto "
            f"the stack to await higher-precedence resolution."
        )

    @staticmethod
    def explain_final_pop(op: str) -> str:
        return (
            f"The end of the reversed expression has been reached. Remaining operator '{op}' is popped "
            f"from the stack and appended to the output buffer in LIFO order."
        )

    @staticmethod
    def explain_pipeline_stage(stage_name: str, input_state: str, output_state: str) -> str:
        if stage_name == "REVERSE_INPUT":
            return (
                f"Step 1: Reverse the Infix Expression. Input: '{input_state}' -> Reversed: '{output_state}'. "
                f"We reverse the expression so we can convert it into prefix using a modified postfix stack algorithm."
            )
        elif stage_name == "SWAP_BRACKETS":
            return (
                f"Step 2: Swap Parentheses. In the reversed expression, every '(' becomes ')' and every ')' becomes '('. "
                f"Result: '{output_state}'. This restores proper grouping from left to right."
            )
        elif stage_name == "REVERSE_POSTFIX":
            return (
                f"Step 4: Reverse Intermediate Postfix. Postfix result: '{input_state}' -> Final Prefix: '{output_state}'. "
                f"Reversing the intermediate postfix yields the correct prefix (Polish) notation!"
            )
        return f"Stage {stage_name}: Processed {input_state} -> {output_state}."
