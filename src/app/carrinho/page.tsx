'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarrinhoPage() {
  const { items, removeItem, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
        <Link href="/" className="text-purple-700 hover:underline">
          Voltar à loja
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Carrinho ({totalItems} itens)</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div
            key={`${item.productId}-${item.color.hex}-${item.size.name}`}
            className="flex items-center gap-4 border-b pb-4"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <Link href={`/produto/${item.slug}`}>
                <h2 className="text-lg font-semibold hover:underline">{item.name}</h2>
              </Link>
              <p className="text-sm text-gray-600">
                Cor: <span className="font-medium">{item.color.name}</span>{' '}
                <span
                  className="inline-block w-4 h-4 rounded-full border ml-1"
                  style={{ backgroundColor: item.color.hex }}
                />
              </p>
              <p className="text-sm text-gray-600">Tamanho: {item.size.name}</p>
              <p className="mt-1 text-purple-700 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm">Qtd: {item.quantity}</p>
              <button
                onClick={() =>
                  removeItem(item.productId, item.color.hex, item.size.name)
                }
                className="text-red-600 hover:underline text-sm"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-xl font-semibold">Total: R$ {totalPrice.toFixed(2)}</p>
        <button
          onClick={() => {
            // stub para checkout; futuramente redireciona para /checkout
            alert('Implementar fluxo de checkout');
          }}
          className="mt-4 bg-purple-700 text-white px-6 py-3 rounded-md hover:bg-purple-800 transition"
        >
          Finalizar Compra
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => clearCart()}
          className="text-gray-600 hover:underline text-sm"
        >
          Limpar Carrinho
        </button>
      </div>
    </main>
  );
}
