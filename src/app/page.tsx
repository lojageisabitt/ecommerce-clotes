import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: { colors: true, sizes: true },
    orderBy: { createdAt: 'desc',},
  });

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => (
        <Link
          key={product.id}
          href={`/produto/${product.slug}`}
          className="border rounded-xl p-4 shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-100 object-cover rounded"
          />
          <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
          <p className="text-lg text-purple-600 font-bold">R$ {product.price.toFixed(2)}</p>
          <div className="flex gap-2 mt-2">
            {product.colors.map(color => (
              <div
                key={color.hex}
                title={color.name}
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.sizes.map(size => (
              <span key={size.name} className="text-sm bg-gray-200 px-2 py-1 rounded">
                {size.name}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </main>
  );
}
