// src/app/api/frete/route.ts
import { NextResponse } from 'next/server'

interface FreteService {
  id: string
  name: string
  price: number
  delivery_time: number
  error?: string
}

export async function POST(request: Request) {
  const { cepDestino, quantidade } = await request.json()

  // Validações básicas
  if (!cepDestino || cepDestino.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
  }
  if (!quantidade || quantidade < 1) {
    return NextResponse.json({ error: 'Quantidade inválida' }, { status: 400 })
  }

  // Calcula peso e dimensões
  const pesoTotal = 0.2 * quantidade // 200g por item em kg
  const alturaTotal = 5 * quantidade // 5cm por item
  const largura = 20 // Fixo em cm
  const comprimento = 20 // Fixo em cm

  try {
    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'Ecommerce-Clotes ageisislane@gmail.com',
      },
      body: JSON.stringify({
        from: { postal_code: '25935506' },
        to: { postal_code: cepDestino },
        products: [
          {
            id: '1',
            quantity: 1,
            weight: pesoTotal,
            width: largura,
            height: alturaTotal,
            length: comprimento,
            insurance_value: 100,
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.errors || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Erro ao calcular frete. Verifique o CEP.' }, { status: 400 })
    }

    const options = (data as FreteService[])
      .filter((service) => !service.error)
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price.toString(),
        delivery_time: service.delivery_time.toString(),
      }))

    return NextResponse.json(options)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao conectar com a API do Melhor Envio.' }, { status: 500 })
  }
}
