import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SupabaseSetupNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 text-center">
      <Link href="/" className="mx-auto mb-10">
        <Logo />
      </Link>
      <div className="rounded-2xl border border-edge bg-surface p-8">
        <h1 className="font-display text-xl font-bold text-ink">Supabase isn&apos;t connected yet</h1>
        <p className="mt-3 text-sm text-muted">
          Create a project at supabase.com, then copy your Project URL and anon key from{" "}
          <span className="text-ink">Project Settings → API</span> into a{" "}
          <code className="text-accent">.env.local</code> file (see{" "}
          <code className="text-accent">.env.example</code> for the variable names). Restart the
          dev server afterwards.
        </p>
      </div>
    </main>
  );
}
