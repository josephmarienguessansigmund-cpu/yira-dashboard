'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yira-api-production.up.railway.app/api/v1';
const HEADERS = { 'Content-Type': 'application/json', 'X-Tenant-ID': 'ci' };

const api = {
  post: async (url: string, body: any) => {
    const r = await fetch(`${API}${url}`, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  get: async (url: string) => {
    const r = await fetch(`${API}${url}`, { headers: HEADERS });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
};

type Etape = 'accueil' | 'inscription' | 'code' | 'filtre' | 'test' | 'resultat';
type Parcours = 'scolaire' | 'professionnel' | null;

const PROFILS: Record<string, { nom: string; desc: string; couleur: string; bg: string; emoji: string }> = {
  R: { nom: 'Réaliste', desc: 'Métiers techniques, manuels, BTP, mécanique, agriculture', couleur: '#B45309', bg: '#FEF3C7', emoji: '🔧' },
  I: { nom: 'Investigateur', desc: 'Sciences, données, ingénierie, santé, recherche', couleur: '#1D4ED8', bg: '#DBEAFE', emoji: '🔬' },
  A: { nom: 'Artistique', desc: 'Design, communication, audiovisuel, mode, artisanat', couleur: '#7C3AED', bg: '#EDE9FE', emoji: '🎨' },
  S: { nom: 'Social', desc: 'Santé, enseignement, RH, ONG, service aux personnes', couleur: '#059669', bg: '#D1FAE5', emoji: '🤝' },
  E: { nom: 'Entrepreneur', desc: 'Commerce, management, vente, business, leadership', couleur: '#DC2626', bg: '#FEE2E2', emoji: '🚀' },
  C: { nom: 'Conventionnel', desc: 'Administration, comptabilité, logistique, banque', couleur: '#0891B2', bg: '#CFFAFE', emoji: '📊' },
};

const FILIERES: Record<string, { label: string; couleur: string; bg: string; delai: string }> = {
  A: { label: 'Filière A — Emploi Direct', couleur: '#059669', bg: '#D1FAE5', delai: '< 1 mois' },
  B: { label: 'Filière B — Accompagnement Renforcé', couleur: '#1D4ED8', bg: '#DBEAFE', delai: '2-3 mois' },
  C: { label: 'Filière C — Stage Passerelle', couleur: '#D97706', bg: '#FEF3C7', delai: '< 6 mois' },
  INFORMEL: { label: 'Parcours Informel', couleur: '#7C3AED', bg: '#EDE9FE', delai: 'Flexible' },
};

export default function EspaceJeune() {
  const router = useRouter();
  const [etape, setEtape] = useState<Etape>('accueil');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [districts, setDistricts] = useState<{code:string;nom:string}[]>([]);

  // Inscription
  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '', date_naissance: '', genre: 'homme', niveau_etude: 'bepc', district: 'Abidjan' });
  const [codeYira, setCodeYira] = useState('');

  // Evaluation
  const [codeRecherche, setCodeRecherche] = useState('');
  const [parcours, setParcours] = useState<Parcours>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [reponses, setReponses] = useState<{question_id:number; valeur:number}[]>([]);
  const [resultat, setResultat] = useState<any>(null);
  const [niveauEval, setNiveauEval] = useState('N1');

  useEffect(() => {
    api.get('/pays/CI/districts').then(d => setDistricts(d.data || [])).catch(() => {});
  }, []);

  const inscrire = async () => {
    if (!form.prenom || !form.nom || !form.telephone) { setErreur('Prénom, nom et téléphone sont obligatoires'); return; }
    setLoading(true); setErreur('');
    try {
      const niveau = form.niveau_etude === 'bts_licence' ? 'N3' : form.niveau_etude === 'bac' ? 'N2' : 'N1';
      setNiveauEval(niveau);
      const data = await api.post('/auth/beneficiaire/inscription', { ...form, country_code: 'CI', consentement_rgpd: true, canal_inscription: 'web' });
      setCodeYira(data.code_yira || '');
      setEtape('code');
    } catch (e: any) { setErreur('Erreur : ' + e.message); }
    finally { setLoading(false); }
  };

  const lancerTest = async (choix: Parcours) => {
    setParcours(choix);
    setLoading(true); setErreur('');
    try {
      const code = codeRecherche || codeYira;
      const data = await api.post('/evaluation/init', {
        prenom: form.prenom || 'Beneficiaire',
        nom: form.nom || 'YIRA',
        niveau: niveauEval,
        code_yira: code,
        parcours: choix,
      });
      setAssessmentId(data.assessment_id);
      setQuestions(data.questions || []);
      setQIndex(0);
      setReponses([]);
      setEtape('test');
    } catch (e: any) { setErreur('Erreur : ' + e.message); }
    finally { setLoading(false); }
  };

  const repondre = async (valeur: number) => {
    const q = questions[qIndex];
    // Extraire le vrai question_id depuis _meta dans label_question
    const meta = q._meta || {};
    const question_id = meta.id || (qIndex + 1);
    const newReponses = [...reponses, { question_id, valeur }];
    setReponses(newReponses);

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // Soumettre toutes les réponses
      setLoading(true);
      try {
        const data = await api.post('/evaluation/soumettre', {
          assessment_id: assessmentId,
          code_yira: codeRecherche || codeYira,
          niveau: niveauEval,
          parcours,
          reponses: newReponses,
        });
        setResultat(data);
        setEtape('resultat');
      } catch (e: any) { setErreur('Erreur soumission : ' + e.message); }
      finally { setLoading(false); }
    }
  };

  // Extraire info question depuis label_question
  const parseQuestion = (q: any) => {
    const label = q.label_question || '';
    const match = label.match(/\[([^\]]+)\] (.+)/);
    const module = match ? match[1].split('|')[0] : '';
    const texte = match ? match[2] : label;
    return { module, texte };
  };

  const progression = questions.length > 0 ? Math.round((qIndex / questions.length) * 100) : 0;

  const S = {
    page: { minHeight: '100vh', background: '#F8FAF9', fontFamily: "'Sora', system-ui, sans-serif" } as any,
    header: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 50 },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #E5EDE9', padding: 28 },
    input: { width: '100%', border: '1.5px solid #E5EDE9', borderRadius: 10, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
    label: { fontSize: 12, fontWeight: 600, color: '#6B8F7A', marginBottom: 6, display: 'block', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    btn: { width: '100%', padding: '13px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
    btnOutline: { width: '100%', padding: '13px', borderRadius: 10, background: '#fff', color: '#1D9E75', fontWeight: 700, fontSize: 15, border: '2px solid #1D9E75', cursor: 'pointer', fontFamily: 'inherit' },
    erreur: { padding: '10px 14px', borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 13, marginBottom: 16 },
    wrap: { maxWidth: 560, margin: '0 auto', padding: '40px 20px' },
  };

  return (
    <main style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B8F7A' }}>← Accueil</button>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>Y</span>
          </div>
          <span style={{ fontWeight: 700, color: '#0F2419', fontSize: 15 }}>Espace Jeune</span>
        </div>
        <div style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: '#E8F8F2', color: '#0F6E56', fontWeight: 600 }}>YIRA Africa</div>
      </header>

      <div style={S.wrap}>

        {/* ACCUEIL */}
        {etape === 'accueil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...S.card, textAlign: 'center', padding: '48px 28px', background: 'linear-gradient(135deg, #0F2419 0%, #1D9E75 100%)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Bienvenue sur YIRA Africa</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
                Découvrez votre profil professionnel et orientez-vous vers le bon métier grâce au SigmundTest® RIASEC
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setEtape('inscription')} style={{ ...S.btn, background: '#E07B00', flex: 1 }}>S'inscrire</button>
                <button onClick={() => setEtape('filtre')} style={{ ...S.btnOutline, borderColor: 'rgba(255,255,255,0.5)', color: '#fff', flex: 1 }}>Reprendre</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { emoji: '🧠', titre: 'SigmundTest® RIASEC', desc: '4 piliers · Score /100' },
                { emoji: '🎓', titre: 'Orientation Scolaire', desc: '71 filières CI' },
                { emoji: '💼', titre: 'Insertion Pro', desc: 'Matching 500+ employeurs' },
              ].map(c => (
                <div key={c.titre} style={{ ...S.card, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#0F2419', marginBottom: 4 }}>{c.titre}</div>
                  <div style={{ fontSize: 11, color: '#6B8F7A' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSCRIPTION */}
        {etape === 'inscription' && (
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setEtape('accueil')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B8F7A' }}>← Retour</button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', margin: 0 }}>Inscription YIRA</h2>
            </div>
            {erreur && <div style={S.erreur}>{erreur}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.label}>Prénom *</label>
                  <input style={S.input} placeholder="Kouassi" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
                </div>
                <div>
                  <label style={S.label}>Nom *</label>
                  <input style={S.input} placeholder="Yao" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={S.label}>Téléphone *</label>
                <input style={S.input} placeholder="+225 07 00 00 00" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Date de naissance</label>
                <input type="date" style={S.input} value={form.date_naissance} onChange={e => setForm({...form, date_naissance: e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Genre</label>
                <select style={S.input} value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="nsp">Je préfère ne pas répondre</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Niveau d'études</label>
                <select style={S.input} value={form.niveau_etude} onChange={e => setForm({...form, niveau_etude: e.target.value})}>
                  <option value="sans">Sans diplôme</option>
                  <option value="cepe">CEPE</option>
                  <option value="bepc">BEPC</option>
                  <option value="bac">BAC</option>
                  <option value="bts_licence">BTS / Licence+</option>
                </select>
              </div>
              <div>
                <label style={S.label}>District</label>
                <select style={S.input} value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
                  {districts.length > 0
                    ? districts.map(d => <option key={d.code} value={d.nom}>{d.nom}</option>)
                    : ['Abidjan','Bouaké','Yamoussoukro','San-Pedro','Daloa','Korhogo','Man'].map(d => <option key={d}>{d}</option>)
                  }
                </select>
              </div>
              <button onClick={inscrire} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1, marginTop: 8 }}>
                {loading ? 'Inscription en cours...' : 'Créer mon compte YIRA'}
              </button>
            </div>
          </div>
        )}

        {/* CODE YIRA APRES INSCRIPTION */}
        {etape === 'code' && (
          <div style={{ ...S.card, textAlign: 'center', padding: '48px 28px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F2419', marginBottom: 8 }}>Inscription réussie !</h2>
            <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 20 }}>Votre code YIRA personnel :</p>
            <div style={{ background: '#E8F8F2', border: '2px solid #1D9E75', borderRadius: 12, padding: '20px', marginBottom: 8 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: '#1D9E75', letterSpacing: 2 }}>{codeYira}</div>
            </div>
            <p style={{ fontSize: 12, color: '#9DB5AB', marginBottom: 28 }}>Notez ce code — il vous permet de reprendre votre évaluation sur n'importe quel appareil</p>
            <button onClick={() => { setCodeRecherche(codeYira); setEtape('filtre'); }} style={S.btn}>
              Démarrer mon évaluation →
            </button>
          </div>
        )}

        {/* QUESTION FILTRE */}
        {etape === 'filtre' && (
          <div>
            {!codeYira && (
              <div style={{ ...S.card, marginBottom: 16 }}>
                <label style={S.label}>Votre code YIRA</label>
                <input style={S.input} placeholder="Y-CI-ABJ-2026-XXXXXX" value={codeRecherche} onChange={e => setCodeRecherche(e.target.value)} />
                {!codeRecherche && (
                  <p style={{ fontSize: 12, color: '#6B8F7A', marginTop: 8 }}>
                    Pas de code ? <button onClick={() => setEtape('inscription')} style={{ color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Inscrivez-vous d'abord</button>
                  </p>
                )}
              </div>
            )}
            <div style={S.card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1D9E75', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Question importante</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F2419', marginBottom: 8, lineHeight: 1.4 }}>
                As-tu déjà terminé tes études ou cherches-tu encore ta voie ?
              </h3>
              <p style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 24 }}>Ta réponse détermine le type de recommandations que tu recevras.</p>
              {erreur && <div style={S.erreur}>{erreur}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => lancerTest('scolaire')} disabled={loading || (!codeRecherche && !codeYira)}
                  style={{ padding: '20px', borderRadius: 12, border: '2px solid #E5EDE9', background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, opacity: loading ? 0.7 : 1 }}>
                  <div style={{ fontSize: 32 }}>🎓</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 15, marginBottom: 4 }}>Je cherche ma voie d'études</div>
                    <div style={{ fontSize: 13, color: '#6B8F7A' }}>Je suis en 3ème, Terminale, ou je veux choisir une filière</div>
                  </div>
                </button>
                <button onClick={() => lancerTest('professionnel')} disabled={loading || (!codeRecherche && !codeYira)}
                  style={{ padding: '20px', borderRadius: 12, border: '2px solid #E5EDE9', background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, opacity: loading ? 0.7 : 1 }}>
                  <div style={{ fontSize: 32 }}>💼</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 15, marginBottom: 4 }}>Je cherche à entrer dans la vie active</div>
                    <div style={{ fontSize: 13, color: '#6B8F7A' }}>J'ai un diplôme et je cherche un emploi ou une reconversion</div>
                  </div>
                </button>
              </div>
              {loading && <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6B8F7A' }}>Chargement des questions...</div>}
            </div>
          </div>
        )}

        {/* TEST — QUESTIONS */}
        {etape === 'test' && questions.length > 0 && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#6B8F7A', fontWeight: 600 }}>Question {qIndex + 1} / {questions.length}</span>
                <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 700 }}>{progression}%</span>
              </div>
              <div style={{ height: 8, background: '#E5EDE9', borderRadius: 4 }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #1D9E75, #E07B00)', borderRadius: 4, width: `${progression}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div style={S.card}>
              {/* Module label */}
              {(() => {
                const { module, texte } = parseQuestion(questions[qIndex]);
                const moduleLabel = module.split('|')[0];
                const dim = module.split('|')[1] || '';
                return (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E8F8F2', color: '#1D9E75', fontWeight: 700 }}>{moduleLabel}</span>
                      {dim && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#F0F4F2', color: '#6B8F7A', fontWeight: 600 }}>{dim}</span>}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F2419', marginBottom: 28, lineHeight: 1.6 }}>{texte}</h3>
                  </>
                );
              })()}

              {/* Réponses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { val: 5, label: 'Tout à fait d\'accord', color: '#059669', bg: '#D1FAE5' },
                  { val: 4, label: 'Plutôt d\'accord', color: '#1D9E75', bg: '#E8F8F2' },
                  { val: 3, label: 'Neutre', color: '#6B8F7A', bg: '#F0F4F2' },
                  { val: 2, label: 'Plutôt pas d\'accord', color: '#D97706', bg: '#FEF3C7' },
                  { val: 1, label: 'Pas du tout d\'accord', color: '#DC2626', bg: '#FEE2E2' },
                ].map(opt => (
                  <button key={opt.val} onClick={() => repondre(opt.val)} disabled={loading}
                    style={{ padding: '14px 18px', borderRadius: 10, border: `1px solid ${opt.bg}`, background: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#0F2419', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: opt.color, flexShrink: 0 }}>{opt.val}</div>
                    {opt.label}
                  </button>
                ))}
              </div>
              {loading && <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B8F7A' }}>Calcul de votre profil en cours...</div>}
            </div>
          </div>
        )}

        {/* RESULTATS */}
        {etape === 'resultat' && resultat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header résultat */}
            <div style={{ ...S.card, background: 'linear-gradient(135deg, #0F2419, #1D9E75)', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Profil SigmundTest® YIRA</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                {resultat.profil_riasec?.charAt(0) || '?'}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                {PROFILS[resultat.profil_riasec?.charAt(0)]?.nom || 'Profil mixte'}
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#E07B00' }}>
                {resultat.score_global}/100
              </div>
            </div>

            {/* Filière recommandée */}
            {parcours === 'professionnel' && resultat.filiere_recommandee && FILIERES[resultat.filiere_recommandee] && (
              <div style={{ ...S.card, background: FILIERES[resultat.filiere_recommandee].bg, border: `2px solid ${FILIERES[resultat.filiere_recommandee].couleur}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 28 }}>📋</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F2419', fontSize: 16 }}>{FILIERES[resultat.filiere_recommandee].label}</div>
                    <div style={{ fontSize: 13, color: '#6B8F7A' }}>Délai d'insertion estimé : {FILIERES[resultat.filiere_recommandee].delai}</div>
                  </div>
                </div>
                {resultat.parcours_informel && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                    {resultat.parcours_informel.map((p: string) => (
                      <span key={p} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#EDE9FE', color: '#7C3AED', fontWeight: 600 }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Scores par pilier */}
            {resultat.scores_piliers && (
              <div style={S.card}>
                <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 15, marginBottom: 16 }}>Scores par pilier</div>
                {Object.entries(resultat.scores_piliers).map(([pilier, score]: [string, any]) => (
                  <div key={pilier} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 600, textTransform: 'capitalize' as const }}>{pilier.replace('_', ' ')}</span>
                      <span style={{ fontSize: 13, color: '#1D9E75', fontWeight: 700 }}>{score}/100</span>
                    </div>
                    <div style={{ height: 8, background: '#E5EDE9', borderRadius: 4 }}>
                      <div style={{ height: '100%', background: '#1D9E75', borderRadius: 4, width: `${score}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profil RIASEC description */}
            {resultat.profil_riasec && PROFILS[resultat.profil_riasec.charAt(0)] && (
              <div style={{ ...S.card, background: PROFILS[resultat.profil_riasec.charAt(0)].bg, border: `1px solid ${PROFILS[resultat.profil_riasec.charAt(0)].couleur}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 32 }}>{PROFILS[resultat.profil_riasec.charAt(0)].emoji}</span>
                  <span style={{ fontWeight: 800, color: '#0F2419', fontSize: 16 }}>Profil {PROFILS[resultat.profil_riasec.charAt(0)].nom}</span>
                </div>
                <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{PROFILS[resultat.profil_riasec.charAt(0)].desc}</p>
              </div>
            )}

            {/* Message prochain RDV conseiller */}
            <div style={{ ...S.card, background: '#FEF3C7', border: '1px solid #D97706', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
              <div style={{ fontWeight: 700, color: '#92400E', fontSize: 15, marginBottom: 4 }}>Prochaine étape</div>
              <p style={{ fontSize: 13, color: '#78350F', margin: 0 }}>Un conseiller YIRA vous contactera dans 24-48h pour une séance de restitution personnalisée.</p>
            </div>

            <button onClick={() => { setEtape('accueil'); setResultat(null); setReponses([]); setQuestions([]); }} style={S.btnOutline}>
              Retour à l'accueil
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
