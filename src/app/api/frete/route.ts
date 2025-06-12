// src/app/api/frete/route.ts
import { NextResponse } from 'next/server'

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
        'User-Agent': 'Ecommerce-Clotes ageisislane@gmail.com', // Substitua pelo seu e-mail
      },
      body: JSON.stringify({
        from: { postal_code: '25935506' }, // CEP de origem da sua loja
        to: { postal_code: cepDestino },
        products: [
          {
            id: '1',
            quantity: 1, // Pacote único
            weight: pesoTotal, // Em kg
            width: largura, // Em cm
            height: alturaTotal, // Em cm
            length: comprimento, // Em cm
            insurance_value: 100, // Valor declarado (ajuste conforme necessário)
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.errors || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Erro ao calcular frete. Verifique o CEP.' }, { status: 400 })
    }

    // Filtra serviços válidos e formata a resposta
    const options = data
      .filter((service: any) => !service.error)
      .map((service: any) => ({
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