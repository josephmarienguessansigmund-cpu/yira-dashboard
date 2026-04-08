'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen,
  MessageSquare, CreditCard, BarChart3, Settings, LogOut,
  Search, Plus, Download, RefreshCw, Globe, Bell,
  TrendingUp, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'beneficiaires', label: 'Beneficiaires', icon: Users },
  { id: 'conseillers', label: 'Conseillers', icon: GraduationCap },
  { id: 'employeurs', label: 'Employeurs', icon: Building2 },
  { id: 'etablissements', label: 'Etablissements', icon: BookOpen },
  { id: 'quiz', label: 'Quiz & Gamification', icon: MessageSquare },
  { id: 'sms', label: 'SMS & Notifications', icon: Bell },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'opc', label: 'OPC-Africa', icon: BarChart3 },
  { id: 'pays', label: 'Pays & Config', icon: Globe },
  { id: 'parametres', label: 'Parametres', icon: Settings },
];

const S = {
  sidebar: { width: 240, background: '#0F2419', height: '100vh', position: 'fixed' as const, left: 0, top: 0, display: 'flex', flexDirection: 'column' as const, zIndex: 100 },
  main: { marginLeft: 240, minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui, sans-serif' },
  header: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 50 },
  content: { padding: '32px' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #E5EDE9', overflow: 'hidden' as const },
  btn: { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  input: { padding: '8px 12px', borderRadius: 8, border: '1px solid #E5EDE9', fontSize: 13, outline: 'none', background: '#F8FAF9' },
  badge: (color: string, bg: string) => ({ fontSize: 11, padding: '3px 8px', borderRadius: 20, color, background: bg, fontWeight: 600 }),
  th: { padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, color: '#6B8F7A', fontWeight: 600, background: '#F8FAF9', borderBottom: '1px solid #E5EDE9' },
  td: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #F0F4F2', color: '#0F2419' },
};

export default function AdminBackoffice() {
  const router = useRouter();
  const [page, setPage] = useState('dashboard');
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [pays, setPays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('yira_token');
    if (!token) { router.push('/login'); return; }
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [bens, paysData] = await Promise.all([
        api.get(endpoints.admin.beneficiaires).catch(() => []),
        api.get('/admin/pays').catch(() => []),
      ]);
      setBeneficiaires(Array.isArray(bens) ? bens : bens?.data ?? []);
      setPays(Array.isArray(paysData) ? paysData : []);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const filtered = beneficiaires.filter(b =>
    !search || b.nom?.toLowerCase().includes(search.toLowerCase()) ||
    b.prenom?.toLowerCase().includes(search.toLowerCase()) ||
    b.code_yira?.toLowerCase().includes(search.toLowerCase()) ||
    b.telephone?.includes(search)
  );

  const creerConseiller = async () => {
    try {
      await api.post('/auth/conseiller/inscription', { ...formData, country_code: 'CI' });
      setMsg('Conseiller cree avec succes');
      setShowForm(false);
      setFormData({});
    } catch (e: any) {
      setMsg('Erreur: ' + e.message);
    }
  };

  const statuts: Record<string, { color: string; bg: string }> = {
    INSCRIT: { color: '#185FA5', bg: '#E6F1FB' },
    EN_EVALUATION: { color: '#E07B00', bg: '#FEF3E2' },
    EN_FORMATION: { color: '#6B3FA0', bg: '#F0EAF8' },
    CERTIFIE: { color: '#1D9E75', bg: '#E8F8F2' },
    INSERE: { color: '#27500A', bg: '#EAF3DE' },
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #1D9E75, #E07B00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>Y</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>YIRA Africa</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Backoffice Admin</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' as const }}>
          {MENU.map((m) => {
            const Icon = m.icon;
            const active = page === m.id;
            return (
              <button key={m.id} onClick={() => setPage(m.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, background: active ? 'rgba(29,158,117,0.2)' : 'transparent', color: active ? '#1D9E75' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: active ? 600 : 400, textAlign: 'left' as const }}>
                <Icon size={16} />
                {m.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,100,100,0.7)', fontSize: 13 }}>
            <LogOut size={16} /> Deconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        <header style={S.header}>
          <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16 }}>
            {MENU.find(m => m.id === page)?.label ?? 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: '#E8F8F2', border: '1px solid #A8DCC8' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1D9E75' }} />
              <span style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>API en ligne</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0F2419', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>A</span>
            </div>
          </div>
        </header>

        <div style={S.content}>
          {msg && (
            <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, background: msg.includes('Erreur') ? '#FCECEA' : '#E8F8F2', color: msg.includes('Erreur') ? '#C0392B' : '#0F6E56', fontSize: 13, border: `1px solid ${msg.includes('Erreur') ? '#F5C6C2' : '#A8DCC8'}` }}>
              {msg} <button onClick={() => setMsg('')} style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>x</button>
            </div>
          )}

          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Beneficiaires inscrits', val: beneficiaires.length, icon: Users, color: '#1D9E75', bg: '#E8F8F2' },
                  { label: 'Pays actifs CEDEAO', val: 7, icon: Globe, color: '#185FA5', bg: '#E6F1FB' },
                  { label: 'Inscrits ce mois', val: beneficiaires.filter(b => new Date(b.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: TrendingUp, color: '#E07B00', bg: '#FEF3E2' },
                  { label: 'Taux insertion cible', val: '72%', icon: CheckCircle, color: '#27500A', bg: '#EAF3DE' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} style={{ ...S.card, padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={s.color} />
                        </div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#0F2419' }}>{loading ? '...' : s.val}</div>
                      <div style={{ fontSize: 12, color: '#6B8F7A', marginTop: 4 }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div style={S.card}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, color: '#0F2419', fontSize: 14 }}>Derniers beneficiaires inscrits</div>
                    <button onClick={() => setPage('beneficiaires')} style={{ ...S.btn, background: '#E8F8F2', color: '#1D9E75' }}>Voir tout</button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Code YIRA', 'Nom', 'District', 'Niveau', 'Statut'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {beneficiaires.slice(0, 5).map((b: any, i: number) => (
                        <tr key={i}>
                          <td style={{ ...S.td, fontFamily: 'monospace', color: '#1D9E75', fontWeight: 600 }}>{b.code_yira}</td>
                          <td style={S.td}>{b.prenom} {b.nom}</td>
                          <td style={{ ...S.td, color: '#6B8F7A' }}>{b.district}</td>
                          <td style={S.td}><span style={S.badge('#185FA5', '#E6F1FB')}>{b.niveau_etude}</span></td>
                          <td style={S.td}><span style={S.badge(statuts[b.statut_parcours]?.color ?? '#6B8F7A', statuts[b.statut_parcours]?.bg ?? '#F0F4F2')}>{b.statut_parcours}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={S.card}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE9', fontWeight: 600, color: '#0F2419', fontSize: 14 }}>Pays actifs CEDEAO</div>
                  <div style={{ padding: 16 }}>
                    {['CI', 'BF', 'ML', 'SN', 'NE', 'GN', 'GH'].map((p) => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F4F2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: p === 'CI' ? '#E8F8F2' : '#F8FAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: p === 'CI' ? '#1D9E75' : '#6B8F7A' }}>{p}</div>
                          <span style={{ fontSize: 13, color: '#0F2419' }}>{p === 'CI' ? 'Cote d\'Ivoire' : p === 'BF' ? 'Burkina Faso' : p === 'ML' ? 'Mali' : p === 'SN' ? 'Senegal' : p === 'NE' ? 'Niger' : p === 'GN' ? 'Guinee' : 'Ghana'}</span>
                        </div>
                        <span style={S.badge(p === 'CI' ? '#1D9E75' : '#6B8F7A', p === 'CI' ? '#E8F8F2' : '#F0F4F2')}>{p === 'CI' ? 'Actif' : 'Config'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BENEFICIAIRES */}
          {page === 'beneficiaires' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' as const }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6B8F7A' }} />
                    <input style={{ ...S.input, paddingLeft: 32, width: 280 }} placeholder="Rechercher par nom, code, telephone..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button onClick={chargerDonnees} style={{ ...S.btn, background: '#F0F4F2', color: '#6B8F7A' }}><RefreshCw size={14} /></button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...S.btn, background: '#E8F8F2', color: '#1D9E75' }}><Download size={14} /> Exporter CSV</button>
                </div>
              </div>

              <div style={S.card}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5EDE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6B8F7A' }}>{filtered.length} beneficiaire{filtered.length > 1 ? 's' : ''}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['INSCRIT', 'EN_EVALUATION', 'EN_FORMATION', 'CERTIFIE', 'INSERE'].map(s => (
                      <span key={s} style={{ ...S.badge(statuts[s]?.color ?? '#6B8F7A', statuts[s]?.bg ?? '#F0F4F2'), cursor: 'pointer' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' as const }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Code YIRA', 'Prenom', 'Nom', 'Telephone', 'District', 'Niveau', 'Genre', 'Statut', 'Inscription'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {filtered.map((b: any, i: number) => (
                        <tr key={i} style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = '#F8FAF9')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                          <td style={{ ...S.td, fontFamily: 'monospace', color: '#1D9E75', fontWeight: 600, fontSize: 12 }}>{b.code_yira}</td>
                          <td style={S.td}>{b.prenom}</td>
                          <td style={{ ...S.td, fontWeight: 500 }}>{b.nom}</td>
                          <td style={{ ...S.td, color: '#6B8F7A', fontSize: 12 }}>{b.telephone}</td>
                          <td style={{ ...S.td, color: '#6B8F7A' }}>{b.district}</td>
                          <td style={S.td}><span style={S.badge('#185FA5', '#E6F1FB')}>{b.niveau_etude}</span></td>
                          <td style={{ ...S.td, color: '#6B8F7A', fontSize: 12 }}>{b.genre}</td>
                          <td style={S.td}><span style={S.badge(statuts[b.statut_parcours]?.color ?? '#6B8F7A', statuts[b.statut_parcours]?.bg ?? '#F0F4F2')}>{b.statut_parcours}</span></td>
                          <td style={{ ...S.td, color: '#6B8F7A', fontSize: 11 }}>{b.created_at ? new Date(b.created_at).toLocaleDateString('fr-FR') : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A', fontSize: 14 }}>Aucun beneficiaire trouve</div>}
                </div>
              </div>
            </div>
          )}

          {/* CONSEILLERS */}
          {page === 'conseillers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Gestion des conseillers certifies YIRA</div>
                <button onClick={() => setShowForm(!showForm)} style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}><Plus size={14} /> Nouveau conseiller</button>
              </div>

              {showForm && (
                <div style={{ ...S.card, padding: 24, marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 16, color: '#0F2419' }}>Creer un nouveau conseiller</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                    {[
                      { key: 'nom', label: 'Nom', placeholder: 'KOUASSI' },
                      { key: 'prenom', label: 'Prenom', placeholder: 'Yao' },
                      { key: 'email', label: 'Email', placeholder: 'yao@nohama.ci' },
                      { key: 'password', label: 'Mot de passe', placeholder: '••••••••' },
                      { key: 'telephone', label: 'Telephone', placeholder: '+225 07...' },
                      { key: 'grade', label: 'Grade', placeholder: 'JUNIOR' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 12, color: '#6B8F7A', display: 'block', marginBottom: 4 }}>{f.label}</label>
                        <input type={f.key === 'password' ? 'password' : 'text'} placeholder={f.placeholder}
                          style={{ ...S.input, width: '100%', boxSizing: 'border-box' as const }}
                          value={formData[f.key] ?? ''}
                          onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={creerConseiller} style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}>Creer le compte</button>
                    <button onClick={() => setShowForm(false)} style={{ ...S.btn, background: '#F0F4F2', color: '#6B8F7A' }}>Annuler</button>
                  </div>
                </div>
              )}

              <div style={S.card}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE9' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['JUNIOR', 'SENIOR', 'SUPERVISEUR'].map(g => (
                      <span key={g} style={{ ...S.btn, background: '#F0F4F2', color: '#6B8F7A', padding: '4px 12px', cursor: 'pointer', border: '1px solid #E5EDE9', borderRadius: 20 }}>{g}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A' }}>
                  <GraduationCap size={48} color="#E5EDE9" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 14 }}>Les conseillers apparaissent ici apres creation</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Phase 0 : 50 conseillers cibles</div>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {page === 'quiz' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Quiz emploi, culture, entrepreneuriat, finance</div>
                <button style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}><Plus size={14} /> Nouveau quiz</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { cat: 'Emploi CI', nb: 18, color: '#1D9E75', bg: '#E8F8F2', desc: 'CV, entretien, droits travailleur' },
                  { cat: 'Culture Generale', nb: 12, color: '#185FA5', bg: '#E6F1FB', desc: 'Histoire CI, geographie, culture' },
                  { cat: 'Metiers & Filieres', nb: 8, color: '#E07B00', bg: '#FEF3E2', desc: 'Metiers en tension, salaires' },
                  { cat: 'Entrepreneuriat', nb: 6, color: '#6B3FA0', bg: '#F0EAF8', desc: 'Creation entreprise, fiscalite CI' },
                  { cat: 'Education Financiere', nb: 10, color: '#27500A', bg: '#EAF3DE', desc: 'Mobile money, epargne, credit' },
                  { cat: 'VAS CultureQuiz', nb: 24, color: '#C0392B', bg: '#FCECEA', desc: 'Quiz monetisable via operateurs' },
                ].map((q) => (
                  <div key={q.cat} style={{ ...S.card, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={S.badge(q.color, q.bg)}>{q.cat}</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#0F2419' }}>{q.nb}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B8F7A' }}>{q.desc}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button style={{ ...S.btn, background: '#F0F4F2', color: '#6B8F7A', fontSize: 11, padding: '4px 10px' }}>Voir</button>
                      <button style={{ ...S.btn, background: q.bg, color: q.color, fontSize: 11, padding: '4px 10px' }}><Plus size={10} /> Ajouter</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SMS */}
          {page === 'sms' && (
            <div>
              <div style={{ ...S.card, marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE9', fontWeight: 600, color: '#0F2419' }}>Templates SMS automatiques S1 a S15</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Code', 'Type', 'Declencheur', 'Statut'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      { code: 'S1', type: 'Inscription', dec: 'Nouveau beneficiaire inscrit', ok: true },
                      { code: 'S2', type: 'Code YIRA', dec: 'Generation code unique', ok: true },
                      { code: 'S3', type: 'Evaluation complete', dec: 'SigmundTest termine', ok: true },
                      { code: 'S4', type: 'Invitation restitution', dec: 'Apres evaluation', ok: true },
                      { code: 'S5', type: 'Affectation formation', dec: 'PII signe', ok: true },
                      { code: 'S6', type: 'Convocation jury', dec: 'J-7 avant jury CQP', ok: false },
                      { code: 'S7', type: 'CQP obtenu', dec: 'Deliberation favorable', ok: false },
                      { code: 'S8', type: 'Embauche confirmee', dec: 'Contrat signe', ok: false },
                      { code: 'S9', type: 'Suivi J+7', dec: '7 jours apres embauche', ok: false },
                      { code: 'S10', type: 'Quiz du jour', dec: 'Quotidien via USSD', ok: false },
                      { code: 'S11', type: 'Bilan J+365', dec: '1 an apres insertion', ok: false },
                      { code: 'S12', type: 'Suivi J+30', dec: '30 jours post-insertion', ok: false },
                      { code: 'S13', type: 'Suivi J+90', dec: '90 jours post-insertion', ok: false },
                      { code: 'S14', type: 'Alerte rupture', dec: 'Detection signal faible', ok: false },
                      { code: 'S15', type: 'Reorientation', dec: 'Protocole rupture active', ok: false },
                    ].map((s) => (
                      <tr key={s.code}>
                        <td style={{ ...S.td, fontFamily: 'monospace', fontWeight: 700, color: '#1D9E75' }}>{s.code}</td>
                        <td style={{ ...S.td, fontWeight: 500 }}>{s.type}</td>
                        <td style={{ ...S.td, color: '#6B8F7A' }}>{s.dec}</td>
                        <td style={S.td}><span style={S.badge(s.ok ? '#1D9E75' : '#6B8F7A', s.ok ? '#E8F8F2' : '#F0F4F2')}>{s.ok ? 'Actif' : 'A configurer'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAIEMENTS */}
          {page === 'paiements' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Revenue F1 (Souscriptions)', val: '0 FCFA', color: '#1D9E75' },
                  { label: 'Revenue F2 (Employeurs)', val: '0 FCFA', color: '#185FA5' },
                  { label: 'Revenue F3 (Gouvernement)', val: '0 FCFA', color: '#E07B00' },
                  { label: 'Revenue F4 (VAS Telecom)', val: '0 FCFA', color: '#6B3FA0' },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: 20 }}>
                    <div style={{ fontSize: 12, color: '#6B8F7A', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, padding: 40, textAlign: 'center' }}>
                <CreditCard size={48} color="#E5EDE9" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Les transactions Flutterwave apparaissent ici</div>
                <div style={{ fontSize: 12, color: '#9DB5AB', marginTop: 4 }}>Flux F1 a F8 selon CDF v2</div>
              </div>
            </div>
          )}

          {/* OPC-AFRICA */}
          {page === 'opc' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Jeunes inscrits', val: beneficiaires.length, sub: '7 pays' },
                  { label: 'Taux insertion J+30', val: '72%', sub: 'CI pilote' },
                  { label: 'CQP delivres', val: 0, sub: 'METFPA' },
                  { label: 'Employeurs actifs', val: 0, sub: '14 secteurs' },
                ].map((s) => (
                  <div key={s.label} style={{ ...S.card, padding: 20 }}>
                    <div style={{ fontSize: 12, color: '#6B8F7A', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0F2419' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#1D9E75', marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#0F2419' }}>Rapports PTF - BAD/GIZ/AFD/BM/PNUD</div>
                  <button style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}><Download size={14} /> Exporter rapport Q2 2026</button>
                </div>
                <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A' }}>
                  <BarChart3 size={48} color="#E5EDE9" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 14 }}>Donnees anonymisees - Exportables PDF, Excel, JSON</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Conforme RGPD CI - Aucun identifiant direct transmis</div>
                </div>
              </div>
            </div>
          )}

          {/* PAYS */}
          {page === 'pays' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { code: 'CI', nom: "Cote d'Ivoire", phase: 'Phase 0', actif: true, monnaie: 'XOF', ussd: '*7572#', operateurs: 'MTN, Orange, Moov' },
                  { code: 'SN', nom: 'Senegal', phase: 'Phase 1', actif: false, monnaie: 'XOF', ussd: '*7572#', operateurs: 'Orange, Free, Expresso' },
                  { code: 'BF', nom: 'Burkina Faso', phase: 'Phase 1', actif: false, monnaie: 'XOF', ussd: '*7572#', operateurs: 'Orange, Moov' },
                  { code: 'ML', nom: 'Mali', phase: 'Phase 1', actif: false, monnaie: 'XOF', ussd: '*7572#', operateurs: 'Orange, Moov' },
                  { code: 'CM', nom: 'Cameroun', phase: 'Phase 1', actif: false, monnaie: 'XAF', ussd: '*7572#', operateurs: 'MTN, Orange' },
                  { code: 'GH', nom: 'Ghana', phase: 'Phase 2', actif: false, monnaie: 'GHS', ussd: '*7572#', operateurs: 'MTN, Vodafone' },
                ].map((p) => (
                  <div key={p.code} style={{ ...S.card, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: p.actif ? '#E8F8F2' : '#F0F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: p.actif ? '#1D9E75' : '#6B8F7A' }}>{p.code}</div>
                      <span style={S.badge(p.actif ? '#1D9E75' : '#6B8F7A', p.actif ? '#E8F8F2' : '#F0F4F2')}>{p.actif ? 'Actif' : p.phase}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0F2419', marginBottom: 4 }}>{p.nom}</div>
                    <div style={{ fontSize: 12, color: '#6B8F7A', marginBottom: 2 }}>Monnaie: {p.monnaie}</div>
                    <div style={{ fontSize: 12, color: '#6B8F7A', marginBottom: 2 }}>USSD: {p.ussd}</div>
                    <div style={{ fontSize: 12, color: '#6B8F7A' }}>Operateurs: {p.operateurs}</div>
                    {!p.actif && (
                      <button style={{ ...S.btn, background: '#E8F8F2', color: '#1D9E75', marginTop: 12, fontSize: 12 }}>Activer ce pays</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ETABLISSEMENTS */}
          {page === 'etablissements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Base etablissements partenaires YIRA</div>
                <button style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}><Plus size={14} /> Ajouter etablissement</button>
              </div>
              <div style={{ ...S.card, padding: 40, textAlign: 'center' }}>
                <BookOpen size={48} color="#E5EDE9" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Base etablissements chargee depuis Supabase</div>
                <div style={{ fontSize: 12, color: '#9DB5AB', marginTop: 4 }}>LP, CET, Universites, Centres de formation CI</div>
              </div>
            </div>
          )}

          {/* EMPLOYEURS */}
          {page === 'employeurs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>500+ DRH partenaires dans 14 secteurs</div>
                <button style={{ ...S.btn, background: '#1D9E75', color: '#fff' }}><Plus size={14} /> Ajouter employeur</button>
              </div>
              <div style={{ ...S.card, padding: 40, textAlign: 'center' }}>
                <Building2 size={48} color="#E5EDE9" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 14, color: '#6B8F7A' }}>Base employeurs DRH partenaires</div>
                <div style={{ fontSize: 12, color: '#9DB5AB', marginTop: 4 }}>Hotellerie, BTP, Commerce, Tech, Agriculture, Banque...</div>
              </div>
            </div>
          )}

          {/* PARAMETRES */}
          {page === 'parametres' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                { titre: 'API SigmundTest', desc: 'Client ID, Product Code, URL SOAP', statut: 'Configure', ok: true },
                { titre: 'Africa\'s Talking', desc: 'USSD *7572#, SMS S1-S15, operateurs CI', statut: 'Configure', ok: true },
                { titre: 'Claude Anthropic (NIE)', desc: 'Culturalisation rapports, coaching, matching', statut: 'Actif', ok: true },
                { titre: 'Flutterwave', desc: 'Paiements 30+ pays, FCFA/GHS/NGN/KES', statut: 'A configurer', ok: false },
                { titre: 'WhatsApp Business API', desc: 'Chatbot orientation 24h/7j, notifications', statut: 'Phase 1', ok: false },
                { titre: 'MTN MoMo + Orange Money', desc: 'Wallet Carte Competences, reception salaire', statut: 'Phase 1', ok: false },
              ].map((p) => (
                <div key={p.titre} style={{ ...S.card, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#0F2419' }}>{p.titre}</div>
                    <span style={S.badge(p.ok ? '#1D9E75' : '#6B8F7A', p.ok ? '#E8F8F2' : '#F0F4F2')}>{p.statut}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6B8F7A' }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
