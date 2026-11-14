# maintain-001: Der nächtliche Build veröffentlicht selbst, auf einem eigenen Rechner

- Status: accepted
- Date: 2026-11-14
- Canonical source: diese Datei
- Open work: mit dem Ticket `lean_publish_process` umsetzen; den Rechner
  einrichten

## Entscheidung

Ein nächtlicher Build zieht die Abhängigkeiten jedes Repos des Oceans
hoch, Major-Versionen eingeschlossen, und veröffentlicht das Ergebnis
selbst. Er braucht kein Review: Er ändert keinen Code, nur Versionen. Er
läuft auf einem eigenen Rechner, den das Team lokal einrichtet, nicht auf
GitHub. Bricht eine Major-Version ein Repo, hält der Build an, und der
Entwickler wird einbezogen; auf einem gebrochenen Repo wird nichts
veröffentlicht. Commit, Push und Publish eines Tickets ziehen keine
Abhängigkeit mehr hoch — `gg do push` auch keine Minor- und
Patch-Versionen —, also ist der nächtliche Build der eine Ort, an dem neue
Versionen ankommen.
