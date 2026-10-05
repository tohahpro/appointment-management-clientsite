import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
// @ts-ignore: side-effect CSS import handled by Next.js
import "./globals.css";
import { Toaster } from "sonner";
import LogoutSuccessToast from "@/components/shared/LogoutSuccessToast";
import LoginSuccessToast from "@/components/shared/LoginSuccessToast";


const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarevia Health Care",
  description: "A Health Care Website",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
        <LogoutSuccessToast />
        <LoginSuccessToast />
      </body>
    </html>
  );
}
