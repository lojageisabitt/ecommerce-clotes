// src/app/produto/[slug]/page.tsx

import Link from 'next/link'
import ProductDetailClient, { ProductDetailClientProps } from '@/components/ProductDetailClient'
import prisma from '@/lib/prisma'

type ProdutoPageProps = {
  params: Promise<{ slug: string }>
}

type ProductWithRelations = {
  id: string
  name: string
  slug: string
  imageUrl: string
  description: string
  price: number
  colors: { id: string; name: string; hex: string }[]
  sizes: { id: string; name: string }[]
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { colors: true, sizes: true },
  })

  if (!product) {
    return <div className="p-4 text-red-600">Produto não encontrado.</div>
  }

  const typedProduct = product as ProductWithRelations

  const productForClient: ProductDetailClientProps = {
    id: typedProduct.id,
    name: typedProduct.name,
    slug: typedProduct.slug,
    imageUrl: typedProduct.imageUrl,
    description: typedProduct.description,
    price: typedProduct.price,
    colors: typedProduct.colors.map((c) => ({
      id: c.id,
      name: c.name,
      hex: c.hex,
    })),
    sizes: typedProduct.sizes.map((s) => ({
      id: s.id,
      name: s.name,
    })),
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link href="/" className="text-purple-700 hover:underline">
        ← Voltar
      </Link>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <ProductDetailClient product={productForClient} />
      </div>
    </main>
  )
}
