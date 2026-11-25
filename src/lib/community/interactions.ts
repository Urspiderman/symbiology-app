import { createClient } from "@/lib/supabase/client";

async function toggleInteraction(
  table: "community_likes" | "community_bookmarks",
  postId: string,
  active: boolean
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const result = active
    ? await supabase
        .from(table)
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
    : await supabase
        .from(table)
        .insert({
          post_id: postId,
          user_id: user.id,
        });

  if (result.error) throw result.error;
}

export function toggleLike(postId: string, active: boolean) {
  return toggleInteraction("community_likes", postId, active);
}

export function toggleBookmark(postId: string, active: boolean) {
  return toggleInteraction("community_bookmarks", postId, active);
}