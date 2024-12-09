import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "600", "700"], // Adjust weights as needed
});

export const metadata = {
  title: "M-Arcade",
  description: "Arcade meant for Mantle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased bg-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
