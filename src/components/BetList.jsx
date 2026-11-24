import { Trash2 } from 'lucide-react'

export default function BetList({ bets, onDelete, loading }) {
  if (loading) return <div className="p-6 text-gray-400">Chargement...</div>
  if (!bets.length) return <div className="p-6 text-gray-400 text-center">Aucun pari. Remplissez le formulaire à gauche.</div>

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2a2e39]">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Position / Historique</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 border-b border-[#2a2e39]">
            <tr>
              <th className="px-4 py-3 font-normal">DATE</th>
              <th className="px-4 py-3 font-normal">ACTIF</th>
              <th className="px-4 py-3 font-normal text-right">MISE</th>
              <th className="px-4 py-3 font-normal text-right">COTE</th>
              <th className="px-4 py-3 font-normal text-center">STATUT</th>
              <th className="px-4 py-3 font-normal text-right">P&L</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]">
            {[...bets].reverse().map(b => (
              <tr key={b.id} className="hover:bg-[#2a2e39]/50 transition-colors">
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{b.bet_date}</td>
                <td className="px-4 py-3 font-medium text-white">{b.match_name}</td>
                <td className="px-4 py-3 text-right text-gray-300">{Number(b.stake).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-300">{b.odds}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.result === 'win' ? 'bg-[#089981]/20 text-[#089981]' : 
                    b.result === 'loss' ? 'bg-[#f23645]/20 text-[#f23645]' : 
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {b.result === 'win' ? 'GAGNÉ' : b.result === 'loss' ? 'PERDU' : 'ATTENTE'}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-medium ${b.profit >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {b.result === 'pending' ? '—' : `${b.profit >= 0 ? '+' : ''}${Number(b.profit).toFixed(2)}`}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onDelete(b.id)} className="text-gray-500 hover:text-[#f23645] transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}