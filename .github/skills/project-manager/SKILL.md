---
name: project-manager
description: '**WORKFLOW SKILL** — Scaffold project structure with folders, files, and TODO-driven comments. USE FOR: reviewing existing code and adding TODOs; creating new file stubs with instructions/comments only; planning folder structures and subfolders; suggesting better approaches via inline TODOs; generating implementation roadmaps as comment blocks; bootstrapping new modules with TODO placeholders. DO NOT USE FOR: writing implementation code; fixing bugs; running tests; refactoring logic. NEVER writes executable code — only comments, TODOs, and structural placeholders.'
argument-hint: 'What part of the project should be scaffolded or reviewed?'
---

# Project Manager

A read-review-scaffold workflow that creates project structure and TODO-driven guidance **without writing any implementation code**.

## When to Use

- Bootstrapping a new feature area (create folders + stub files with TODOs)
- Reviewing existing files to identify gaps, improvements, or missing pieces
- Planning implementation order via TODO comments
- Creating file templates with instructions for developers
- Suggesting architectural improvements as inline TODOs

## Core Rules

1. **NEVER write executable code** — no functions, no classes, no logic, no imports
2. **ONLY write comments and TODOs** — every line in created files must be a comment
3. **Create real files and folders** — use the file system, don't just describe what to create
4. **Review before creating** — always read existing files first to understand context
5. **Be specific in TODOs** — include what, why, and reference related files

## Comment Format

Use the language-appropriate comment syntax:

```
// TypeScript/JavaScript files (.ts, .tsx, .js)
# Python files (.py)
<!-- Markdown instruction blocks -->
/* CSS/JSON description blocks */
```

## TODO Priority Levels

Use these prefixes consistently:

```
// TODO: Standard task — implement this feature
// TODO(HIGH): Critical — must be done before other tasks depend on it
// TODO(LOW): Nice-to-have — improvement or optimization
// TODO(REVIEW): Needs discussion — multiple approaches possible
// TODO(NEW-FILE): Suggests creating an additional file
// TODO(REFACTOR): Existing code needs restructuring
// TODO(APPROACH): Documents the recommended implementation strategy
```

## Procedure

### Step 1 — Understand Scope

Read the user's request and determine:
- **Scaffold mode**: Creating new folders/files from scratch
- **Review mode**: Analyzing existing files and adding TODOs
- **Hybrid mode**: Both reviewing existing + creating new stubs

### Step 2 — Explore Existing Structure

Before creating anything:
1. List the project directory to understand current layout
2. Read relevant existing files (configs, types, related modules)
3. Check documentation files for specifications (if available)
4. Identify what exists vs what's missing

### Step 3 — Plan the Structure

Create a TODO list of all files/folders to create or review:
- Group by directory
- Order by dependency (foundational files first)
- Note which existing files need TODO annotations

### Step 4 — Create/Review Files

For **new files** — create with comments only:
```typescript
// =============================================================================
// FILE: ComponentName.tsx
// PURPOSE: [What this file should do]
// LOCATION: src/components/feature/ComponentName.tsx
// =============================================================================

// TODO(APPROACH): [Recommended implementation strategy]
// - [Key consideration 1]
// - [Key consideration 2]

// TODO(HIGH): Import dependencies
// - React, React Native core components
// - Types from src/types/[relevant].types.ts
// - Hooks from src/hooks/[relevant].ts

// TODO: Define Props interface
// - [prop1]: [type] — [description]
// - [prop2]: [type] — [description]

// TODO: Implement main component
// - [Step 1 of implementation]
// - [Step 2 of implementation]
// - [Step 3 of implementation]

// TODO(LOW): Add animations
// - Use React Native Reanimated
// - [Describe the animation]

// TODO: Export component
```

For **existing files** — add TODO comments at relevant locations:
```typescript
// TODO(REFACTOR): This function should be split into smaller helpers
// TODO(NEW-FILE): Extract this logic into src/utils/[name].ts
// TODO(REVIEW): Consider using [alternative approach] because [reason]
```

### Step 5 — Create Summary File

After scaffolding, create a `_TODOS.md` file in the target directory:
```markdown
# TODOs — [Feature/Area Name]

## Files Created
- [ ] `path/to/file1.ts` — [purpose]
- [ ] `path/to/file2.ts` — [purpose]

## Files Reviewed
- [ ] `path/to/existing.ts` — [TODOs added]

## Implementation Order
1. Start with [file] because [reason]
2. Then [file] because [depends on step 1]
3. Finally [file] because [depends on steps 1-2]

## New Files Suggested
- [ ] `path/to/suggested.ts` — [why it's needed]

## Better Approaches Identified
- [Current approach] → [Suggested improvement] — [why]
```

### Step 6 — Report

Summarize what was done:
- How many files created vs reviewed
- Key TODOs by priority
- Suggested implementation order
- Any architectural concerns raised

## Quality Checks

Before finishing, verify:
- [ ] No executable code was written (only comments/TODOs)
- [ ] Every created file has a header block (FILE, PURPOSE, LOCATION)
- [ ] TODOs reference specific files/types where relevant
- [ ] A `_TODOS.md` summary exists in the target directory
- [ ] Implementation order accounts for dependencies
