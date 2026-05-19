# GitHub Copilot Workspace Instructions

## MANDATORY: Read PROJECT.md before every response

At the start of **every** prompt in this workspace, you MUST:

1. Read the file `PROJECT.md` in the root of this workspace using the `read_file` tool.
2. Use the information in `PROJECT.md` as the source of truth for the current state of the project — architecture, tech stack, completed features, pending work, and change log.

## MANDATORY: Update PROJECT.md after every response

At the end of **every** prompt in this workspace, you MUST:

1. Update the `## 14. Change Log` table in `PROJECT.md` with a new row describing what changed in this prompt (prompt number, brief description of changes).
2. If any section of `PROJECT.md` is now outdated due to changes made in this prompt (new files added, features completed, things moved), update those sections too.
3. Update the `> Last updated:` line at the top of `PROJECT.md` to reflect the current prompt number and a one-line summary.

## Why this matters

`PROJECT.md` is the persistent memory of this project. It survives across all chat sessions. Without reading and updating it, context is lost and work may be duplicated or contradicted.

## Project file location

```
PROJECT.md  (workspace root: my-icon-shop/PROJECT.md)
```
