import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync(new URL("../../scripts/windows/inspect-creative-workstation.ps1", import.meta.url), "utf8");

test("workstation inventory is explicitly read-only", () => {
  assert.match(script, /collectionMode = 'read-only'/);
  assert.match(script, /No software was installed, updated, launched or modified/);
  for (const forbidden of [
    /\bStart-Process\b/i,
    /\bInvoke-WebRequest\b/i,
    /\bInvoke-RestMethod\b/i,
    /\bStart-BitsTransfer\b/i,
    /\bInstall-Module\b/i,
    /\bSet-ExecutionPolicy\b/i,
    /\bInvoke-Expression\b/i,
    /\bwinget\s+install\b/i,
    /\bchoco\s+install\b/i,
    /\bRemove-Item\b/i,
    /\bSet-Item\b/i,
    /\bNew-Item\b/i
  ]) assert.doesNotMatch(script, forbidden);
});

test("workstation inventory covers required hardware, Adobe hosts and creative tools", () => {
  for (const expected of [
    "Win32_OperatingSystem", "Win32_Processor", "Win32_VideoController",
    "Win32_LogicalDisk", "Photoshop", "Illustrator", "Premiere Pro",
    "After Effects", "InDesign", "Media Encoder", "UXP Developer Tool",
    "node = Get-CommandVersion", "ffmpeg = Get-CommandVersion",
    "blender = Get-CommandVersion"
  ]) assert.ok(script.includes(expected), "missing inventory field: " + expected);
});

test("workstation inventory does not enumerate environment secrets", () => {
  assert.doesNotMatch(script, /Get-ChildItem\s+Env:/i);
  assert.doesNotMatch(script, /CF_ACCESS_CLIENT_SECRET|API_KEY|PASSWORD|TOKEN/i);
});
