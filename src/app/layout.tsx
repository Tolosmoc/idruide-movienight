import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/Providers";

export const metadata: Metadata = {
  title: "MovieNight - Recherche de films",
  description: "Trouvez votre prochain film a regarder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}