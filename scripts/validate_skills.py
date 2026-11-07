#!/usr/bin/env python3
"""Validate project Agent Skills metadata without third-party dependencies."""

from __future__ import annotations

import re
import sys
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SCALAR_KEYS = {"name", "description", "license", "compatibility"}


def parse_frontmatter(path: Path) -> dict[str, str]:
    """Read the scalar metadata fields used by this repository's skills."""
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError("missing opening YAML frontmatter delimiter")
    try:
        end = lines.index("---", 1)
    except ValueError as exc:
        raise ValueError("missing closing YAML frontmatter delimiter") from exc

    fields: dict[str, str] = {}
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"invalid metadata line: {line}")
        key, value = line.split(":", 1)
        key = key.strip()
        if key in fields:
            raise ValueError(f"duplicate metadata key: {key}")
        if key in SCALAR_KEYS:
            fields[key] = value.strip().strip('"').strip("'")
    return fields


def validate_skill(folder: Path) -> list[str]:
    issues: list[str] = []
    skill_file = folder / "SKILL.md"
    if not skill_file.is_file():
        return ["SKILL.md is missing"]

    try:
        data = parse_frontmatter(skill_file)
    except (OSError, UnicodeError, ValueError) as exc:
        return [str(exc)]

    name = data.get("name", "")
    description = data.get("description", "")
    if not name:
        issues.append("name is required")
    elif len(name) > 64 or not NAME_RE.fullmatch(name):
        issues.append("name must be 1-64 lowercase letters/digits separated by single hyphens")
    elif name != folder.name:
        issues.append("name must match its skill folder")

    if not description:
        issues.append("description is required")
    elif len(description) > 1024:
        issues.append("description must be 1-1024 characters")

    compatibility = data.get("compatibility", "")
    if compatibility and len(compatibility) > 500:
        issues.append("compatibility must be <=500 characters")

    return issues


def validate_root(root: Path) -> tuple[list[str], int]:
    if not root.is_dir():
        return [f"{root}: directory not found"], 0
    folders = sorted(path for path in root.iterdir() if path.is_dir())
    if not folders:
        return [f"{root}: no skill directories found"], 0

    failures: list[str] = []
    for folder in folders:
        failures.extend(f"{folder / 'SKILL.md'}: {issue}" for issue in validate_skill(folder))
    return failures, len(folders)


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv
    root = Path(args[1]) if len(args) > 1 else Path(".agents/skills")
    failures, count = validate_root(root)
    for failure in failures:
        print(failure)
    print(f"Validated {count} skill(s); {len(failures)} issue(s).")
    return int(bool(failures))


if __name__ == "__main__":
    raise SystemExit(main())
