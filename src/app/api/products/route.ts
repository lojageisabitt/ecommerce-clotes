import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// POST: Cadastrar produto com cores
export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, price, imageUrl, description, colors, sizes } = body;

  if (!name || !slug || !price || !imageUrl || !description) {
    return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        imageUrl,
        description,
        colors: {
          create: colors?.map((color: any) => ({
            name: color.name,
            hex: color.hex,
          })),
        },
        sizes: {
          create: sizes?.map((size: any) => ({
            name: size.name,
          })),
        },
      },
      include: {
        colors: true,
        sizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}

// GET: Listar todos os produtos com cores
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        colors: true,
        sizes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}
