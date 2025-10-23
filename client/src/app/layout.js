
import './globals.css';
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'] });

export const metadata = {
  title: 'GreenNexus',
  description: 'Your personal sustainability companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={jost.className}>
        {children}
        
      </body>
    </html>
  );
}