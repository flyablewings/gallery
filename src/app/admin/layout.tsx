import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="pt-24 md:pt-32">
          {children}
        </main>
      </div>
    </Providers>
  );
}