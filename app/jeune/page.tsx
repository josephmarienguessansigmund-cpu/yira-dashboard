'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EspaceJeune() {
  const router = useRouter();
  const [tab, setTab] = useState('accueil');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 text-sm">← Accueil</button>
          <div className="w-px h-4 bg-gray-200" />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1D9E75' }}>Y</div>
          <div className="font-semibold text-gray-900">Espace Jeune</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full" style={{ background: '#E1F5EE', color: '#085041' }}>
          Non connecté
        </div>
      </header>

      {/* Nav tabs */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6 max-w-4xl mx-auto">
          {[
            { id: 'accueil', label: 'Accueil' },
            { id: 'inscription', label: 'Inscription' },
            { id: 'evaluation', label: 'Évaluation' },
            { id: 'parcours', label: 'Mon Parcours' },
            { id: 'carte', label: 'Ma Carte' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {tab === 'accueil' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur YIRA</h1>
              <p className="text-gray-500 mb-8">Votre plateforme d'orientation et d'insertion professionnelle</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button onClick={() => setTab('inscription')} className="p-4 rounded-xl text-white font-medium" style={{ background: '#1D9E75' }}>
                  S'inscrire
                </button>
                <button onClick={() => setTab('evaluation')} className="p-4 rounded-xl border-2 font-medium" style={{ borderColor: '#1D9E75', color: '#1D9E75' }}>
                  Reprendre
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Évaluation SigmundTest', desc: 'Découvrez votre profil RIASEC', icon: '🧠' },
                { label: 'Formation CQP/NVQ', desc: 'Trouvez votre filière', icon: '📚' },
                { label: 'Insertion emploi', desc: 'Matchez avec 500+ employeurs', icon: '💼' },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <div className="font-medium text-gray-900 text-sm mb-1">{c.label}</div>
                  <div className="text-gray-500 text-xs">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'inscription' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Inscription YIRA</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Prénom</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Kouassi" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nom</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Yao" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="+225 07 00 00 00" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date de naissance</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Niveau d'études</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Sans diplôme</option>
                  <option>CEPE</option>
                  <option>BEPC</option>
                  <option>BAC</option>
                  <option>BTS / Licence+</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">District</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Abidjan</option>
                  <option>Bouaké</option>
                  <option>Yamoussoukro</option>
                  <option>San-Pédro</option>
                  <option>Autre</option>
                </select>
              </div>
              <button className="w-full py-3 rounded-xl text-white font-medium mt-2" style={{ background: '#1D9E75' }}>
                Créer mon compte YIRA
              </button>
            </div>
          </div>
        )}

        {tab === 'evaluation' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Évaluation SigmundTest®</h2>
            <p className="text-gray-500 text-sm mb-6">Entrez votre code YIRA pour reprendre votre évaluation</p>
            <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center font-mono text-lg mb-4" placeholder="YIR-CI-2026-XXXXX" />
            <button className="w-full py-3 rounded-xl text-white font-medium" style={{ background: '#185FA5' }}>
              Reprendre l'évaluation
            </button>
            <div className="mt-4 text-xs text-gray-400">Pas de code ? Inscrivez-vous d'abord</div>
          </div>
        )}

        {tab === 'parcours' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Parcours YIRA</h2>
            <div className="space-y-4">
              {[
                { etape: 'Inscription', statut: 'done', date: '08/04/2026' },
                { etape: 'Évaluation SigmundTest', statut: 'active', date: 'En cours' },
                { etape: 'Restitution conseiller', statut: 'pending', date: 'À venir' },
                { etape: 'Formation CQP', statut: 'pending', date: 'À venir' },
                { etape: 'Certification', statut: 'pending', date: 'À venir' },
                { etape: 'Insertion emploi', statut: 'pending', date: 'À venir' },
                { etape: 'Suivi 12 mois', statut: 'pending', date: 'À venir' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    e.statut === 'done' ? 'bg-green-100 text-green-700' :
                    e.statut === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {e.statut === 'done' ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${e.statut === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{e.etape}</div>
                    <div className="text-xs text-gray-400">{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'carte' && (
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl p-6 text-white mb-6" style={{ background: 'linear-gradient(135deg, #1D9E75, #085041)' }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs opacity-70 mb-1">YIRA Africa</div>
                  <div className="font-bold text-lg">Carte de Compétences</div>
                </div>
                <div className="text-2xl">💳</div>
              </div>
              <div className="mb-6">
                <div className="text-xs opacity-70 mb-1">Bénéficiaire</div>
                <div className="font-bold">Kouassi Yao</div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-70 mb-1">Code YIRA</div>
                  <div className="font-mono text-sm">YIR-CI-2026-00142</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-70 mb-1">Niveau</div>
                  <div className="font-bold">N2 · BAC</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-gray-500 text-sm">QR Code de vérification</div>
              <div className="w-24 h-24 bg-gray-100 rounded-xl mx-auto mt-3 flex items-center justify-center text-3xl">◼</div>
              <div className="text-xs text-gray-400 mt-2">Scannez pour vérifier les certifications</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}