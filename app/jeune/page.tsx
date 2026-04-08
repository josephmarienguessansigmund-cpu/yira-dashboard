'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, endpoints } from '@/lib/api';

export default function EspaceJeune() {
  const router = useRouter();
  const [tab, setTab] = useState('accueil');
  const [form, setForm] = useState({
    prenom: '', nom: '', telephone: '', date_naissance: '',
    niveau_etude: 'bepc', district: 'Abidjan', genre: 'homme',
  });
  const [codeYira, setCodeYira] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [codeRecherche, setCodeRecherche] = useState('');

  const inscrire = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.post(endpoints.auth.inscription, {
        ...form,
        consentement_rgpd: true,
        canal_inscription: 'web',
        country_code: 'CI',
      });
      setCodeYira(data.code_yira ?? data.data?.code_yira ?? '');
      setMessage('Inscription reussie !');
      setTab('code');
    } catch (err: any) {
      setMessage('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 text-sm">Accueil</button>
          <div className="w-px h-4 bg-gray-200" />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1D9E75' }}>Y</div>
          <div className="font-semibold text-gray-900">Espace Jeune</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full" style={{ background: '#E1F5EE', color: '#085041' }}>
          YIRA Africa
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6 max-w-4xl mx-auto">
          {[
            { id: 'accueil', label: 'Accueil' },
            { id: 'inscription', label: 'Inscription' },
            { id: 'evaluation', label: 'Evaluation' },
            { id: 'parcours', label: 'Mon Parcours' },
            { id: 'carte', label: 'Ma Carte' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {tab === 'accueil' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="text-5xl mb-4">ðŸŽ“</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur YIRA Africa</h1>
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
                { label: 'Evaluation SigmundTest', desc: 'Decouvrez votre profil RIASEC', icon: 'ðŸ§ ' },
                { label: 'Formation CQP/NVQ', desc: 'Trouvez votre filiere', icon: 'ðŸ“š' },
                { label: 'Insertion emploi', desc: 'Matchez avec 500+ employeurs', icon: 'ðŸ’¼' },
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
            {message && (
              <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Prenom</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Kouassi" value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nom</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Yao" value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Telephone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="+225 07 00 00 00" value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date de naissance</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.date_naissance}
                  onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Genre</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="nsp">Je ne souhaite pas repondre</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Niveau d'etudes</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.niveau_etude} onChange={(e) => setForm({ ...form, niveau_etude: e.target.value })}>
                  <option value="sans">Sans diplome</option>
                  <option value="cepe">CEPE</option>
                  <option value="bepc">BEPC</option>
                  <option value="bac">BAC</option>
                  <option value="bts_licence">BTS / Licence+</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">District</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  <option>Abidjan</option>
                  <option>Bouake</option>
                  <option>Yamoussoukro</option>
                  <option>San-Pedro</option>
                  <option>Daloa</option>
                  <option>Korhogo</option>
                  <option>Autre</option>
                </select>
              </div>
              <button onClick={inscrire} disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium mt-2 disabled:opacity-50"
                style={{ background: '#1D9E75' }}>
                {loading ? 'Inscription en cours...' : 'Creer mon compte YIRA'}
              </button>
            </div>
          </div>
        )}

        {tab === 'code' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto text-center">
            <div className="text-5xl mb-4">ðŸŽ‰</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Inscription reussie !</h2>
            <p className="text-gray-500 text-sm mb-6">Votre code YIRA unique :</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="font-mono text-2xl font-bold text-green-700">{codeYira}</div>
            </div>
            <p className="text-xs text-gray-400 mb-6">Conservez ce code â€” il vous permettra de reprendre votre evaluation sur n'importe quel canal</p>
            <button onClick={() => setTab('evaluation')} className="w-full py-3 rounded-xl text-white font-medium" style={{ background: '#1D9E75' }}>
              Demarrer mon evaluation
            </button>
          </div>
        )}

        {tab === 'evaluation' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto text-center">
            <div className="text-4xl mb-4">ðŸ§ </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Evaluation SigmundTest</h2>
            <p className="text-gray-500 text-sm mb-6">Entrez votre code YIRA</p>
            <input className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center font-mono text-lg mb-4"
              placeholder="YIR-CI-2026-XXXXX" value={codeRecherche}
              onChange={(e) => setCodeRecherche(e.target.value)} />
            <button className="w-full py-3 rounded-xl text-white font-medium" style={{ background: '#185FA5' }}>
              Reprendre l'evaluation
            </button>
            <div className="mt-4 text-xs text-gray-400">Pas de code ? Inscrivez-vous d'abord</div>
          </div>
        )}

        {tab === 'parcours' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Parcours YIRA</h2>
            <div className="space-y-4">
              {[
                { etape: 'Inscription', statut: 'done' },
                { etape: 'Evaluation SigmundTest', statut: 'active' },
                { etape: 'Restitution conseiller', statut: 'pending' },
                { etape: 'Formation CQP', statut: 'pending' },
                { etape: 'Certification', statut: 'pending' },
                { etape: 'Insertion emploi', statut: 'pending' },
                { etape: 'Suivi 12 mois', statut: 'pending' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${e.statut === 'done' ? 'bg-green-100 text-green-700' : e.statut === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                    {e.statut === 'done' ? 'âœ“' : i + 1}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{e.etape}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'carte' && (
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl p-6 text-white mb-6" style={{ background: '#1D9E75' }}>
              <div className="text-xs opacity-70 mb-1">YIRA Africa</div>
              <div className="font-bold text-lg mb-8">Carte de Competences</div>
              <div className="mb-4">
                <div className="text-xs opacity-70 mb-1">Code YIRA</div>
                <div className="font-mono text-sm">{codeYira || 'YIR-CI-2026-XXXXX'}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}