# dna_check_only: Check the DNA in every repo, update it only at night

## Goal

Noted on 2026-11-15, not planned in detail yet.

Every repo checks that the files its DNA generated are unchanged, and
nothing more: the check writes no DNA and commits nothing. New DNA arrives
through a nightly maintenance run over the whole ocean — the repos of
ggsuite and all others. A change to a skill of a ggsuite repo is made in
`dna_gg`, where the skills come from. And the DNA of a repo comes from one
ecosystem: pub or npm, not both.

Today the DNA test of a repo (`test/dna/dna_test.dart`, helix's
`runDnaTest`) does more than check: it copies locally changed instances
away and writes the DNA content back, and it writes DNA updates and
commits them as `#gg: generated DNA` — in the middle of a ticket, during
`gg can commit`. That is hidden work the ticket did not ask for.

It serves the goal
[publish a ticket in minutes](../goals/publish-a-ticket-in-minutes.md).

## Requirements

- [req-dna-chk](../requirements/dna.md): a check proves that the generated
  DNA files are unchanged, and changes nothing
- [req-dna-src](../requirements/dna.md): changes to skills go into
  `dna_gg`
- [req-dna-eco](../requirements/dna.md): the DNA of a repo comes from one
  ecosystem
- [req-maintain-dna](../requirements/maintain.md): a nightly maintenance
  run keeps the DNA of every repo current

## Affected repos

- `helix`: a check mode for the DNA test — compare the generated files
  with what the DNA generates, report the differences, write nothing
- The DNA layers (`dna_gg`, `dna_ggsuite`, the layers of the other
  organizations): install the check-only test in every repo
- `gg_multi_maintain`: the nightly run upgrades the DNA as well
  (`--upgrade-dna`), for every organization of the ocean
- `dna_gg`: the development guide says that a skill is changed in
  `dna_gg`, not in the repo
- The layer that brings `@ggdna/dna-github` into Dart repos: a pub
  counterpart, or a layer list per ecosystem

## Steps

1. Read how `runDnaTest` decides what to write, and where the check-only
   variant fits
2. Add the check-only mode to helix and test it: a changed generated file
   fails the check, nothing is written, nothing is committed
3. Place the check-only test in every repo through the DNA layers
4. Let the nightly run of `gg do maintain` upgrade the DNA of every
   organization of the ocean
5. Write the rule for skills into the development guide of `dna_gg`
6. Give every repo layers of its own ecosystem only, and let the check
   fail on a mix
7. Roll it out: one nightly run updates the DNA everywhere

## Open questions

- Does the check live in helix (a mode of `runDnaTest`) or in a script of
  its own that the DNA installs?
- What does a failed check tell the developer: the changed files, and
  that the change belongs into the DNA layer?
- Does `--nightly` take `--upgrade-dna` along, or does the nightly
  schedule run both flags?
- How are repos of other organizations reached whose DNA layers are not
  `dna_gg`?
- Which layer brings `@ggdna/dna-github` (npm) into the Dart repos, and is
  there a pub package for it?
- The Dart repos also list ordinary packages such as `gg_log` and
  `gg_args` as DNA layers in `dna/_generated.json` — intended?
