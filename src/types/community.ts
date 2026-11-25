export type CommunityCategory =
  | "diskusi"
  | "tanya-jawab"
  | "tips-trik"
  | "showcase"
  | "iot-teknologi"
  | "tanaman-ikan";

export type ReportReason =
  | "spam"
  | "misinformation"
  | "harassment"
  | "inappropriate"
  | "other";

export interface CommunityAuthor {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface CommunityImage {
  id: string;
  post_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
  signed_url?: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityFeedPost extends CommunityPost {
  author?: CommunityAuthor;
  images: CommunityImage[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author?: CommunityAuthor;
  replies?: CommunityComment[];
}

export interface CreatePostInput {
  category: CommunityCategory;
  title: string;
  content: string;
  images?: File[];
}

export interface CreateCommentInput {
  post_id: string;
  content: string;
  parent_id?: string | null;
}

export interface CommunityReport {
  id: string;
  post_id: string;
  user_id: string;
  reason: ReportReason;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
}

export const COMMUNITY_CATEGORIES = [
  {
    value: "diskusi",
    label: "Diskusi",
  },
  {
    value: "tanya-jawab",
    label: "Tanya Jawab",
  },
  {
    value: "tips-trik",
    label: "Tips & Trik",
  },
  {
    value: "showcase",
    label: "Showcase",
  },
  {
    value: "iot-teknologi",
    label: "IoT & Teknologi",
  },
  {
    value: "tanaman-ikan",
    label: "Tanaman & Ikan",
  },
] as const;