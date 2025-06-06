import { PrismaClient } from '@prisma/client';
import Link from 'next/link';


const prisma = new PrismaClient();

export default async function ProdutoPage(props: { params: { slug: string } }) {
  const params = await props.params;
  const slug = params.slug;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { colors: true },
  });

  if (!product) {
    return <div className="p-4 text-red-600">Produto não encontrado.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
        <Link href={`/`}>Voltar</Link>
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl text-purple-700 font-bold mt-4">R$ {product.price.toFixed(2)}</p>

          <div className="mt-4">
            <h2 className="font-semibold mb-2">Cores disponíveis:</h2>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <div
                  key={color.hex}
                  title={color.name}
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
