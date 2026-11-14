# lean_publish_process: Publish-Schritte weglassen, die die Wartung übernehmen kann

## Ziel

Das Veröffentlichen eines Tickets tut nur noch, was in diesem Moment
geschehen muss: die Versionen der Abhängigkeiten, die das Ticket gerade
veröffentlicht hat, in `pubspec.yaml` oder `package.json` schreiben, mit
`dart pub get` oder `<Paketmanager> install` auflösen, analysieren,
mergen, hochladen und taggen. Zwei Dinge verlassen den Publish: das
Hochziehen aller übrigen Abhängigkeiten — vor allem der Major-Versionen —
und der erneute Lauf der Tests. Die Upgrades übernimmt stattdessen ein
nächtlicher Build über den Ocean, damit Pakete und Apps aktuell bleiben,
ohne dass jedes Ticket dafür bezahlt.

Es ist für Entwickler, die Tickets mit vielen Repos veröffentlichen, und
dient dem Ziel
[Ein Ticket in Minuten veröffentlichen](../goals/publish-a-ticket-in-minutes.md).
Das Ticket ist nur geplant. Umgesetzt wird es nach dem Merge des Tickets
`speed_up_gg`, weil beide dieselbe Funktion ändern.

## Anforderungen

- [req-publish-own, get, chk](../requirements/publish.md): Ein Publish
  ändert nur die Abhängigkeiten des Tickets, löst auf statt hochzuziehen
  und wiederholt die Tests nicht
- [req-maintain-maj, ngt](../requirements/maintain.md): Major-Versionen
  zieht nur die Wartung hoch, und ein nächtlicher Build hält den Ocean
  aktuell

Was ein Publish und die Wartung heute tun, steht in den Themen
[publish](../concepts/topics/publish.md) und
[maintain](../concepts/topics/maintain.md). Die Entscheidungen, auf denen
der Plan beruht: [publish-001](../concepts/decisions/publish-001.md) und
[maintain-001](../concepts/decisions/maintain-001.md).

## Betroffene Repos

- `gg_multi_do_publish`: `_publishRepo` zieht nichts mehr hoch und lässt
  `can commit` nicht mehr laufen; es löst auf, analysiert und schreibt
  den Hash der Prüfungen; `_refreshDependencies` nutzt get oder install
- `gg_one_do_publish`: Auch `gg one do publish` zieht standardmäßig nichts
  hoch; heute lässt es das Upgrade nur mit `--no-upgrade` aus
- `gg_one_commit`: Das Upgrade überspringt Major-Versionen nur auf
  Wunsch; der Standard von `do.upgrade.deps.majorVersions` wird false
- `gg_multi_commit`: `gg do push` zieht nichts mehr hoch
- `gg_one_core`: ein Weg, die Prüfungen für den Commit des Publish nach
  get und analyze als bestanden festzuhalten, ohne die Tests
- `gg_localize_refs`: sagt, welche Manifest-Zeilen es geändert hat, damit
  ein Test belegen kann, dass sich sonst nichts geändert hat
- `gg_multi_maintain`: der nächtliche Build — jede Organisation des
  Oceans, Abhängigkeiten mit Major-Versionen, keine Rückfrage, kein
  Review, selbst veröffentlichen, bei dem Repo anhalten, das eine
  Major-Version bricht, und es dem Entwickler sagen
- `gg` und `dna_gg`: Der Development-Guide sagt, was ein Publish tut und
  was der nächtliche Build tut; ein Guide zum Einrichten des Rechners
  für den nächtlichen Build

## Schritte

1. Einen Publish eines echten Tickets pro Schritt mit dem Prozess-Trace
   messen: was das Upgrade, das wiederholte `can commit` und das
   Auffrischen kosten
2. Ohne Upgrade veröffentlichen: `DoUpgradeDeps` aus `_publishRepo`
   nehmen und `_refreshDependencies` `dart pub get` oder `<pm> install`
   ausführen lassen
3. Belegen, dass ein Publish nur die Abhängigkeiten des Tickets ändert:
   Ein Test vergleicht das Manifest vorher und nachher
4. `can commit` im Publish durch `dart pub get` und `dart analyze`
   ersetzen und den Hash der Prüfungen für den Commit des Publish
   schreiben, damit der Quick Check auf GitHub besteht
5. Upgrades aus Commit, Push und Publish nehmen: Der Standard für
   Major-Versionen wird false, und `gg do push` zieht nichts mehr hoch
6. Den nächtlichen Build auf `gg do maintain` aufbauen: alle Repos in
   Abhängigkeitsreihenfolge, Major-Versionen eingeschlossen,
   veröffentlichen ohne Review; bricht eine Major-Version ein Repo,
   anhalten und dem Entwickler sagen, welches Repo und warum
7. Den Rechner des nächtlichen Builds einrichten und den Guide dazu
   schreiben: gg, die Zugangsdaten, der Zeitplan
8. Die Guides schreiben: was ein Publish tut, was der nächtliche Build
   tut, wie man seinen Bericht liest
9. Noch einmal messen und mit Schritt 1 vergleichen

## Offene Fragen

- Welche Zugangsdaten hält der Rechner des nächtlichen Builds für GitHub,
  pub.dev und npm, und wer betreut ihn?
- Wie erfährt der Entwickler, dass eine Major-Version ein Repo gebrochen
  hat: eine Mail, ein Issue, ein Ticket?
- Was ersetzt `dart analyze` in einem TypeScript-Repo? Vorschlag: das
  Lint des Repos, `tsc --noEmit` und eslint
- Welche Version bekommt ein Release, das nur hochzieht? `gg do maintain`
  hat `--version-increment`; Vorschlag: patch
