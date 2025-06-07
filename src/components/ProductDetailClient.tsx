'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export type Color = { id: string; name: string; hex: string }
export type Size  = { id: string; name: string }

export type ProductDetailClientProps = {
  id: string
  name: string
  slug: string
  imageUrl: string
  description: string
  price: number
  colors: Color[]
  sizes: Size[]
}

export default function ProductDetailClient({ product }: { product: ProductDetailClientProps }) {
  const { id, name, slug, imageUrl, description, price, colors, sizes } = product

  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)

  const { addItem } = useCart()

 const [message, setMessage] = useState<string | null>(null)

const handleAddToCart = () => {
  if (!selectedColor || !selectedSize) {
    alert('Selecione cor e tamanho antes de adicionar ao carrinho.')
    return
  }

  addItem({
    productId: id,
    name,
    slug,
    imageUrl,
    price,
    color: { name: selectedColor.name, hex: selectedColor.hex },
    size: { name: selectedSize.name },
    quantity: 1,
  })

  setMessage('Item adicionado ao carrinho!')

  setTimeout(() => setMessage(null), 3000)
}

  return (
    <div className="mt-4 space-y-6">
      {/* Imagem */}
      <div>
        <Image
          src={imageUrl}
          alt={name}
          width={600}
          height={600}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>

      {/* Informações */}
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg text-gray-700 mt-2">{description}</p>
        <p className="text-2xl text-purple-700 font-bold mt-4">
          R$ {price.toFixed(2)}
        </p>
      </div>

      {/* Seleção de cor */}
      <div>
        <h2 className="font-semibold mb-2">Escolha a cor:</h2>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition ${
                selectedColor?.id === color.id
                  ? 'ring-2 ring-purple-600'
                  : 'hover:border-gray-500'
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Seleção de tamanho */}
      <div>
        <h2 className="font-semibold mb-2">Escolha o tamanho:</h2>
        <div className="flex gap-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              className={`px-3 py-1 border rounded-md transition ${
                selectedSize?.id === size.id
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
      {/* Mensagem de sucesso */}
      {message && (
        <div className="p-2 bg-green-100 text-green-800 rounded-md text-center">
          {message}
        </div>
      )}
      {/* Botão adicionar ao carrinho */}
      <button
        onClick={handleAddToCart}
        type="button"
        className="mt-6 w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  )
}
