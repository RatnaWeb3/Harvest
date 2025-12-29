# Run Prompt

Execute a prompt from the `prompts/` directory.

**Usage:**
- `/run-prompt 1` - Execute prompt 1
- `/run-prompt 1-3` - Execute prompts 1, 2, and 3

**Process:**
1. Read the specified prompt file(s) from `prompts/`
2. Activate the skill specified in the prompt
3. **Check relevant learnings in `docs/issues/`** based on task type:
   - Move/contracts → `docs/issues/move/README.md`
   - UI/frontend → `docs/issues/ui/README.md`
   - Indexer → `docs/issues/indexer/README.md`
   - Movement network → `docs/issues/movement/README.md`
4. Execute ALL requirements in the prompt
5. Verify using the verification steps
6. Delete the prompt file after successful completion
7. Report what was accomplished
8. List remaining prompts

**Example:**
```
/run-prompt 2
```

This will:
1. Read `prompts/2.md`
2. Execute all tasks in the prompt
3. Delete `prompts/2.md` when done
4. Show remaining prompts
