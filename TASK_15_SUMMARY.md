# Task 15: Dodavanje "Bestellungen" Linka u Navigaciju

## Status: ✅ Završeno

## Šta je urađeno

Dodat je link "Bestellungen" (Narudžbe) u navigaciju kako bi korisnici mogli lako pristupiti stranici za praćenje narudžbi.

---

## Problem

- Stranica `/order/track` (TrackOrderPage) već postoji i funkcionalna je
- Korisnici nisu mogli lako pristupiti ovoj stranici
- Nije bilo linka u navigaciji za praćenje narudžbi
- Korisnici su morali ručno upisati URL ili dobiti link nakon kupovine

---

## Rješenje

Dodati linkovi na **3 lokacije** u navigaciji:

### 1. ✅ Desktop Header (Gornji Red)

**Lokacija:** `src/components/layout/SiteHeader.tsx`

**Dodato:**
```tsx
<Link
  to="/order/track"
  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-surface-alt"
  title="Bestellungen verfolgen"
>
  <Package className="size-5" />
  <span className="hidden lg:inline">Bestellungen</span>
</Link>
```

**Pozicija:** Između "Alle Produkte" i "Mein Konto"

**Responsive:**
- `hidden sm:inline-flex` - Vidljivo od 640px širine
- `hidden lg:inline` - Tekst "Bestellungen" vidljiv samo na desktop (1024px+)
- Na tablet (640-1023px) prikazuje se samo ikona 📦

---

### 2. ✅ Desktop Navigation Bar (Donji Red)

**Lokacija:** `src/components/layout/DesktopNav.tsx`

**Dodato:**
```tsx
<li>
  <Link
    to="/order/track"
    className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-ink hover:text-brand"
  >
    <Package className="size-4" />
    Bestellungen
  </Link>
</li>
```

**Pozicija:** Između kategorija i "Hilfe & Wissen"

**Vidljivost:** Samo na desktop (lg: breakpoint, 1024px+)

---

### 3. ✅ Mobile Menu (Hamburger Meni)

**Lokacija:** `src/components/layout/MobileMenu.tsx`

**Dodato:**
```tsx
<li>
  <Link
    to="/order/track"
    onClick={onClose}
    className="block px-4 py-3.5 text-sm border-b border-line"
  >
    Bestellungen verfolgen
  </Link>
</li>
```

**Pozicija:** Između "Mein Konto" i "Merkliste"

**Vidljivost:** Samo na mobilnim uređajima (ispod 1024px)

---

## Vizuelni Prikaz

### Desktop Header (Gornji Red)
```
[Logo] [Search Bar] [Bestellungen 📦] [Mein Konto 👤] [❤️] [🛒]
```

### Desktop Navigation Bar (Donji Red)
```
[Alle Produkte] [Textilien ▼] [Flyer ▼] ... [📦 Bestellungen] [Hilfe & Wissen]
```

### Mobile Menu
```
☰ Menu
├─ Alle Produkte
├─ Textilien >
├─ Flyer >
├─ ...
├─ Mein Konto
├─ Bestellungen verfolgen  ← NOVO
├─ Merkliste
├─ FAQ
└─ Kontakt
```

---

## Tehnički Detalji

### Izmijenjeni Fajlovi

1. **`src/components/layout/SiteHeader.tsx`**
   - Importovan `Package` icon iz lucide-react
   - Dodat link u header toolbar (desktop)
   - Responsive: `hidden sm:inline-flex` + `hidden lg:inline`

2. **`src/components/layout/DesktopNav.tsx`**
   - Importovan `Package` icon
   - Dodat link u navigation bar
   - Prikazuje se samo na desktop (lg:)

3. **`src/components/layout/MobileMenu.tsx`**
   - Dodat link u mobile menu
   - Pozicioniran između "Mein Konto" i "Merkliste"
   - `onClick={onClose}` zatvara meni nakon klika

### Ikona

**Package Icon (📦)** iz lucide-react:
- `size-5` u header-u (20px)
- `size-4` u navigation bar-u (16px)
- Bez ikone u mobile menu-u (samo tekst)

### Routing

**URL:** `/order/track`

**Stranica:** `src/pages/TrackOrderPage.tsx` (već postojeća)

**Funkcionalnost:**
- Korisnik unosi broj narudžbe (npr. `ord_xyz123`)
- Prikazuje se status narudžbe (Eingegangen → In Bearbeitung → Versandt → Geliefert)
- Narudžbe se čuvaju lokalno (localStorage) za brz pristup
- Real-time ažuriranje statusa preko Firebase

---

## Responsive Ponašanje

### Desktop (1024px+)
- ✅ Link u header-u sa ikonom i tekstom "Bestellungen"
- ✅ Link u navigation bar-u sa ikonom i tekstom
- ❌ Mobile menu nije vidljiv

### Tablet (640-1023px)
- ✅ Link u header-u samo sa ikonom 📦 (bez teksta)
- ❌ Navigation bar nije vidljiv
- ❌ Mobile menu nije vidljiv

### Mobile (<640px)
- ❌ Link u header-u nije vidljiv
- ❌ Navigation bar nije vidljiv
- ✅ Link u mobile menu-u (hamburger meni)

---

## Korisničko Iskustvo

### Prije
❌ Korisnik mora ručno upisati `/order/track` u URL  
❌ Korisnik mora sačuvati link iz email-a  
❌ Nema vidljivog načina da se provjeri status narudžbe  

### Poslije
✅ Korisnik vidi "Bestellungen" link u navigaciji  
✅ Jedan klik vodi na stranicu za praćenje  
✅ Jasno vidljivo na svim uređajima (desktop, tablet, mobile)  
✅ Ikona 📦 je prepoznatljiva i intuitivna  

---

## Testiranje

### Testirano na:
- ✅ Desktop (1920px širina) - Header + Navigation bar
- ✅ Laptop (1440px širina) - Header + Navigation bar
- ✅ Tablet (768px širina) - Header (samo ikona)
- ✅ Mobile (375px širina) - Mobile menu

### Scenariji:
1. ✅ Klik na "Bestellungen" u header-u → Otvara `/order/track`
2. ✅ Klik na "Bestellungen" u navigation bar-u → Otvara `/order/track`
3. ✅ Klik na "Bestellungen verfolgen" u mobile menu-u → Otvara `/order/track` i zatvara meni
4. ✅ Hover efekti rade na svim linkovima
5. ✅ Responsive breakpoints rade ispravno

---

## Accessibility

- ✅ `title` atribut na header linku: "Bestellungen verfolgen"
- ✅ Semantički `<Link>` komponente (React Router)
- ✅ Keyboard navigacija radi
- ✅ Screen reader friendly (tekst + ikona)
- ✅ Hover states za vizuelni feedback

---

## Buduća Poboljšanja (Opciono)

### 1. Badge sa Brojem Aktivnih Narudžbi
```tsx
<Link to="/order/track" className="relative">
  <Package className="size-5" />
  {activeOrdersCount > 0 && (
    <span className="absolute -top-1 -right-1 size-4 bg-brand text-white text-[10px] rounded-full">
      {activeOrdersCount}
    </span>
  )}
</Link>
```

### 2. Dropdown sa Brzim Pregledom
```tsx
<Popover>
  <PopoverTrigger>
    <Package /> Bestellungen
  </PopoverTrigger>
  <PopoverContent>
    {recentOrders.map(order => (
      <OrderPreview key={order.id} order={order} />
    ))}
  </PopoverContent>
</Popover>
```

### 3. Notifikacije za Promjenu Statusa
- Push notifikacije kada se status promijeni
- Email notifikacije
- Badge sa "Novo" indikatorom

---

## Napomene

- Link je dodat na **3 lokacije** za maksimalnu dostupnost
- Responsive dizajn osigurava vidljivost na svim uređajima
- Ikona 📦 (Package) je univerzalno prepoznatljiva
- Stranica `/order/track` već postoji i potpuno je funkcionalna
- Nema breaking changes - sve postojeće funkcionalnosti rade

---

## Metadata

- **Task ID:** 15
- **User Query:** 30
- **Datum:** 2026-05-20
- **Status:** ✅ Završeno
- **Izmijenjeni Fajlovi:** 3
- **Novi Fajlovi:** 1 (dokumentacija)
- **Route:** `/order/track`
- **Ikona:** Package (lucide-react)
