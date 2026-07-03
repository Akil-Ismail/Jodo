import type { Block } from "./types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockToHtml(block: Block): string {
  const p = new Proxy(block.props, {
    get: (target, key: string) => escapeHtml(target[key] ?? ""),
  });

  switch (block.type) {
    case "navbar":
      return `<nav class="flex items-center justify-between px-8 py-5">
  <span class="text-lg font-bold text-neutral-900">${p.brand}</span>
  <a href="${p.ctaHref}" class="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">${p.ctaLabel}</a>
</nav>`;
    case "hero":
      return `<section class="px-8 py-24 text-center text-white" style="background-color: ${p.bg}">
  <h1 class="mx-auto max-w-3xl text-4xl font-bold md:text-6xl">${p.heading}</h1>
  <p class="mx-auto mt-6 max-w-xl text-lg text-white/80">${p.subheading}</p>
  <a href="${p.ctaHref}" class="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-neutral-900">${p.ctaLabel}</a>
</section>`;
    case "features":
      return `<section class="px-8 py-20 text-center">
  <h2 class="text-3xl font-bold text-neutral-900">${p.heading}</h2>
  <div class="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
    ${[1, 2, 3]
      .map(
        (i) => `<div>
      <h3 class="font-semibold text-neutral-900">${p[`item${i}Title`]}</h3>
      <p class="mt-2 text-sm text-neutral-600">${p[`item${i}Body`]}</p>
    </div>`
      )
      .join("\n    ")}
  </div>
</section>`;
    case "text":
      return `<section class="mx-auto max-w-2xl px-8 py-20">
  <h2 class="text-2xl font-bold text-neutral-900">${p.heading}</h2>
  <p class="mt-4 leading-relaxed text-neutral-600">${p.body}</p>
</section>`;
    case "cta":
      return `<section class="px-8 py-20 text-center text-white" style="background-color: ${p.bg}">
  <h2 class="text-3xl font-bold">${p.heading}</h2>
  <a href="${p.ctaHref}" class="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-neutral-900">${p.ctaLabel}</a>
</section>`;
    case "footer":
      return `<footer class="px-8 py-8 text-center text-sm text-neutral-500">${p.text}</footer>`;
    default:
      return "";
  }
}

export function blocksToHtmlDocument(blocks: Block[], title: string): string {
  const body = blocks.map(blockToHtml).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
${body}
</body>
</html>
`;
}
