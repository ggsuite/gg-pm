# lean_publish_process: Leave out publish steps that maintenance can do

## Goal

Publishing a ticket does only what has to happen at that moment: write
the versions of the dependencies the ticket has just published into
`pubspec.yaml` or `package.json`, resolve with `dart pub get` or
`<package manager> install`, analyze, merge, upload and tag. Two things
leave the publish: upgrading all the other dependencies — major versions
above all — and running the tests once more. A nightly build over the
ocean takes the upgrades instead, so packages and apps stay on current
versions without every ticket paying for it.

It is for developers who publish tickets with many repos, and it serves
the goal [publish a ticket in minutes](../goals/publish-a-ticket-in-minutes.md).
The ticket is planned only. It is implemented after the ticket
`speed_up_gg` is merged, because both change the same function.

## Requirements

- [req-publish-own, get, chk](../requirements/publish.md): a publish
  changes only the dependencies of the ticket, resolves instead of
  upgrading, and does not repeat the tests
- [req-maintain-maj, ngt](../requirements/maintain.md): major versions
  are raised by maintenance only, and a nightly build keeps the ocean
  current

Decisions the plan rests on:
[publish-001](../concepts/decisions/publish-001.md) and
[maintain-001](../concepts/decisions/maintain-001.md).

## Findings

What `gg do publish` does today for every repo of the ticket, in this
order (`_publishRepo` in
`gg_multi_do_publish/lib/src/commands/do/publish.dart`), and what the
ticket changes:

| Step today                                                                                                                                                              | After the ticket                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Switch the refs to published versions and set the versions of the siblings published in this run; the operator stays, `^1.2.3` becomes `^<new>` (`_changeRefsToPubDev`) | Stays: the one manifest change a publish needs                      |
| Upgrade all dependencies: `dart pub upgrade --major-versions --tighten`, `pnpm update --latest` (`DoUpgradeDeps`; major versions are on by default)                     | Gone; the nightly build does it                                     |
| Refresh the dependencies with `dart pub upgrade` or `<pm> install`, twice per repo (`_refreshDependencies`)                                                             | `dart pub get` or `<pm> install`                                    |
| Run `can commit` again — analyze, format, tests — because the manifest changed and the hash of the checked tree no longer fits                                          | `dart analyze` only; the hash of the checks is written all the same |
| System commit »changed references to pub.dev«, `can publish` with pana, push                                                                                            | Stays                                                               |
| Merge the pull request and wait, upload, wait for the registry, tag, switch the workspace back to local refs                                                            | Stays                                                               |

Also found:

- `gg do push` upgrades the dependencies too; only the checks of the
  publish switch that off
- Whether major versions are crossed is the setting
  `do.upgrade.deps.majorVersions` of `.gg/gg_rc`; it defaults to true
- The quick check on GitHub runs no tests: it only checks that the commit
  was made with gg, by the hash `can commit` writes. A publish that
  leaves `can commit` out has to write that hash for the commit it makes
- `gg do maintain` exists (`gg_multi_maintain`): per repo a fresh clone,
  a branch `maintain_<id>`, the tasks `--upgrade-sdk`, `--upgrade-deps
  [--major]`, `--upgrade-dna`, then `gg one do commit` and
  `gg one do publish`, in dependency order. Major versions need `--major`
- Nothing runs on a schedule: the only workflow is `quick_check.yaml` on
  push and pull request. A nightly build does not exist

## Affected repos

- `gg_multi_do_publish`: `_publishRepo` no longer upgrades and no longer
  runs `can commit`; it resolves, analyzes and writes the hash of the
  checks; `_refreshDependencies` uses get or install
- `gg_one_do_publish`: `gg one do publish` does not upgrade by default
  either; today it only skips the upgrade with `--no-upgrade`
- `gg_one_commit`: the upgrade crosses major versions only when asked;
  the default of `do.upgrade.deps.majorVersions` becomes false
- `gg_multi_commit`: `gg do push` no longer upgrades anything
- `gg_one_core`: a way to record the checks as passed for the commit of
  the publish after get and analyze, without the tests
- `gg_localize_refs`: tells which manifest lines it changed, so a test
  can prove that nothing else did
- `gg_multi_maintain`: the nightly build — every organization of the
  ocean, dependencies with major versions, no prompt, no review, publish
  on its own, stop at the repo a major version breaks and tell the
  developer
- `gg` and `dna_gg`: the development guide says what a publish does and
  what the nightly build does; a guide for setting up the computer of
  the nightly build

## Steps

1. Measure one publish of a real ticket per step with the process trace:
   what the upgrade, the repeated `can commit` and the refresh cost
2. Publish without upgrade: take `DoUpgradeDeps` out of `_publishRepo`
   and let `_refreshDependencies` run `dart pub get` or `<pm> install`
3. Prove that a publish changes only the dependencies of the ticket: a
   test compares the manifest before and after
4. Replace `can commit` in the publish by `dart pub get` and
   `dart analyze`, and write the hash of the checks for the commit of
   the publish, so the quick check on GitHub passes
5. Take upgrades out of commit, push and publish: the default for major
   versions becomes false, and `gg do push` no longer upgrades anything
6. Build the nightly build on `gg do maintain`: all repos in dependency
   order, major versions included, publish without review; when a major
   version breaks a repo, stop and tell the developer which repo and why
7. Set up the computer of the nightly build and write the guide for it:
   gg, the credentials, the schedule
8. Write the guides: what a publish does, what the nightly build does,
   how to read its report
9. Measure again and compare with step 1

## Open questions

- Which credentials does the computer of the nightly build hold for
  GitHub, pub.dev and npm, and who looks after it?
- How is the developer told that a major version broke a repo: a mail, an
  issue, a ticket?
- What replaces `dart analyze` in a TypeScript repo? Proposal: the lint
  of the repo, `tsc --noEmit` and eslint
- Which version does an upgrade-only release get? `gg do maintain` has
  `--version-increment`; proposal: patch
