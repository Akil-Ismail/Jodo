import type { SectionDef } from "./types";

export const SECTION_DEFS: Record<string, SectionDef> = {
  navbar: {
    type: "navbar",
    label: "Navbar",
    defaultProps: { brand: "My Site", ctaLabel: "Get started", ctaHref: "#" },
    fields: [
      { key: "brand", label: "Brand", type: "text" },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
    ],
  },
  hero: {
    type: "hero",
    label: "Hero",
    defaultProps: {
      heading: "Build something great",
      subheading: "A short line about what you offer and why it matters.",
      ctaLabel: "Get started",
      ctaHref: "#",
      bg: "#111111",
    },
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Subheading", type: "textarea" },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
      { key: "bg", label: "Background color", type: "color" },
    ],
  },
  features: {
    type: "features",
    label: "Features",
    defaultProps: {
      heading: "Why choose us",
      item1Title: "Fast",
      item1Body: "Describe the first benefit here.",
      item2Title: "Reliable",
      item2Body: "Describe the second benefit here.",
      item3Title: "Simple",
      item3Body: "Describe the third benefit here.",
    },
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "item1Title", label: "Item 1 title", type: "text" },
      { key: "item1Body", label: "Item 1 body", type: "textarea" },
      { key: "item2Title", label: "Item 2 title", type: "text" },
      { key: "item2Body", label: "Item 2 body", type: "textarea" },
      { key: "item3Title", label: "Item 3 title", type: "text" },
      { key: "item3Body", label: "Item 3 body", type: "textarea" },
    ],
  },
  text: {
    type: "text",
    label: "Text block",
    defaultProps: {
      heading: "About",
      body: "Write anything here — a story, a mission statement, product details.",
    },
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  cta: {
    type: "cta",
    label: "Call to action",
    defaultProps: {
      heading: "Ready to start?",
      ctaLabel: "Get started",
      ctaHref: "#",
      bg: "#7C3AED",
    },
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
      { key: "bg", label: "Background color", type: "color" },
    ],
  },
  footer: {
    type: "footer",
    label: "Footer",
    defaultProps: { text: `© ${new Date().getFullYear()} My Site. All rights reserved.` },
    fields: [{ key: "text", label: "Text", type: "text" }],
  },
};

export const SECTION_ORDER = ["navbar", "hero", "features", "text", "cta", "footer"];

// Mirrors blockToHtml in ./html.ts markup-for-markup — Phase 1 has no generic
// JSX-to-HTML compiler yet, so canvas preview and exported code are two
// hand-kept-in-sync templates rather than one shared source, per the
// "one-way sync first" plan (JODO-Architecture-Plan.md §11 Phase 1).
export function renderBlock(type: string, props: Record<string, string>) {
  switch (type) {
    case "navbar":
      return (
        <nav className="flex items-center justify-between px-8 py-5">
          <span className="text-lg font-bold text-neutral-900">{props.brand}</span>
          <a
            href={props.ctaHref}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {props.ctaLabel}
          </a>
        </nav>
      );
    case "hero":
      return (
        <section
          className="px-8 py-24 text-center text-white"
          style={{ backgroundColor: props.bg }}
        >
          <h1 className="mx-auto max-w-3xl text-4xl font-bold md:text-6xl">{props.heading}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">{props.subheading}</p>
          <a
            href={props.ctaHref}
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-neutral-900"
          >
            {props.ctaLabel}
          </a>
        </section>
      );
    case "features":
      return (
        <section className="px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-neutral-900">{props.heading}</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <h3 className="font-semibold text-neutral-900">
                  {props[`item${i}Title`]}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{props[`item${i}Body`]}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "text":
      return (
        <section className="mx-auto max-w-2xl px-8 py-20">
          <h2 className="text-2xl font-bold text-neutral-900">{props.heading}</h2>
          <p className="mt-4 leading-relaxed text-neutral-600">{props.body}</p>
        </section>
      );
    case "cta":
      return (
        <section
          className="px-8 py-20 text-center text-white"
          style={{ backgroundColor: props.bg }}
        >
          <h2 className="text-3xl font-bold">{props.heading}</h2>
          <a
            href={props.ctaHref}
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-neutral-900"
          >
            {props.ctaLabel}
          </a>
        </section>
      );
    case "footer":
      return (
        <footer className="px-8 py-8 text-center text-sm text-neutral-500">{props.text}</footer>
      );
    default:
      return null;
  }
}
