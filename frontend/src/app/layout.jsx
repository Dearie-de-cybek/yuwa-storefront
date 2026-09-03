import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'YUWA',
  description: 'Everyday luxury for the modern woman.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-secondary text-primary font-sans flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
