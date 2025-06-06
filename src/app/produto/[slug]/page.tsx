
import Link from 'next/link'
import ProductDetailClient, { ProductDetailClientProps } from '@/components/ProductDetailClient'
import prisma from '@/lib/prisma';


export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { colors: true, sizes: true },
  })

  if (!product) {
    return <div className="p-4 text-red-600">Produto não encontrado.</div>
  }


  const productForClient: ProductDetailClientProps = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    description: product.description,
    price: product.price,
    colors: product.colors.map((c) => ({
      id: c.id,
      name: c.name,
      hex: c.hex,
    })),
    sizes: product.sizes.map((s) => ({
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
