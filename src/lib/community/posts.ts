import { createClient } from "@/lib/supabase/client";
import type {
  CommunityAuthor,
  CommunityFeedPost,
  CommunityPost,
  CommunityImage,
  CreatePostInput,
} from "@/types/community";

export async function getCommunityPosts() {
  const supabase = createClient();

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  const posts = (data ?? []) as CommunityPost[];

  if (!posts.length) return [];

  const postIds = posts.map((post) => post.id);
  const authorIds = [...new Set(posts.map((post) => post.user_id))];

  const [authors, images, likes, comments, bookmarks] =
    await Promise.all([
      supabase.rpc("get_community_authors", {
        author_ids: authorIds,
      }),
      supabase
        .from("community_images")
        .select("*")
        .in("post_id", postIds)
        .order("sort_order"),
      supabase
        .from("community_likes")
        .select("post_id,user_id")
        .in("post_id", postIds),
      supabase
        .from("community_comments")
        .select("post_id")
        .in("post_id", postIds),
      supabase
        .from("community_bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds),
    ]);

  for (const result of [authors, images, likes, comments, bookmarks]) {
    if (result.error) throw result.error;
  }

  const authorMap = new Map(
    ((authors.data ?? []) as CommunityAuthor[])
      .map((author) => [author.id, author])
  );

  const imageRows = (images.data ?? []) as CommunityImage[];

  const signedImages = await Promise.all(
    imageRows.map(async (image) => {
      const { data } = await supabase.storage
        .from("community-images")
        .createSignedUrl(image.storage_path, 3600);

      return {
        ...image,
        signed_url: data?.signedUrl,
      };
    })
  );

  return posts.map((post): CommunityFeedPost => ({
    ...post,
    author: authorMap.get(post.user_id),
    images: signedImages.filter(
      (image) => image.post_id === post.id
    ),
    likes_count: (likes.data ?? []).filter(
      (like) => like.post_id === post.id
    ).length,
    comments_count: (comments.data ?? []).filter(
      (comment) => comment.post_id === post.id
    ).length,
    is_liked: (likes.data ?? []).some(
      (like) =>
        like.post_id === post.id &&
        like.user_id === user.id
    ),
    is_bookmarked: (bookmarks.data ?? []).some(
      (bookmark) => bookmark.post_id === post.id
    ),
  }));
}

export async function createCommunityPost(input: CreatePostInput) {
  const supabase = createClient();

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const title = input.title.trim();
  const content = input.content.trim();
  const images = input.images ?? [];

  if (title.length < 3 || title.length > 150) {
    throw new Error("Judul harus terdiri dari 3-150 karakter.");
  }

  if (!content || content.length > 5000) {
    throw new Error("Isi postingan harus terdiri dari 1-5000 karakter.");
  }

  if (images.length > 4) {
    throw new Error("Maksimal 4 foto per postingan.");
  }

  for (const file of images) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Format foto tidak didukung.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran maksimal foto adalah 5 MB.");
    }
  }

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: user.id,
      title,
      content,
      category: input.category,
    })
    .select()
    .single();

  if (error) throw error;

  const uploadedPaths: string[] = [];

  try {
    for (let index = 0; index < images.length; index++) {
      const file = images[index];

      const extension =
        file.type === "image/png" ? "png" :
        file.type === "image/webp" ? "webp" : "jpg";

      const path =
        `${user.id}/${post.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("community-images")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      uploadedPaths.push(path);

      const { error: imageError } = await supabase
        .from("community_images")
        .insert({
          post_id: post.id,
          storage_path: path,
          sort_order: index,
        });

      if (imageError) throw imageError;
    }

    return post;
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage
        .from("community-images")
        .remove(uploadedPaths);
    }

    await supabase
      .from("community_posts")
      .delete()
      .eq("id", post.id);

    throw error;
  }
}

export async function deleteCommunityPost(postId: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Silakan masuk terlebih dahulu.");

  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .select("id")
    .eq("id", postId)
    .eq("user_id", user.id)
    .single();

  if (postError) throw postError;
  if (!post) throw new Error("Postingan tidak ditemukan.");

  const { data: images, error: imageError } = await supabase
    .from("community_images")
    .select("storage_path")
    .eq("post_id", postId);

  if (imageError) throw imageError;

  const paths = (images ?? []).map((image) => image.storage_path);

  if (paths.length) {
    const { error } = await supabase.storage
      .from("community-images")
      .remove(paths);

    if (error) throw error;
  }

  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) throw error;
}