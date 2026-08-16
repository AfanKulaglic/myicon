# 🚀 MYICON — Priprema za pravo lansiranje (GO LIVE)

Ovaj fajl ti govori tačno šta treba da uradiš za **pet stvari**:

1. **Resend ključ + promjena emaila računa** — za slanje emailova (prednarudžbe/Vorkasse)
2. **PayPal** — šta ti treba za prava (ne fejk) PayPal plaćanja
3. **Kartica (kreditna/debitna)** — šta ti treba za kartična plaćanja (Stripe)
4. **eBay** — kako da radi realno, a ne fejk
5. **Banka** — koji podaci ti trebaju za pravi žiro račun

> ⏱️ Vrijeme potrebno: ~1–2 sata + vrijeme verifikacije računa (1–7 dana za banku/Stripe). Većinu stvari možeš uraditi sam, bez programera.

---

## 1. 📧 RESEND — ključ za slanje emailova

### Šta je Resend?
Resend je servis koji šalje emailove. Besplatan je za tvoj obim:
**3.000 emailova mjesečno, 100 dnevno** — trajno, ne probni period.

### Korak po korak (10 minuta)

**1. Kreiraj račun**
- Idi na: **https://resend.com**
- Klikni **"Sign Up"** (gore desno)
- Registruj se sa Google ili email adresom

**2. Verifikuj domen (VAŽNO!)**
- Resend neće slati emailove sa tvoje adrese dok ne dokažeš da je tvoj domen tvoj.
- U dashboardu klikni **"Add Domain"**
- Unesi svoj domen: **my-icon.shop**
- Resend će ti dati **DNS zapise** (tri stvari: `MX`, `TXT`/`SPF`, `DKIM` — to su redovi teksta).
- Idi na sajt gdje si kupio domen (npr. GoDaddy, IONOS, Strato, Hostinger...) → **DNS Management** → dodaj te zapise.
- Vrati se u Resend i klikni **"Verify"** — za 5–30 minuta domen postaje verifikovan (zeleno "Verified").

> 💡 **ZA TESTIRANJE (opciono):** Ako ne želiš odmah da se petljaš sa DNS-om, Resend dozvoljava slanje sa `onboarding@resend.dev` — emailovi stižu, ali samo tebi (ili na adrese koje odobriš). Za pravu prodaju ti ipak treba verifikovan domen.

**3. Napravi API ključ**
- U dashboardu lijevo klikni **"API Keys"**
- Klikni **"Create API Key"**
- Daj mu ime, npr. `myicon-prod`
- **VAŽNO:** NEMOJ staviti ograničenje na domen (ostavi prazno) — aplikacija šalje sa više stranica.
- Klikni **"Create"**
- **ODMAH kopiraj ključ!** Prikazuje se samo jednom. Izgleda ovako:
  ```
  re_XXXXXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXX
  ```

**4. Daj mi ključ**
- Pošalji mi ključ u chat (ili ga upiši u `.env` — objašnjeno ispod).

> ✅ **Status:** Ključ je unesen u `.env` kao `VITE_RESEND_API_KEY`.

### Gdje emailovi stižu
- Emailovi o narudžbama (potvrda sa IBAN-om, potvrda uplate) idu **kupcu** na adresu koju unese na checkout-u.
- **Svaki email se automatski šalje i kao kopija (BCC) na `myicon2025@gmail.com`** — tvoj poslovni inbox, da ništa ne propustiš. Podešeno preko `VITE_EMAIL_COPY_TO` u `.env`.

> ⚠️ **Dok ne verifikuješ domen:** Resend (besplatan plan) šalje sa `onboarding@resend.dev` **samo na adresu s kojom si registrovao račun**. Ako si račun napravio sa `afankul42@gmail.com`, test emailovi će stizati tamo — to je normalno. Čim verifikuješ domen `my-icon.shop`, emailovi idu svima (i kupcima, i BCC na tvoj gmail).

### 🎨 Dizajn emailova — logo i boje sajta (VEĆ URAĐENO)

Emailovi **nisu generički** — napravljeni su da izgledaju kao tvoja stranica:
- **Logo MYICON** stoji na vrhu svakog emaila — uzima se sa **ImgBB linka** (`https://i.ibb.co/60ff2bwD/logo-text-1.png`), pa se vidi u svakom mail klijentu (podešeno preko `VITE_EMAIL_LOGO_URL` u `.env`)
- **Boje brenda**: plava `#1E5AA8` (dugmeta, linkovi), limeta `#C5E337` (tanka traka na vrhu), ista pozadina i kartica kao na sajtu
- Plavo **dugme „Bestellung verfolgen"** kao na sajtu
- **Slika proizvoda** pored svakog artikla u emailu (slika koju je kupac vidio na sajtu). Ako proizvod nema sliku, prikazuje se sivi placeholder sa „MYiCON" — nijedan proizvod ne može biti bez slike u emailu

**Slike i linkovi u emailu koriste Vercel sajt:** `https://myicon-one.vercel.app` (podešeno preko `VITE_PUBLIC_URL` u `.env`). Dugme „Bestellung verfolgen" vodi na tvoj Vercel sajt.

**Ko dobija koji email (potvrđeno):**
- **Kupac** — za SVAKU narudžbu (PayPal i Vorkasse) dobija email sa **listom proizvoda** (slika, količina, naziv, cijena) + ukupnim iznosom. Za Vorkasse dodatno IBAN + Verwendungszweck.
- **Admin (myicon2025@gmail.com)** — za SVAKU narudžbu dobija posebnu obavijest **„Neue Bestellung"** sa slikama proizvoda, ukupnim iznosom, načinom plaćanja i podacima kupca (ime, email, adresa). Uz to dobija i BCC kopiju kupčevog emaila.

### 5. Promijeni email Resend računa na `myicon2025@gmail.com` (VAŽNO) ⭐

Ako želiš da **svi emailovi** (testni i oni za kupce) idu na tvoj poslovni gmail, najbolje je da **promijeniš email samog Resend računa**. Korak po korak:

**1. Prijavi se**
- Idi na: **https://resend.com** → **Sign In** (sa svojim Google/email računom — onim sa kojim si se registrovao)

**2. Otvori postavke računa**
- Klikni svoj avatar (profilna slika/ime) **dole lijevo** u dashboardu
- Klikni **"Settings"**
- Klikni **"Account"** (ili **"Profile"**) u lijevom meniju

**3. Promijeni email**
- Pored **"Email"** klikni **"Edit"** (ili olovku ✏️)
- Unesi: **myicon2025@gmail.com**
- Klikni **"Save"**

**4. Potvrdi novi email**
- Resend ti pošalje **verifikacioni link na myicon2025@gmail.com**
- Otvori Gmail → pronađi Resend poruku → klikni link
- Gotovo! Od sada je `myicon2025@gmail.com` vlasnik računa

> 💡 **Značenje:** od tog trenutka, test emailovi sa `onboarding@resend.dev` stižu na `myicon2025@gmail.com`, a i BCC kopije svih emailova idu tamo. `afankul42@gmail.com` više nije u igri.

> ⚠️ **Ako je Resend registrovana preko Google prijave** („Continue with Google"): promijeni email preko Google-a (Google račun → email) ili napravi novi Resend račun sa `myicon2025@gmail.com` — obje opcije su jednostavne, nova registracija traje 5 minuta.

---

### 🛡️ KAKO SAKRITI KLJUČ (najbolje moguće)

Trenutno je tvoja aplikacija **frontend-only** (Vite SPA — sav kod se šalje u browser korisnika). To znači da **svaki ključ koji počne sa `VITE_` može svako vidjeti** u developer alatima (F12 → Network/JS fajlovi).

Zato postoje **dva nivoa** zaštite:

#### Nivo 1 — Minimalno (radimo sada, default)
Ključ stoji u `.env` kao `VITE_RESEND_API_KEY`. Radi, ali je vidljiv. **OK samo dok testiraš.**

#### Nivo 2 — Sigurno (preporučeno za lansiranje) ⭐
Ključ se drži **na serveru**, browser ga nikad ne vidi. Pošto se tvoja aplikacija deploy-uje na **Vercel** (već imaš `vercel.json`), najlakši način je:

**Plan:**
1. Napravimo jednu malu **Vercel serverless funkciju**: `/api/send-email` — ona drži ključ i šalje email.
2. Tvoja aplikacija poziva **svoju** funkciju (`/api/send-email`), a ne Resend direktno.
3. Ključ ide u **Vercel Environment Variables** (tamo je siguran, browser ga nikad ne dobije).
4. `VITE_RESEND_API_KEY` se **briše** iz `.env` i koda.

**Šta trebaš uraditi za ovo (kad budeš spreman):**
- [ ] Daj mi zeleno svjetlo u chatu da napravim `/api/send-email` funkciju
- [ ] Kad deploy-uješ na Vercel: **Settings → Environment Variables** → dodaj `RESEND_API_KEY` = tvoj ključ
- [ ] Lokalno za testiranje, ključ stavi u `.env` kao `RESEND_API_KEY` (bez `VITE_` prefiksa)

> 🔒 **Pravilo:** ključ šalji samo meni (ili ga sam upiši u `.env`). **Nikad ga ne šalji** kupcima, ne stavljaj u GitHub, ne lijepi u chat grupe. Ako ikad procure — u Resend dashboardu obriši stari ključ i napravi novi (5 sekundi).

---

## 2. 💳 PAYPAL — šta ti treba za PRAVA plaćanja

### Trenutno stanje
U aplikaciji je **simuliran PayPal** — klikneš „Mit PayPal bezahlen" i poslije 1,2 s
samo se kreira narudžba. **Nema stvarnog plaćanja** — niko ne šalje novac.

### Šta ti treba da PayPal radi realno

**1. PayPal Business račun (besplatan)**
- Idi na: **https://www.paypal.com** → **Sign Up** → **Business Account**
- Unesi: ime firme/ime i prezime, adresu, email (preporuka: `myicon2025@gmail.com`), IBAN računa za isplatu
- Potvrdi email

**2. PayPal Developer račun**
- Idi na: **https://developer.paypal.com**
- Prijavi se sa istim Business računom
- Klikni **"Apps & Credentials"** → **"Create App"**
- Dobićeš **Client ID** (nije tajna) i **Secret** (TAJNO — čuva se na serveru)

**3. Šta mi treba od tebe (da bih ja uradio integraciju):**
- [ ] PayPal Business email račun (kreiran + potvrđen)
- [ ] **Client ID** (možeš slobodno dati — nije tajna)
- [ ] **Secret** (šalji samo meni / u `.env` na serveru — NIKAD u browser kodu)
- [ ] Webhook URL podešen u PayPal dashboardu (napravimo zajedno kad deploy-uješ)

**4. Kako će izgledati kad je gotovo:**
- Klik „Mit PayPal bezahlen" → prebaci kupca na **PayPal stranicu** → kupac se prijavi i plati
- PayPal ti **automatski javi** (webhook) da je uplata stigla
- Narudžba prelazi u „In Bearbeitung" automatski — **bez ručne potvrde**

> ⚠️ **Napomena:** PayPal integracija zahtijeva server (webhook mora negdje da „čuči"). Radićemo je preko Vercel serverless funkcije — isto mjesto gdje će ići Resend ključ.

---

## 3. 💳 KARTICA (kreditna/debitna) — šta ti treba

### Preporučeni provajder: Stripe
Stripe je najčešći izbor za kartična plaćanja u EU — prihvata **Visa, Mastercard, Amex, Maestro** + **SEPA direktni dug** (žiro na rate). Cijena: ~1,5% + 0,25 € po transakciji, bez mjesečne naknade.

### Korak po korak

**1. Napravi Stripe račun (besplatan)**
- Idi na: **https://stripe.com** → **Start now**
- Registruj se sa `myicon2025@gmail.com`
- Odgovori na pitanja (zemlja: **Njemačka**, tip biznisa, opis djelatnosti: „Online-Druckerei / Print on Demand")

**2. Popuni poslovne podatke (verifikacija)**
- Stripe traži: ime firme (ili ime i prezime), adresu, **IBAN za isplatu novca**, porezni broj (ako postoji)
- Ovo traje 1–7 dana — Stripe provjerava podatke prije nego pusti prave uplate

**3. Uzmi API ključeve**
- U dashboardu: **Developers → API keys**
- Treba ti troje:
  | Ključ | Tajna? | Gdje ide |
  |-------|--------|----------|
  | **Publishable key** (`pk_live_...`) | Ne (javni) | U browser kod, bez problema |
  | **Secret key** (`sk_live_...`) | **DA** | Samo na server (Vercel env vars) |
  | **Webhook secret** (`whsec_...`) | **DA** | Samo na server |

**4. Šta mi treba od tebe (da bih ja uradio integraciju):**
- [ ] Stripe račun kreiran + podaci poslani na verifikaciju
- [ ] **Publishable key** (slobodno šalji)
- [ ] **Secret key** (samo meni / na server)
- [ ] **Webhook secret** (napravimo zajedno poslije deploy-a)

> ⚠️ **Bitno:** Stripe ključevi sa `_live_` u nazivu su za pravi novac. Za testiranje prvo koristi `pk_test_...` / `sk_test_...` (test mod) — plaćaš karticom za test `4242 4242 4242 4242` i ništa se ne naplaćuje.

> 💡 **Savjet:** Stripe može zamijeniti i PayPal — jedan Stripe račun prihvata karticu, SEPA i još metode. Ali pošto ti već imaš PayPal kao opciju, možemo oba (PayPal + Stripe kartica + Vorkasse = 3 metode na checkout-u).

---

## 4. 🛒 eBAY — kako da radi REALNO (ne fejk)

### Trenutno stanje
Tvoja aplikacija **nema eBay integraciju** — checkout koristi simulirani PayPal. eBay je potpuno odvojen kanal: prodaješ na eBayu, eBay sam šalje emailove kupcima i automatski ti isplaćuje novac (eBay Managed Payments).

### Šta eBay već radi sam (ne moraš ništa)
| Stvar | Ko to radi |
|-------|-----------|
| Email kupcu: potvrda narudžbe | eBay |
| Email tebi: obavijest o prodaji | eBay |
| Naplata kupca (kartica/PayPal) | eBay Managed Payments |
| Isplata novca na tvoj račun | eBay (automatski, ~2 dana) |
| Email kupcu kad uneseš tracking broj | eBay |

**Zato ti NE treba sistem "čeka na potvrdu uplate" za eBay — eBay ti već potvrdi uplatu sam.**

### Šta treba da uradiš da eBay radi "iz tvoje aplikacije"

Postoje **dva nivoa** — odluči koji želiš:

#### Opcija A — Ručno praćenje (najlakše, 0 koda) ✅ preporučeno za početak
- Kada prodaja na eBayu stigne, **ručno uneseš narudžbu u svoj admin panel** (ili samo pogledaš eBay dashboard).
- Kupac prati status na **eBayu**, ne u tvojoj aplikaciji.
- Ne treba ti nikakav kod. eBay je već "realan" sam po sebi.

#### Opcija B — eBay API integracija (kad budeš htio automatiku)
Da bi eBay narudžbe **automatski** dolazile u tvoj admin panel i da bi im ti slao svoje emailove, treba:

**1. eBay Developers Program račun**
- Idi na: **https://go.developer.ebay.com**
- Registruj se (potreban ti je eBay prodavački račun + verifikacija)
- **Kreće se odavde:** Applications → Create an application
- Dobićeš **App ID** i **Cert ID** (tvoji "ključevi" za eBay)

**2. OAuth 2.0 dozvole**
- Kupac mora **jednom** da odobri da tvoja aplikacija čita njegove narudžbe
- Dobijaš **Access Token** (živi ~2 sata) + **Refresh Token** (traje 18 mjeseci)
- Tokene mora čuvati **server** (ista priča kao Resend ključ — nikad u browseru)

**3. eBay REST API pozivi** (server-side):
| Šta želiš | API |
|-----------|-----|
| Povuci narudžbe | `GET /sell/fulfillment/v1/order` |
| Status/ispunjenje | `GET /sell/fulfillment/v1/order/{id}` |
| Unesi tracking broj (šalješ robu) | `POST /sell/fulfillment/v1/order/{id}/shipping_fulfillment` |

**4. Tvoja aplikacija tada:**
- Svakih N minuta provjeri nove eBay narudžbe → doda ih u admin panel
- Kad ti uneseš tracking broj → pošalje eBayu → **eBay automatski emaila kupca**
- Opciono: pošalje i tvoj email ("u proizvodnji") — eBay to ne brani, ali je uobičajeno da eBay vodi komunikaciju

**Šta ti treba da bih ja ovo napravio (kad odlučiš):**
- [ ] eBay Developers račun (link gore)
- [ ] App ID + Cert ID
- [ ] Sandbox test račun (za testiranje bez pravih narudžbi) — preporučeno
- [ ] Odlučiš: serverless funkcija na Vercelu (preporučeno)

> ⚠️ **Napomena:** eBay API je server-only i zahtijeva pozivanje svakih ~2 sata zbog tokena. Ovo je konkretan posao — kad budeš spreman, reci mi i napravićemo ga korak po korak. Za sada je Opcija A sasvim dovoljna.

---

## 5. 🏦 BANKA — koji podaci trebaju

Trenutno u aplikaciji stoji **fejk IBAN** (`DE12 3456 7890 1234 5678 90`) u fajlu `src/lib/bank.ts`. Prije lansiranja ga zamijeni pravim podacima.

### Koji podaci ti trebaju (i odakle)

| Podatak | Primjer | Odakle ga uzimaš |
|---------|---------|------------------|
| **Ime primaoca** | `MYICON GmbH` | Mora biti **tačno** kako glasi na računu (za firmu: naziv iz registra; za fizičko lice: tvoje ime i prezime) |
| **IBAN** | `DE89 3704 0044 0532 0130 00` | Iz bankovnog računa / online bankarstva / ugovora sa bankom |
| **BIC / SWIFT** | `COBADEFFXXX` | Isto mjesto — banka ga uvijek daje uz IBAN |
| **Naziv banke** | `Commerzbank`, `Sparkasse`, `N26`, `Revolut`... | Tvoja banka |
| **Verwendungszweck (svrha uplate)** | `MYICON-<broj narudžbe>` | Automatski generiše aplikacija — ne moraš ništa |

### Koliko brzo možeš dobiti prave podatke

| Tvoja situacija | Kako | Vrijeme |
|-----------------|------|---------|
| **Već imaš račun** (bilo koja banka) | IBAN + BIC vidiš u online bankarstvu | 2 minute |
| **Nemaš račun, želiš brzo** | **N26, Revolut, bunq, Vivid** — otvaranje preko aplikacije, IBAN odmah | 10–15 minuta |
| **Želiš njemačku banku** | Sparkasse / Volksbank / Commerzbank — lično ili online | 1–5 dana |
| **Planiraš firmu (GmbH)** | Poslovni račun (npr. N26 Business, Revolut Business, Commerzbank Business) | 1–7 dana |

### Šta trebaš uraditi sa podacima
Kada dobiješ prave podatke, **pošalji mi ih u chatu** (ili ih sam upiši) u `src/lib/bank.ts`:

```ts
export const BANK_ACCOUNT = {
  holder: "TVOJE IME / NAZIV FIRME",
  iban: "DE00 0000 0000 0000 0000 00",
  bic: "XXXXXXXXXXX",
  bankName: "NAZIV BANKE",
  referencePrefix: "MYICON-",
  paymentDeadlineDays: 7,
};
```

> 🔒 IBAN i BIC **nisu tajni** (mogu se slobodno dijeliti — to je javna informacija za primanje uplata). Za razliku od Resend ključa, ovo može slobodno stajati u aplikaciji.

### Pravne stvari za Njemačku (kratko)
- Na **Impressum** stranici (već je imaš) moraju stajati: pun naziv, adresa, email, telefon — to je zakonski obavezno.
- IBAN na checkout stranici i u emailu — sasvim normalno i uobičajeno (Vorkasse je standard u Njemačkoj).
- Ako primaš veće količine novca, otvori **poslovni račun** — preporuka stručnjaka.

---

## ✅ Kontrolna lista — sve zajedno

### Prije lansiranja
- [ ] **Resend:** račun prebačen na `myicon2025@gmail.com`, domen `my-icon.shop` verifikovan, API ključ kreiran
- [ ] **Resend ključ:** (preporučeno) stavljen u Vercel env vars + `/api/send-email` funkcija; ili (za test) u `.env` kao `VITE_RESEND_API_KEY`
- [ ] **PayPal:** Business račun kreiran; Client ID + Secret predati meni
- [ ] **Kartica (Stripe):** račun kreiran + verifikovan; Publishable + Secret key predati meni
- [ ] **Banka:** pravi IBAN + BIC + ime upisani u `src/lib/bank.ts`
- [ ] **eBay:** odlučeno — Opcija A (ručno, ništa ne treba) ili Opcija B (API, treba developers račun)
- [ ] Test narudžba: kupi proizvod preko Vorkasse → dobiješ email sa IBAN-om → u adminu klikneš "Zahlung erhalten" → kupac dobije email o uplati

### Šta mi treba da pošalješ da krenemo
1. **Resend API ključ** ✅ već poslan — sljedeći korak: promijeni email računa na `myicon2025@gmail.com` (koraci u sekciji 1)
2. **Pravi bankovni podaci** (holder, IBAN, BIC, banka) — ili reci "ostavi fejk za sad"
3. **PayPal:** Business račun + Client ID + Secret
4. **Kartica:** Stripe račun + Publishable key + Secret key
5. **eBay odluku:** Opcija A ili B — ako B, treba mi App ID + Cert ID
