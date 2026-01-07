'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)

  // Carga inicial
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setCart(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Guardado automático
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, mounted])

  // --- 🔥 FUNCIÓN CORREGIDA ---
  // Ahora acepta un objeto "item" que ya trae todo (precio, cantidad y extras)
  const addToCart = (item) => {
    setCart(prev => {
      // 1. Validamos que los extras existan
      const options = item.selectedOptions || [];
      
      // 2. Creamos el ID único combinando ID del producto + Nombres de los extras
      // Ej: "12-Bacon-Cheddar"
      const optionsSignature = options.map(o => o.name).sort().join('-');
      const cartItemId = `${item.id}-${optionsSignature}`;
      
      // 3. Buscamos si ya existe ese producto exacto en el carrito
      const existing = prev.find(i => i.cartItemId === cartItemId)
      
      if (existing) {
        // Si existe, solo sumamos la cantidad
        return prev.map(i => 
          i.cartItemId === cartItemId 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      
      // 4. Si es nuevo, lo agregamos. 
      // IMPORTANTE: 'item' ya trae el precio calculado y los extras desde el Modal.
      return [...prev, { ...item, cartItemId }]
    })
  }

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }
  
  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return
    setCart(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getTotal 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)