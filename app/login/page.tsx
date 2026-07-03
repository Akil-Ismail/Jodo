import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthField } from "@/components/AuthField";
import { SupabaseSetupNotice } from "@/components/SupabaseSetupNotice";
import { login } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupNotice />;
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mx-auto mb-10">
        <Logo />
      </Link>

      <div className="rounded-2xl border border-edge bg-surface p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Log in</h1>
        <p className="mt-1 text-sm text-muted">Welcome back.</p>

        {params.notice && (
          <p className="mt-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            {params.notice}
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {params.error}
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          <AuthField label="Email" name="email" type="email" />
          <AuthField label="Password" name="password" type="password" />
          <button
            type="submit"
            className="w-full rounded-xl bg-neon-gradient px-4 py-3 font-semibold text-white shadow-neon hover:shadow-neon-lg transition-shadow"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
