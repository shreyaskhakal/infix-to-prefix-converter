"""
Viva Mode Preparation Module for Interactive Infix-to-Prefix DSA Lab.

Provides comprehensive college viva questions, textbook answers,
in-depth conceptual explanations, and an interactive Flashcard Quick Mode.
"""

import random
from dataclasses import dataclass
from typing import List, Dict, Optional


@dataclass
class VivaQuestion:
    """Represents a viva examination question with answer and explanation."""
    id: int
    category: str
    question: str
    short_answer: str
    deep_explanation: str


class VivaBank:
    """
    Curated repository of oral examination questions on Stack and Expression Parsing.
    """

    def __init__(self) -> None:
        self.questions: List[VivaQuestion] = self._init_questions()

    def _init_questions(self) -> List[VivaQuestion]:
        return [
            VivaQuestion(
                id=1,
                category="Expression Formats",
                question="What is an Infix expression?",
                short_answer="An expression where operators are written in-between their operands (e.g., A + B).",
                deep_explanation=(
                    "Infix notation is the standard mathematical representation used by humans. "
                    "However, evaluating an infix expression requires resolving ambiguity using operator "
                    "precedence, associativity rules, and parentheses, making direct compiler evaluation "
                    "more complex than prefix or postfix forms."
                )
            ),
            VivaQuestion(
                id=2,
                category="Expression Formats",
                question="What is a Prefix (Polish) expression?",
                short_answer="An expression where operators precede their operands (e.g., + A B).",
                deep_explanation=(
                    "Invented by Polish logician Jan Łukasiewicz in 1924, prefix notation eliminates "
                    "the need for parentheses and operator precedence rules during machine evaluation. "
                    "An expression can be evaluated cleanly from right to left using a single operand stack."
                )
            ),
            VivaQuestion(
                id=3,
                category="Expression Formats",
                question="What is a Postfix (Reverse Polish) expression?",
                short_answer="An expression where operators follow their operands (e.g., A B +).",
                deep_explanation=(
                    "Postfix notation places operators directly after their corresponding operands. "
                    "It is widely used in stack-oriented programming languages (like Forth and PostScript) "
                    "and virtual machines (like JVM bytecode) because it can be evaluated sequentially "
                    "from left to right in a single linear pass."
                )
            ),
            VivaQuestion(
                id=4,
                category="Stack Fundamentals",
                question="Why is a Stack used for expression conversion?",
                short_answer="Because a stack provides LIFO (Last In, First Out) ordering, which matches the deferral of lower-precedence operators.",
                deep_explanation=(
                    "When parsing an infix expression, operators cannot be emitted immediately because an "
                    "incoming operator may have higher precedence and must be executed first. The stack "
                    "stores deferred operators until their operands and any higher-priority sub-expressions "
                    "are fully evaluated."
                )
            ),
            VivaQuestion(
                id=5,
                category="Stack Fundamentals",
                question="What does LIFO mean, and how does it apply here?",
                short_answer="LIFO stands for 'Last In, First Out'. The most recently pushed operator is popped first.",
                deep_explanation=(
                    "In our custom Stack class, push() appends an element to the top, and pop() removes the "
                    "topmost element. In expression parsing, higher-precedence operators or inner parenthesized "
                    "expressions are pushed last and therefore popped first, enforcing correct operational priority."
                )
            ),
            VivaQuestion(
                id=6,
                category="Precedence & Associativity",
                question="What is Operator Precedence?",
                short_answer="The rule defining which operation is evaluated first in an expression without parentheses.",
                deep_explanation=(
                    "Precedence assigns an order of importance: Exponentiation (^) has precedence 3, "
                    "Multiplication, Division, and Modulo (*, /, %) have precedence 2, while Addition "
                    "and Subtraction (+, -) have precedence 1. Operators with higher precedence bind "
                    "more tightly to operands."
                )
            ),
            VivaQuestion(
                id=7,
                category="Precedence & Associativity",
                question="What is Operator Associativity?",
                short_answer="The direction of evaluation (Left-to-Right or Right-to-Left) when operators share equal precedence.",
                deep_explanation=(
                    "For example, '+' and '-' are left-associative, so 'A - B - C' evaluates as '((A - B) - C)'. "
                    "Exponentiation ('^') is right-associative, so 'A ^ B ^ C' evaluates as '(A ^ (B ^ C))'."
                )
            ),
            VivaQuestion(
                id=8,
                category="Precedence & Associativity",
                question="Why is Exponentiation (^) Right-Associative?",
                short_answer="In standard mathematics, a tower of powers like a^b^c is evaluated top-down: a^(b^c).",
                deep_explanation=(
                    "If evaluated left-to-right, (a^b)^c would simply equal a^(b*c), rendering multiple exponents "
                    "redundant. Top-down / right-to-left evaluation gives distinct mathematical meaning: 2^(3^2) = 2^9 = 512, "
                    "whereas (2^3)^2 = 8^2 = 64."
                )
            ),
            VivaQuestion(
                id=9,
                category="Complexity Analysis",
                question="What is the Time Complexity of Infix-to-Prefix conversion?",
                short_answer="O(n), where n is the length (number of tokens) of the expression.",
                deep_explanation=(
                    "Reversing the input takes O(n). Swapping parentheses takes O(n). During postfix conversion, "
                    "every token is pushed onto the stack at most once and popped at most once, which is O(n). "
                    "Reversing the final postfix takes O(n). Overall sum: O(n) + O(n) + O(n) + O(n) = O(n)."
                )
            ),
            VivaQuestion(
                id=10,
                category="Complexity Analysis",
                question="What is the Space Complexity of this algorithm?",
                short_answer="O(n) auxiliary space.",
                deep_explanation=(
                    "In the worst case (e.g., deeply nested parentheses or strictly increasing operator precedence), "
                    "the stack stores up to O(n) operators. Additionally, the tokenized, reversed, and output lists "
                    "each occupy O(n) memory. Therefore, overall auxiliary space is linear O(n)."
                )
            ),
            VivaQuestion(
                id=11,
                category="Algorithm Pipeline",
                question="What happens when an Opening Parenthesis '(' is encountered in the algorithm?",
                short_answer="It is pushed onto the stack to act as an isolated boundary for the nested sub-expression.",
                deep_explanation=(
                    "Parentheses override standard precedence. Pushing '(' ensures that any operators pushed "
                    "inside this scope will only interact with operators within the same scope. The '(' acts "
                    "as a protective floor until its corresponding ')' arrives."
                )
            ),
            VivaQuestion(
                id=12,
                category="Algorithm Pipeline",
                question="What happens when a Closing Parenthesis ')' is encountered?",
                short_answer="All operators are popped to output until '(' is reached, then '(' and ')' are discarded.",
                deep_explanation=(
                    "The arrival of ')' signifies the completion of the sub-expression. Every operator "
                    "remaining on the stack inside this parenthetical level is transferred to the output buffer "
                    "in LIFO order. Once the matching '(' is popped, both boundary tokens are discarded."
                )
            ),
            VivaQuestion(
                id=13,
                category="Algorithm Pipeline",
                question="Why do we reverse the Infix expression at the start?",
                short_answer="Reversing allows us to adapt the well-known Infix-to-Postfix algorithm to produce Prefix notation.",
                deep_explanation=(
                    "Prefix notation requires operators before operands, while postfix puts them after. "
                    "Because prefix reading is essentially postfix viewed from right to left, reversing "
                    "the input and then reversing the postfix output naturally produces prefix notation without "
                    "needing a completely separate two-pass syntax tree parser."
                )
            ),
            VivaQuestion(
                id=14,
                category="Algorithm Pipeline",
                question="Why do we swap '(' with ')' after reversing the infix expression?",
                short_answer="Reversing inverts bracket orientations; swapping restores proper open-to-close logical hierarchy.",
                deep_explanation=(
                    "When '(A + B)' is reversed character-wise, it becomes ') B + A ('. Here, ')' comes first, "
                    "which would violate stack bracket matching. Swapping '(' <-> ')' produces '( B + A )', "
                    "allowing the standard postfix engine to treat '(' as the open delimiter and ')' as the close delimiter."
                )
            ),
            VivaQuestion(
                id=15,
                category="Algorithm Pipeline",
                question="Why do we reverse the Postfix result at the end?",
                short_answer="To invert the post-order sequence back into the Polish prefix pre-order sequence.",
                deep_explanation=(
                    "Because our stack engine processed the reversed infix expression, the output is in "
                    "reversed-prefix order (equivalent to postfix on the reversed tokens). A final reversal "
                    "flips both operands and operators back into their correct prefix positions: * + A B C."
                )
            ),
        ]

    def get_all(self) -> List[VivaQuestion]:
        return self.questions

    def get_by_category(self, category: str) -> List[VivaQuestion]:
        return [q for q in self.questions if q.category == category]

    def get_categories(self) -> List[str]:
        return sorted(list(set(q.category for q in self.questions)))

    def get_random_question(self, exclude_id: Optional[int] = None) -> VivaQuestion:
        candidates = [q for q in self.questions if q.id != exclude_id] if exclude_id else self.questions
        return random.choice(candidates if candidates else self.questions)
