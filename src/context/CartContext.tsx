'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type CartItem = {
  productId: string
  name: string
  slug: string
  imageUrl: string
  price: number
  color: { name: string; hex: string }
  size: { name: string }
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, colorHex: string, sizeName: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Carrega do localStorage ao montar
  useEffect(() => {
    const stored = localStorage.getItem('loja-roupas-cart')
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  // Persiste no localStorage sempre que items mudar
  useEffect(() => {
    localStorage.setItem('loja-roupas-cart', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existsIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color.hex === newItem.color.hex &&
          item.size.name === newItem.size.name
      )

      if (existsIndex > -1) {
        const updated = [...prev]
        updated[existsIndex].quantity += newItem.quantity
        return updated
      }

      return [...prev, newItem]
    })
  }

  const removeItem = (
    productId: string,
    colorHex: string,
    sizeName: string
  ) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color.hex === colorHex &&
            item.size.name === sizeName
          )
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
