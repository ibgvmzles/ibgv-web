import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Cargamos Oswald (Tipografía secundaria del manual)
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

// Cargamos Inter para los textos largos por accesibilidad
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="es" className={`${oswald.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-ui-dark bg-white flex flex-col min-h-screen">
        <Header />

        {/* El "children" es el contenido de la página actual (Inicio, Nosotros, etc.) */}
        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  )
}