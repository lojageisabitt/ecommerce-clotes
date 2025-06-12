'use client'

import Link from 'next/link'
import Image from 'next/image'
import { WhatsAppButton } from './WhatsAppButton'


export default function Footer() {


  return (
    <footer className="w-full shadow-md">
      <div className="flex flex-col md:flex-row justify-center items-center py-20 gap-10">
        <div className="items-center flex flex-col">
            <Image src={'/assets/cartoes-de-credito-1.png'} alt={'Aceitamos Cartões'} width={100} height={100}/>
            <h4 className="font-bold text-center">Aceitamos Cartões</h4>
        </div>
        <div className="items-center flex flex-col">
            <Image src={'/assets/caminhao-de-entrega-4.png'} alt={'Entrega Rápida'} width={100} height={100}/>
            <h4 className="font-bold text-center">Entrega Rápida</h4>
        </div>
        <div className="items-center flex flex-col">
            <Image src={'/assets/cadeado-1.png'} alt={'Site Seguro'} width={100} height={100}/>
            <h4 className="font-bold text-center">Site Seguro</h4>
        </div>
      </div>
      <div className="w-full bg-[#000020] shadow-md p-10 text-white flex flex-col items-center">
        <div className='max-w-6xl flex flex-col md:flex-row justify-between gap-10'>
        <div>
            <Image src={"/assets/LOGO-LOJA-DE-ROUPAS-C-M-TEIXEIRAS.png"} alt={'Logo Loja de roupas CM Teixeiras'} width={293} height={56} />
        </div>
        <div>
            <h4 className="font-bold">Horário de Atendimento</h4>
            <p>Segunda à sexta: 9:00 às 20:00</p>
            <Link href="https://wa.me/5521986369426" className="flex items-center">
                <p>Whatsapp: 21986369426</p>
            </Link>
            <h4 className="font-bold mt-4">Endereço</h4>
            <p>Rua maestro Claudionor da Silva</p>
        </div>
        <div>
            <h4 className="font-bold">Formas de Pagamento</h4>
            <Image className='rounded mb-4' src={'/assets/formas-de-pagamento.png'} alt={'Formas de Pagamento aceitas pela loja CM Teixeitas'} width={170} height={170}/>
            <h4 className="font-bold">Site Seguro</h4>
            <Image src={'/assets/ssl-site-seguro.png'} alt={'Site Seguro SSL'} width={100} height={100}/>
        </div>
        </div>
      </div>
      <WhatsAppButton />
    </footer>
  )
}
