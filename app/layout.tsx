import type { Metadata } from "next";
import { Figtree} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";

const font = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "A Spotify clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className}antialiased`}
      >
        <SupabaseProvider>
        <Sidebar>
          {children}
        </Sidebar>
        </SupabaseProvider>
      </body>
    </html>
  );
}
