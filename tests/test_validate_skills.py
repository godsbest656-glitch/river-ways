import tempfile
import unittest
from pathlib import Path
from scripts.validate_skills import validate_skill, main


class SkillValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def write_skill(self, folder="demo-skill", metadata=None):
        path = self.root / folder
        path.mkdir()
        meta = metadata or 'name: demo-skill\ndescription: "A useful design skill."'
        (path / "SKILL.md").write_text(f"---\n{meta}\n---\n\n# Skill\n", encoding="utf-8")
        return path

    def test_valid_skill(self):
        self.assertEqual(validate_skill(self.write_skill()), [])

    def test_folder_must_match_name(self):
        path = self.write_skill("different")
        self.assertIn("name must match its skill folder", validate_skill(path))

    def test_missing_description(self):
        path = self.write_skill(metadata="name: demo-skill")
        self.assertIn("description is required", validate_skill(path))

    def test_invalid_name(self):
        path = self.write_skill(metadata='name: Demo_Skill\ndescription: "A skill."')
        self.assertTrue(any("name must be" in item for item in validate_skill(path)))

    def test_missing_frontmatter(self):
        path = self.root / "bad"
        path.mkdir()
        (path / "SKILL.md").write_text("# no metadata", encoding="utf-8")
        self.assertTrue(validate_skill(path))

    def test_main_exit_code(self):
        self.write_skill()
        self.assertEqual(main(["validator", str(self.root)]), 0)


if __name__ == "__main__":
    unittest.main()
