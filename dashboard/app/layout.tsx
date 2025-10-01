import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dashboard de Concursos Públicos | Dados Oficiais DOU 2001-2025",
  description: "Dashboard analítico com dados históricos de concursos públicos federais brasileiros. Visualize tendências, vagas autorizadas e análises organizacionais de 25 anos de dados oficiais do Diário Oficial da União.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
