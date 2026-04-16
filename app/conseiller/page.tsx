'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yira-api-production.up.railway.app/api/v1';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('yira_token');
}

async function apiFetch(url: string, method = 'GET', body?: any) {
  const token = getToken();
  try {
    const r = await fetch(`${API}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'ci',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  } catch (e: any) {
    console.warn('[API]', url, e.message);
    return null;
  }
}

type Onglet = 'dashboard' | 'beneficiaires' | 'evaluations' | 'affectations' | 'profil';

export default function EspaceConseiller() {
  const router = useRouter();
  const [onglet, setOnglet] = useState<Onglet>('dashboard');
  const [loading, setLoading] = useState(true);
  const [conseiller, setConseiller] = useState<any>(null);
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, en_evaluation: 0, en_formation: 0, inseres: 0, certifies: 0 });
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    charger();
  }, []);

  async function charger() {
    setLoading(true);
    const [profil, bens] = await Promise.all([
      apiFetch('/auth/profil'),
      apiFetch('/admin/beneficiaires'),
    ]);

    if (profil) setConseiller(profil);

    const liste = Array.isArray(bens) ? bens : bens?.data ?? [];
    setBeneficiaires(liste);
    setStats({
      total: liste.length,
      en_evaluation: liste.filter((b: any) => b.statut_parcours === 'EN_EVALUATION').length,
      en_formation: liste.filter((b: any) => b.statut_parcours === 'EN_FORMATION').length,
      inseres: liste.filter((b: any) => b.statut_parcours === 'INSERE').length,
      certifies: liste.filter((b: any) => b.statut_parcours === 'CERTIFIE').length,
    });
    setLoading(false);
  }

  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  const filtres = beneficiaires.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.nom?.toLowerCase().includes(q) || b.prenom?.toLowerCase().includes(q) || b.code_yira?.toLowerCase().includes(q) || b.telephone?.includes(q);
    const matchStatut = !filtreStatut || b.statut_parcours === filtreStatut;
    return matchSearch && matchStatut;
  });

  const STATUTS: Record<string, { label: string; color: string; bg: string }> = {
    INSCRIT:        { label: 'Inscrit',        color: '#185FA5', bg: '#E6F1FB' },
    EN_EVALUATION:  { label: 'En évaluation',  color: '#E07B00', bg: '#FEF3E2' },
    EN_FORMATION:   { label: 'En formation',   color: '#6B3FA0', bg: '#F0EAF8' },
    CERTIFIE:       { label: 'Certifié',       color: '#1D9E75', bg: '#E8F8F2' },
    INSERE:         { label: 'Inséré',         color: '#27500A', bg: '#EAF3DE' },
  };

  const MENU: { id: Onglet; label: string; emoji: string }[] = [
    { id: 'dashboard',    label: 'Dashboard',       emoji: '📊' },
    { id: 'beneficiaires',label: 'Bénéficiaires',   emoji: '👥' },
    { id: 'evaluations',  label: 'Évaluations',     emoji: '🧠' },
    { id: 'affectations', label: 'Affectations',    emoji: '🏫' },
    { id: 'profil',       label: 'Mon profil',      emoji: '👤' },
  ];

  const S = {
    page: { minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui,-apple-system,sans-serif' },
    header: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 50 },
    nav: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' as const },
    navBtn: (active: boolean) => ({ padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400, color: active ? '#1D9E75' : '#6B8F7A', borderBottom: active ? '2px solid #1D9E75' : '2px solid transparent', whiteSpace: 'nowrap' as const }),
    card: { background: '#fff', borderRadius: 12, border: '1px solid #E5EDE9', padding: 20 },
    input: { border: '1px solid #E5EDE9', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#F8FAF9', fontFamily: 'inherit' },
    badge: (color: string, bg: string) => ({ fontSize: 11, padding: '3px 8px', borderRadius: 20, color, background: bg, fontWeight: 600, whiteSpace: 'nowrap' as const }),
    th: { padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, color: '#6B8F7A', fontWeight: 700, background: '#F8FAF9', borderBottom: '1px solid #E5EDE9', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    td: { padding: '12px 14px', fontSize: 13, borderBottom: '1px solid #F0F4F2', color: '#0F2419' },
  };

  return (
    <main style={S.page}>

      {/* Header */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B8F7A' }}>← Accueil</button>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#185FA5,#0C3D6E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>C</span>
          </div>
          <span style={{ fontWeight: 700, color: '#0F2419', fontSize: 15 }}>Espace Conseiller</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {conseiller && (
            <span style={{ fontSize: 13, color: '#6B8F7A' }}>
              {conseiller.prenom} {conseiller.nom}
            </span>
          )}
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#E6F1FB', color: '#185FA5', fontWeight: 600 }}>
            {conseiller?.grade ?? 'Conseiller'}
          </span>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#DC2626' }}>Déconnexion</button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={S.nav}>
        {MENU.map(m => (
          <button key={m.id} onClick={() => setOnglet(m.id)} style={S.navBtn(onglet === m.id)}>
            {m.emoji} {m.label}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6B8F7A', fontSize: 14 }}>
            Chargement des données...
          </div>
        )}

        {!loading && onglet === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Bienvenue */}
            <div style={{ ...S.card, background: 'linear-gradient(135deg,#185FA5,#0C3D6E)', color: '#fff' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Tableau de bord</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Bonjour, {conseiller?.prenom ?? 'Conseiller'} 👋</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                Voici l&apos;état de votre portefeuille bénéficiaires
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
              {[
                { label: 'Total bénéficiaires', val: stats.total, color: '#185FA5', bg: '#E6F1FB' },
                { label: 'En évaluation', val: stats.en_evaluation, color: '#E07B00', bg: '#FEF3E2' },
                { label: 'En formation', val: stats.en_formation, color: '#6B3FA0', bg: '#F0EAF8' },
                { label: 'Certifiés CQP', val: stats.certifies, color: '#1D9E75', bg: '#E8F8F2' },
                { label: 'Insérés', val: stats.inseres, color: '#27500A', bg: '#EAF3DE' },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, borderTop: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: '#6B8F7A', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Derniers bénéficiaires */}
            <div style={S.card}>
              <div style={{ fontWeight: 700, color: '#0F2419', marginBottom: 16 }}>Derniers bénéficiaires inscrits</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Code YIRA', 'Nom', 'District', 'Niveau', 'Statut', 'Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {beneficiaires.slice(0, 8).map((b: any, i: number) => (
                    <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setOnglet('beneficiaires')}>
                      <td style={{ ...S.td, fontFamily: 'monospace', color: '#1D9E75', fontWeight: 700, fontSize: 12 }}>{b.code_yira}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{b.prenom} {b.nom}</td>
                      <td style={{ ...S.td, color: '#6B8F7A' }}>{b.district}</td>
                      <td style={S.td}>{b.niveau_etude}</td>
                      <td style={S.td}>
                        {b.statut_parcours && STATUTS[b.statut_parcours] && (
                          <span style={S.badge(STATUTS[b.statut_parcours].color, STATUTS[b.statut_parcours].bg)}>
                            {STATUTS[b.statut_parcours].label}
                          </span>
                        )}
                      </td>
                      <td style={{ ...S.td, color: '#6B8F7A', fontSize: 11 }}>
                        {b.created_at ? new Date(b.created_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {beneficiaires.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A', fontSize: 14 }}>Aucun bénéficiaire pour le moment</div>
              )}
            </div>
          </div>
        )}

        {!loading && onglet === 'beneficiaires' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Filtres */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input style={{ ...S.input, minWidth: 260 }} placeholder="Rechercher par nom, code, téléphone..." value={search} onChange={e => setSearch(e.target.value)} />
              <select style={S.input} value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}>
                <option value="">Tous les statuts</option>
                {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={charger} style={{ ...S.input, cursor: 'pointer', background: '#E8F8F2', color: '#1D9E75', fontWeight: 600, border: '1px solid #A8DCC8' }}>
                Actualiser
              </button>
            </div>

            <div style={S.card}>
              <div style={{ padding: '0 0 12px', fontSize: 13, color: '#6B8F7A', marginBottom: 8 }}>
                {filtres.length} bénéficiaire{filtres.length > 1 ? 's' : ''}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Code YIRA', 'Prénom', 'Nom', 'Téléphone', 'District', 'Genre', 'Niveau', 'Statut', 'Inscription'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtres.map((b: any, i: number) => (
                      <tr key={i} onMouseEnter={e => (e.currentTarget.style.background = '#F8FAF9')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                        <td style={{ ...S.td, fontFamily: 'monospace', color: '#1D9E75', fontWeight: 700, fontSize: 11 }}>{b.code_yira}</td>
                        <td style={S.td}>{b.prenom}</td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{b.nom}</td>
                        <td style={{ ...S.td, color: '#6B8F7A', fontSize: 12 }}>{b.telephone}</td>
                        <td style={{ ...S.td, color: '#6B8F7A' }}>{b.district}</td>
                        <td style={{ ...S.td, color: '#6B8F7A', fontSize: 12 }}>{b.genre}</td>
                        <td style={S.td}>{b.niveau_etude}</td>
                        <td style={S.td}>
                          {b.statut_parcours && STATUTS[b.statut_parcours] && (
                            <span style={S.badge(STATUTS[b.statut_parcours].color, STATUTS[b.statut_parcours].bg)}>
                              {STATUTS[b.statut_parcours].label}
                            </span>
                          )}
                        </td>
                        <td style={{ ...S.td, color: '#6B8F7A', fontSize: 11 }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtres.length === 0 && (
                  <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A', fontSize: 14 }}>Aucun résultat</div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && onglet === 'evaluations' && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16, marginBottom: 8 }}>Évaluations SigmundTest</div>
            <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 24 }}>Lancez une évaluation pour un bénéficiaire ou consultez les résultats existants.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'Total évaluations', val: beneficiaires.filter(b => b.statut_parcours !== 'INSCRIT').length, color: '#1D9E75' },
                { label: 'En cours', val: beneficiaires.filter(b => b.statut_parcours === 'EN_EVALUATION').length, color: '#E07B00' },
                { label: 'Complétées', val: beneficiaires.filter(b => ['EN_FORMATION','CERTIFIE','INSERE'].includes(b.statut_parcours)).length, color: '#185FA5' },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: '#6B8F7A', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && onglet === 'affectations' && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16, marginBottom: 8 }}>Affectations établissements</div>
            <p style={{ fontSize: 14, color: '#6B8F7A' }}>Affectez vos bénéficiaires certifiés aux établissements partenaires.</p>
            <div style={{ marginTop: 24, padding: 40, textAlign: 'center', background: '#F8FAF9', borderRadius: 8, color: '#6B8F7A', fontSize: 14 }}>
              {stats.certifies > 0
                ? `${stats.certifies} bénéficiaires certifiés en attente d'affectation`
                : 'Aucune affectation en attente pour le moment'
              }
            </div>
          </div>
        )}

        {!loading && onglet === 'profil' && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16, marginBottom: 20 }}>Mon profil conseiller</div>
            {conseiller ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Nom complet', val: `${conseiller.prenom ?? '—'} ${conseiller.nom ?? ''}` },
                  { label: 'Email', val: conseiller.email ?? '—' },
                  { label: 'Téléphone', val: conseiller.telephone ?? '—' },
                  { label: 'Grade', val: conseiller.grade ?? '—' },
                  { label: 'Pays', val: conseiller.country_code ?? 'CI' },
                  { label: 'Rôle', val: conseiller.role ?? 'conseiller' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #F0F4F2' }}>
                    <span style={{ fontSize: 13, color: '#6B8F7A', width: 140, flexShrink: 0 }}>{f.label}</span>
                    <span style={{ fontSize: 13, color: '#0F2419', fontWeight: 600 }}>{f.val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6B8F7A', fontSize: 14 }}>Profil non disponible</p>
            )}
          </div>
        )}

      </div>
    </main>
  );
}