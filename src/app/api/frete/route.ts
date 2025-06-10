// src/app/api/frete/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cepDestino, pesoTotal } = await req.json();

    if (!cepDestino || !pesoTotal) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        from: { postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM },
        to: { postal_code: cepDestino },
        products: [{
          weight: pesoTotal,
          width: 20,
          height: 5,
          length: 25,
          quantity: 1
        }],
        options: { own_hand: false, receipt: false, insurance_value: 0 },
        services: ['1', '2'] // Correios PAC e SEDEX
      }])
    });

    const data = await response.json();
    console.log('Resposta do Melhor Envio:', data);
    

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: 500 });
  }
}
