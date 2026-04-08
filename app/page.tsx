'use client';
import { useRouter } from 'next/navigation';

const espaces = [
  {
    id: 'jeune',
    titre: 'Espace Jeune',
    desc: 'Inscription, évaluation SigmundTest, suivi parcours, carte de compétences',
    couleur: '#1D9E75',
    bg: '#E1F5EE',
    icon: '🎓',
    href: '/jeune',
  },
  {
    id: 'conseiller',
    titre: 'Espace Conseiller',
    desc: 'Dashboard bénéficiaires, restitutions, affectations, rapports',
    couleur: '#185FA5',
    bg: '#E6F1FB',
    icon: '👤',
    href: '/conseiller',
  },
  {
    id: 'employeur',
    titre: 'Espace Employeur',
    desc: 'Publication postes, profils matchés, messagerie candidats, contrats',
    couleur: '#854F0B',
    bg: '#FAEEDA',
    icon: '🏢',
    href: '/employeur',
  },
  {
    id: 'formateur',
    titre: 'Espace Formateur',
    desc: 'Emploi du temps, suivi présence, évaluations, jury CQP',
    couleur: '#534AB7',
    bg: '#EEEDFE',
    icon: '📚',
    href: '/formateur',
  },
  {
    id: 'admin',
    titre: 'Backoffice Admin',
    desc: 'Gestion utilisateurs, paramétrage, monitoring, rapports financiers',
    couleur: '#712B13',
    bg: '#FAECE7',
    icon: '⚙️',
    href: '/admin',
  },
  {
    id: 'opc',
    titre: 'OPC-Africa',
    desc: 'Dashboard ministères, KPIs anonymisés, rapports bailleurs',
    couleur: '#27500A',
    bg: '#EAF3DE',
    icon: '📊',
    href: '/opc',
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: '#1D9E75' }}>
            Y
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">YIRA Africa</div>
            <div className="text-xs text-gray-500">Plateforme panafricaine d'orientation et d'insertion</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">Côte d'Ivoire · Phase 0</div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4" style={{ background: '#E1F5EE', color: '#085041' }}>
          2 000 000 jeunes/an à horizon 2032
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur YIRA Africa
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Choisissez votre espace pour accéder à la plateforme
        </p>
      </section>

      {/* Espaces */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {espaces.map((e) => (
            <button
              key={e.id}
              onClick={() => router.push(e.href)}
              className="text-left p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: e.bg }}
              >
                {e.icon}
              </div>
              <div className="font-semibold text-gray-900 text-base mb-2">{e.titre}</div>
              <div className="text-gray-500 text-sm leading-relaxed">{e.desc}</div>
              <div className="mt-4 text-sm font-medium flex items-center gap-1" style={{ color: e.couleur }}>
                Accéder <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        YIRA Africa · NOHAMA Consulting · SigmundTest® Africa · 2026
      </footer>
    </main>
  );
}