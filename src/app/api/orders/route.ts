// src/app/api/orders/route.ts
import { checkoutSchema } from '@/lib/validators/checkoutSchema'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { ValidationError } from 'yup'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, ...customerData } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 })
    }

    interface Item {
      productId: string
      name: string
      quantity: number
      price: number
      size: { name: string }
      color: { name: string }
    }

    let validatedData: typeof checkoutSchema.__outputType
    try {
      validatedData = await checkoutSchema.validate(customerData, { abortEarly: false })
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        return NextResponse.json({ error: validationError.errors }, { status: 400 })
      }
      return NextResponse.json({ error: 'Erro de validação desconhecido.' }, { status: 400 })
    }

    const total = items.reduce((acc: number, item: Item) => {
      return acc + item.price * item.quantity
    }, 0)

    // Garante que o frete seja salvo na ordem
    const frete = typeof body.frete === 'number' ? body.frete : 0

    const order = await prisma.order.create({
      data: {
        ...validatedData,
        total,
        frete, // salva o frete
        address: validatedData.address,
        items: {
          create: items.map((item: Item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size.name,
            color: item.color.name,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar pedido.' }, { status: 500 })
  }
}