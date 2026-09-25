import './globals.css';
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kezera Tech — Designing the Future Through Technology',
    template: '%s | Kezera Tech',
  },
  description:
    'Kezera Tech is a technology company focused on building innovative software, digital products, and technology solutions that solve real-world problems. We combine software development, modern technology, and user-centered design to help businesses and organizations turn ideas into practical, scalable digital solutions.',
  keywords: [
    'Kezera Tech',
    'software development Ethiopia',
    'software development Addis Ababa',
    'technology company Ethiopia',
    'technology company Addis Ababa',
    'software company Ethiopia',
    'software company Addis Ababa',
    'web development Ethiopia',
    'web development Addis Ababa',
    'mobile app development Ethiopia',
    'mobile app development Addis Ababa',
    'custom software development Ethiopia',
    'digital solutions Ethiopia',
    'IT solutions Ethiopia',
    'website development Ethiopia',
    'web application development Ethiopia',
    'mobile application development Ethiopia',
    'business software Ethiopia',
    'UI UX design Ethiopia',
    'technology solutions Addis Ababa',
    'digital transformation Ethiopia',
    'software engineering Ethiopia',
    'IT consulting Ethiopia',
    'business automation Ethiopia',
  ],
  authors: [{ name: 'Kezera Tech' }],
  creator: 'Kezera Tech',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kezeratech.com',
    siteName: 'Kezera Tech',
    title: 'Kezera Tech — Designing the Future Through Technology',
    description:
      'Kezera Tech is a technology company focused on building innovative software, digital products, and technology solutions that solve real-world problems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kezera Tech — Designing the Future Through Technology',
    description:
      'Kezera Tech is a technology company focused on building innovative software, digital products, and technology solutions that solve real-world problems.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const viewport: any = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A3D91' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
