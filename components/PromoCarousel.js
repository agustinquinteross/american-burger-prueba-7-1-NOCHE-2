'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export default function PromoCarousel() {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // 1. Cargar Banners desde Supabase
  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false }) // Los más nuevos primero
      
      if (data) setBanners(data)
      setLoading(false)
    }
    fetchBanners()
  }, [])

  // 2. Auto-Play (Cambiar cada 5 segundos)
  useEffect(() => {
    if (banners.length <= 1) return // No rotar si hay solo 1 o 0
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, banners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  if (loading) return <div className="h-40 sm:h-64 bg-gray-900 animate-pulse rounded-2xl mx-4 mt-6 flex items-center justify-center"><Loader2 className="animate-spin text-gray-700"/></div>
  if (banners.length === 0) return null // No mostrar nada si no hay banners

  return (
    <div className="relative group w-full max-w-6xl mx-auto px-4 mt-6">
      {/* Contenedor Principal */}
      <div className="relative h-40 sm:h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-800">
        
        {/* Imágenes */}
        <div 
            className="w-full h-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {banners.map((banner) => (
                <div key={banner.id} className="min-w-full h-full relative">
                    <img 
                        src={banner.image_url} 
                        alt={banner.title || 'Promo'} 
                        className="w-full h-full object-cover"
                    />
                    {/* Sombra y Título (Opcional) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                        {banner.title && <h2 className="text-white font-black text-xl sm:text-3xl italic tracking-tighter drop-shadow-lg">{banner.title}</h2>}
                    </div>
                </div>
            ))}
        </div>

        {/* Flechas (Solo visibles en Desktop al pasar el mouse) */}
        <div className="hidden sm:block">
            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft size={24}/>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={24}/>
            </button>
        </div>

        {/* Indicadores (Puntitos) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white'}`}
                />
            ))}
        </div>

      </div>
    </div>
  )
}