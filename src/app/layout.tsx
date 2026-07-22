import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { LionWatermark } from "@/components/lion-watermark";
import { ReminderScheduler } from "@/components/reminder-scheduler";
import { TasksProvider } from "@/lib/tasks-context";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  weight: ["400", "700"],
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
    <html lang="uk" className={`${roboto.variable} ${robotoCondensed.variable} antialiased`}>
      <body className="bg-brand-bg text-brand-text">
        <TasksProvider>
          <ReminderScheduler />
          <div className="relative flex h-dvh flex-col overflow-hidden overscroll-none">
            <LionWatermark />
            <main className="relative min-h-0 flex-1 overflow-y-auto">{children}</main>
            <BottomNav />
          </div>
        </TasksProvider>
      </body>
    </html>
  );
}
