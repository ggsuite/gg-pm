# Publish

What `gg do publish` does for a ticket, and what is known about it. The
evidence behind the requirements of the area
[publish](../../requirements/publish.md).

## What a publish does today

For every repo of the ticket, in this order (`_publishRepo` in
`gg_multi_do_publish/lib/src/commands/do/publish.dart`, read on
2026-11-14):

1. Switch the refs to published versions and set the versions of the
   siblings published in this run; the operator stays, `^1.2.3` becomes
   `^<new>` (`_changeRefsToPubDev`)
2. Upgrade all dependencies: `dart pub upgrade --major-versions
   --tighten`, `pnpm update --latest` (`DoUpgradeDeps`)
3. Refresh the dependencies with `dart pub upgrade` or `<pm> install`,
   twice per repo (`_refreshDependencies`)
4. Run `can commit` again — analyze, format, tests — because the manifest
   changed and the hash of the checked tree no longer fits
5. System commit »changed references to pub.dev«, `can publish` with
   pana, push
6. Merge the pull request and wait, upload, wait for the registry, tag,
   switch the workspace back to local refs

## What holds

- Only step 1 changes what the ticket itself published; steps 2 and 3
  touch every dependency of the repo
- The tests of step 4 passed at the commit already. The published
  versions of the sibling repos are the commits that were tested through
  local refs
- The quick check on GitHub runs no tests: it only checks that the commit
  was made with gg, by the hash `can commit` writes. A publish that
  leaves `can commit` out has to write that hash for the commit it makes
- `gg do push` upgrades the dependencies too; only the checks of the
  publish switch that off
- Whether major versions are crossed is the setting
  `do.upgrade.deps.majorVersions` of `.gg/gg_rc`; it defaults to true

## Not known yet

- What each step costs. No publish was measured step by step; the ticket
  `lean_publish_process` starts with that measurement
