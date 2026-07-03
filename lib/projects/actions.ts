"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "project"
  );
}

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const stack = String(formData.get("stack") ?? "html");

  if (!name) {
    redirect(`/dashboard?error=${encodeURIComponent("Project name is required.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;

  for (let attempt = 0; attempt <= 5; attempt++) {
    slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const { error } = await supabase.from("projects").insert({
      owner_id: user.id,
      name,
      slug,
      stack,
    });

    if (!error) break;

    if (error.code !== "23505" /* unique_violation on (owner_id, slug) */) {
      redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect("/dashboard");
}
