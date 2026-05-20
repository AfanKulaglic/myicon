# Lock & Polygon Feature für Print-Zonen

## Übersicht

Die Print-Zonen im Admin-Panel unterstützen jetzt zwei neue Funktionen:
1. **Lock/Unlock** - Zonen können gesperrt werden, um versehentliche Änderungen zu verhindern
2. **Polygon-Modus** - Zonen können als freie Vierecke mit individuell verschiebbaren Ecken definiert werden

## Features

### 1. Lock/Unlock Funktion

**Zweck:** Verhindert versehentliche Änderungen an bereits konfigurierten Print-Zonen.

**Verwendung:**
- Klicken Sie auf den "Zone gesperrt/entsperrt" Button im rechten Panel
- Gesperrte Zonen:
  - Können nicht verschoben werden
  - Können nicht in der Größe verändert werden
  - Können nicht rotiert werden
  - Zeigen ein Schloss-Symbol (🔒) im Info-Label
  - Haben einen grauen Rahmen statt blau

**Visuell:**
- Entsperrt: Blauer Rahmen, alle Handles sichtbar
- Gesperrt: Grauer Rahmen, keine Handles, Schloss-Symbol

### 2. Polygon-Modus

**Zweck:** Ermöglicht nicht-rechteckige Print-Zonen wie Parallelogramme, Trapeze oder andere Vierecke.

**Verwendung:**
1. Klicken Sie auf "Polygon-Modus (freie Ecken)" Button
2. Die Zone wird in ein Viereck mit 4 frei beweglichen Ecken umgewandelt
3. Jede Ecke kann einzeln verschoben werden:
   - **TL** (Top-Left): Obere linke Ecke
   - **TR** (Top-Right): Obere rechte Ecke
   - **BL** (Bottom-Left): Untere linke Ecke
   - **BR** (Bottom-Right): Untere rechte Ecke

**Funktionen im Polygon-Modus:**
- ✅ Jede Ecke einzeln verschieben (runde Handles mit Punkt)
- ✅ Gesamte Zone verschieben (zentraler Move-Button)
- ✅ Lock/Unlock funktioniert auch im Polygon-Modus
- ❌ Rotation-Handle nicht verfügbar (nicht nötig, da Ecken frei beweglich)
- ❌ Rechteck-Resize-Handles nicht verfügbar

**Zurück zum Rechteck-Modus:**
- Klicken Sie erneut auf den Button (zeigt dann "Rechteck-Modus")
- Die Zone wird automatisch in das kleinste umschließende Rechteck umgewandelt
- Rotation wird auf 0° zurückgesetzt

### 3. Rechteck-Modus (Standard)

**Features:**
- 4 Eck-Handles zum Größe ändern (NW, NE, SW, SE)
- Rotation-Handle (lila Kreis oben) zum Drehen der gesamten Zone
- Move-Funktion durch Klicken und Ziehen der Zone
- Rotation kann auch manuell im Input-Feld eingegeben werden (0-360°)

## Technische Details

### Datenstruktur

```typescript
interface PrintPlacement {
  // ... andere Felder ...
  
  // Standard-Rechteck (immer vorhanden)
  printArea: {
    leftPct: number;
    topPct: number;
    widthPct: number;
    heightPct: number;
  };
  
  // Optional: Polygon mit 4 Ecken
  printAreaCorners?: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  
  // Rotation (nur für Rechteck-Modus)
  rotation?: number; // 0-360 Grad
  
  // Lock-Status
  locked?: boolean;
}
```

### Rendering-Logik

1. **Wenn `printAreaCorners` definiert ist:**
   - Rendert als SVG-Polygon
   - Zeigt 4 runde Corner-Handles
   - Zeigt zentralen Move-Button
   - Ignoriert `rotation` Feld

2. **Wenn `printAreaCorners` nicht definiert ist:**
   - Rendert als CSS-transformiertes Rechteck
   - Zeigt 4 eckige Resize-Handles
   - Zeigt Rotation-Handle (lila Kreis)
   - Verwendet `rotation` Feld für CSS transform

### Koordinaten

- Alle Positionen sind in **Prozent** der Mockup-Dimensionen (0-100)
- Ermöglicht resolution-unabhängige Definitionen
- Funktioniert mit beliebigen Mockup-Größen

## Anwendungsfälle

### Rechteck-Modus mit Rotation
- Standard T-Shirt Front/Back
- Gerade Print-Bereiche die gedreht werden sollen
- Symmetrische Designs

### Polygon-Modus
- Schräge Print-Bereiche auf Ärmeln
- Perspektivische Verzerrungen auf 3D-Mockups
- Anpassung an nicht-rechteckige Produktformen
- Trapezförmige Bereiche (z.B. auf Kapuzen)
- Parallelogramme für diagonale Designs

## UI-Elemente

### Handles

| Typ | Aussehen | Funktion |
|-----|----------|----------|
| Eck-Handle (Rechteck) | Kleines weißes Quadrat mit blauem Rand | Größe ändern |
| Corner-Handle (Polygon) | Runder weißer Kreis mit blauem Rand und Punkt | Ecke verschieben |
| Rotation-Handle | Lila Kreis mit Rotation-Icon | Zone drehen |
| Move-Button (Polygon) | Blauer Kreis mit Move-Icon | Gesamte Zone verschieben |

### Buttons

1. **Lock/Unlock Button**
   - Grau wenn gesperrt, Blau wenn entsperrt
   - Zeigt Schloss-Icon (🔒/🔓)

2. **Polygon-Modus Button**
   - Lila wenn Polygon-Modus aktiv (⬡)
   - Grau wenn Rechteck-Modus aktiv (▭)

## Tastenkombinationen

Aktuell keine Tastenkombinationen implementiert. Alle Funktionen sind über Maus/Touch verfügbar.

## Browser-Kompatibilität

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Browser (Touch-Support)

## Bekannte Einschränkungen

1. Polygon-Modus unterstützt nur Vierecke (4 Ecken), keine beliebigen Polygone
2. Keine automatische Kollisionserkennung zwischen Zonen
3. Keine Snap-to-Grid Funktion
4. Keine Undo/Redo Funktion (Änderungen werden sofort gespeichert)

## Zukünftige Erweiterungen

Mögliche Features für zukünftige Versionen:
- [ ] Snap-to-Grid für präzise Positionierung
- [ ] Undo/Redo Funktionalität
- [ ] Tastenkombinationen (z.B. L für Lock, P für Polygon)
- [ ] Kollisionserkennung und Warnung bei überlappenden Zonen
- [ ] Kopieren/Einfügen von Zonen
- [ ] Vorlagen für häufig verwendete Formen
- [ ] Mehr als 4 Ecken (beliebige Polygone)
- [ ] Bezier-Kurven für geschwungene Kanten

## Speicherung

Alle Änderungen werden automatisch in Firebase gespeichert wenn:
- Eine Ecke verschoben wird
- Die Zone gedreht wird
- Der Lock-Status geändert wird
- Zwischen Rechteck- und Polygon-Modus gewechselt wird

Die Daten werden im `placements` Array des Produkts gespeichert.
