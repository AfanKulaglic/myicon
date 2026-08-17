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

**2. Verifikuj domen (VAŽNO!)** — ✅ URAĐENO
- Resend neće slati emailove sa tvoje adrese dok ne dokažeš da je tvoj domen tvoj.
- U dashboardu klikni **"Add Domain"**
- Unesi svoj domen: **my-icon.shop**
- Resend će ti dati **DNS zapise** (tri stvari: `MX`, `TXT`/`SPF`, `DKIM` — to su redovi teksta).
- Pošto su nameserveri tvoje domene na Vercelu, ti zapisi se dodaju u **Vercel → Settings → Domains → `my-icon.shop` → DNS Records** (ne u Porkbun).
- Vrati se u Resend i klikni **"Verify"** — za 5–30 minuta domen postaje verifikovan (zeleno "Verified").

> ✅ **Status:** domen `my-icon.shop` je verifikovan (potvrđeno — slanje sa `info@my-icon.shop` radi na bilo koju adresu).

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

**4. Ključ u Vercel (najvažniji korak!)**
Ključ **NE ide u browser kod** — njega čita serverless funkcija `api/send-email.ts` na Vercelu. Da bi emailovi radili na živom sajtu:

- Idi na **vercel.com** → tvoj projekat **myicon** → **Settings** → **Environment Variables**
- Klikni **Add New** i upiši:
  - **Key:** `RESEND_API_KEY`
  - **Value:** tvoj ključ (`re_...`)
  - Ostavi **Production** označeno → **Save**
- Idi na **Deployments** → kod zadnjeg deploymenta klikni **⋯** → **Redeploy**
- Sačekaj 1–2 min da se build završi

> ✅ **Status:** ključ je u `.env` (lokalno) i poslan je test koji radi. Provjeri samo da je `RESEND_API_KEY` dodat u Vercel env vars (korak iznad) — bez toga živi sajt ne šalje emailove.

### Gdje emailovi stižu
- Emailovi o narudžbama (potvrda sa IBAN-om, potvrda uplate) idu **kupcu** na adresu koju unese na checkout-u.
- **Admin obavijest „Neue Bestellung"** za svaku narudžbu ide na `myicon2025@gmail.com` (podešeno preko `VITE_EMAIL_COPY_TO` u `.env`) — kupac dobija **samo svoj** email, bez kopija.
- **Admin obavijest „Neue Bestellung"** za svaku narudžbu ide na `myicon2025@gmail.com` — sa proizvodima, iznosom i podacima kupca.

> ℹ️ **Zašto je potreban server (`/api/send-email`):** Resend **blokira direktne pozive iz browsera** (CORS — ne šalje `Access-Control-Allow-Origin` zaglavlje). Zato aplikacija šalje email preko svoje serverless funkcije `api/send-email.ts` koja drži ključ na serveru i prosljeđuje Resendu. Ovo je urađeno i radi.

### 🎨 Dizajn emailova — logo i boje sajta (VEĆ URAĐENO)

Emailovi **nisu generički** — napravljeni su da izgledaju kao tvoja stranica:
- **Logo MYICON** stoji na vrhu svakog emaila — uzima se sa **ImgBB linka** (`https://i.ibb.co/60ff2bwD/logo-text-1.png`), pa se vidi u svakom mail klijentu (podešeno preko `VITE_EMAIL_LOGO_URL` u `.env`)
- **Boje brenda**: plava `#1E5AA8` (dugmeta, linkovi), limeta `#C5E337` (tanka traka na vrhu), ista pozadina i kartica kao na sajtu
- Plavo **dugme „Bestellung verfolgen"** kao na sajtu
- **Slika proizvoda** pored svakog artikla u emailu (slika koju je kupac vidio na sajtu). Ako proizvod nema sliku, prikazuje se sivi placeholder sa „MYiCON" — nijedan proizvod ne može biti bez slike u emailu

**Slike i linkovi u emailu koriste Vercel sajt:** `https://www.my-icon.shop` (podešeno preko `VITE_PUBLIC_URL` u `.env`). Dugme „Bestellung verfolgen" vodi na tvoj Vercel sajt.

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

Tvoja aplikacija je **frontend-only** (Vite SPA — sav kod se šalje u browser korisnika). Zato se Resend ključ **ne smije** nalaziti u browser kodu — svako bi ga mogao vidjeti (F12 → JS fajlovi).

#### ✅ URAĐENO — Sigurno (Nivo 2) ⭐
Ključ se drži **na serveru**, browser ga nikad ne vidi:

1. Napravljena je **Vercel serverless funkcija**: `api/send-email.ts` — ona drži ključ i šalje email.
2. Aplikacija poziva **svoju** funkciju (`/api/send-email`), a ne Resend direktno. (Ovo je i tehnički obavezno — Resend blokira direktne pozive iz browsera zbog CORS-a, pa emailovi bez ove funkcije uopće ne bi stizali.)
3. Ključ ide u **Vercel Environment Variables** (tamo je siguran, browser ga nikad ne dobije).

**Šta trebaš uraditi (jednom, ako već nisi):**
- [ ] U **Vercel → Settings → Environment Variables** dodaj:
  - **Key:** `RESEND_API_KEY`
  - **Value:** tvoj Resend ključ (`re_...`)
  - Označi **Production** → **Save**
- [ ] Poslije toga idi na **Deployments** → zadnji deployment → **⋯** → **Redeploy**
- [ ] Lokalno za testiranje, ključ stoji u `.env` kao `RESEND_API_KEY` (bez `VITE_` prefiksa)

> 🔒 **Pravilo:** ključ šalji samo meni (ili ga sam upiši u `.env`). **Nikad ga ne šalji** kupcima, ne stavljaj u GitHub, ne lijepi u chat grupe. Ako ikad procure — u Resend dashboardu obriši stari ključ i napravi novi (5 sekundi).

---

## 6. 🤖 GROQ — AI podrška u chatu (besplatno)

### Šta je Groq?
Groq je AI provajder sa **besplatnim nivoom** (bez kartice) koji nudi OpenAI GPT-OSS modele. Koristi se za **AI chat podršku** na sajtu — dugme dole desno gdje kupci mogu pitati o proizvodima, narudžbama, dostavi itd.

### Korak po korak (5 minuta)

**1. Kreiraj račun**
- Idi na: **https://console.groq.com**
- Registruj se (Google ili email) — **bez kartice**

**2. Napravi API ključ**
- U dashboardu klikni **"API Keys"**
- Klikni **"Create API Key"** → ime npr. `myicon` → **Create**
- **Kopiraj ključ** (izgleda kao `gsk_...`)

**3. Ključ u Vercel (najvažnije!)**
- **vercel.com** → projekat **myicon** → **Settings** → **Environment Variables**
- **Add New**: Key `GROQ_API_KEY`, Value tvoj ključ (`gsk_...`), označi **Production** → **Save**
- **Deployments** → zadnji deployment → **⋯** → **Redeploy**

### Kako AI radi
- **Poznaje sve proizvode** iz baze (naslov, cijena, opis, boje, veličine — uživo)
- **Provjerava status narudžbe** — kupac napiše broj `ord_...` i AI mu kaže status
- Odgovara **na njemačkom**
- **NE otkriva IBAN/BIC** u chatu — kupca šalje na email (pravilo u system promptu)
- Ključ se čuva **samo na serveru** (`api/chat.ts`) — nikad u browseru

> ✅ **Status:** kod napravljen i testiran lokalno — radi. Treba samo dodati `GROQ_API_KEY` u Vercel env vars + Redeploy.

---



## 2. 💳 PAYPAL — PRAVA plaćanja (INTEGRISANO ✅)

### Trenutno stanje
✅ **PayPal integracija je napravljena i radi sa PRAVIM (Live) plaćanjem.** Kada kupac klikne
„Mit PayPal bezahlen", prebacuje se na **paypal.com**, tamo se prijavi i plati, i tek kad je
uplata potvrđena, narudžba se kreira u bazi (status „Eingegangen / bezahlt"). Kupac i admin
dobijaju emailove kao i do sada.

### Kako radi (tehnički)
```
Kupac klikne „Mit PayPal bezahlen"
        ↓
Serverless funkcija api/paypal/create-order.ts kreira PayPal narudžbu
        ↓
Kupac se prebaci na paypal.com i odobri plaćanje
        ↓
Vraća se na sajt → api/paypal/capture-order.ts potvrđuje (capture) uplatu
        ↓
Tek sada se narudžba upisuje u Firebase + šalju se emailovi
        ↓
Kupac vidi „Vielen Dank für Ihre Bestellung!"
```

- **Ključevi su samo na serveru** (`PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` u Vercel env vars) — browser ih nikad ne vidi
- Live endpoint: `api-m.paypal.com` (sandbox se uključuje sa `PAYPAL_ENV=sandbox`)
- Narudžba se u bazi kreira **tek nakon što je novac stvarno naplaćen** — nema lažnih narudžbi

### Šta TI trebaš uraditi (jednom, 2 minute) ⭐

Da bi PayPal radio na živom sajtu, dodaj ključeve u Vercel:

1. **vercel.com** → projekat **myicon** → **Settings** → **Environment Variables**
2. Klikni **Add New** i dodaj **oba**:
   - **Key:** `PAYPAL_CLIENT_ID` → **Value:** tvoj Client ID (`AXKb...`)
   - **Key:** `PAYPAL_CLIENT_SECRET` → **Value:** tvoj Secret (`EA4o...`)
   - Oba označena za **Production** → **Save**
3. **Deployments** → zadnji deployment → **⋯** → **Redeploy**

> ✅ Lokalno su ključevi već upisani u `.env` — lokalni test radi odmah.

### Napomene
- **Webhook** (automatske obavijesti PayPal-a, npr. za povrate/refunde) **nije potreban** za osnovno plaćanje — naš flow potvrđuje uplatu odmah (capture). Možemo ga dodati kasnije za napredne stvari.
- Testiraj prvo sa **malim iznosom** (npr. najjeftiniji proizvod) — to je pravi novac.
- PayPal provizija: ~2,49% + 0,35 € po transakciji (njemačke cijene).

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

✅ **URAĐENO — pravi bankovni podaci su upisani** u `src/lib/bank.ts` (Ivan Muzeka, Deutsche Bank). Ako se ikad promijene, zamijeni ih u tom fajlu.

### Koji podaci ti trebaju (i odakle)

| Podatak | Vrijednost u aplikaciji | |
|---------|------------------------|--|
| **Ime primaoca (Empfänger)** | `Ivan Muzeka` | ✅ upisano |
| **IBAN** | `DE85 3707 0024 0319 8488 00` | ✅ upisano |
| **BIC / SWIFT** | `DEUTDEDBKOE` | ✅ upisano |
| **Naziv banke** | `Deutsche Bank` | ✅ upisano |
| **Verwendungszweck (svrha uplate)** | **Broj predračuna (proforma fakture)** — npr. `RE-2026-3F9A2C1B` | Automatski generiše aplikacija — jedinstven za svaku narudžbu |

### 📄 Broj predračuna (Rechnungsnummer)

Svaka narudžba dobija **svoj jedinstveni broj predračuna**, npr. `RE-2026-3F9A2C1B`:

- **Format:** `RE-<godina>-<jedinstveni dio iz broja narudžbe>` — npr. narudžba `ord_3f9a2c1b` → predračun `RE-2026-3F9A2C1B`
- **Kupac ga dobija odmah nakon narudžbe** — u emailu potvrde i na stranici „Vielen Dank für Ihre Bestellung"
- **Verwendungszweck = taj isti broj** — kupac ga unese pri uplati, a ti po njemu prepoznaš koja uplata pripada kojoj narudžbi (jedan broj = jedna narudžba = jedna uplata)
- Bankovni podaci se **ne prikazuju na checkout stranici** — kupac ih dobija tek u emailu nakon narudžbe (kako si tražio)

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
  holder: "Ivan Muzeka",
  iban: "DE85 3707 0024 0319 8488 00",
  bic: "DEUTDEDBKOE",
  bankName: "Deutsche Bank",
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
- [x] **Resend ključ:** `/api/send-email` serverless funkcija napravljena ✅ — samo još provjeri da je `RESEND_API_KEY` dodat u Vercel env vars (Settings → Environment Variables → Redeploy)
- [ ] **PayPal:** Business račun kreiran; Client ID + Secret predati meni
- [ ] **Kartica (Stripe):** račun kreiran + verifikovan; Publishable + Secret key predati meni
- [ ] **Banka:** pravi IBAN + BIC + ime upisani u `src/lib/bank.ts`
- [ ] **eBay:** odlučeno — Opcija A (ručno, ništa ne treba) ili Opcija B (API, treba developers račun)
- [ ] Test narudžba: kupi proizvod preko Vorkasse → dobiješ email sa IBAN-om → u adminu klikneš "Zahlung erhalten" → kupac dobije email o uplati

### Šta mi treba da pošalješ da krenemo
1. **Resend API ključ** ✅ već poslan — sljedeći korak: provjeri `RESEND_API_KEY` u Vercel env vars
2. **Pravi bankovni podaci** (holder, IBAN, BIC, banka) — ili reci "ostavi fejk za sad"
3. **PayPal:** Business račun + Client ID + Secret
4. **Kartica:** Stripe račun + Publishable key + Secret key
5. **eBay odluku:** Opcija A ili B — ako B, treba mi App ID + Cert ID
