'use client';
import { useEffect, useState } from 'react';
import { getFilieres } from '@/lib/api';

interface Filiere {
  id: string;
  nom: string;
  domaine: string;
  niveau: string;
  description?: string;
}

export default function FilieresPage() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilieres('CI')
      .then((data: any) => setFilieres(Array.isArray(data) ? data : data?.data ?? []))
      .catch(() => setFilieres([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F2419', marginBottom: 8 }}>Filières de formation</h1>
        <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 32 }}>Côte d'Ivoire — {filieres.length} filières disponibles</p>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#6B8F7A', padding: 60 }}>Chargement...</div>
        ) : filieres.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6B8F7A', padding: 60 }}>Aucune filière trouvée</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filieres.map((f: Filiere) => (
              <div key={f.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5EDE9', padding: 20 }}>
                <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{f.domaine}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F2419', marginBottom: 4 }}>{f.nom}</div>
                <div style={{ fontSize: 12, color: '#9DB5AB' }}>Niveau {f.niveau}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}