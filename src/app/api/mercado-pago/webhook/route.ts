// src/app/api/mercado-pago/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const paymentId = body?.data?.id
    const topic = body?.type || body?.topic

    if (topic !== 'payment' || !paymentId) {
      return NextResponse.json({ status: 'ignored' })
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    })

    const payment = await mpRes.json()

    const orderId = payment.external_reference
    const status = payment.status // approved, pending, rejected...

    // Atualiza o status do pedido no banco de dados
    await prisma.order.update({
      where: { id: orderId },
      data: { statusPagamento: status },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro no webhook:', err)
    return NextResponse.json({ error: 'Erro no Webhook' }, { status: 500 })
  }
}
