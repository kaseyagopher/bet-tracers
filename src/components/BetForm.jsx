import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function BetForm({ onSubmit }) {
  const [form, setForm] = useState({
    match_name: '',
    bet_type: 'simple',
    stake: '',
    odds: '',
    result: 'pending',
    bet_date: new Date().toISOString().slice(0, 10),
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const stake = Number(form.stake)
    const odds = Number(form.odds)
    let profit = 0
    if (form.result === 'win') profit = stake * odds - stake
    else if (form.result === 'loss') profit = -stake

    onSubmit({
      match_name: form.match_name,
      bet_type: form.bet_type,
      stake,
      odds,
      result: form.result,
      profit,
      bet_date: form.bet_date,
    })

    setForm({ ...form, match_name: '', stake: '', odds: '', result: 'pending' })
  }

  const inputClass = "w-full bg-[#131722] border border-[#2a2e39] text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>ÉVÉNEMENT</label>
        <input name="match_name" placeholder="Ex: PSG - Lyon" value={form.match_name} onChange={handleChange} required className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>MISE (€)</label>
          <input name="stake" type="number" step="0.01" placeholder="10.00" value={form.stake} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>COTE</label>
          <input name="odds" type="number" step="0.01" placeholder="2.00" value={form.odds} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>TYPE</label>
        <select name="bet_type" value={form.bet_type} onChange={handleChange} className={inputClass}>
          <option value="simple">Simple</option>
          <option value="combiné">Combiné</option>
          <option value="système">Système</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>RÉSULTAT</label>
        <select name="result" value={form.result} onChange={handleChange} className={inputClass}>
          <option value="pending">En attente</option>
          <option value="win">Gagné</option>
          <option value="loss">Perdu</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>DATE</label>
        <input name="bet_date" type="date" value={form.bet_date} onChange={handleChange} required className={inputClass} />
      </div>

      <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded transition-colors flex items-center justify-center gap-2 text-sm">
        <Plus size={16} /> AJOUTER
      </button>
    </form>
  )
}