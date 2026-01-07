'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Save, X, Loader2, Ticket, Calendar, Hash } from 'lucide-react'

export default function AdminCouponForm({ couponToEdit, onCancel, onSaved }) {
  const [loading, setLoading] = useState(false)
  
  // Estados Básicos
  const [code, setCode] = useState(couponToEdit?.code || '')
  const [value, setValue] = useState(couponToEdit?.value || 10)
  const [discountType, setDiscountType] = useState(couponToEdit?.discount_type || 'percent')
  
  // Estados Avanzados (Fecha y Límite)
  // Convertimos la fecha de UTC a formato local para el input (YYYY-MM-DDTHH:MM)
  const defaultDate = couponToEdit?.expires_at ? new Date(couponToEdit.expires_at).toISOString().slice(0, 16) : ''
  const [expiresAt, setExpiresAt] = useState(defaultDate)
  const [usageLimit, setUsageLimit] = useState(couponToEdit?.usage_limit || '')
  
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const couponData = {
        code: code.toUpperCase().trim(),
        value: parseFloat(value),
        discount_type: discountType,
        // Si el input de fecha está vacío, mandamos null (sin vencimiento)
        expires_at: expiresAt || null, 
        // Si el input de límite está vacío o es 0, mandamos null (ilimitado)
        usage_limit: usageLimit && parseInt(usageLimit) > 0 ? parseInt(usageLimit) : null,
        is_active: true
      }

      if (couponToEdit) {
        const { error } = await supabase.from('coupons').update(couponData).eq('code', couponToEdit.code)
        if (error) throw error
      } else {
        const { error } = await supabase.from('coupons').insert(couponData)
        if (error) throw error
      }

      onSaved()

    } catch (error) {
      console.error(error)
      alert('Error guardando cupón: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket size={20} className="text-red-600"/> 
            {couponToEdit ? 'Editar Cupón' : 'Nuevo Cupón'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Código */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Código (Ej: PROMO2024)</label>
            <input 
                required 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value.toUpperCase())} 
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white font-black tracking-widest focus:border-red-500 outline-none placeholder-gray-600 uppercase" 
                placeholder="CÓDIGO..." 
            />
          </div>

          {/* Tipo y Valor */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Tipo</label>
                <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none">
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($)</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Valor</label>
                <input required type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 outline-none" />
             </div>
          </div>

          {/* RESTRICCIONES (La parte nueva) */}
          <div className="pt-4 border-t border-gray-800 space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">Restricciones (Opcional)</p>
              
              {/* Fecha Límite */}
              <div className="flex items-center gap-3 bg-black p-3 rounded-lg border border-gray-800">
                  <Calendar size={20} className="text-gray-500"/>
                  <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-1">Fecha de Vencimiento:</label>
                      <input 
                        type="datetime-local" 
                        value={expiresAt} 
                        onChange={e => setExpiresAt(e.target.value)} 
                        className="bg-transparent text-white text-sm w-full outline-none scheme-dark" 
                      />
                  </div>
              </div>

              {/* Límite de Usos */}
              <div className="flex items-center gap-3 bg-black p-3 rounded-lg border border-gray-800">
                  <Hash size={20} className="text-gray-500"/>
                  <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-1">Límite de usos totales:</label>
                      <input 
                        type="number" 
                        placeholder="Ej: 50 (Dejar vacío para Ilimitado)" 
                        value={usageLimit} 
                        onChange={e => setUsageLimit(e.target.value)} 
                        className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-700" 
                      />
                  </div>
              </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:bg-gray-800 transition text-sm">Cancelar</button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-500 transition shadow-lg flex items-center gap-2 text-sm">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Guardar</>}
          </button>
        </div>

      </div>
    </div>
  )
}