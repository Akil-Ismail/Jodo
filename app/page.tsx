import Link from "next/link";
import { Logo } from "@/components/Logo";

const features = [
  {
    title: "Visual Builder",
    body: "Drag, drop, resize, restyle. A real canvas with responsive breakpoints — not a form with a color picker.",
  },
  {
    title: "Own the Code",
    body: "Every project is standard HTML, React, or Vue. Open the VS Code-style editor and change anything.",
  },
  {
    title: "AI That Edits",
    body: "Ask the built-in agent to build sections, fix bugs, or refactor. Review its diffs before they land.",
  },
  {
    title: "Repo & Deploy",
    body: "Connect GitHub, commit from the canvas, deploy to a live URL in one click.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      <header className="flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/dashboard" className="hover:text-ink transition-colors">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-neon-gradient px-4 py-2 font-semibold text-white shadow-neon hover:shadow-neon-lg transition-shadow"
          >
            Start building
          </Link>
        </nav>
      </header>

      <section className="py-24 text-center">
        <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
          Build visually.
          <br />
          <span className="gradient-text glow-text">Own the code.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Jodo is the website builder that never locks you in. Drag and drop like Shopify,
          edit code like VS Code, ship to GitHub and a live URL — with an AI agent that
          works alongside you.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-neon-gradient px-8 py-4 text-lg font-semibold text-white shadow-neon hover:shadow-neon-lg transition-shadow"
          >
            Create your first project
          </Link>
        </div>
      </section>

      <section className="grid gap-6 pb-24 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-edge bg-surface p-8 transition-colors hover:border-accent"
          >
            <h3 className="font-display text-xl font-semibold text-ink">{f.title}</h3>
            <p className="mt-3 text-muted">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-edge py-8 text-center text-sm text-muted">
        &lt;Jodo&gt; — build visually, own the code.
      </footer>
    </main>
  );
}
