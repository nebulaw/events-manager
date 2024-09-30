import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/app/_auth/providers";

const FrutigerRegular = localFont({
  src: "./fonts/Frutiger.ttf",
  variable: "--font-frutiger",
  weight: "400",
});
const FrutigerBold = localFont({
  src: "./fonts/Frutiger_bold.ttf",
  variable: "--font-frutiger-bold",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Events",
  description: "Manager your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${FrutigerRegular.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
