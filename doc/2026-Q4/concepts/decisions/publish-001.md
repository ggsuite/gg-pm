# publish-001: A publish analyzes instead of testing, and still writes the hash of the checks

- Status: accepted
- Date: 2026-11-14
- Canonical source: this file
- Open work: implement it with the ticket `lean_publish_process`, after
  `speed_up_gg` is merged

## Decision

Before a repo is published, gg runs `dart pub get` and `dart analyze`
only; the full `can commit` with its tests is left out. The tests passed
at the commit, and the published versions of the sibling repos are the
very commits that were tested through local refs, so a second run proves
nothing new and costs most of the time of a publish. The quick check on
GitHub does not run tests either: it only checks that the commit was made
with gg, by the hash `can commit` writes. So the publish still has to
write that hash for the commit it makes, or the quick check fails.
