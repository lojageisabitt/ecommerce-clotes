// src/app/pedido/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import React from 'react'
import { PagarNovamenteButton } from '@/components/PagarNovamenteButton'

interface PedidoPageProps {
  params:  Promise<{ id: string }>
  searchParams?: Promise<{ status?: string }>
}

export default async function PedidoPage({ params, searchParams }: PedidoPageProps) {
 const { id } = await params
const statusQuery = (await searchParams)?.status

  let order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) return notFound()

  if (statusQuery === 'approved' && order.statusPagamento !== 'approved') {
    await prisma.order.update({
      where: { id },
      data: { statusPagamento: 'approved' },
    })
    order = { ...order, statusPagamento: 'approved' }
  }

  const statusText = {
    approved: 'Pagamento aprovado!',
    pending: 'Pagamento pendente. Aguarde confirmação.',
    rejected: 'Pagamento recusado. Tente novamente.',
    failure: 'Erro no pagamento. Tente novamente.',
    success: 'Pedido criado. Aguarde confirmação do pagamento.',
  }

  const displayStatus = order.statusPagamento || statusQuery || 'success'
  const totalProdutos = order.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0
  const frete = order.frete ?? 0
  const totalGeral = totalProdutos + frete
  const itemsForButton = order.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }))

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Pedido #{order.id.slice(0, 8)}</h1>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <p className="text-lg font-semibold">
          {statusText[displayStatus as keyof typeof statusText] || 'Aguardando pagamento...'}
        </p>
        <p className="text-sm text-gray-500 mt-1">Status atual: {order.statusPagamento || 'aguardando'}</p>
        {displayStatus !== 'approved' && (
          <PagarNovamenteButton orderId={order.id} items={itemsForButton} frete={frete} />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Itens do pedido:</h2>
      <ul className="space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">
              Quantidade: {item.quantity} — Tamanho: {item.size} — Cor: {item.color}
            </p>
            <p className="text-sm font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right font-bold text-lg">
        Subtotal: R$ {totalProdutos.toFixed(2)}<br />
        Frete: R$ {frete.toFixed(2)}<br />
        Total: R$ {totalGeral.toFixed(2)}
      </div>
    </main>
  )
}
