import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // seu prisma singleton

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { colors: true, sizes: true },
    });
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produto.' }, { status: 500 });
  }
}
