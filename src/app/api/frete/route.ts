// src/app/api/frete/route.ts
import { NextRequest, NextResponse } from 'next/server';

type FreteOption = {
  id: string;
  name: string;
  price: number;
  delivery_time: number;
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { cepDestino, pesoTotal } = await req.json();

    // Validação de entrada
    if (!cepDestino || !pesoTotal || isNaN(pesoTotal) || cepDestino.length !== 8) {
      console.error('Validação falhou:', { cepDestino, pesoTotal });
      return NextResponse.json({ error: 'CEP ou peso inválidos' }, { status: 400 });
    }

    // Verificar variáveis de ambiente
    if (!process.env.MELHOR_ENVIO_TOKEN) {
      console.error('Token do Melhor Envio não configurado');
      return NextResponse.json({ error: 'Token do Melhor Envio não configurado' }, { status: 500 });
    }
    if (!process.env.MELHOR_ENVIO_CEP_ORIGEM) {
      console.error('CEP de origem não configurado');
      return NextResponse.json({ error: 'CEP de origem não configurado' }, { status: 500 });
    }

    // Formatar CEPs
    const formattedCepDestino = cepDestino.replace(/(\d{5})(\d{3})/, '$1-$2');
    const cepOrigem = process.env.MELHOR_ENVIO_CEP_ORIGEM.replace(/(\d{5})(\d{3})/, '$1-$2');

    console.log('Enviando requisição para Melhor Envio:', { cepOrigem, formattedCepDestino, pesoTotal });

    // Requisição à API do Melhor Envio
    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify([
        {
          from: { postal_code: cepOrigem },
          to: { postal_code: formattedCepDestino },
          products: [
            {
              weight: parseFloat(pesoTotal),
              width: 20,
              height: 5,
              length: 25,
              quantity: 1,
            },
          ],
          options: { own_hand: false, receipt: false, insurance_value: 0 },
        },
      ]),
    });

    // Logar resposta bruta
    const responseText = await response.text();
    console.log('Resposta bruta do Melhor Envio:', responseText);
    console.log('Status da resposta:', response.status);

    // Verificar se a resposta está vazia
    if (!responseText) {
      console.error('Resposta vazia da API do Melhor Envio');
      return NextResponse.json({ error: 'Resposta vazia da API do Melhor Envio', status: response.status }, { status: 500 });
    }

    // Tentar parsear como JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError);
      return NextResponse.json({ error: 'Resposta inválida da API do Melhor Envio', details: responseText, status: response.status }, { status: 500 });
    }

    console.log('Resposta parseada do Melhor Envio:', JSON.stringify(data, null, 2));

    // Verificar erros na resposta
    if (!response.ok || data.errors) {
      console.error('Erro na API do Melhor Envio:', data.errors || response.statusText);
      return NextResponse.json(
        { error: data.errors || 'Erro ao consultar a API do Melhor Envio', status: response.status },
        { status: response.status || 500 }
      );
    }

    // Formatar resposta para o frontend
    const fretes = (data as FreteOption[])
      .filter((option) => !option.error)
      .map((option) => ({
        id: option.id,
        name: option.name,
        price: option.price.toString(),
        delivery_time: option.delivery_time.toString(),
      }));

    if (fretes.length === 0) {
      console.warn('Nenhuma opção de frete válida retornada');
      return NextResponse.json({ error: 'Nenhuma opção de frete disponível' }, { status: 404 });
    }

    return NextResponse.json(fretes);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Erro ao calcular frete', details: errorMessage }, { status: 500 });
  }
}
