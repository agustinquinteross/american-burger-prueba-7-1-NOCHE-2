'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
// 🔥 AQUÍ AGREGUÉ 'Layers' QUE FALTABA
import { X, Save, Upload, Loader2, Trash2, Layers, Image as ImageIcon } from 'lucide-react'

export default function AdminProductForm({ productToEdit, onCancel, onSaved }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Estados del Formulario
  const [name, setName] = useState(productToEdit?.name || '')
  const [description, setDescription] = useState(productToEdit?.description || '')
  const [price, setPrice] = useState(productToEdit?.price || '')
  const [categoryId, setCategoryId] = useState(productToEdit?.category_id || '')
  const [imageUrl, setImageUrl] = useState(productToEdit?.image_url || '')
  
  // Estados de Datos
  const [categories, setCategories] = useState([])
  const [modifierGroups, setModifierGroups] = useState([])
  const [selectedModifiers, setSelectedModifiers] = useState([]) 

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      // 1. Cargar Categorías
      const { data: cats } = await supabase.from('categories').select('*').order('id')
      if (cats) {
          setCategories(cats)
          if (!productToEdit && cats.length > 0 && !categoryId) {
              setCategoryId(cats[0].id)
          }
      }

      // 2. Cargar Grupos de Extras
      const { data: groups } = await supabase.from('modifier_groups').select('*').order('id')
      if (groups) setModifierGroups(groups)

      // 3. Si editamos, cargar modificadores existentes
      if (productToEdit) {
        const { data: existingModifiers } = await supabase
            .from('product_modifiers')
            .select('group_id')
            .eq('product_id', productToEdit.id)
        
        if (existingModifiers) {
            setSelectedModifiers(existingModifiers.map(em => em.group_id))
        }
      }
    }
    fetchData()
  }, [])

  // --- SUBIDA DE IMAGEN ---
  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Subir a 'menu-images'
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath)
      setImageUrl(data.publicUrl)

    } catch (error) {
      alert('Error subiendo imagen: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // --- GUARDAR PRODUCTO ---
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        image_url: imageUrl,
        is_active: true
      }

      let productId = productToEdit?.id

      if (productToEdit) {
        // ACTUALIZAR
        const { error } = await supabase.from('products').update(productData).eq('id', productId)
        if (error) throw error
      } else {
        // CREAR
        const { data, error } = await supabase.from('products').insert([productData]).select()
        if (error) throw error
        productId = data[0].id
      }

      // GUARDAR RELACIONES
      if (productToEdit) {
        await supabase.from('product_modifiers').delete().eq('product_id', productId)
      }
      
      if (selectedModifiers.length > 0) {
        const modifiersToInsert = selectedModifiers.map(groupId => ({
            product_id: productId,
            group_id: groupId
        }))
        const { error: modError } = await supabase.from('product_modifiers').insert(modifiersToInsert)
        if (modError) throw modError
      }

      onSaved()

    } catch (error) {
      alert('Error guardando: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleModifier = (groupId) => {
      setSelectedModifiers(prev => 
        prev.includes(groupId) 
            ? prev.filter(id => id !== groupId) 
            : [...prev, groupId]
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 shadow-2xl flex flex-col custom-scrollbar">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Foto del Producto</label>
                        <div className="relative overflow-hidden bg-black border border-gray-700 rounded-xl aspect-square flex items-center justify-center group cursor-pointer hover:border-gray-500 transition">
                            {imageUrl ? (
                                <>
                                    <img src={imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                        <ImageIcon className="text-white"/>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    {uploading ? <Loader2 className="animate-spin mb-2"/> : <Upload size={32} className="mb-2"/>}
                                    <span className="text-xs">{uploading ? 'Subiendo...' : 'Subir Foto'}</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Precio</label>
                            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-red-600" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Categoría</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-red-600">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Nombre</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-red-600 font-bold" placeholder="Ej: Doble Cheese..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Descripción</label>
                        <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-red-600 text-sm" placeholder="Ingredientes..." />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                        <label className="text-xs font-bold text-yellow-500 uppercase flex items-center gap-2">
                            <Layers size={14}/> Grupos de Extras Permitidos
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                            {modifierGroups.length === 0 && <p className="text-xs text-gray-500">No hay grupos de extras creados.</p>}
                            {modifierGroups.map(group => (
                                <label key={group.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedModifiers.includes(group.id) ? 'bg-red-900/20 border-red-600' : 'bg-black border-gray-800 hover:border-gray-600'}`}>
                                    <input type="checkbox" className="w-4 h-4 accent-red-600" checked={selectedModifiers.includes(group.id)} onChange={() => toggleModifier(group.id)} />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-white block">{group.name}</span>
                                        <span className="text-[10px] text-gray-400">{group.min_selection === 1 && group.max_selection === 1 ? 'Selección Única' : 'Múltiple'}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </form>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 sticky bottom-0 bg-gray-900 z-10">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:bg-gray-800 transition text-sm">Cancelar</button>
          <button onClick={handleSave} disabled={loading || uploading} className="px-6 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-500 transition shadow-lg flex items-center gap-2 text-sm disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Guardar Producto</>}
          </button>
        </div>

      </div>
    </div>
  )
}