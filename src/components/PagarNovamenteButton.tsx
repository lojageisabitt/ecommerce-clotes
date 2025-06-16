// src/components/PagarNovamenteButton.tsx
'use client'
import React from 'react'

interface PagarNovamenteButtonProps {
  orderId: string
  items: { name: string; quantity: number; price: number }[]
  frete: number
}

export function PagarNovamenteButton({ orderId, items, frete }: PagarNovamenteButtonProps) {
  const handlePagarNovamente = async () => {
    const formattedItems = [
      ...items,
      { name: 'Frete', quantity: 1, price: frete },
    ]
    const res = await fetch('/api/mercado-pago/preference', {
      method: 'POST',
      body: JSON.stringify({ items: formattedItems, orderId }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const { init_point } = await res.json()
      if (init_point) {
        window.location.href = init_point
      }
    }
  }
  return (
    <button
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={handlePagarNovamente}
    >
      Pagar novamente
    </button>
  )
}
