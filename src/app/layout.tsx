import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHOP.CO - E-Commerce Store",
  description: "Find clothes that matches your style",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-satoshi antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}