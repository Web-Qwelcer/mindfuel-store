"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react"

const CART_STORAGE_KEY = "mindfuel-cart"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type CartState = CartItem[]

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

type CartAction =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "INCREASE_QUANTITY"; payload: { id: string } }
  | { type: "DECREASE_QUANTITY"; payload: { id: string } }
  | { type: "CLEAR" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((item) => item.id === action.payload.id)
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      }
      return [...state, action.payload]
    }
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload.id)
    case "INCREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    case "DECREASE_QUANTITY": {
      const item = state.find((i) => i.id === action.payload.id)
      if (!item) return state
      if (item.quantity <= 1) {
        return state.filter((i) => i.id !== action.payload.id)
      }
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i
      )
    }
    case "CLEAR":
      return []
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity"> | CartItem) => void
  removeFromCart: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  checkout: () => Promise<string | null>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, null, () => loadFromStorage())

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> | CartItem) => {
      const quantity = "quantity" in item ? item.quantity : 1
      dispatch({
        type: "ADD",
        payload: {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        },
      })
    },
    []
  )

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: { id } })
  }, [])

  const increaseQuantity = useCallback((id: string) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: { id } })
  }, [])

  const decreaseQuantity = useCallback((id: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id } })
  }, [])

  const checkout = useCallback(async () => {
    if (items.length === 0) return null

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })

    if (!res.ok) return null

    const order = await res.json()

    dispatch({ type: "CLEAR" })

    return order.id as string
  }, [items])

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    checkout,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
