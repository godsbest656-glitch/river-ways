#!/usr/bin/env python3
"""Validate Agent Skills frontmatter and folder/name consistency."""

from __future__ import annotations
import re
import sys
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def parse_frontmatter(path: Path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError("missing opening YAML frontmatter delimiter")
    try:
        end = lines.index("---", 1)
    except ValueError as exc:
        raise ValueError("missing closing YAML frontmatter delimiter") from exc
    fields = {}
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"invalid metadata line: {line}")
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip().strip('"').strip("'")
    return fields


def validate_skill(folder: Path):
    issues = []
    skill_file = folder / "SKILL.md"
    if not skill_file.is_file():
        return ["SKILL.md is missing"]
    try:
        data = parse_frontmatter(skill_file)
    except ValueError as exc:
        return [str(exc)]
    name = data.get("name", "")
    description = data.get("description", "")
    if not name:
        issues.append("name is required")
    elif len(name) > 64 or not NAME_RE.fullmatch(name):
        issues.append("name must be <=64 chars, lowercase letters/digits/single hyphens")
    elif name != folder.name:
        issues.append("name must match its skill folder")
    if not description:
        issues.append("description is required")
    elif len(description) > 1024:
        issues.append("description must be <=1024 characters")
    compatibility = data.get("compatibility", "")
    if compatibility and len(compatibility) > 500:
        issues.append("compatibility must be <=500 characters")
    return issues


def main(argv=None):
    argv = argv or sys.argv
    root = Path(argv[1]) if len(argv) > 1 else Path(".agents/skills")
    if not root.is_dir():
        print(f"{root}: directory not found")
        return 1
    folders = sorted(path for path in root.iterdir() if path.is_dir())
    if not folders:
        print(f"{root}: no skill directories found")
        return 1
    failed = 0
    for folder in folders:
        issues = validate_skill(folder)
        for issue in issues:
            print(f"{folder / 'SKILL.md'}: {issue}")
        failed += bool(issues)
    print(f"Validated {len(folders)} skill(s); {failed} invalid.")
    return int(bool(failed))


if __name__ == "__main__":
    raise SystemExit(main())
