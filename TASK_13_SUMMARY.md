# Task 13: Lock & Polygon Funkcionalnost za Print Zone

## Status: ✅ Završeno

## Šta je urađeno

Dodane su dvije nove funkcionalnosti u admin panel za definisanje print zona (druckbereiche), i customizer je ažuriran da prikazuje ove zone klijentima:

### 1. 🔒 Lock/Unlock Funkcija

**Svrha:** Zaključavanje zona kako bi se spriječile slučajne izmjene.

**Kako radi:**
- Kliknite na dugme "Zone gesperrt/entsperrt" u desnom panelu
- Kada je zona zaključana:
  - ❌ Ne može se pomjerati
  - ❌ Ne može se mijenjati veličina
  - ❌ Ne može se rotirati
  - ✅ Prikazuje ikonu brave (🔒)
  - ✅ Ima sivu boju umjesto plave

**Vizuelno:**
- **Otključano:** Plavi okvir, svi kontrolni elementi vidljivi
- **Zaključano:** Sivu okvir, nema kontrolnih elemenata, ikona brave

---

### 2. ⬡ Polygon Mod (Slobodne Ivice)

**Svrha:** Omogućava kreiranje dijagonalnih i ne-pravougaonih zona.

**Kako radi:**
1. Kliknite na dugme "Polygon-Modus (freie Ecken)"
2. Zona se pretvara u četvorougao sa 4 slobodno pomjerljiva ugla
3. Svaki ugao se može pomjerati pojedinačno:
   - **TL** (Top-Left): Gornji lijevi ugao
   - **TR** (Top-Right): Gornji desni ugao
   - **BL** (Bottom-Left): Donji lijevi ugao
   - **BR** (Bottom-Right): Donji desni ugao

**Mogućnosti u Polygon modu:**
- ✅ Pomjeranje svakog ugla pojedinačno (okrugli kontrolni elementi)
- ✅ Pomjeranje cijele zone (centralno dugme sa Move ikonom)
- ✅ Lock/Unlock radi i u Polygon modu
- ✅ Kreiranje paralelgrama, trapeza i drugih oblika
- ✅ **Zona se prikazuje klijentima u customizer-u kao polygon**
- ❌ Rotacija nije dostupna (nije potrebna jer su uglovi slobodni)

**Povratak na Pravougaoni Mod:**
- Kliknite ponovo na dugme (prikazuje "Rechteck-Modus")
- Zona se automatski pretvara u najmanji pravougaonik koji obuhvata sve uglove
- Rotacija se resetuje na 0°

---

### 3. 🔄 Pravougaoni Mod (Standardni)

**Mogućnosti:**
- 4 ugaona kontrolna elementa za promjenu veličine (NW, NE, SW, SE)
- Ljubičasti kružni kontrolni element za rotaciju (na vrhu)
- Pomjeranje cijele zone klikom i povlačenjem
- Rotacija se može unijeti i ručno u polje (0-360°)
- ✅ **Rotirana zona se prikazuje klijentima u customizer-u**

---

### 4. 🎨 Prikaz u Customizer-u (Klijentska Strana)

**Važno:** Sve zone definirane u admin panelu (pravougaone, rotirane, ili polygon) se sada **automatski prikazuju klijentima** na customize stranici.

**Kako radi:**
- **Pravougaone zone:** Prikazuju se kao plavi isprekidani pravougaonik
- **Rotirane zone:** Prikazuju se kao rotirani pravougaonik pod definisanim uglom
- **Polygon zone:** Prikazuju se kao četvorougao sa tačnim pozicijama uglova
- **Clipping:** Dizajni koje klijent dodaje se automatski isjecaju (clip) po obliku zone
  - Pravougaone zone: Standardni pravougaoni clip
  - Rotirane zone: Rotirani pravougaoni clip
  - Polygon zone: Polygon clip po tačnim uglovima

**Vizuelni elementi:**
- Plavi isprekidani okvir (print area)
- Zeleni isprekidani okvir (safe zone - ako je definisan)
- Crveni isprekidani okvir (bleed - ako je uključen)

---

## Primjeri Upotrebe

### Pravougaoni Mod sa Rotacijom
✅ Standardni T-shirt Front/Back  
✅ Ravni print područja koja treba rotirati  
✅ Simetrični dizajni  
✅ **Klijent vidi rotiranu zonu i može dodavati dizajne unutar nje**

### Polygon Mod
✅ Kosi print područja na rukavima  
✅ Perspektivna izobličenja na 3D mockup-ima  
✅ Prilagođavanje ne-pravougaonim oblicima proizvoda  
✅ Trapezoidni oblici (npr. na kapuljačama)  
✅ Paralelogrami za dijagonalne dizajne  
✅ **Klijent vidi tačan oblik zone i dizajni se isjecaju po tom obliku**

---

## Kontrolni Elementi (Handles)

| Tip | Izgled | Funkcija |
|-----|--------|----------|
| **Ugaoni Handle (Pravougaonik)** | Mali bijeli kvadrat sa plavim okvirom | Promjena veličine |
| **Corner Handle (Polygon)** | Okrugli bijeli krug sa plavim okvirom i tačkom | Pomjeranje ugla |
| **Rotation Handle** | Ljubičasti krug sa ikonom rotacije | Rotiranje zone |
| **Move Button (Polygon)** | Plavi krug sa Move ikonom | Pomjeranje cijele zone |

---

## Dugmad

### 1. Lock/Unlock Dugme
- **Sivo** kada je zaključano (🔒)
- **Plavo** kada je otključano (🔓)

### 2. Polygon Mod Dugme
- **Ljubičasto** kada je Polygon mod aktivan (⬡)
- **Sivo** kada je Pravougaoni mod aktivan (▭)

---

## Tehnički Detalji

### Izmijenjeni Fajlovi
1. **`src/types/index.ts`**
   - Dodato `printAreaCorners` polje za polygon koordinate
   - Dodato `rotation` polje za rotaciju pravougaonika
   - Dodato `locked` polje za lock status

2. **`src/components/admin/PlacementsEditor.tsx`**
   - Implementirana Lock/Unlock funkcionalnost
   - Implementiran Polygon mod sa 4 slobodna ugla
   - Dodati kontrolni elementi za pomjeranje uglova
   - Dodato dugme za prebacivanje između modova
   - Vizuelni prikaz za oba moda (SVG polygon i CSS transform)

3. **`src/features/customizer/canvas/DesignerCanvas.tsx`** ⭐ NOVO
   - Dodana podrška za prikaz rotiranih pravougaonih zona
   - Dodana podrška za prikaz polygon zona
   - Implementiran polygon clipping za dizajne
   - Implementiran rotated rectangle clipping
   - Koristi Konva Path komponentu za SVG polygon rendering

### Struktura Podataka

```typescript
interface PrintPlacement {
  // Standardni pravougaonik (uvijek prisutan)
  printArea: {
    leftPct: number;    // 0-100%
    topPct: number;     // 0-100%
    widthPct: number;   // 0-100%
    heightPct: number;  // 0-100%
  };
  
  // Opciono: Polygon sa 4 ugla
  printAreaCorners?: {
    topLeft: { x: number; y: number };      // 0-100%
    topRight: { x: number; y: number };     // 0-100%
    bottomLeft: { x: number; y: number };   // 0-100%
    bottomRight: { x: number; y: number };  // 0-100%
  };
  
  // Rotacija (samo za pravougaoni mod)
  rotation?: number; // 0-360 stepeni
  
  // Lock status
  locked?: boolean;
}
```

### Koordinatni Sistem
- Sve pozicije su u **procentima** dimenzija mockup-a (0-100)
- Omogućava definicije nezavisne od rezolucije
- Radi sa bilo kojim veličinama mockup-a

### Rendering u Customizer-u

**Pravougaoni mod (bez rotacije):**
```typescript
<Rect x={area.x} y={area.y} width={area.width} height={area.height} />
```

**Pravougaoni mod (sa rotacijom):**
```typescript
<Group rotation={areaRotation}>
  <Rect x={area.x} y={area.y} width={area.width} height={area.height} />
</Group>
```

**Polygon mod:**
```typescript
<Path data="M x1 y1 L x2 y2 L x3 y3 L x4 y4 Z" />
```

**Clipping funkcija:**
- Pravougaonik: `ctx.rect(x, y, w, h)`
- Rotirani pravougaonik: Kalkulacija rotiranih uglova + `ctx.lineTo()`
- Polygon: `ctx.moveTo()` + `ctx.lineTo()` za svaki ugao

---

## Čuvanje Podataka

Sve izmjene se automatski čuvaju u Firebase kada:
- ✅ Ugao se pomjeri
- ✅ Zona se rotira
- ✅ Lock status se promijeni
- ✅ Prebacivanje između Pravougaonog i Polygon moda

Podaci se čuvaju u `placements` nizu proizvoda.

---

## Kompatibilnost

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobilni browseri (Touch podrška)
- ✅ Konva Canvas rendering (hardware accelerated)

---

## Dokumentacija

Kreirana je detaljna dokumentacija:
- **`LOCK_FEATURE.md`** - Tehnička dokumentacija na njemačkom
- **`TASK_13_SUMMARY.md`** - Ovaj fajl, sažetak na bosanskom

---

## Kako Koristiti

### Kreiranje Dijagonalne Zone

1. Otvorite admin panel → Products → Odaberite proizvod
2. Scroll do "Placements" sekcije
3. Kliknite na postojeću zonu ili dodajte novu
4. Kliknite na dugme **"Polygon-Modus (freie Ecken)"** (ljubičasto dugme)
5. Povucite svaki ugao na željenu poziciju
6. Zona će automatski formirati dijagonalni oblik
7. Kliknite **"Zone gesperrt"** da zaključate zonu
8. **Klijent će vidjeti tačan oblik zone na customize stranici**

### Rotiranje Pravougaone Zone

1. Otvorite admin panel → Products → Odaberite proizvod
2. Scroll do "Placements" sekcije
3. Kliknite na postojeću zonu (mora biti u Pravougaonom modu)
4. Povucite **ljubičasti kružni kontrolni element** na vrhu zone
5. Ili unesite ugao ručno u polje "Rotation (Grad)"
6. Zona će se rotirati oko svog centra
7. **Klijent će vidjeti rotiranu zonu na customize stranici**

---

## Primjer Workflow-a

**Scenario:** Kreiranje kose print zone na rukavu majice

1. Dodajte novu placement zonu (npr. "sleeve_left")
2. Pozicionirajte pravougaonik približno na rukav
3. Prebacite na **Polygon mod**
4. Pomjerite gornji lijevi ugao malo gore
5. Pomjerite donji desni ugao malo dolje
6. Rezultat: Dijagonalna zona koja prati oblik rukava
7. Zaključajte zonu da spriječite slučajne izmjene
8. **Otvorite customize stranicu - zona se prikazuje kao dijagonalni četvorougao**
9. **Klijent dodaje dizajn - automatski se isijeca po obliku zone**

---

## Napomene

- Polygon mod podržava samo četvorouglove (4 ugla)
- Nema automatske detekcije kolizije između zona
- Nema Undo/Redo funkcionalnosti (izmjene se odmah čuvaju)
- Sve izmjene su vidljive u realnom vremenu
- **Customizer automatski prikazuje sve tipove zona (pravougaone, rotirane, polygon)**
- **Clipping radi za sve tipove zona - dizajni se isjecaju po tačnom obliku**

---

## Metadata

- **Task ID:** 13
- **User Query:** 27-28
- **Datum:** 2026-05-20
- **Status:** ✅ Završeno
- **Izmijenjeni Fajlovi:** 3 (types, admin editor, customizer canvas)
- **Novi Fajlovi:** 2 (dokumentacija)
