// src/app/api/mercado-pago/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const paymentId = body?.data?.id
    const topic = body?.type || body?.topic

    if (topic !== 'payment' || !paymentId) {
      return NextResponse.json({ status: 'ignored' })
    }

    // Busca o pagamento via API oficial
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    })

    const payment = await mpRes.json()
    const orderId = payment?.external_reference
    const status = payment?.status // approved, pending, rejected

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Pagamento inválido' }, { status: 400 })
    }

    // Atualiza o status do pedido no banco
    await prisma.order.update({
      where: { id: orderId },
      data: { statusPagamento: status },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro no webhook Mercado Pago:', err)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
