"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EspaceEmployeur() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const profils = [
    { code: "CAND-0142", riasec: "SAE", niveau: "N2", score: 78, dispo: "Immediat", filiere: "Commerce" },
    { code: "CAND-0143", riasec: "RC", niveau: "N1", score: 65, dispo: "Immediat", filiere: "Batiment" },
    { code: "CAND-0144", riasec: "IEC", niveau: "N3", score: 92, dispo: "1 mois", filiere: "Tech" },
  ];
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 text-sm">Accueil</button>
          <div className="font-semibold text-gray-900">Espace Employeur</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700">DRH Partenaire</div>
      </header>
      <div className="bg-white border-b px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {["dashboard","profils","offres","messagerie"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 ${tab === t ? "border-orange-600 text-orange-700" : "border-transparent text-gray-500"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "dashboard" && (
          <div className="grid grid-cols-3 gap-4">
            {[{label:"Profils",val:"12"},{label:"Offres",val:"3"},{label:"Recrutements",val:"8"}].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-6 border text-center">
                <div className="text-3xl font-bold text-gray-900">{s.val}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "profils" && (
          <div className="space-y-4">
            {profils.map((p) => (
              <div key={p.code} className="bg-white rounded-xl p-5 border flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{p.code}</div>
                  <div className="text-xs text-gray-500">{p.filiere} - Niveau {p.niveau}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{p.score}</div>
                    <div className="text-xs text-gray-400">Score /100</div>
                  </div>
                  <button className="px-4 py-2 rounded-lg text-white text-sm" style={{background:"#854F0B"}}>
                    Je suis interesse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "offres" && (
          <div className="bg-white rounded-2xl p-8 border max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-6">Publier une offre</h2>
            <div className="space-y-4">
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Titre du poste" />
              <select className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>N1</option><option>N2</option><option>N3</option>
              </select>
              <button className="w-full py-3 rounded-xl text-white font-medium" style={{background:"#854F0B"}}>Publier</button>
            </div>
          </div>
        )}
        {tab === "messagerie" && (
          <div className="bg-white rounded-2xl p-8 border text-center">
            <div className="text-gray-500">Messagerie securisee avec les candidats YIRA</div>
          </div>
        )}
      </div>
    </main>
  );
}
