'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkoutSchema } from '@/lib/validators/checkoutSchema'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'

type CheckoutFormData = yup.InferType<typeof checkoutSchema>

export default function CheckoutForm() {
  const { items, clearCart } = useCart()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
  })

const onSubmit = async (data: CheckoutFormData) => {
  if (items.length === 0) {
    toast.error('Seu carrinho está vazio')
    return
  }

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, items }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      toast.error('Erro ao criar pedido')
      return
    }

    const { orderId } = await res.json()

    const prefRes = await fetch('/api/mercado-pago/preference', {
      method: 'POST',
      body: JSON.stringify({ items, orderId }),
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

      <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
        Finalizar Pedido
      </button>
    </form>
  )
}
