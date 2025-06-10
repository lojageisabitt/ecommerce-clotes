// src/app/api/mercado-pago/preference/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

type Item = { name: string; quantity: number; price: number };

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});
const preferenceClient = new Preference(client);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items: Item[];
      orderId: string;
    };
    const { items, orderId } = body;

    if (!items?.length || !orderId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const preferencePayload = {
      items: items.map((item, idx) => ({
        id: `item-${idx}`,
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: item.price,
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}?status=success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/${orderId}?status=pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercado-pago/webhook`,
      external_reference: orderId,
    };

    const mpResponse = await preferenceClient.create({
      body: preferencePayload,
    });
    const initPoint = mpResponse.init_point;

    return NextResponse.json({ init_point: initPoint });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return NextResponse.json(
      { error: 'Erro ao criar preferência' },
      { status: 500 }
    );
  }
}
