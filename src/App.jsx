import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import BetForm from './components/BetForm'
import BetList from './components/BetList'
import BetChart from './components/BetChart'
import { Activity, LayoutDashboard } from 'lucide-react'

export default function App() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .order('bet_date', { ascending: true })
    if (!error) setBets(data)
    setLoading(false)
  }

  useEffect(() => { fetchBets() }, [])

  const addBet = async (bet) => {
    const { error } = await supabase.from('bets').insert([bet])
    if (!error) fetchBets()
  }

  const deleteBet = async (id) => {
    await supabase.from('bets').delete().eq('id', id)
    fetchBets()
  }

  // Stats globales pour le header
  const totalProfit = bets
    .filter(b => b.result !== 'pending')
    .reduce((s, b) => s + Number(b.profit), 0)
  const wins = bets.filter(b => b.result === 'win').length
  const settled = bets.filter(b => b.result !== 'pending').length
  const winRate = settled ? ((wins / settled) * 100).toFixed(1) : 0

  return (
    <div className="flex h-screen overflow-hidden bg-[#131722]">
      
      {/* SIDEBAR GAUCHE : Formulaire d'ajout */}
      <div className="w-80 flex-shrink-0 border-r border-[#2a2e39] bg-[#1e222d] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2a2e39]">
          <Activity className="text-blue-500 mr-3" size={24} />
          <span className="text-white font-bold text-xl tracking-wide">BET TERMINAL</span>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <BetForm onSubmit={addBet} />
        </div>
      </div>

      {/* ZONE PRINCIPALE DROITE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header (Ticker) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2a2e39] bg-[#1e222d]">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-xs text-gray-400">PROFIT NET</p>
              <p className={`text-xl font-semibold ${totalProfit >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} €
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">TAUX DE RÉUSSITE</p>
              <p className="text-xl font-semibold text-white">{winRate} %</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <LayoutDashboard size={16} /> Dashboard
          </div>
        </div>

        {/* Contenu défilant */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Graphique Principal (Style TradingView) */}
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-[#2a2e39] flex justify-between items-center bg-[#1e222d]">
               <span className="font-semibold text-white">Évolution du Capital</span>
               <span className="text-xs bg-[#2a2e39] px-2 py-1 rounded text-gray-300">1D</span>
            </div>
            <BetChart bets={bets} />
          </div>

          {/* Historique des paris */}
          <BetList bets={bets} onDelete={deleteBet} loading={loading} />
        
        </div>
      </div>
    </div>
  )
}