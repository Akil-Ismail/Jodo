"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { blocksToHtmlDocument } from "./html";
import type { Block } from "./types";

export async function saveCanvas(projectId: string, projectName: string, blocks: Block[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const html = blocksToHtmlDocument(blocks, projectName);

  const { error: canvasError } = await supabase.from("project_files").upsert(
    { project_id: projectId, path: "canvas.json", content: JSON.stringify(blocks), updated_by: user.id },
    { onConflict: "project_id,path" }
  );
  if (canvasError) throw new Error(canvasError.message);

  const { error: htmlError } = await supabase.from("project_files").upsert(
    { project_id: projectId, path: "index.html", content: html, updated_by: user.id },
    { onConflict: "project_id,path" }
  );
  if (htmlError) throw new Error(htmlError.message);

  revalidatePath(`/editor/${projectId}`);
}
