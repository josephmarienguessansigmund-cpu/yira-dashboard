"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const stats = [
  { label: "Bénéficiaires actifs", val: "28", sub: "sur 30 max" },
  { label: "En formation", val: "12", sub: "+3 ce mois" },
  { label: "CQP obtenus", val: "7", sub: "taux 64%" },
  { label: "Insertions J+30", val: "5", sub: "taux 71%" },
];

const beneficiaires = [
  { nom: "Kouassi Yao", code: "YIR-CI-00142", niveau: "N2", statut: "En évaluation", pct: 27 },
  { nom: "Amoin Prisca", code: "YIR-CI-00143", niveau: "N1", statut: "En évaluation", pct: 85 },
  { nom: "Bamba Ibrahim", code: "YIR-CI-00144", niveau: "N3", statut: "En formation", pct: 100 },
  { nom: "Koné Mariama", code: "YIR-CI-00145", niveau: "N2", statut: "Certifié", pct: 100 },
  { nom: "Tra Bi Joël", code: "YIR-CI-00146", niveau: "N1", statut: "Inséré", pct: 100 },
];

export default function EspaceConseiller() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-gray-600 text-sm">? Accueil</button>
          <div className="w-px h-4 bg-gray-200" />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#185FA5" }}>C</div>
          <div className="font-semibold text-gray-900">Espace Conseiller</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full" style={{ background: "#E6F1FB", color: "#0C447C" }}>
          Conseiller Junior · Abidjan
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "beneficiaires", label: "Bénéficiaires" },
            { id: "affectation", label: "Affectation" },
            { id: "messagerie", label: "Messagerie" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">{s.label}</div>
                  <div className="text-3xl font-bold text-gray-900">{s.val}</div>
                  <div className="text-xs text-green-600 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">Mes bénéficiaires</div>
              <table className="w-full">
                <thead><tr className="text-xs text-gray-400 border-b border-gray-50">
                  <th className="text-left px-6 py-3">Nom</th>
                  <th className="text-left px-6 py-3">Code</th>
                  <th className="text-left px-6 py-3">Niveau</th>
                  <th className="text-left px-6 py-3">Statut</th>
                  <th className="text-left px-6 py-3">Progression</th>
                </tr></thead>
                <tbody>
                  {beneficiaires.map((b) => (
                    <tr key={b.code} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{b.nom}</td>
                      <td className="px-6 py-3 text-xs font-mono text-gray-400">{b.code}</td>
                      <td className="px-6 py-3"><span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{b.niveau}</span></td>
                      <td className="px-6 py-3 text-sm text-gray-600">{b.statut}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${b.pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{b.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "beneficiaires" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="text-4xl mb-4">??</div>
            <div className="text-gray-500">Liste complète des bénéficiaires — connecté à REPO-1 API</div>
          </div>
        )}

        {tab === "affectation" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Affecter un bénéficiaire</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Code YIRA du bénéficiaire</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="YIR-CI-2026-XXXXX" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Profil RIASEC dominant</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>R — Réaliste</option>
                  <option>I — Investigateur</option>
                  <option>A — Artistique</option>
                  <option>S — Social</option>
                  <option>E — Entreprenant</option>
                  <option>C — Conventionnel</option>
                </select>
              </div>
              <button className="w-full py-3 rounded-xl text-white font-medium" style={{ background: "#185FA5" }}>
                Trouver les établissements
              </button>
            </div>
          </div>
        )}

        {tab === "messagerie" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <div className="text-4xl mb-4">??</div>
            <div className="text-gray-500">Messagerie sécurisée — bénéficiaires et employeurs</div>
          </div>
        )}
      </div>
    </main>
  );
}
