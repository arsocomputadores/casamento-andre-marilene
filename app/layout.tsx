export const metadata = {
  title: "André & Marilene — Casamento",
  description: "Site de casamento — André & Marilene",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Imperial+Script&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
