"""
Challenge Mode Module for Interactive Infix-to-Prefix DSA Lab.

Tests the student's mastery of Stack mechanics, operator precedence,
associativity, syntax validation, and expression transformation.
"""

from dataclasses import dataclass
from typing import List, Optional, Dict, Any, Tuple


@dataclass
class ChallengeQuestion:
    """Represents a single challenge quiz question."""
    id: int
    category: str
    expression: Optional[str]
    context: str
    question_text: str
    options: List[str]
    correct_index: int
    explanation: str


class ChallengeEngine:
    """
    Manages quiz questions, session state, scores, and explanations.
    """

    def __init__(self) -> None:
        self.questions: List[ChallengeQuestion] = self._load_questions()
        self.current_index: int = 0
        self.score: int = 0
        self.answers: Dict[int, int] = {}  # question_id -> chosen option index

    def _load_questions(self) -> List[ChallengeQuestion]:
        return [
            ChallengeQuestion(
                id=1,
                category="Next Operation",
                expression="A + B * C",
                context="In reversed postfix conversion, token is '+' and stack top is '*'.",
                question_text="What happens when operator '+' encounters '*' on top of the stack?",
                options=[
                    "Push '+' immediately",
                    "Pop '*' to output because '*' has higher precedence than '+'",
                    "Pop 'B' from output",
                    "Raise a syntax error"
                ],
                correct_index=1,
                explanation=(
                    "'*' has precedence 2 while '+' has precedence 1. Higher-precedence operators "
                    "must evaluate before lower-precedence ones, so '*' is popped to the output."
                )
            ),
            ChallengeQuestion(
                id=2,
                category="Precedence & Associativity",
                expression="A ^ B ^ C",
                context="The exponentiation operator '^' has precedence 3 and is right-associative.",
                question_text="What is the correct prefix notation for 'A ^ B ^ C'?",
                options=[
                    "^ ^ A B C",
                    "^ A ^ B C",
                    "^ B ^ A C",
                    "A B C ^ ^"
                ],
                correct_index=1,
                explanation=(
                    "Because '^' is right-associative, 'A ^ B ^ C' is grouped as 'A ^ (B ^ C)'. "
                    "The prefix form of 'B ^ C' is '^ B C', and applying 'A ^' yields '^ A ^ B C'."
                )
            ),
            ChallengeQuestion(
                id=3,
                category="Stack State",
                expression="(A + B) * C",
                context="In reversed form: 'C * (B + A)'. Processing token 'A'.",
                question_text="At the moment token 'A' is read, what is the exact state of the stack?",
                options=[
                    "[ ] (empty)",
                    "[ * ]",
                    "[ *, ( ]",
                    "[ *, (, + ]"
                ],
                correct_index=3,
                explanation=(
                    "Before reading 'A', '*' was pushed, then '(' was pushed, and '+' was pushed. "
                    "Therefore, the stack holds ['*', '(', '+'] from bottom to top."
                )
            ),
            ChallengeQuestion(
                id=4,
                category="Parentheses Behavior",
                expression="(A + B) * C",
                context="A closing parenthesis ')' is encountered in the reversed expression.",
                question_text="What stack action is triggered upon reading ')'?",
                options=[
                    "Push ')' onto the stack",
                    "Pop all operators until '(' is reached, then discard both '(' and ')'",
                    "Clear the entire stack immediately",
                    "Add ')' directly to the output buffer"
                ],
                correct_index=1,
                explanation=(
                    "')' delimits the end of a parenthesized sub-expression in the reversed string. "
                    "All operators inside the scope are popped to the output until '(' is reached, "
                    "and both parenthesis tokens are discarded."
                )
            ),
            ChallengeQuestion(
                id=5,
                category="Validation",
                expression="Varied Expressions",
                context="Evaluating expression syntax rules.",
                question_text="Which of the following expressions is syntactically INVALID?",
                options=[
                    "(A + B) * C",
                    "A + B * (C ^ D)",
                    "A + * B",
                    "total_price - discount"
                ],
                correct_index=2,
                explanation=(
                    "'A + * B' contains two consecutive binary operators ('+' and '*'), which is invalid "
                    "because a binary operator requires an operand between them."
                )
            ),
            ChallengeQuestion(
                id=6,
                category="Pipeline Steps",
                expression="Standard Algorithm",
                context="Infix-to-Prefix conversion pipeline using a stack.",
                question_text="What is the first step in the stack-based Infix-to-Prefix algorithm?",
                options=[
                    "Directly run infix-to-postfix conversion",
                    "Reverse the infix expression and swap '(' with ')'",
                    "Evaluate the expression using an operand stack",
                    "Construct a binary expression tree"
                ],
                correct_index=1,
                explanation=(
                    "The standard method first reverses the infix tokens and swaps parentheses "
                    "so that standard stack-based postfix conversion can be reused."
                )
            ),
            ChallengeQuestion(
                id=7,
                category="Associativity in Reversed String",
                expression="A - B - C",
                context="Left-associative operators in reversed postfix conversion.",
                question_text="When converting the reversed expression 'C - B - A', why is '-' NOT popped when another '-' arrives?",
                options=[
                    "Because '-' has lower precedence than itself",
                    "Because left-associative operators must not be popped on equal precedence in a reversed expression",
                    "Because '-' cannot be pushed onto a stack",
                    "Because subtraction is commutative"
                ],
                correct_index=1,
                explanation=(
                    "In a reversed expression, the order of operands and operators is mirrored. "
                    "To maintain original left-to-right evaluation for left-associative operators, "
                    "we do not pop on equal precedence; we only pop if stack top is strictly greater."
                )
            ),
            ChallengeQuestion(
                id=8,
                category="Prefix Prediction",
                expression="A + B * C",
                context="Standard operator precedence without parentheses.",
                question_text="What is the final prefix expression for 'A + B * C'?",
                options=[
                    "+ A * B C",
                    "* + A B C",
                    "+ * A B C",
                    "A B C * +"
                ],
                correct_index=0,
                explanation=(
                    "Multiplication has higher precedence than addition: 'B * C' -> '* B C'. "
                    "Then addition applies to 'A' and '* B C': '+ A * B C'."
                )
            ),
            ChallengeQuestion(
                id=9,
                category="Complexity",
                expression="Algorithm Analysis",
                context="Time and Space bounds for converting expression of length n.",
                question_text="What are the Time and Space complexities of stack-based Infix-to-Prefix conversion?",
                options=[
                    "Time: O(n log n), Space: O(1)",
                    "Time: O(n^2), Space: O(n)",
                    "Time: O(n), Space: O(n)",
                    "Time: O(1), Space: O(n)"
                ],
                correct_index=2,
                explanation=(
                    "Each token is pushed and popped at most once, and reversals take linear time O(n). "
                    "The stack and output buffers store up to n tokens, so auxiliary space is O(n)."
                )
            ),
            ChallengeQuestion(
                id=10,
                category="Data Structures",
                expression="LIFO Mechanics",
                context="Stack properties.",
                question_text="Why is a Stack (LIFO) the ideal data structure for expression conversion?",
                options=[
                    "Because it sorts elements in alphabetical order",
                    "Because it naturally preserves operator deferral until higher-precedence operations finish",
                    "Because it allows random access to all elements in O(1) time",
                    "Because it computes mathematical results using floating-point hardware"
                ],
                correct_index=1,
                explanation=(
                    "LIFO order guarantees that operators with higher precedence or deeper parenthetical "
                    "nesting are popped and applied first, deferring lower-precedence operators."
                )
            ),
        ]

    def total_questions(self) -> int:
        return len(self.questions)

    def current_question(self) -> ChallengeQuestion:
        return self.questions[self.current_index]

    def answer(self, option_index: int) -> Tuple[bool, str]:
        """
        Submit an answer for the current question.
        Returns: (is_correct: bool, explanation: str)
        """
        q = self.current_question()
        self.answers[q.id] = option_index
        is_correct = (option_index == q.correct_index)
        if is_correct:
            self.score += 1
        return is_correct, q.explanation

    def next_question(self) -> bool:
        """Advance to next question if available. Returns True if advanced."""
        if self.current_index + 1 < len(self.questions):
            self.current_index += 1
            return True
        return False

    def is_finished(self) -> bool:
        return len(self.answers) >= len(self.questions)

    def get_stats(self) -> Dict[str, Any]:
        total = len(self.questions)
        pct = (self.score / total * 100) if total > 0 else 0.0
        return {
            "total": total,
            "correct": self.score,
            "score_percent": round(pct, 1),
            "answered_count": len(self.answers)
        }

    def restart(self) -> None:
        self.current_index = 0
        self.score = 0
        self.answers.clear()
