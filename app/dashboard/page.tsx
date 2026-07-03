import Link from "next/link";
import { Logo } from "@/components/Logo";

const stacks = [
  { id: "html", name: "HTML / CSS / JS", note: "Static site — simplest, fastest", ready: true },
  { id: "react", name: "React / Next.js", note: "Component-based apps", ready: false },
  { id: "vue", name: "Vue / Nuxt", note: "Coming after React", ready: false },
  { id: "node", name: "+ Node.js backend", note: "APIs & server logic add-on", ready: false },
];

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      <header className="flex items-center justify-between border-b border-edge py-5">
        <Link href="/">
          <Logo size={22} />
        </Link>
        <span className="text-sm text-muted">Phase 0 preview</span>
      </header>

      <section className="py-12">
        <h1 className="font-display text-3xl font-bold">Your projects</h1>
        <p className="mt-2 text-muted">
          No projects yet. Pick a stack to create your first one.
        </p>

        <h2 className="mt-10 font-display text-lg font-semibold text-ink">New project</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stacks.map((s) => (
            <button
              key={s.id}
              disabled={!s.ready}
              className={
                "rounded-2xl border p-6 text-left transition-all " +
                (s.ready
                  ? "border-accent bg-surface shadow-neon hover:shadow-neon-lg cursor-pointer"
                  : "border-edge bg-surface/50 opacity-60 cursor-not-allowed")
              }
            >
              <div className="font-display font-semibold text-ink">{s.name}</div>
              <div className="mt-1 text-sm text-muted">{s.note}</div>
              {!s.ready && (
                <div className="mt-3 inline-block rounded-full border border-edge px-2 py-0.5 text-xs text-muted">
                  soon
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
