import './globals.css'
import { ThemeProvider } from '../context/themeContext'

export const metadata = {
  title: 'Worknoon Chat',
  description: 'worknoon-eCommerce-chat',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
    <html lang="en">
      <body>{children}</body>
    </html>
    </ThemeProvider>
  )
}