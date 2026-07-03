"use client";

import dynamic from "next/dynamic";

// dnd-kit generates its internal aria-describedby ids from a mount-order
// counter that lands on different numbers during SSR vs. client hydration,
// causing a hydration-mismatch warning. The editor is fully interactive with
// no static-content value, so it's simplest to skip SSR for it entirely.
export const EditorLoader = dynamic(() => import("./Editor").then((m) => m.Editor), {
  ssr: false,
});
