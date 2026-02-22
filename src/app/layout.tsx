import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "925Kids — Kids Activities in Walnut Creek & Lamorinda",
  description:
    "Every after-school and summer program in the 925, in one place. Filter by age, interest, and neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
