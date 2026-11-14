# Publish

Was `gg do publish` für ein Ticket tut und was darüber bekannt ist. Die
Belege hinter den Anforderungen des Bereichs
[publish](../../requirements/publish.md).

## Was ein Publish heute tut

Für jedes Repo des Tickets, in dieser Reihenfolge (`_publishRepo` in
`gg_multi_do_publish/lib/src/commands/do/publish.dart`, gelesen am
2026-11-14):

1. Die Refs auf veröffentlichte Versionen umstellen und die Versionen der
   in diesem Lauf veröffentlichten Geschwister setzen; der Operator
   bleibt, aus `^1.2.3` wird `^<neu>` (`_changeRefsToPubDev`)
2. Alle Abhängigkeiten hochziehen: `dart pub upgrade --major-versions
   --tighten`, `pnpm update --latest` (`DoUpgradeDeps`)
3. Die Abhängigkeiten mit `dart pub upgrade` oder `<pm> install`
   auffrischen, zweimal pro Repo (`_refreshDependencies`)
4. `can commit` noch einmal laufen lassen — analyze, format, Tests —, weil
   sich das Manifest geändert hat und der Hash des geprüften Stands nicht
   mehr passt
5. System-Commit »changed references to pub.dev«, `can publish` mit pana,
   Push
6. Den Pull Request mergen und warten, hochladen, auf die Registry
   warten, taggen, den Workspace auf lokale Refs zurückstellen

## Was gilt

- Nur Schritt 1 ändert, was das Ticket selbst veröffentlicht hat; die
  Schritte 2 und 3 fassen jede Abhängigkeit des Repos an
- Die Tests aus Schritt 4 wurden schon beim Commit bestanden. Die
  veröffentlichten Versionen der Geschwister-Repos sind die Commits, die
  über lokale Refs getestet wurden
- Der Quick Check auf GitHub lässt keine Tests laufen: Er prüft nur, dass
  der Commit mit gg gemacht wurde, über den Hash, den `can commit`
  schreibt. Ein Publish, der `can commit` weglässt, muss diesen Hash für
  den Commit schreiben, den er macht
- Auch `gg do push` zieht die Abhängigkeiten hoch; nur die Prüfungen des
  Publish schalten das ab
- Ob Major-Versionen übersprungen werden, steuert die Einstellung
  `do.upgrade.deps.majorVersions` in `.gg/gg_rc`; ihr Standard ist true

## Noch nicht bekannt

- Was jeder Schritt kostet. Kein Publish wurde Schritt für Schritt
  gemessen; das Ticket `lean_publish_process` beginnt mit dieser Messung
