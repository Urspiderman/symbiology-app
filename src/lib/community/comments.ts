import { createClient } from "@/lib/supabase/client";
import type {
  CommunityAuthor,
  CommunityComment,
  CreateCommentInput,
} from "@/types/community";

export async function getComments(postId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw error;

  const comments = (data ?? []) as CommunityComment[];

  if (!comments.length) return [];

  const ids = [...new Set(comments.map((comment) => comment.user_id))];

  const { data: authors, error: authorError } = await supabase
    .rpc("get_community_authors", {
      author_ids: ids,
    });

  if (authorError) throw authorError;

  const authorMap = new Map(
    ((authors ?? []) as CommunityAuthor[])
      .map((author) => [author.id, author])
  );

  return comments.map((comment) => ({
    ...comment,
    author: authorMap.get(comment.user_id),
  }));
}

export async function createComment(input: CreateCommentInput) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const content = input.content.trim();

  if (!content || content.length > 2000) {
    throw new Error("Komentar harus terdiri dari 1-2000 karakter.");
  }

  const { error } = await supabase
    .from("community_comments")
    .insert({
      post_id: input.post_id,
      user_id: user.id,
      parent_id: input.parent_id ?? null,
      content,
    });

  if (error) throw error;
}