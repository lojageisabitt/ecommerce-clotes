'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react' // ou use qualquer outro ícone de sua preferência

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="w-full bg-[#000020] shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo (esquerda) */}
        <Link href="/" className="flex items-center">
          <Image className="py-8 max-w-[180px] md:max-w-[250px]" src="/assets/LOGO-LOJA-DE-ROUPAS-C-M-TEIXEIRAS.png" alt="Logo LOJA DE ROUPAS C.M.TEIXEIRAS" width={293} height={56} />
          {/* <span className="text-2xl font-bold text-purple-700">Loja Roupas</span> */}
        </Link>

        {/* Ícone de carrinho (direita) */}
        <div className="flex items-center space-x-4">
          <Link href="/meus-pedidos" className="text-white p-2 hover:bg-gray-500 hover:rounded transition mr-4">
            Meus Pedidos</Link>
          <Link href="/carrinho" className="relative p-2 rounded-full hover:bg-gray-500 transition" aria-label="Ver carrinho">
            <ShoppingCart className="w-6 h-6 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
