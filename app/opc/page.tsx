"use client";
import { useRouter } from "next/navigation";
export default function OPCAfrica() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-gray-400 text-sm">Accueil</button>
        <div className="font-semibold text-gray-900">OPC-Africa - Observatoire</div>
        <div className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 ml-auto">Lecture seule</div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {label:"Jeunes inscrits",val:"1,247",pays:"7 pays"},
            {label:"Taux insertion J+30",val:"68%",pays:"CI pilote"},
            {label:"CQP delivres",val:"312",pays:"METFPA"},
            {label:"Employeurs actifs",val:"89",pays:"14 secteurs"},
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900">{s.val}</div>
              <div className="text-xs text-green-600 mt-1">{s.pays}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="font-semibold text-gray-900 mb-4">Rapport automatise - Format PTF BAD/GIZ/AFD</div>
          <div className="text-sm text-gray-500">Donnees anonymisees - Exportables en PDF, Excel et JSON</div>
          <button className="mt-4 px-6 py-2 rounded-lg text-white text-sm font-medium" style={{background:"#27500A"}}>
            Telecharger rapport Q1 2026
          </button>
        </div>
      </div>
    </main>
  );
}
