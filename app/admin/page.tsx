"use client";
import { useRouter } from "next/navigation";
export default function EspaceAdmin() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-gray-400 text-sm">Accueil</button>
        <div className="font-semibold text-gray-900">Backoffice Admin NOHAMA</div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-4">
        {[
          {titre:"Utilisateurs",val:"284",desc:"Conseillers, formateurs, DRH"},
          {titre:"Pays actifs",val:"7",desc:"CI BF ML SN NE GN GH"},
          {titre:"Jeunes inscrits",val:"1,247",desc:"Depuis Phase 0"},
          {titre:"Quiz actifs",val:"48",desc:"Emploi, culture, finance"},
          {titre:"SMS envoyes",val:"3,891",desc:"Taux livraison 94%"},
          {titre:"Revenue ce mois",val:"284K",desc:"FCFA - Abonnements"},
        ].map((s) => (
          <div key={s.titre} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{s.titre}</div>
            <div className="text-2xl font-bold text-gray-900">{s.val}</div>
            <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
