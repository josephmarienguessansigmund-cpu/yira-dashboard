'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  GraduationCap, Users, Building2, BookOpen,
  Settings, BarChart3, ArrowRight, Globe,
  CheckCircle, Star, TrendingUp, Shield, Loader2
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yira-api-production.up.railway.app/api/v1';

async function apiFetch(url: string) {
  try {
    const r = await fetch(`${API}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

const ESPACES = [
  { id: 'jeune', titre: 'Espace Jeune', desc: 'Inscription, évaluation SigmundTest, suivi parcours, carte de compétences', couleur: '#1D9E75', bg: 'linear-gradient(135deg,#1D9E75,#0F6E56)', bgLight: '#E8F8F2', icon: GraduationCap, href: '/jeune', stats: '50 000+ jeunes' },
  { id: 'conseiller', titre: 'Espace Conseiller', desc: 'Dashboard bénéficiaires, restitutions SigmundTest, affectations établissements', couleur: '#185FA5', bg: 'linear-gradient(135deg,#185FA5,#0C3D6E)', bgLight: '#E6F1FB', icon: Users, href: '/conseiller', stats: '400+ conseillers' },
  { id: 'employeur', titre: 'Espace Employeur', desc: 'Profils matchés par IA, messagerie candidats, publication offres emploi', couleur: '#E07B00', bg: 'linear-gradient(135deg,#E07B00,#A55A00)', bgLight: '#FEF3E2', icon: Building2, href: '/employeur', stats: '500+ DRH' },
  { id: 'formateur', titre: 'Espace Formateur', desc: 'Emploi du temps, suivi présence, évaluations formatives, jury CQP/NVQ', couleur: '#6B3FA0', bg: 'linear-gradient(135deg,#6B3FA0,#4A2B6E)', bgLight: '#F0EAF8', icon: BookOpen, href: '/formateur', stats: '200+ formateurs' },
  { id: 'admin', titre: 'Backoffice Admin', desc: 'Gestion utilisateurs, paramétrage plateforme, monitoring, rapports financiers', couleur: '#C0392B', bg: 'linear-gradient(135deg,#C0392B,#7D241C)', bgLight: '#FCECEA', icon: Settings, href: '/admin', stats: 'NOHAMA Consulting' },
  { id: 'opc', titre: 'OPC-Africa', desc: 'Observatoire panafricain, KPIs ministères, rapports bailleurs BAD/GIZ/AFD', couleur: '#27500A', bg: 'linear-gradient(135deg,#27500A,#162E06)', bgLight: '#EAF3DE', icon: BarChart3, href: '/opc', stats: '7 pays actifs' },
];

export default function Home() {
  const router = useRouter();
  const [pays, setPays] = useState<any[]>([]);
  const [stats, setStats] = useState({ jeunes: 0, filieres: 0, pays: 0, taux_insertion: 72 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/pays/tous'),
      apiFetch('/admin/dashboard'),
      apiFetch('/filieres?pays=CI'),
    ]).then(([paysData, dashData, filieresData]) => {
      if (paysData) setPays(Array.isArray(paysData) ? paysData : paysData.data ?? []);
      setStats({
        jeunes: dashData?.total_beneficiaires ?? dashData?.jeunes ?? 0,
        filieres: filieresData?.total ?? 0,
        pays: Array.isArray(paysData) ? paysData.length : paysData?.data?.length ?? 0,
        taux_insertion: dashData?.taux_insertion ?? 72,
      });
    }).finally(() => setLoading(false));
  }, []);

  const chiffres = [
    { val: stats.jeunes > 0 ? `${stats.jeunes.toLocaleString()}+` : '2M+', label: 'Jeunes cibles 2032', icon: TrendingUp },
    { val: pays.length > 0 ? `${pays.length}` : '—', label: 'Pays CEDEAO actifs', icon: Globe },
    { val: `${stats.taux_insertion}%`, label: 'Taux insertion J+30', icon: CheckCircle },
    { val: stats.filieres > 0 ? `${stats.filieres}+` : '—', label: 'Filières disponibles', icon: Star },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E5EDE9', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="8" x2="22" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="32" y1="8" x2="22" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="22" y1="24" x2="22" y2="36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="34" cy="34" r="5" fill="#E07B00"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#0F2419', letterSpacing: '-0.3px' }}>YIRA Africa</div>
              <div style={{ fontSize: 11, color: '#6B8F7A' }}>Plateforme panafricaine</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: '#E8F8F2', border: '1px solid #A8DCC8' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: loading ? '#D97706' : '#1D9E75' }} />
              <span style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>{loading ? 'Chargement...' : 'API en ligne'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,#0F2419 0%,#1D9E75 50%,#E07B00 100%)', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', marginBottom: 24 }}>
            <Shield size={14} color="#E07B00" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>SigmundTest Africa · 30+ ans · +1.2M évaluations</span>
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
            L&apos;orientation et l&apos;insertion<br />
            <span style={{ color: '#E07B00' }}>professionnelle en Afrique</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40, lineHeight: 1.6 }}>
            YIRA connecte les jeunes, les conseillers, les formateurs et les employeurs<br />sur une seule plateforme panafricaine.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/jeune')} style={{ padding: '14px 28px', borderRadius: 10, background: '#E07B00', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Je suis un jeune <ArrowRight size={16} />
            </button>
            <button onClick={() => router.push('/login')} style={{ padding: '14px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              Connexion professionnels
            </button>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E5EDE9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {chiffres.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} style={{ padding: '20px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #E5EDE9' : 'none' }}>
                <Icon size={20} color="#1D9E75" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0F2419', letterSpacing: '-0.5px' }}>
                  {loading ? <Loader2 size={20} color="#E5EDE9" style={{ animation: 'spin 1s linear infinite' }} /> : c.val}
                </div>
                <div style={{ fontSize: 13, color: '#6B8F7A', marginTop: 4 }}>{c.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Espaces */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Accès rapide</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F2419', letterSpacing: '-0.5px', marginBottom: 12 }}>Choisissez votre espace</h2>
          <p style={{ fontSize: 16, color: '#6B8F7A' }}>Tous les acteurs de l&apos;insertion professionnelle sur une seule plateforme</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {ESPACES.map(e => {
            const Icon = e.icon;
            return (
              <button key={e.id} onClick={() => router.push(e.href)}
                style={{ textAlign: 'left', padding: 0, background: '#fff', borderRadius: 16, border: '1px solid #E5EDE9', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={el => { (el.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (el.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={el => { (el.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (el.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div style={{ height: 6, background: e.bg }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: e.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={e.couleur} />
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: e.bgLight, color: e.couleur, fontWeight: 600 }}>{e.stats}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2419', marginBottom: 8 }}>{e.titre}</div>
                  <div style={{ fontSize: 13, color: '#6B8F7A', lineHeight: 1.6, marginBottom: 20 }}>{e.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: e.couleur }}>
                    Accéder <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pays dynamiques */}
      <section style={{ background: 'linear-gradient(135deg,#0F2419,#1D9E75)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Expansion panafricaine</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              {loading ? '...' : `${pays.length} pays CEDEAO actifs`}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {pays.map((p: any) => p.code).join(' · ')} — 54 pays cibles 2032
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.1)' }} />
                ))
              : pays.map((p: any) => (
                  <div key={p.code} style={{ width: 48, height: 48, borderRadius: 12, background: p.statut === 'actif' ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.15)', border: p.statut === 'actif' ? '1px solid rgba(29,158,117,0.5)' : '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', title: p.nom }}>
                    {p.code}
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F2419', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Y</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>YIRA Africa</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            NOHAMA Consulting · SigmundTest Africa · 2026 · Abidjan, Côte d&apos;Ivoire
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Confidentialité', 'CGU', 'Contact'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

    </main>
  );
}