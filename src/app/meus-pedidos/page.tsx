'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type Pedido = {
  id: string
  statusPagamento: string | null
  total: number
  createdAt: string
}

type FormInputs = {
  email: string
  cpf: string
}

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  cpf: yup.string().required('CPF obrigatório'),
})

export default function MeusPedidosPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function buscarPedidos(data: FormInputs) {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/orders/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error('Erro ao buscar pedidos')
      }

      const pedidosEncontrados: Pedido[] = await res.json()
      setPedidos(pedidosEncontrados)
    } catch {
      setErro('Não foi possível buscar os pedidos. Verifique os dados informados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto my-14 p-4">
      <h1 className="text-2xl font-bold mb-4">Consultar Meus Pedidos</h1>

      <form onSubmit={handleSubmit(buscarPedidos)} className="space-y-4">
        <div>
          <label>Email</label>
          <input {...register('email')} className="border p-2 w-full rounded" />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label>CPF</label>
          <input {...register('cpf')} className="border p-2 w-full rounded" />
          {errors.cpf && <p className="text-red-600">{errors.cpf.message}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {loading ? 'Buscando...' : 'Buscar pedidos'}
        </button>
      </form>

      {erro && <p className="text-red-600 mt-4">{erro}</p>}

      {pedidos.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Pedidos encontrados:</h2>
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="border p-3 rounded">
              <p><strong>Pedido:</strong> {pedido.id}</p>
              <p><strong>Status:</strong> {pedido.statusPagamento || 'Pendente'}</p>
              <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
              <p><strong>Criado em:</strong> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
              <a
                href={`/pedido/${pedido.id}`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                Ver detalhes
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
