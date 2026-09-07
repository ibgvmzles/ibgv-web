import { Oswald } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// 1. Cargamos Manofa Condensed (Fuente Primaria)
const manofa = localFont({
  src: './fonts/manofa-bold.ttf',
  variable: '--font-manofa',
  display: 'swap',
})

// 2. Cargamos Barcelony (Fuente para Subtítulos)
const barcelony = localFont({
  src: './fonts/barcelony.ttf',
  variable: '--font-barcelony',
  display: 'swap',
})

// 3. Cargamos Oswald (Textos y Títulos Internos)
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata = {
  title: 'Iglesia Bíblica Gracia Verdadera | Manizales',
  description: 'Comunidad reformada en Manizales donde el centro es Jesucristo y su obra en la cruz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Agregamos la variable de barcelony a la etiqueta html
    <html lang="es" className={`${manofa.variable} ${barcelony.variable} ${oswald.variable}`}>
      <body className="font-oswald font-light antialiased text-ui-dark bg-white flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}