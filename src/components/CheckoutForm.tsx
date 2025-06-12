'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkoutSchema } from '@/lib/validators/checkoutSchema'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import { useState, useEffect } from 'react'

type CheckoutFormData = yup.InferType<typeof checkoutSchema>

export default function CheckoutForm() {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [frete, setFrete] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
  })

  const zipCode = watch('address.zipCode')

  useEffect(() => {
    const calcularFrete = async () => {
      if (!zipCode || zipCode.length < 8 || items.length === 0) return

      const quantidade = items.reduce((acc, item) => acc + item.quantity, 0)

      try {
        const res = await fetch('/api/frete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cepDestino: zipCode, quantidade }),
        })

        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const melhor = data[0]
          setFrete(Number(melhor.price))
        } else {
          setFrete(null)
        }
      } catch (err) {
        console.error('Erro ao calcular frete:', err)
        toast.error('Erro ao calcular o frete.')
      }
    }

    calcularFrete()
  }, [zipCode, items])

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio')
      return
    }

    if (!frete) {
      toast.error('Calcule o frete antes de finalizar.')
      return
    }

    try {
      // Criação do pedido
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ ...data, items, frete }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        toast.error('Erro ao criar pedido')
        return
      }

      const { orderId } = await res.json()

      // Itens formatados para Mercado Pago
      const formattedItems = [
        ...items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        {
          name: 'Frete',
          quantity: 1,
          price: frete,
        },
      ]

      // Criação da preferência do Mercado Pago
      const prefRes = await fetch('/api/mercado-pago/preference', {
        method: 'POST',
        body: JSON.stringify({ items: formattedItems, orderId }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!prefRes.ok) {
        toast.error('Erro ao redirecionar para o pagamento.')
        return
      }

      const { init_point } = await prefRes.json()

      clearCart()
      router.push(init_point)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao finalizar o pedido')
    }
  }

  const totalItems = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalGeral = totalItems + (frete ?? 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <input {...register('fullName')} placeholder="Nome completo" className="input" />
      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

      <input {...register('email')} placeholder="E-mail" className="input" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input {...register('cpf')} placeholder="CPF" className="input" />
      {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}

      <input {...register('phone')} placeholder="Telefone" className="input" />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

      <input {...register('address.street')} placeholder="Rua" className="input" />
      {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}

      <input {...register('address.number')} placeholder="Número" className="input" />
      {errors.address?.number && <p className="text-red-500 text-sm">{errors.address.number.message}</p>}

      <input {...register('address.neighborhood')} placeholder="Bairro" className="input" />
      {errors.address?.neighborhood && <p className="text-red-500 text-sm">{errors.address.neighborhood.message}</p>}

      <input {...register('address.city')} placeholder="Cidade" className="input" />
      {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}

      <input {...register('address.state')} placeholder="Estado" className="input" />
      {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}

      <input {...register('address.zipCode')} placeholder="CEP" className="input" />
      {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}

      <div className="mt-2 text-sm">
        <p>Subtotal: R$ {totalItems.toFixed(2)}</p>
        <p>Frete: {frete !== null ? `R$ ${frete.toFixed(2)}` : 'calculando...'}</p>
        <p className="font-semibold">Total: R$ {totalGeral.toFixed(2)}</p>
      </div>

      <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
        Finalizar Pedido
      </button>
    </form>
  )
}
