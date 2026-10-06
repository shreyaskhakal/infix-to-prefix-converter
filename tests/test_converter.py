"""
Comprehensive Unit Tests for Infix-to-Prefix Conversion and Stack DSA.
"""

import unittest
from stack import Stack
from converter import InfixToPrefixConverter
from validator import ExpressionValidator


class TestStackDataStructure(unittest.TestCase):
    """Verify that the custom Stack conforms strictly to LIFO semantics."""

    def setUp(self):
        self.stack = Stack()

    def test_empty_stack(self):
        self.assertTrue(self.stack.is_empty())
        self.assertEqual(self.stack.size(), 0)
        self.assertEqual(len(self.stack), 0)
        self.assertFalse(bool(self.stack))
        with self.assertRaises(IndexError):
            self.stack.pop()
        with self.assertRaises(IndexError):
            self.stack.peek()

    def test_push_and_peek(self):
        self.stack.push("A")
        self.assertFalse(self.stack.is_empty())
        self.assertEqual(self.stack.size(), 1)
        self.assertEqual(self.stack.peek(), "A")

        self.stack.push("+")
        self.assertEqual(self.stack.size(), 2)
        self.assertEqual(self.stack.peek(), "+")

    def test_lifo_order(self):
        items = ["first", "second", "third", "fourth"]
        for it in items:
            self.stack.push(it)

        self.assertEqual(self.stack.size(), 4)
        self.assertEqual(self.stack.pop(), "fourth")
        self.assertEqual(self.stack.pop(), "third")
        self.assertEqual(self.stack.pop(), "second")
        self.assertEqual(self.stack.pop(), "first")
        self.assertTrue(self.stack.is_empty())

    def test_clear_and_display(self):
        self.stack.push("X")
        self.stack.push("Y")
        self.assertIn("X", self.stack.display())
        self.stack.clear()
        self.assertTrue(self.stack.is_empty())
        self.assertEqual(self.stack.display(), "Stack: [EMPTY]")


class TestExpressionValidator(unittest.TestCase):
    """Test validation and educational error message handling."""

    def test_valid_expressions(self):
        valid_cases = [
            "A+B",
            "(A+B)*C",
            "A*(B+C)",
            "(A-B)/(C+D)",
            "A+B*(C^D-E)^(F+G*H)-I",
            "A^B^C",
            "total + price * 2",
            "((A+B))",
            "x",
            "123",
        ]
        for expr in valid_cases:
            valid, msg, _ = ExpressionValidator.validate(expr)
            self.assertTrue(valid, f"Expression '{expr}' should be valid, got: {msg}")

    def test_invalid_expressions(self):
        invalid_cases = [
            ("", "empty"),
            ("   ", "empty"),
            ("A++B", "consecutive operators"),
            ("A*/B", "consecutive operators"),
            ("+A", "start with an operator"),
            ("A+", "end with an operator"),
            ("(A+B", "Mismatched opening"),
            ("A+B)", "Mismatched closing"),
            ("A+()+B", "empty parentheses"),
            ("A $ B", "Invalid character"),
            ("A B", "consecutive operands"),
        ]
        for expr, expected_error in invalid_cases:
            valid, msg, pos = ExpressionValidator.validate(expr)
            self.assertFalse(valid, f"Expression '{expr}' should be INVALID")
            self.assertIn(expected_error.lower(), msg.lower())


class TestInfixToPrefixConverter(unittest.TestCase):
    """Verify correct prefix conversion and intermediate postfix computation."""

    def test_basic_addition(self):
        res = InfixToPrefixConverter.convert("A+B")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "+AB")
        self.assertEqual(res.postfix_expression, "BA+")

    def test_parentheses_multiplication(self):
        # (A+B)*C -> *+ABC
        res = InfixToPrefixConverter.convert("(A+B)*C")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "*+ABC")
        self.assertEqual(res.postfix_expression, "CBA+*")

    def test_precedence_no_parentheses(self):
        # A+B*C -> +A*BC
        res = InfixToPrefixConverter.convert("A+B*C")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "+A*BC")

    def test_parentheses_override(self):
        # A*(B+C) -> *A+BC
        res = InfixToPrefixConverter.convert("A*(B+C)")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "*A+BC")

    def test_fraction_groups(self):
        # (A-B)/(C+D) -> /-AB+CD
        res = InfixToPrefixConverter.convert("(A-B)/(C+D)")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "/-AB+CD")

    def test_right_associativity_power(self):
        # A^B^C -> ^A^BC (since A^(B^C))
        res = InfixToPrefixConverter.convert("A^B^C")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "^A^BC")

    def test_complex_teacher_demo_expression(self):
        # A+B*(C^D-E)^(F+G*H)-I
        expr = "A+B*(C^D-E)^(F+G*H)-I"
        res = InfixToPrefixConverter.convert(expr)
        self.assertTrue(res.is_valid)
        # Verify result is non-empty and has proper step records
        self.assertGreater(len(res.postfix_steps), 10)
        self.assertGreater(len(res.prefix_expression), 0)

    def test_multi_character_identifiers(self):
        res = InfixToPrefixConverter.convert("total + price * 2")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "+ total * price 2")

    def test_spaces_handling(self):
        res = InfixToPrefixConverter.convert(" A + B * C ")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.prefix_expression, "+A*BC")

    def test_step_records_not_empty(self):
        res = InfixToPrefixConverter.convert("A+B*C")
        self.assertTrue(res.is_valid)
        self.assertGreater(len(res.all_steps), 0)
        # Check that reasons exist for every step
        for st in res.all_steps:
            self.assertTrue(len(st.reason) > 0)
            self.assertTrue(len(st.action) > 0)

    def test_stack_activity_tracked(self):
        res = InfixToPrefixConverter.convert("(A+B)*C")
        self.assertTrue(res.is_valid)
        # '*' should be pushed
        self.assertIn("*", res.stack_activity)
        self.assertGreater(res.stack_activity["*"]["push"], 0)
        # Check overall stats
        self.assertIn("pushes", res.stack_stats)
        self.assertIn("max_size", res.stack_stats)
        self.assertGreaterEqual(res.stack_stats["max_size"], 1)


class TestAlgorithmEventSystem(unittest.TestCase):
    """Verify Section 30: Event-Driven Algorithm System Integrity."""

    def test_sequential_step_numbers(self):
        res = InfixToPrefixConverter.convert("(A+B)*C")
        self.assertTrue(res.is_valid)
        steps = res.all_steps
        self.assertGreater(len(steps), 0)
        for i, step in enumerate(steps):
            self.assertEqual(step.step_number, i + 1, f"Step index {i} does not match {step.step_number}")

    def test_event_types_occurrences(self):
        res = InfixToPrefixConverter.convert("(A+B)*C")
        self.assertTrue(res.is_valid)
        op_types = [s.operation_type for s in res.all_steps]
        self.assertIn("PUSH", op_types)
        self.assertIn("POP", op_types)
        self.assertIn("OUTPUT", op_types)
        self.assertIn("MATCH", op_types)
        self.assertIn("FINAL_POP", op_types)

    def test_snapshots_immutability(self):
        res = InfixToPrefixConverter.convert("A+B*C")
        self.assertTrue(res.is_valid)
        for step in res.all_steps:
            self.assertIsInstance(step.stack_state, list)
            self.assertIsInstance(step.output_state, list)
            self.assertIsInstance(step.reason, str)
            self.assertGreater(len(step.reason), 10)

    def test_final_cleanup_pops(self):
        res = InfixToPrefixConverter.convert("A+B+C")
        self.assertTrue(res.is_valid)
        # At least one final cleanup event
        cleanup_steps = [s for s in res.all_steps if s.operation_type == "FINAL_POP"]
        self.assertGreaterEqual(len(cleanup_steps), 1)


if __name__ == "__main__":
    unittest.main()

