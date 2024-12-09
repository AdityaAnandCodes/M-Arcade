import Link from 'next/link';

const games = [
  { id: '1', name: 'zombie' },
  { id: '2', name: 'slotmachine' },
  
];

export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Games</h1>
      <ul className="space-y-4">
        {games.map((game) => (
          <li key={game.id} className="bg-white shadow p-4 rounded-lg">
            <Link href={`/games/${game.name}`}>
              <div className="text-indigo-600 hover:underline font-semibold">
                {game.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
