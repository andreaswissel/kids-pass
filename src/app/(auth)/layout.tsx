import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🎨</span>
            <span className="text-2xl font-bold text-kidspass-text">KidsPass</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-sm text-kidspass-text-muted">
        © {new Date().getFullYear()} KidsPass. All rights reserved.
      </footer>
    </div>
  );
}

