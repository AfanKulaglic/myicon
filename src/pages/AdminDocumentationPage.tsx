export default function AdminDocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page 1 - Cover */}
      <div className="h-screen flex flex-col items-center justify-center p-16 border-b-8 border-gray-200">
        <div className="text-center space-y-8">
          <div className="mb-12">
            <img 
              src="/logo/logo text.png" 
              alt="Logo" 
              className="h-24 mx-auto mb-8"
            />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Admin Panel
          </h1>
          <h2 className="text-3xl text-gray-600 mb-8">
            Dokumentacija za Administratore
          </h2>
          <div className="text-xl text-gray-500 space-y-2">
            <p>Kompletno Uputstvo za Korištenje</p>
            <p>MyIcon Shop Admin Panel</p>
            <p className="mt-8">{new Date().toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Page 2 - Pristup Admin Panelu */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Pristup Admin Panelu</h2>
        <div className="space-y-8 flex-1">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-3xl font-semibold text-blue-900 mb-6">🔐 Kako Pristupiti</h3>
            <div className="space-y-6 text-xl text-gray-700">
              <div className="bg-white p-6 rounded-xl">
                <p className="font-semibold text-blue-800 mb-3">Korak 1: Otvorite Admin URL</p>
                <p className="font-mono bg-gray-100 p-4 rounded-lg text-lg">
                  https://vašdomen.com/admin
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <p className="font-semibold text-blue-800 mb-3">Korak 2: Unesite Admin Kod</p>
                <p>Pojavit će se ekran za unos admin koda. Unesite vaš sigurnosni kod.</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <p className="font-semibold text-blue-800 mb-3">Korak 3: Pristup Odobren</p>
                <p>Nakon uspješne prijave, vidjet ćete admin dashboard sa svim opcijama.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-orange-900 mb-4">⚠️ Važne Napomene</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>• Admin kod je potreban za svaki pristup panelu</li>
              <li>• Kod možete promijeniti u Settings tabu</li>
              <li>• Čuvajte kod na sigurnom mjestu</li>
              <li>• Ne dijelite kod sa neovlaštenim osobama</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Page 3 - Dashboard */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">📊 Dashboard</h2>
        <div className="grid grid-cols-2 gap-8 flex-1">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Šta je Dashboard?</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Dashboard je početna stranica admin panela koja prikazuje pregled najvažnijih 
                informacija o vašoj prodavnici.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistike</h3>
              <div className="space-y-3 text-lg text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span>📦 Ukupno Narudžbi</span>
                  <span className="font-semibold">Broj svih narudžbi</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>💰 Ukupan Prihod</span>
                  <span className="font-semibold">Suma svih narudžbi</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>📦 Broj Proizvoda</span>
                  <span className="font-semibold">Aktivni proizvodi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Nedavne Narudžbe</h3>
              <p className="text-lg text-gray-700 mb-4">
                Prikazuje 5 najnovijih narudžbi sa:
              </p>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• ID narudžbe</li>
                <li>• Datum kreiranja</li>
                <li>• Status narudžbe</li>
                <li>• Ukupan iznos</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Brzi Pristup</h3>
              <p className="text-lg text-gray-700">
                Kliknite na "View All" da vidite sve narudžbe ili koristite navigaciju 
                sa lijeve strane za pristup drugim sekcijama.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page 4 - Products */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">📦 Products (Proizvodi)</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <h3 className="text-2xl font-semibold text-purple-900 mb-4">Upravljanje Proizvodima</h3>
            <p className="text-lg text-gray-700">
              Ovdje možete dodavati, uređivati i brisati proizvode u vašoj prodavnici.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">➕ Dodavanje Proizvoda</h3>
              <ol className="space-y-3 text-lg text-gray-700 list-decimal list-inside">
                <li>Kliknite "New Product" dugme</li>
                <li>Popunite osnovne informacije:
                  <ul className="ml-6 mt-2 space-y-1 text-base">
                    <li>- Naziv proizvoda</li>
                    <li>- Slug (URL)</li>
                    <li>- Opis</li>
                    <li>- Kategorija</li>
                  </ul>
                </li>
                <li>Postavite cijenu i količinu</li>
                <li>Upload slike proizvoda</li>
                <li>Dodajte boje i veličine</li>
                <li>Definirajte print zone</li>
                <li>Kliknite "Save"</li>
              </ol>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">✏️ Uređivanje Proizvoda</h3>
              <ol className="space-y-3 text-lg text-gray-700 list-decimal list-inside">
                <li>Pronađite proizvod u listi</li>
                <li>Kliknite ikonu olovke (Edit)</li>
                <li>Izmijenite željene podatke</li>
                <li>Kliknite "Save" za čuvanje</li>
              </ol>
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">🗑️ Brisanje</h4>
                <p className="text-base text-gray-600">
                  Kliknite crvenu ikonu kante za brisanje. Potvrdite akciju u dijalogu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">📥 Import Mock Data</h3>
            <p className="text-lg text-gray-700">
              Dugme "Import from Mock" omogućava brzo učitavanje testnih proizvoda. 
              Korisno za početno postavljanje ili testiranje.
            </p>
          </div>
        </div>
      </div>

      {/* Page 5 - Categories & Orders */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">🏷️ Categories & 🛍️ Orders</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Categories</h3>
              <p className="text-lg text-gray-700 mb-4">
                Upravljanje kategorijama proizvoda i potkategorijama.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Funkcionalnosti</h3>
              <ul className="space-y-3 text-lg text-gray-700">
                <li>✓ Uređivanje naziva kategorije</li>
                <li>✓ Promjena opisa</li>
                <li>✓ Upload slike kategorije</li>
                <li>✓ Dodavanje potkategorija</li>
                <li>✓ Brisanje potkategorija</li>
                <li>✓ Import mock podataka</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>Napomena:</strong> Kliknite na kategoriju da je proširite i uredite.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-orange-900 mb-4">Orders</h3>
              <p className="text-lg text-gray-700 mb-4">
                Pregled i upravljanje svim narudžbama kupaca.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Statusi Narudžbi</h3>
              <div className="space-y-3 text-base text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>
                  <span>Nova narudžba, čeka obradu</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Processing</span>
                  <span>U obradi</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Shipped</span>
                  <span>Poslano</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Delivered</span>
                  <span>Dostavljeno</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">Cancelled</span>
                  <span>Otkazano</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>Promjena statusa:</strong> Kliknite na dropdown meni sa statusom i odaberite novi status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page 6 - Content Management */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">📝 Content (Sadržaj)</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
            <h3 className="text-2xl font-semibold text-indigo-900 mb-4">Uređivanje Sadržaja Stranica</h3>
            <p className="text-lg text-gray-700">
              Najmoćnija sekcija admin panela - omogućava uređivanje svih tekstova, slika i 
              sadržaja na web stranici bez potrebe za programiranjem.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🏠 Home</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Hero sekcija</li>
                <li>• How It Works</li>
                <li>• CTA sekcija</li>
                <li>• Trust Strip</li>
                <li>• Kategorije</li>
                <li>• Bestsellers</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📄 Stranice</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• About</li>
                <li>• FAQ</li>
                <li>• Contact</li>
                <li>• Terms</li>
                <li>• Privacy</li>
                <li>• Imprint</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🧩 Komponente</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Navbar</li>
                <li>• Footer</li>
                <li>• Cart</li>
                <li>• Wishlist</li>
                <li>• Login/Register</li>
                <li>• Account</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-green-900 mb-4">✨ Live Preview</h3>
            <p className="text-lg text-gray-700 mb-3">
              Dok uređujete sadržaj, desna strana ekrana prikazuje LIVE PREVIEW - 
              vidite promjene u realnom vremenu prije nego što ih sačuvate!
            </p>
            <div className="bg-white p-4 rounded-lg mt-3">
              <p className="text-base text-gray-600">
                <strong>Kako funkcioniše:</strong> Unesite tekst u polje → Promjena se odmah vidi 
                na previewu → Kliknite "Save" da sačuvate promjene
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page 7 - Settings & Tips */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">⚙️ Settings & Savjeti</h2>
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl">
            <h3 className="text-3xl font-semibold text-red-900 mb-6">Settings</h3>
            <div className="bg-white p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Promjena Admin Koda</h4>
              <ol className="space-y-3 text-lg text-gray-700 list-decimal list-inside">
                <li>Idite na Settings tab</li>
                <li>Unesite novi admin kod (minimum 4 karaktera)</li>
                <li>Potvrdite novi kod</li>
                <li>Kliknite "Save Code"</li>
                <li>Novi kod će biti aktivan odmah</li>
              </ol>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-base text-gray-700">
                  <strong>⚠️ Važno:</strong> Zapamtite novi kod! Bez njega nećete moći pristupiti admin panelu.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">💡 Korisni Savjeti</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li>✓ Redovno provjeravajte nove narudžbe</li>
                <li>✓ Ažurirajte statuse narudžbi na vrijeme</li>
                <li>✓ Koristite Live Preview prije čuvanja</li>
                <li>✓ Testirajte promjene na stranici</li>
                <li>✓ Pravite backup prije velikih promjena</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-900 mb-4">🎯 Best Practices</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li>✓ Koristite kvalitetne slike (min 1400px)</li>
                <li>✓ Pišite jasne opise proizvoda</li>
                <li>✓ Održavajte konzistentan stil</li>
                <li>✓ Redovno ažurirajte sadržaj</li>
                <li>✓ Odgovarajte brzo na narudžbe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Page 8 - Kako Promjene Utiču na Stranicu */}
      <div className="h-screen flex flex-col p-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">🔄 Kako Promjene Utiču na Stranicu</h2>
        <div className="space-y-6 flex-1">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-purple-900 mb-6">Real-Time Ažuriranje</h3>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Sve promjene koje napravite u admin panelu se ODMAH reflektuju na live stranici!
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📦 Proizvodi</h4>
                <p className="text-base text-gray-600">
                  Dodavanje/uređivanje proizvoda → Odmah vidljivo na stranici proizvoda i kategorijama
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📝 Sadržaj</h4>
                <p className="text-base text-gray-600">
                  Promjena teksta/slika → Odmah ažurirano na odgovarajućoj stranici
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🏷️ Kategorije</h4>
                <p className="text-base text-gray-600">
                  Uređivanje kategorija → Odmah vidljivo u navigaciji i na home stranici
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🛍️ Narudžbe</h4>
                <p className="text-base text-gray-600">
                  Promjena statusa → Kupac vidi ažurirani status u svom accountu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">✅ Zaključak</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Admin panel vam daje potpunu kontrolu nad vašom online prodavnicom. 
              Sve promjene su trenutne, sigurne i lako se mogu vratiti ako je potrebno. 
              Za dodatnu pomoć ili pitanja, kontaktirajte tehničku podršku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
