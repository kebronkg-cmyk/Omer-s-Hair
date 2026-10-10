#!/usr/bin/env bash
# Stände der Website verwalten.
#   tools/version.sh merken "Beschreibung"   nach einem Push: aktuellen Commit als neuen Stand eintragen
#   tools/version.sh back                    Stand vor dem aktuellen wiederherstellen (neuer Commit, nichts wird gelöscht)
#   tools/version.sh liste                   alle Stände zeigen
set -euo pipefail
cd "$(dirname "$0")/.."
LISTE=tools/staende.txt
aktuell() { grep -v '^#' "$LISTE" | tail -1; }
case "${1:-liste}" in
  merken)
    n=$(( $(aktuell | cut -d' ' -f1) + 1 ))
    echo "$n $(git rev-parse --short HEAD) ${2:-ohne Beschreibung}" >> "$LISTE"
    echo "Stand $n gemerkt." ;;
  back)
    read -r nr _ <<<"$(aktuell)"
    # Der aktuelle Stand ist vielleicht selbst schon ein „back“: dann weiter zurück als dessen Ziel.
    ziel_nr=$(( nr - 1 ))
    vorlage=$(aktuell | cut -d' ' -f3-)
    if [[ "$vorlage" =~ ^zurück\ auf\ Stand\ ([0-9]+) ]]; then ziel_nr=$(( ${BASH_REMATCH[1]} - 1 )); fi
    (( ziel_nr >= 1 )) || { echo "Es gibt keinen älteren Stand."; exit 1; }
    ziel=$(grep -v '^#' "$LISTE" | awk -v n="$ziel_nr" '$1 == n { print $2 }')
    liste_jetzt=$(cat "$LISTE")
    git restore --source="$ziel" --staged --worktree :/
    printf '%s\n' "$liste_jetzt" > "$LISTE"          # die Liste selbst bleibt aktuell
    git add -A
    git commit -q -m "Zurück auf Stand $ziel_nr ($ziel)"
    echo "$(( nr + 1 )) $(git rev-parse --short HEAD) zurück auf Stand $ziel_nr" >> "$LISTE"
    git add "$LISTE" && git commit -q --amend --no-edit
    echo "Zurück auf Stand $ziel_nr. Jetzt pushen." ;;
  liste) grep -v '^#' "$LISTE" ;;
  *) echo "unbekannt: $1"; exit 1 ;;
esac
