import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Admin header */}
      <header className="bg-kidspass-text text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span className="text-xl font-bold">KidsPass Admin</span>
              </Link>
              <nav className="hidden md:flex gap-4">
                <Link
                  href="/admin/partners"
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Partners
                </Link>
                <Link
                  href="/admin/activities"
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Activities
                </Link>
                <Link
                  href="/admin/sessions"
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Sessions
                </Link>
                <Link
                  href="/admin/bookings"
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Bookings
                </Link>
                <Link
                  href="/admin/users"
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Users
                </Link>
              </nav>
            </div>
            <Link
              href="/app"
              className="px-4 py-2 bg-primary text-kidspass-text rounded-md font-semibold hover:bg-primary-hover transition-colors"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

