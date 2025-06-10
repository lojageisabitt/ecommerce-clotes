import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch('https://api.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_API_TOKEN}`,
      },
      body: JSON.stringify([body]), // O Melhor Envio aceita um array de cotação
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 })
  }
}
