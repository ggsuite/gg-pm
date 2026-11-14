# Maintenance

## req-maintain-maj: Major versions are raised by maintenance only

- Status: accepted
- Priority: must
- Statement: Major versions of dependencies are raised by maintenance only, never by commit, push or publish
- Why: [publish a ticket in minutes](../goals/publish-a-ticket-in-minutes.md),
  topic `maintain`
- Acceptance: With a new major version of a dependency released, commit,
  push and publish of a ticket leave its constraint untouched;
  `gg do maintain --upgrade-deps --major` raises it
- Note: accepted on 2026-11-14. `gg do push` upgrades nothing at all any
  more, no minor and patch versions either, see
  [maintain-001](../concepts/decisions/maintain-001.md)

## req-maintain-ngt: A nightly build keeps the ocean current

- Status: accepted
- Priority: must
- Statement: A nightly build raises the dependencies of every repo of the ocean, major versions included, and publishes the result on its own, without a review
- Why: [publish a ticket in minutes](../goals/publish-a-ticket-in-minutes.md),
  topic `maintain`
- Acceptance: After a night without failures, no repo of the ocean is
  behind a released version of one of its dependencies, and every raised
  repo is published; when a major version breaks a repo, the build stops
  and tells the developer which repo broke and why
- Note: accepted on 2026-11-14, see
  [maintain-001](../concepts/decisions/maintain-001.md)
