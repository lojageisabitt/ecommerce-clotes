import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface CategoriaPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { slug } = await params

  let produtos = []
  let categoriaNome = ''

  if (slug === 'todos') {
    produtos = await prisma.product.findMany({
      include: { colors: true, sizes: true },
      orderBy: { createdAt: 'desc' }
    })
    categoriaNome = 'Todos os Produtos'
  } else {
    const categoria = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            colors: true,
            sizes: true,
          },
        },
      },
    })

    if (!categoria) return notFound()

    produtos = categoria.products
    categoriaNome = categoria.name
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Categoria: {categoriaNome}</h1>

      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtos.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.slug}`}
              className="border rounded p-4 hover:shadow-lg transition"
            >
              <Image src={product.imageUrl} alt={product.name} className="w-full h-120 object-cover mb-2 rounded" />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
              <button className='bg-green-600 px-8 py-2 m-4 rounded-xl text-center font-bold text-white'>VER DETALHES</button>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
