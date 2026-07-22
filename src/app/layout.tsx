import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { TasksProvider } from "@/lib/tasks-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI-планер дня",
  description: "Диктуй або пиши все, що в голові — розберемо на задачі пізніше.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <TasksProvider>
          <div className="flex h-dvh flex-col overscroll-none">
            <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            <BottomNav />
          </div>
        </TasksProvider>
      </body>
    </html>
  );
}
