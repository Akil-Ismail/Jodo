import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SupabaseSetupNotice } from "@/components/SupabaseSetupNotice";
import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/lib/projects/actions";
import { logout } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const stacks = [
  { id: "html", name: "HTML / CSS / JS", note: "Static site — simplest, fastest", ready: true },
  { id: "nextjs", name: "React / Next.js", note: "Component-based apps", ready: false },
  { id: "vue", name: "Vue / Nuxt", note: "Coming after React", ready: false },
  { id: "node", name: "+ Node.js backend", note: "APIs & server logic add-on", ready: false },
];

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupNotice />;
  }

  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, stack, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-6">
      <header className="flex items-center justify-between border-b border-edge py-5">
        <Link href="/">
          <Logo size={22} />
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>{user?.email}</span>
          <form action={logout}>
            <button className="transition-colors hover:text-ink">Log out</button>
          </form>
        </div>
      </header>

      <section className="py-12">
        <h1 className="font-display text-3xl font-bold">Your projects</h1>
        <p className="mt-2 text-muted">
          {projects && projects.length > 0
            ? `${projects.length} project${projects.length === 1 ? "" : "s"}.`
            : "No projects yet. Pick a stack below to create your first one."}
        </p>

        {projects && projects.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-edge bg-surface p-6">
                <div className="font-display font-semibold text-ink">{p.name}</div>
                <div className="mt-1 text-sm text-muted">{p.stack}</div>
              </div>
            ))}
          </div>
        )}

        {params.error && (
          <p className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {params.error}
          </p>
        )}

        <h2 className="mt-10 font-display text-lg font-semibold text-ink">New project</h2>
        <form action={createProject} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stacks.map((s, i) => (
              <label
                key={s.id}
                className={
                  "block rounded-2xl border p-6 text-left transition-all " +
                  (s.ready
                    ? "cursor-pointer border-accent bg-surface shadow-neon hover:shadow-neon-lg has-[:checked]:ring-2 has-[:checked]:ring-accent"
                    : "cursor-not-allowed border-edge bg-surface/50 opacity-60")
                }
              >
                <input
                  type="radio"
                  name="stack"
                  value={s.id}
                  disabled={!s.ready}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                <div className="font-display font-semibold text-ink">{s.name}</div>
                <div className="mt-1 text-sm text-muted">{s.note}</div>
                {!s.ready && (
                  <div className="mt-3 inline-block rounded-full border border-edge px-2 py-0.5 text-xs text-muted">
                    soon
                  </div>
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              name="name"
              placeholder="Project name"
              required
              className="flex-1 rounded-lg border border-edge bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-xl bg-neon-gradient px-6 py-2.5 font-semibold text-white shadow-neon hover:shadow-neon-lg transition-shadow"
            >
              Create
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
