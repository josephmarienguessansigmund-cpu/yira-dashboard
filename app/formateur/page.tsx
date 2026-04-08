"use client";
import { useRouter } from "next/navigation";
export default function EspaceFormateur() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-gray-400 text-sm">Accueil</button>
        <div className="font-semibold text-gray-900">Espace Formateur</div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 gap-4">
        {[
          {titre:"Emploi du temps",desc:"Votre planning de formation"},
          {titre:"Suivi presence",desc:"30 beneficiaires assignes"},
          {titre:"Evaluations",desc:"Notes et rapports mi-parcours"},
          {titre:"Jury CQP",desc:"Organisation et deliberation"},
        ].map((c) => (
          <div key={c.titre} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="font-semibold text-gray-900 mb-2">{c.titre}</div>
            <div className="text-sm text-gray-500">{c.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
