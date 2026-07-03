import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/SupabaseSetupNotice";
import { EditorLoader } from "./EditorLoader";
import type { Block } from "@/lib/canvas/types";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupNotice />;
  }

  const { projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, stack")
    .eq("id", projectId)
    .single();

  if (!project) {
    notFound();
  }

  const { data: canvasFile } = await supabase
    .from("project_files")
    .select("content")
    .eq("project_id", projectId)
    .eq("path", "canvas.json")
    .maybeSingle();

  const initialBlocks: Block[] = canvasFile ? JSON.parse(canvasFile.content) : [];

  return (
    <EditorLoader projectId={project.id} projectName={project.name} initialBlocks={initialBlocks} />
  );
}
