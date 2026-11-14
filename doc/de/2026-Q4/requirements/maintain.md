# Wartung

## req-maintain-maj: Major-Versionen zieht nur die Wartung hoch

- Status: accepted
- Priority: must
- Statement: Major-Versionen von Abhängigkeiten zieht nur die Wartung hoch, nie Commit, Push oder Publish
- Why: [Ein Ticket in Minuten veröffentlichen](../goals/publish-a-ticket-in-minutes.md),
  Thema `maintain`
- Acceptance: Ist eine neue Major-Version einer Abhängigkeit erschienen,
  lassen Commit, Push und Publish eines Tickets deren Versionsangabe
  unberührt; `gg do maintain --upgrade-deps --major` zieht sie hoch
- Note: akzeptiert am 2026-11-14. `gg do push` zieht gar nichts mehr hoch,
  auch keine Minor- und Patch-Versionen, siehe
  [maintain-001](../concepts/decisions/maintain-001.md)

## req-maintain-ngt: Ein nächtlicher Build hält den Ocean aktuell

- Status: accepted
- Priority: must
- Statement: Ein nächtlicher Build zieht die Abhängigkeiten jedes Repos des Oceans hoch, Major-Versionen eingeschlossen, und veröffentlicht das Ergebnis selbst, ohne Review
- Why: [Ein Ticket in Minuten veröffentlichen](../goals/publish-a-ticket-in-minutes.md),
  Thema `maintain`
- Acceptance: Nach einer Nacht ohne Fehler liegt kein Repo des Oceans
  hinter einer veröffentlichten Version einer seiner Abhängigkeiten, und
  jedes hochgezogene Repo ist veröffentlicht; bricht eine Major-Version
  ein Repo, hält der Build an und sagt dem Entwickler, welches Repo
  gebrochen ist und warum
- Note: akzeptiert am 2026-11-14, siehe
  [maintain-001](../concepts/decisions/maintain-001.md)
