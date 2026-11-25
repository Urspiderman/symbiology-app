import { createClient } from "@/lib/supabase/client";
import type { ReportReason } from "@/types/community";

export async function reportPost(
  postId: string,
  reason: ReportReason,
  description = ""
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const { error } = await supabase
    .from("community_reports")
    .insert({
      post_id: postId,
      user_id: user.id,
      reason,
      description: description.trim().slice(0, 1000),
    });

  if (error?.code === "23505") {
    throw new Error("Kamu sudah melaporkan postingan ini.");
  }

  if (error) throw error;
}