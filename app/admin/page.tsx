'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';

export default function EspaceAdmin() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('yira_token');
    if (!token) { router.push('/login'); return; }
    Promise.all([
      api.get(endpoints.admin.dashboard).catch(() => null),
      api.get(endpoints.admin.beneficiaires).catch(() => []),
    ]).then(([dash, bens]) => {
      setStats(dash);
      setBeneficiaires(Array.isArray(bens) ? bens : bens?.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('yira_token');
    localStorage.removeItem('yira_role');
    router.push('/login');
  };

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAF9' }}>
      <div style={{ fontSize: 14, color: '#6B8F7A' }}>Chargement...</div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ fontSize: 13, color: '#6B8F7A', background: 'none', border: 'none', cursor: 'pointer' }}>Accueil</button>
          <div style={{ fontWeight: 700, color: '#0F2419' }}>Backoffice Admin NOHAMA</div>
        </div>
        <button onClick={logout} style={{ fontSize: 13, color: '#C0392B', background: 'none', border: '1px solid #F5C6C2', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
          Deconnexion
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ grid: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Beneficiaires inscrits', val: beneficiaires.length || stats?.total_beneficiaires || 0, color: '#1D9E75' },
            { label: 'Pays actifs', val: 7, color: '#185FA5' },
            { label: 'API Status', val: 'En ligne', color: '#E07B00' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #E5EDE9' }}>
              <div style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5EDE9', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5EDE9', fontWeight: 700, color: '#0F2419' }}>
            Beneficiaires inscrits ({beneficiaires.length})
          </div>
          {beneficiaires.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B8F7A', fontSize: 14 }}>
              Aucun beneficiaire pour l'instant
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAF9' }}>
                  {['Code YIRA', 'Nom', 'Prenom', 'Telephone', 'District', 'Niveau', 'Statut'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6B8F7A', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {beneficiaires.map((b: any, i: number) => (
                  <tr key={i} style={{ borderTop: '1px solid #F0F4F2' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: '#1D9E75', fontWeight: 600 }}>{b.code_yira}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#0F2419' }}>{b.nom}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#0F2419' }}>{b.prenom}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B8F7A' }}>{b.telephone}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B8F7A' }}>{b.district}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: '#E8F8F2', color: '#0F6E56', fontWeight: 600 }}>{b.niveau_etude}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: '#E6F1FB', color: '#185FA5', fontWeight: 600 }}>{b.statut_parcours}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}