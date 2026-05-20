export default function AdminDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Page 1 - Cover */}
      <div className="h-screen flex flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="text-center space-y-8 relative z-10">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-30 animate-pulse"></div>
            <img 
              src="/logo/logo text.png" 
              alt="Logo" 
              className="h-28 mx-auto mb-8 relative z-10 drop-shadow-2xl"
            />
          </div>
          
          <div className="space-y-6">
            <div className="inline-block">
              <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Admin Panel
              </h1>
              <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-700 mb-8">
              Dokumentacija za Administratore
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xl font-semibold text-gray-700">Kompletno Uputstvo za Korištenje</p>
            </div>
            
            <p className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyIcon Shop Admin Panel
            </p>
            
            <div className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg">
              <p className="text-lg text-gray-600 font-medium">
                📅 {new Date().toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Page 2 - Pristup Admin Panelu */}
      <div className="h-screen flex flex-col p-16 relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-block mb-12">
            <h2 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Pristup Admin Panelu
            </h2>
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8 flex-1 relative z-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-10 rounded-3xl shadow-2xl border border-blue-400/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                  🔐
                </div>
                <h3 className="text-4xl font-bold text-white">Kako Pristupiti</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">1</div>
                    <div className="flex-1">
                      <p className="font-bold text-xl text-blue-900 mb-3">Otvorite Admin URL</p>
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl shadow-inner">
                        <p className="font-mono text-green-400 text-lg">https://vašdomen.com/admin</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">2</div>
                    <div className="flex-1">
                      <p className="font-bold text-xl text-purple-900 mb-3">Unesite Admin Kod</p>
                      <p className="text-lg text-gray-700">Pojavit će se ekran za unos admin koda. Unesite vaš sigurnosni kod.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">3</div>
                    <div className="flex-1">
                      <p className="font-bold text-xl text-green-900 mb-3">Pristup Odobren ✓</p>
                      <p className="text-lg text-gray-700">Nakon uspješne prijave, vidjet ćete admin dashboard sa svim opcijama.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-3xl shadow-xl border-2 border-orange-300/50">
            <div className="flex items-start gap-4">
              <div className="text-5xl">⚠️</div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Važne Napomene</h3>
                <ul className="space-y-3 text-lg text-gray-800">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Admin kod je potreban za svaki pristup panelu
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Kod možete promijeniti u Settings tabu
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Čuvajte kod na sigurnom mjestu
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Ne dijelite kod sa neovlaštenim osobama
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 - Dashboard */}
      <div className="h-screen flex flex-col p-16 relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 mb-12">
          <div className="inline-flex items-center gap-4 mb-3">
            <div className="text-6xl">📊</div>
            <h2 className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-64"></div>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1 relative z-10">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Šta je Dashboard?</h3>
                <p className="text-xl leading-relaxed text-blue-50">
                  Dashboard je početna stranica admin panela koja prikazuje pregled najvažnijih 
                  informacija o vašoj prodavnici.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📈
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Statistike</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                  <span className="text-lg font-medium text-gray-700">📦 Ukupno Narudžbi</span>
                  <span className="font-bold text-blue-600">Broj svih narudžbi</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                  <span className="text-lg font-medium text-gray-700">💰 Ukupan Prihod</span>
                  <span className="font-bold text-green-600">Suma svih narudžbi</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                  <span className="text-lg font-medium text-gray-700">📦 Broj Proizvoda</span>
                  <span className="font-bold text-purple-600">Aktivni proizvodi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-3xl">📋</span>
                  Nedavne Narudžbe
                </h3>
                <p className="text-xl mb-4 text-green-50">
                  Prikazuje 5 najnovijih narudžbi sa:
                </p>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    ID narudžbe
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Datum kreiranja
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Status narudžbe
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Ukupan iznos
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-3xl shadow-xl border-2 border-purple-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⚡</span>
                <h3 className="text-2xl font-bold text-purple-900">Brzi Pristup</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
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
