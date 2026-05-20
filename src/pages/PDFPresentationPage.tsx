function PDFPresentationPage() {
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
            MyIcon Shop
          </h1>
          <h2 className="text-3xl text-gray-600 mb-8">
            E-Commerce Platforma za Personalizovane Proizvode
          </h2>
          <div className="text-xl text-gray-500 space-y-2">
            <p>Web Aplikacija</p>
            <p>React + TypeScript + Firebase</p>
            <p className="mt-8">{new Date().toLocaleDateString('bs-BA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Page 2 - Pregled Projekta */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Pregled Projekta</h2>
        <div className="grid grid-cols-2 gap-12 flex-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Svrha</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Online platforma za dizajniranje i naručivanje personalizovanih proizvoda 
                (majice, duksevi, kape) sa custom dizajnom.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">👥 Ciljana Grupa</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kompanije, timovi, organizacije i pojedinci koji žele brendirane proizvode 
                sa vlastitim logom ili dizajnom.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">💡 Ključna Prednost</h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                Interaktivni designer koji omogućava real-time pregled proizvoda sa 
                custom dizajnom prije naručivanja.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 Statistika</h3>
              <div className="space-y-4 text-xl text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span>Proizvoda:</span>
                  <span className="font-semibold">34</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Kategorija:</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Boja po proizvodu:</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Tehnologija:</span>
                  <span className="font-semibold">React + Firebase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 - Tehnologije */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Tehnologije i Alati</h2>
        <div className="grid grid-cols-3 gap-8 flex-1">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">Frontend</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>✓ React 18</li>
              <li>✓ TypeScript</li>
              <li>✓ Vite</li>
              <li>✓ Tailwind CSS</li>
              <li>✓ React Router</li>
              <li>✓ Zustand (State Management)</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-orange-900 mb-6">Backend & Storage</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>✓ Firebase Firestore</li>
              <li>✓ Firebase Authentication</li>
              <li>✓ Firebase Storage</li>
              <li>✓ ImgBB CDN</li>
              <li>✓ Real-time Database</li>
            </ul>
          </div>
          <div className="bg-green-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-green-900 mb-6">Design & Canvas</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li>✓ Konva.js (Canvas)</li>
              <li>✓ Fabric.js</li>
              <li>✓ Green-screen Recoloring</li>
              <li>✓ Image Manipulation</li>
              <li>✓ Real-time Preview</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Deployment & Hosting</h3>
          <p className="text-lg text-gray-600">Vercel (Frontend) + Firebase (Backend & Database)</p>
        </div>
      </div>

      {/* Page 4 - Ključne Funkcionalnosti */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Ključne Funkcionalnosti</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-blue-900 mb-3">🎨 Interaktivni Designer</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Upload custom logo/slike</li>
                <li>• Dodavanje teksta sa custom fontovima</li>
                <li>• Geometrijski oblici i elementi</li>
                <li>• Real-time preview na proizvodu</li>
                <li>• Drag & drop funkcionalnost</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-purple-900 mb-3">🛒 E-Commerce Sistem</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Korpa sa real-time ažuriranjem</li>
                <li>• Wishlist funkcionalnost</li>
                <li>• Checkout proces</li>
                <li>• Praćenje narudžbi</li>
                <li>• Quantity pricing</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-3">👤 Korisnički Sistem</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Registracija i prijava</li>
                <li>• Profil korisnika</li>
                <li>• Historija narudžbi</li>
                <li>• Sačuvani draft dizajni</li>
                <li>• Wishlist proizvoda</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-orange-900 mb-3">⚙️ Admin Panel</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Upravljanje proizvodima</li>
                <li>• Upravljanje kategorijama</li>
                <li>• Pregled narudžbi</li>
                <li>• Uređivanje sadržaja</li>
                <li>• Statistika i izvještaji</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Page 5 - Performanse i Optimizacije */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Performanse i Optimizacije</h2>
        <div className="space-y-8">
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-3xl font-semibold text-blue-900 mb-6">📸 ImgBB Image Hosting</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Prednosti:</h4>
                <ul className="space-y-2 text-lg text-gray-700">
                  <li>✓ Potpuno besplatno (unlimited storage)</li>
                  <li>✓ CDN distribucija</li>
                  <li>✓ Dostupno u BiH (Cloudinary blokiran)</li>
                  <li>✓ Automatski backup</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Rezultati:</h4>
                <ul className="space-y-2 text-lg text-gray-700">
                  <li>📊 70-75% brže učitavanje slika</li>
                  <li>📦 Kompresija: 1.5MB → 800KB</li>
                  <li>🖼️ Rezolucija: 1400px (optimalno)</li>
                  <li>⚡ DNS preconnect za brzinu</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">🎯 UX Optimizacije</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Skeleton loading za sve slike</li>
                <li>• Smooth fade-in animacije</li>
                <li>• Responsive design (360px+)</li>
                <li>• Mobile-first pristup</li>
                <li>• Intuitivna navigacija</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">⚡ Tehnička Optimizacija</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Terser minifikacija</li>
                <li>• Code splitting</li>
                <li>• Lazy loading komponenti</li>
                <li>• Optimizovani bundlovi</li>
                <li>• Caching strategije</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Page 6 - Arhitektura */}
      <div className="h-screen flex flex-col p-16 border-b-8 border-gray-200">
        <h2 className="text-5xl font-bold text-gray-900 mb-12">Arhitektura Sistema</h2>
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Frontend Layer</h3>
              <p className="text-lg text-gray-700">React SPA sa TypeScript, Vite build tool, Tailwind CSS za styling</p>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl text-gray-400">↕️</div>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-orange-900 mb-4">Backend Layer</h3>
              <p className="text-lg text-gray-700">Firebase Firestore (NoSQL), Firebase Auth, Real-time listeners</p>
            </div>
            <div className="flex justify-center">
              <div className="text-4xl text-gray-400">↕️</div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Storage Layer</h3>
              <p className="text-lg text-gray-700">ImgBB CDN (product images), Local storage (mockup templates)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page 7 - Zaključak */}
      <div className="h-screen flex flex-col items-center justify-center p-16">
        <div className="text-center space-y-12 max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-8">Zaključak</h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-3xl">
            <p className="text-2xl text-gray-700 leading-relaxed mb-8">
              MyIcon Shop je moderna, skalabilna e-commerce platforma koja kombinuje 
              intuitivni dizajn sa naprednim funkcionalnostima za personalizaciju proizvoda.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">70%+</div>
                <div className="text-gray-600">Brže učitavanje</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Besplatno hosting</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-purple-600 mb-2">34</div>
                <div className="text-gray-600">Proizvoda</div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-xl text-gray-500">
            <p>Hvala na pažnji!</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default PDFPresentationPage;
