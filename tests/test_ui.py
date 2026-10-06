"""
GUI Functional and Integration Tests for Interactive Infix-to-Prefix DSA Lab.
"""

import unittest
from main import InfixToPrefixApp


class TestGUIIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = InfixToPrefixApp()

    @classmethod
    def tearDownClass(cls):
        cls.app.destroy()

    def test_screen_navigation(self):
        screens = ["home", "converter", "whatif", "challenge", "viva", "about", "presentation"]
        for scr in screens:
            self.app.show_screen(scr)
            self.assertEqual(self.app.current_screen_name, scr)

    def test_converter_flow_and_time_machine(self):
        self.app.show_screen("converter")
        self.app.entry_expr.delete(0, "end")
        self.app.entry_expr.insert(0, "(A+B)*C")
        self.app.run_conversion()

        self.assertIsNotNone(self.app.conversion_result)
        self.assertEqual(self.app.conversion_result.prefix_expression, "*+ABC")

        # Test Stepping Forward and Backward
        initial_step = self.app.current_step_index
        self.app.step_next()
        self.assertEqual(self.app.current_step_index, initial_step + 1)
        self.app.step_prev()
        self.assertEqual(self.app.current_step_index, initial_step)

        # Test Jump
        self.app.step_last()
        self.assertEqual(
            self.app.current_step_index,
            len(self.app.conversion_result.all_steps) - 1
        )
        self.app.step_first()
        self.assertEqual(self.app.current_step_index, 0)

    def test_whatif_comparison(self):
        self.app.show_screen("whatif")
        self.app.entry_whatif_a.delete(0, "end")
        self.app.entry_whatif_a.insert(0, "A+B*C")
        self.app.entry_whatif_b.delete(0, "end")
        self.app.entry_whatif_b.insert(0, "(A+B)*C")
        self.app.run_whatif_comparison()

        self.assertIn("+A*BC", self.app.lbl_wa_prefix.cget("text"))
        self.assertIn("*+ABC", self.app.lbl_wb_prefix.cget("text"))
        self.assertTrue(len(self.app.lbl_whatif_reason.cget("text")) > 20)

    def test_challenge_quiz(self):
        self.app.show_screen("challenge")
        # Submit an answer to question 1
        curr_q = self.app.challenge_engine.current_question()
        correct_idx = curr_q.correct_index
        self.app._on_select_option(correct_idx)
        stats = self.app.challenge_engine.get_stats()
        self.assertEqual(stats["correct"], 1)

    def test_viva_flashcard(self):
        self.app.show_screen("viva")
        self.app._load_next_flashcard()
        self.assertIsNotNone(self.app.current_flashcard)
        self.app._reveal_flashcard()
        self.assertIn("ANSWER:", self.app.lbl_fc_ans.cget("text"))

    def test_presentation_mode_toggle(self):
        self.app.toggle_presentation_mode()
        self.assertTrue(self.app.is_presentation_mode)
        self.assertEqual(self.app.current_screen_name, "presentation")
        self.app._pres_load_demo("A^B^C")
        self.assertEqual(self.app.conversion_result.prefix_expression, "^A^BC")
        self.app.toggle_presentation_mode()
    def test_keyboard_navigation(self):
        class DummyEvent:
            def __init__(self, widget):
                self.widget = widget

        self.app.show_screen("converter")
        self.app.load_sample("A+B")
        self.assertEqual(self.app.current_step_index, 0)

        # Trigger right key
        self.app._on_key_right(DummyEvent(self.app))
        self.assertEqual(self.app.current_step_index, 1)

        # Trigger left key
        self.app._on_key_left(DummyEvent(self.app))
        self.assertEqual(self.app.current_step_index, 0)


if __name__ == "__main__":
    unittest.main()
