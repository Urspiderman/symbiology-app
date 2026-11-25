"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  ArrowUpRight,
  Bookmark,
  Heart,
  ImagePlus,
  LayoutGrid,
  LoaderCircle,
  MessageCircle,
  Plus,
  Search,
  Sprout,
  TrendingUp,
  UserRound,
  Users,
  X,
  Trash2,
  Flag,
  Send,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  getCommunityPosts,
  createCommunityPost,
  deleteCommunityPost,
} from "@/lib/community/posts";

import {
  toggleLike,
  toggleBookmark,
} from "@/lib/community/interactions";

import {
  getComments,
  createComment,
} from "@/lib/community/comments";

import { reportPost } from "@/lib/community/moderation";

import {
  COMMUNITY_CATEGORIES,
} from "@/types/community";

import type {
  CommunityCategory,
  CommunityFeedPost,
  CommunityComment,
  ReportReason,
} from "@/types/community";

type FeedMode = "all" | "mine" | "saved";

const panel =
  "rounded-[26px] border border-[#005b4510] bg-white/85 shadow-sm backdrop-blur-xl";

const field =
  "w-full rounded-2xl border border-[#005b4520] bg-[#fffae7]/50 px-4 py-3 text-sm text-[#005b45] outline-none focus:ring-2 focus:ring-[#ff70ad]";

function message(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Terjadi kesalahan. Silakan coba kembali.";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityFeedPost[]>([]);
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState<FeedMode>("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postCategory, setPostCategory] =
    useState<CommunityCategory>("diskusi");
  const [files, setFiles] = useState<File[]>([]);

  const [activePost, setActivePost] =
    useState<CommunityFeedPost | null>(null);

  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<CommunityComment | null>(null);

  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [description, setDescription] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");

      const data = await getCommunityPosts();

      setPosts(data);
    } catch (error) {
      setError(message(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? "");
    });

    void refresh();
  }, [refresh]);

  const filtered = posts.filter((post) => {
    const keyword = search.trim().toLowerCase();

    return (
      (mode !== "mine" || post.user_id === userId) &&
      (mode !== "saved" || post.is_bookmarked) &&
      (category === "all" || post.category === category) &&
      (
        !keyword ||
        `${post.title} ${post.content} ${post.author?.full_name ?? ""}`
          .toLowerCase()
          .includes(keyword)
      )
    );
  });

  const trending = COMMUNITY_CATEGORIES.map((item) => ({
    ...item,
    count: posts.filter((post) => post.category === item.value).length,
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  async function runAction(action: () => Promise<unknown>) {
    if (busy) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await action();
    } catch (error) {
      setError(message(error));
    } finally {
      setBusy(false);
    }
  }

  async function submitPost(event: FormEvent) {
    event.preventDefault();

    await runAction(async () => {
      await createCommunityPost({
        title,
        content,
        category: postCategory,
        images: files,
      });

      setTitle("");
      setContent("");
      setFiles([]);
      setShowCreate(false);
      setMode("all");
      setCategory("all");
      setSearch("");
      setNotice("Postingan berhasil diterbitkan.");

      await refresh();
    });
  }

  async function openComments(post: CommunityFeedPost) {
    await runAction(async () => {
      const data = await getComments(post.id);

      setComments(data);
      setActivePost(post);
      setReplyTo(null);
      setCommentText("");
    });
  }

  async function submitComment(event: FormEvent) {
    event.preventDefault();

    if (!activePost) return;

    await runAction(async () => {
      await createComment({
        post_id: activePost.id,
        content: commentText,
        parent_id: replyTo?.id,
      });

      setCommentText("");
      setReplyTo(null);
      setComments(await getComments(activePost.id));

      await refresh();
    });
  }

  function renderComment(
    comment: CommunityComment,
    depth = 0,
    ancestors: string[] = []
  ) {
    if (ancestors.includes(comment.id)) return null;

    return (
      <div key={comment.id} className="space-y-3">
        <div className="rounded-2xl bg-[#fffae7] p-4">
          <p className="text-xs font-bold">
            {comment.author?.full_name ?? "Pengguna Symbiology"}
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm">
            {comment.content}
          </p>

          <button
            type="button"
            onClick={() => setReplyTo(comment)}
            className="mt-2 text-xs font-bold text-[#005b45]"
          >
            Balas
          </button>
        </div>

        {depth < 20 && (
          <div className="ml-3 border-l border-[#005b4520] pl-3">
            {comments
              .filter((item) => item.parent_id === comment.id)
              .map((item) =>
                renderComment(item, depth + 1, [...ancestors, comment.id])
              )}
          </div>
        )}
      </div>
    );
  }

  const modes = [
    { value: "all" as const, label: "Feed", icon: LayoutGrid },
    { value: "mine" as const, label: "Postingan Saya", icon: UserRound },
    { value: "saved" as const, label: "Tersimpan", icon: Bookmark },
  ];

  return (
    <section className="space-y-6 pb-8 text-[#005b45]">

      <div className="relative overflow-hidden rounded-[32px] bg-[#005b45] p-7 text-[#fffae7] md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#ff70ad]/15 blur-3xl" />

        <Sprout className="pointer-events-none absolute -bottom-10 right-0 hidden h-64 w-64 rotate-12 text-[#fffae7]/10 md:block" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold tracking-widest text-[#ff70ad]">
            <Users size={15} />
            SMART FARMING COMMUNITY
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Good things grow
            <span className="block text-[#ff70ad]">together.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#fffae7]/80">
            Berbagi pengalaman, menemukan inspirasi, dan belajar
            akuaponik bersama komunitas Symbiology.
          </p>

          <button
            onClick={() => setShowCreate(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#ff70ad] px-5 py-3.5 text-sm font-extrabold text-[#005b45] transition hover:scale-[1.02]"
          >
            <Plus size={19} />
            Buat Postingan
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-3 font-bold">
            Tutup
          </button>
        </div>
      )}

      {notice && (
        <div role="status" className="rounded-2xl bg-[#e2f0e9] p-4 text-sm">
          {notice}
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_270px]">

        <aside className={`${panel} p-4 lg:sticky lg:top-28`}>
          <p className="mb-3 hidden px-3 text-xs font-bold tracking-widest opacity-50 lg:block">
            EXPLORE
          </p>

          <div className="grid grid-cols-3 gap-1 lg:grid-cols-1">
            {modes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold lg:justify-start lg:px-4 lg:text-sm ${
                  mode === value
                    ? "bg-[#005b45] text-[#fffae7]"
                    : "hover:bg-[#e2f0e9]"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 hidden border-t border-[#005b4510] pt-5 lg:block">
            <p className="mb-3 px-3 text-xs font-bold tracking-widest opacity-50">
              KATEGORI
            </p>

            {[{ value: "all", label: "Semua Topik" }, ...COMMUNITY_CATEGORIES]
              .map((item) => (
                <button
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className={`mb-1 w-full rounded-xl px-4 py-2.5 text-left text-sm ${
                    category === item.value
                      ? "bg-[#ffe0ee] font-bold"
                      : "hover:bg-[#fffae7]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </aside>

        <main className="min-w-0 space-y-4">

          <div className={`${panel} flex items-center gap-3 p-4`}>
            <Search size={21} className="shrink-0 opacity-60" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari topik, postingan, atau pengguna..."
              className="w-full bg-transparent text-sm outline-none"
            />

            {search && (
              <button onClick={() => setSearch("")} aria-label="Hapus pencarian">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {[{ value: "all", label: "Semua" }, ...COMMUNITY_CATEGORIES]
              .map((item) => (
                <button
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                    category === item.value
                      ? "bg-[#005b45] text-[#fffae7]"
                      : "bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>

          {loading ? (
            <div className={`${panel} flex justify-center p-16`}>
              <LoaderCircle className="animate-spin" size={30} />
            </div>
          ) : filtered.length === 0 ? (
            <div className={`${panel} p-10 text-center md:p-16`}>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#ffe0ee]">
                <MessageCircle size={34} />
              </div>

              <h2 className="mt-6 text-xl font-black">
                {mode === "saved"
                  ? "Belum ada postingan tersimpan."
                  : "Belum ada postingan."}
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-60">
                Temukan diskusi baru atau bagikan pengalaman akuaponikmu.
              </p>

              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 rounded-xl bg-[#005b45] px-5 py-3 text-sm font-bold text-[#fffae7]"
              >
                Buat Postingan
              </button>
            </div>
          ) : (
            filtered.map((post) => (
              <article key={post.id} className={`${panel} overflow-hidden p-5 md:p-6`}>

                <div className="flex items-center gap-3">
                  {post.author?.avatar_url ? (
                    <img
                      src={post.author.avatar_url}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffe0ee]">
                      <UserRound size={21} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">
                      {post.author?.full_name ?? "Pengguna Symbiology"}
                    </p>

                    <p className="mt-1 text-xs opacity-50">
                      {formatDate(post.created_at)}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e2f0e9] px-3 py-1.5 text-[10px] font-bold">
                    {COMMUNITY_CATEGORIES.find(
                      (item) => item.value === post.category
                    )?.label}
                  </span>
                </div>

                <h2 className="mt-5 break-words text-xl font-extrabold">
                  {post.title}
                </h2>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 opacity-80">
                  {post.content}
                </p>

                {post.images.length > 0 && (
                  <div className={`mt-4 grid gap-2 ${
                    post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}>
                    {post.images.map((image) =>
                      image.signed_url ? (
                        <img
                          key={image.id}
                          src={image.signed_url}
                          alt="Foto postingan akuaponik"
                          className="max-h-[420px] w-full rounded-2xl object-cover"
                          loading="lazy"
                        />
                      ) : null
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-[#005b4510] pt-4">
                  <button
                    disabled={busy}
                    aria-label="Sukai postingan"
                    aria-pressed={post.is_liked}
                    onClick={() => runAction(async () => {
                      await toggleLike(post.id, post.is_liked);
                      await refresh();
                    })}
                    className="flex items-center gap-2 text-sm font-bold"
                  >
                    <Heart
                      size={21}
                      fill={post.is_liked ? "#ff70ad" : "none"}
                      color={post.is_liked ? "#ff70ad" : "#005b45"}
                    />
                    {post.likes_count}
                  </button>

                  <button
                    disabled={busy}
                    onClick={() => openComments(post)}
                    className="flex items-center gap-2 text-sm font-bold"
                    aria-label="Buka komentar"
                  >
                    <MessageCircle size={21} />
                    {post.comments_count}
                  </button>

                  <div className="flex-1" />

                  <button
                    disabled={busy}
                    aria-label="Simpan postingan"
                    aria-pressed={post.is_bookmarked}
                    onClick={() => runAction(async () => {
                      await toggleBookmark(post.id, post.is_bookmarked);
                      await refresh();
                    })}
                  >
                    <Bookmark
                      size={21}
                      fill={post.is_bookmarked ? "#005b45" : "none"}
                    />
                  </button>

                  {post.user_id === userId ? (
                    <button
                      disabled={busy}
                      aria-label="Hapus postingan"
                      onClick={() => {
                        if (!window.confirm("Hapus postingan ini?")) return;

                        void runAction(async () => {
                          await deleteCommunityPost(post.id);
                          await refresh();
                        });
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={19} />
                    </button>
                  ) : (
                    <button
                      aria-label="Laporkan postingan"
                      onClick={() => {
                        setReportId(post.id);
                        setReason("spam");
                        setDescription("");
                      }}
                      className="opacity-50"
                    >
                      <Flag size={19} />
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </main>

        <aside className="hidden space-y-4 xl:block">

          <div className="rounded-[26px] bg-[#ffe0ee] p-6">
            <TrendingUp size={26} />

            <h2 className="mt-3 text-lg font-black">Topik Populer</h2>

            <p className="mt-1 text-xs opacity-60">
              Berdasarkan postingan terbaru
            </p>

            <div className="mt-5 space-y-4">
              {trending.length ? trending.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setMode("all");
                    setCategory(item.value);
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs opacity-60">
                      {item.count} postingan
                    </p>
                  </div>
                  <ArrowUpRight size={17} />
                </button>
              )) : (
                <p className="text-xs opacity-60">
                  Belum ada topik populer.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[26px] bg-[#005b45] p-6 text-[#fffae7]">
            <Sprout size={36} className="text-[#ff70ad]" />

            <h2 className="mt-4 text-2xl font-black">
              Grow ur future.
            </h2>

            <p className="mt-3 text-xs leading-6 opacity-80">
              Setiap pengalaman kecil bisa menjadi inspirasi besar
              bagi sesama penggiat akuaponik.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <h2 className="text-sm font-extrabold">Etika Komunitas</h2>

            <p className="mt-3 text-xs leading-6 opacity-70">
              Saling menghargai, berbagi informasi yang bertanggung
              jawab, hindari spam, dan dukung sesama anggota.
            </p>
          </div>
        </aside>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitPost}
            role="dialog"
            aria-modal="true"
            aria-label="Buat postingan"
            className="max-h-[90dvh] w-full max-w-xl space-y-4 overflow-y-auto rounded-[30px] bg-[#fffae7] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Buat Postingan</h2>
              <button type="button" disabled={busy} onClick={() => setShowCreate(false)}>
                <X size={23} />
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <select
              className={field}
              value={postCategory}
              onChange={(event) =>
                setPostCategory(event.target.value as CommunityCategory)
              }
            >
              {COMMUNITY_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <input
              className={field}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Judul postingan"
              required
              minLength={3}
              maxLength={150}
            />

            <textarea
              className={`${field} min-h-40 resize-y`}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Apa yang ingin kamu bagikan?"
              required
              maxLength={5000}
            />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#005b4530] p-5 text-sm font-bold">
              <ImagePlus size={22} />
              Tambahkan Foto (maks. 4)

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? []);

                  if (files.length + selected.length > 4) {
                    setError("Maksimal 4 foto.");
                    return;
                  }

                  if (selected.some((file) => file.size > 5 * 1024 * 1024)) {
                    setError("Ukuran maksimal foto adalah 5 MB.");
                    return;
                  }

                  setError("");
                  setFiles((old) => [...old, ...selected]);
                  event.target.value = "";
                }}
              />
            </label>

            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 text-xs">
                <span className="truncate">{file.name}</span>

                <button
                  type="button"
                  onClick={() => setFiles((old) => old.filter((_, i) => i !== index))}
                >
                  <X size={17} />
                </button>
              </div>
            ))}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#005b45] p-4 text-sm font-bold text-[#fffae7] disabled:opacity-50"
            >
              {busy && <LoaderCircle size={18} className="animate-spin" />}
              Terbitkan Postingan
            </button>
          </form>
        </div>
      )}

      {activePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Komentar postingan"
            className="flex max-h-[90dvh] w-full max-w-xl flex-col rounded-[30px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Diskusi</h2>

              <button disabled={busy} onClick={() => setActivePost(null)}>
                <X size={23} />
              </button>
            </div>

            <p className="mt-3 text-sm font-bold">{activePost.title}</p>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="my-5 min-h-24 flex-1 space-y-4 overflow-y-auto">
              {comments.length ? comments
                .filter((comment) => !comment.parent_id)
                .map((comment) => renderComment(comment)) : (
                  <p className="py-10 text-center text-sm opacity-50">
                    Jadilah orang pertama yang berkomentar.
                  </p>
                )}
            </div>

            {replyTo && (
              <div className="mb-2 flex items-center justify-between rounded-xl bg-[#ffe0ee] p-3 text-xs">
                Membalas {replyTo.author?.full_name ?? "pengguna"}

                <button onClick={() => setReplyTo(null)}>
                  <X size={16} />
                </button>
              </div>
            )}

            <form onSubmit={submitComment} className="flex items-center gap-2">
              <input
                className={field}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Tulis komentar..."
                required
                maxLength={2000}
              />

              <button
                disabled={busy}
                className="rounded-xl bg-[#005b45] p-3 text-white"
                aria-label="Kirim komentar"
              >
                <Send size={21} />
              </button>
            </form>
          </div>
        </div>
      )}

      {reportId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            role="dialog"
            aria-modal="true"
            aria-label="Laporkan postingan"
            onSubmit={(event) => {
              event.preventDefault();

              void runAction(async () => {
                await reportPost(reportId, reason, description);
                setReportId(null);
                setNotice("Laporan berhasil dikirim.");
              });
            }}
            className="w-full max-w-md space-y-4 rounded-[28px] bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Laporkan Postingan</h2>
              <button type="button" disabled={busy} onClick={() => setReportId(null)}>
                <X size={22} />
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <select
              className={field}
              value={reason}
              onChange={(event) => setReason(event.target.value as ReportReason)}
            >
              <option value="spam">Spam</option>
              <option value="misinformation">Informasi menyesatkan</option>
              <option value="harassment">Pelecehan</option>
              <option value="inappropriate">Konten tidak pantas</option>
              <option value="other">Lainnya</option>
            </select>

            <textarea
              className={`${field} min-h-24`}
              placeholder="Keterangan tambahan (opsional)"
              value={description}
              maxLength={1000}
              onChange={(event) => setDescription(event.target.value)}
            />

            <button
              disabled={busy}
              className="w-full rounded-xl bg-[#005b45] p-3 text-sm font-bold text-white"
            >
              Kirim Laporan
            </button>
          </form>
        </div>
      )}
    </section>
  );
}