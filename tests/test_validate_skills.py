import tempfile
import unittest
from pathlib import Path

from scripts.validate_skills import parse_frontmatter, validate_root, validate_skill


class SkillValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def write_skill(self, folder="demo-skill", metadata=None, body="# Demo\n"):
        path = self.root / folder
        path.mkdir()
        meta = metadata or 'name: demo-skill\ndescription: "A useful project skill."'
        (path / "SKILL.md").write_text(f"---\n{meta}\n---\n\n{body}", encoding="utf-8")
        return path

    def test_valid_skill(self):
        self.assertEqual(validate_skill(self.write_skill()), [])

    def test_name_must_match_folder(self):
        path = self.write_skill("different")
        self.assertIn("name must match its skill folder", validate_skill(path))

    def test_missing_description(self):
        path = self.write_skill(metadata="name: demo-skill")
        self.assertIn("description is required", validate_skill(path))

    def test_invalid_uppercase_name(self):
        path = self.write_skill(metadata='name: Demo-Skill\ndescription: "A skill."')
        self.assertTrue(any("name must be" in issue for issue in validate_skill(path)))

    def test_consecutive_hyphens_are_rejected(self):
        path = self.write_skill("demo--skill", 'name: demo--skill\ndescription: "A skill."')
        self.assertTrue(any("name must be" in issue for issue in validate_skill(path)))

    def test_name_length_is_limited(self):
        name = "a" * 65
        path = self.write_skill(name, f'name: {name}\ndescription: "A skill."')
        self.assertTrue(any("name must be" in issue for issue in validate_skill(path)))

    def test_description_length_is_limited(self):
        path = self.write_skill(metadata='name: demo-skill\ndescription: "' + ("x" * 1025) + '"')
        self.assertTrue(any("description must be" in issue for issue in validate_skill(path)))

    def test_compatibility_length_is_limited(self):
        path = self.write_skill(metadata='name: demo-skill\ndescription: "A skill."\ncompatibility: "' + ("x" * 501) + '"')
        self.assertTrue(any("compatibility must be" in issue for issue in validate_skill(path)))

    def test_duplicate_metadata_key_is_rejected(self):
        path = self.write_skill(metadata='name: demo-skill\nname: other\ndescription: "A skill."')
        self.assertTrue(any("duplicate metadata key" in issue for issue in validate_skill(path)))

    def test_missing_frontmatter_is_rejected(self):
        path = self.root / "missing-frontmatter"
        path.mkdir()
        (path / "SKILL.md").write_text("# No metadata", encoding="utf-8")
        self.assertTrue(validate_skill(path))

    def test_missing_skill_file_is_rejected(self):
        path = self.root / "missing-file"
        path.mkdir()
        self.assertIn("SKILL.md is missing", validate_skill(path))

    def test_root_validation_counts_all_skills(self):
        self.write_skill()
        self.write_skill("second-skill", 'name: second-skill\ndescription: "Another skill."')
        failures, count = validate_root(self.root)
        self.assertEqual(count, 2)
        self.assertEqual(failures, [])

    def test_empty_root_is_rejected(self):
        failures, count = validate_root(self.root)
        self.assertEqual(count, 0)
        self.assertTrue(failures)


if __name__ == "__main__":
    unittest.main()
