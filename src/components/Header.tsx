'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react' // ou use qualquer outro ícone de sua preferência

export default function Header() {
  const { totalItems } = useCart()
  const router = useRouter()

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo (esquerda) */}
        <Link href="/" className="flex items-center">
          {/* Se tiver uma imagem de logo, troque por <Image src="/logo.png" alt="Logo" width={40} height={40} /> */}
          <span className="text-2xl font-bold text-purple-700">Loja Roupas</span>
        </Link>

        {/* Ícone de carrinho (direita) */}
        <button
          onClick={() => router.push('/carrinho')}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Ver carrinho"
          type="button"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
