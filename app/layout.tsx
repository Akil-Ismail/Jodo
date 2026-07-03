import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jodo — Build visually. Own the code.",
  description:
    "Drag-and-drop website builder where every project is real, exportable code. Visual builder, VS Code-style editor, AI agent, GitHub deploys.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
