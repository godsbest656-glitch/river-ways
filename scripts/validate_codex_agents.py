#!/usr/bin/env python3
"""Validate project-scoped Codex custom-agent TOML files."""

from __future__ import annotations

import re
import sys
import tomllib
from pathlib import Path
from typing import Any

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
REQUIRED_FIELDS = ("name", "description", "developer_instructions")


def parse_agent(path: Path) -> dict[str, Any]:
    """Parse one agent TOML document."""
    with path.open("rb") as stream:
        data = tomllib.load(stream)
    if not isinstance(data, dict):
        raise ValueError("TOML root must be a table")
    return data


def validate_agent(path: Path) -> list[str]:
    """Return validation issues for one agent definition."""
    try:
        data = parse_agent(path)
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as exc:
        return [f"invalid TOML: {exc}"]

    issues: list[str] = []
    for field in REQUIRED_FIELDS:
        value = data.get(field)
        if not isinstance(value, str) or not value.strip():
            issues.append(f"{field} must be a non-empty string")

    name = data.get("name")
    if isinstance(name, str) and name.strip():
        if len(name) > 64 or not NAME_RE.fullmatch(name):
            issues.append("name must be 1-64 lowercase letters/digits separated by single hyphens")
        elif name != path.stem:
            issues.append("name must match the TOML filename")

    description = data.get("description")
    if isinstance(description, str) and len(description) > 1024:
        issues.append("description must be <=1024 characters")

    instructions = data.get("developer_instructions")
    if isinstance(instructions, str) and not instructions.strip():
        issues.append("developer_instructions must contain actionable instructions")

    return issues


def validate_root(root: Path) -> tuple[list[str], int]:
    """Validate every TOML agent in a directory and detect duplicate names."""
    if not root.is_dir():
        return [f"{root}: directory not found"], 0

    files = sorted(root.glob("*.toml"))
    if not files:
        return [f"{root}: no agent TOML files found"], 0

    failures: list[str] = []
    seen: set[str] = set()
    for path in files:
        failures.extend(f"{path}: {issue}" for issue in validate_agent(path))
        try:
            name = parse_agent(path).get("name")
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            continue
        if isinstance(name, str):
            if name in seen:
                failures.append(f"{path}: duplicate agent name: {name}")
            seen.add(name)

    return failures, len(files)


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv
    root = Path(args[1]) if len(args) > 1 else Path(".codex/agents")
    failures, count = validate_root(root)
    for failure in failures:
        print(failure)
    print(f"Validated {count} Codex agent(s); {len(failures)} issue(s).")
    return int(bool(failures))


if __name__ == "__main__":
    raise SystemExit(main())
