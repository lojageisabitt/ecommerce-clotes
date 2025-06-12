import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, cpf } = await req.json()

  if (!email || !cpf) {
    return NextResponse.json({ message: 'Email e CPF são obrigatórios' }, { status: 400 })
  }

  try {
    const pedidos = await prisma.order.findMany({
      where: {
        email,
        cpf,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        statusPagamento: true,
        total: true,
        createdAt: true,
      },
    })

    return NextResponse.json(pedidos)
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar pedidos', error }, { status: 500 })
  }
}
