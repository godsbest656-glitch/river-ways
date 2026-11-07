import tempfile
import unittest
from pathlib import Path

from scripts.validate_codex_agents import validate_agent, validate_root


class CodexAgentValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def write_agent(self, filename="demo-agent.toml", name="demo-agent"):
        path = self.root / filename
        path.write_text(
            'name = "' + name + '"\n'
            'description = "A focused test agent."\n'
            'developer_instructions = """\nFollow the task and report evidence.\n"""\n',
            encoding="utf-8",
        )
        return path

    def test_valid_agent(self):
        self.assertEqual(validate_agent(self.write_agent()), [])

    def test_name_must_match_filename(self):
        path = self.write_agent(filename="different.toml")
        self.assertIn("name must match the TOML filename", validate_agent(path))

    def test_invalid_name_is_rejected(self):
        path = self.write_agent(name="Demo Agent")
        self.assertTrue(any("name must be" in issue for issue in validate_agent(path)))

    def test_missing_required_field_is_rejected(self):
        path = self.root / "missing.toml"
        path.write_text('name = "missing"\ndescription = "Only two fields."\n', encoding="utf-8")
        self.assertTrue(any("developer_instructions must" in issue for issue in validate_agent(path)))

    def test_empty_developer_instructions_are_rejected(self):
        path = self.root / "empty-instructions.toml"
        path.write_text(
            'name = "empty-instructions"\n'
            'description = "A test agent."\n'
            'developer_instructions = "   "\n',
            encoding="utf-8",
        )
        self.assertTrue(any("developer_instructions must contain" in issue for issue in validate_agent(path)))

    def test_overlong_description_is_rejected(self):
        path = self.write_agent()
        text = path.read_text(encoding="utf-8").replace(
            "A focused test agent.", "x" * 1025
        )
        path.write_text(text, encoding="utf-8")
        self.assertTrue(any("description must be <=1024" in issue for issue in validate_agent(path)))

    def test_invalid_toml_is_rejected(self):
        path = self.root / "broken.toml"
        path.write_text('name = "broken"\ndescription = [', encoding="utf-8")
        self.assertTrue(any("invalid TOML" in issue for issue in validate_agent(path)))

    def test_duplicate_agent_names_are_rejected(self):
        self.write_agent()
        self.write_agent(filename="second.toml")
        failures, count = validate_root(self.root)
        self.assertEqual(count, 2)
        self.assertTrue(any("duplicate agent name" in issue for issue in failures))

    def test_empty_root_is_rejected(self):
        failures, count = validate_root(self.root)
        self.assertEqual(count, 0)
        self.assertTrue(failures)

    def test_nonexistent_root_is_rejected(self):
        failures, count = validate_root(self.root / "missing")
        self.assertEqual(count, 0)
        self.assertTrue(failures)


if __name__ == "__main__":
    unittest.main()
