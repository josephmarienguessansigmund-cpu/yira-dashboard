import { getFilieres } from "@/lib/api";

// 1. Placez l'interface ici, en dehors du composant
interface Filiere {
  id: string;
  nom: string;
}

export default async function FilieresPage() {
  const filieres = await getFilieres("CI");

  return (
    <div>
      <h1>Filières</h1>

      {/* 2. Utilisez l'interface dans le .map() ici */}
      {filieres.map((f: Filiere) => (
        <div key={f.id}>
          <p>{f.nom}</p>
        </div>
      ))}
    </div>
  );
}