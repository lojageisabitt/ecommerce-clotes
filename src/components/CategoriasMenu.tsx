'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Categoria = {
  id: string
  name: string
  slug: string
}

export default function CategoriasMenu() {
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    fetch('/api/categorias')
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error('Erro ao carregar categorias:', err))
  }, [])

  return (
    <nav className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between font-bold gap-4 overflow-x-auto">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="text-sm text-gray-700 hover:underline whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
        <Link href="/personalizado" className="text-sm font-semibold text-purple-700 hover:underline">
          Personalizado
        </Link>
      </div>
    </nav>
  )
}
