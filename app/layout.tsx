import './globals.css';
import { ThemeProvider } from '../context/themeContext';
import { AuthProvider } from "../context/authContext"


export const metadata = {
  title: 'Worknoon Chat',
  description: 'Worknoon eCommerce multi-role real-time messaging workspace terminal',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
        <ThemeProvider>
          <AuthProvider>
              {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
