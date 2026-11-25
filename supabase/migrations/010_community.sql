begin;

-- ==========================================
-- COMMUNITY POSTS
-- ==========================================

create table if not exists public.community_posts (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id) on delete cascade,

    category text not null default 'diskusi'
        check (
            category in (
                'diskusi',
                'tanya-jawab',
                'tips-trik',
                'showcase',
                'iot-teknologi',
                'tanaman-ikan'
            )
        ),

    title text not null
        check (char_length(trim(title)) between 3 and 150),

    content text not null
        check (char_length(trim(content)) between 1 and 5000),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ==========================================
-- COMMUNITY COMMENTS
-- ==========================================

create table if not exists public.community_comments (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null
        references public.community_posts(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    parent_id uuid,

    content text not null
        check (char_length(trim(content)) between 1 and 2000),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique (id, post_id),

    foreign key (parent_id, post_id)
        references public.community_comments(id, post_id)
        on delete cascade,

    check (parent_id is distinct from id)
);

-- ==========================================
-- COMMUNITY LIKES
-- ==========================================

create table if not exists public.community_likes (
    post_id uuid not null
        references public.community_posts(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (post_id, user_id)
);

-- ==========================================
-- COMMUNITY BOOKMARKS
-- ==========================================

create table if not exists public.community_bookmarks (
    post_id uuid not null
        references public.community_posts(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (post_id, user_id)
);

-- ==========================================
-- COMMUNITY REPORTS
-- ==========================================

create table if not exists public.community_reports (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null
        references public.community_posts(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    reason text not null
        check (
            reason in (
                'spam',
                'misinformation',
                'harassment',
                'inappropriate',
                'other'
            )
        ),

    description text
        check (char_length(description) <= 1000),

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'reviewed',
                'resolved',
                'dismissed'
            )
        ),

    created_at timestamptz not null default now(),

    unique (post_id, user_id)
);

-- ==========================================
-- COMMUNITY IMAGES
-- ==========================================

create table if not exists public.community_images (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null
        references public.community_posts(id)
        on delete cascade,

    storage_path text not null unique,

    sort_order integer not null default 0
        check (sort_order >= 0),

    created_at timestamptz not null default now()
);

-- ==========================================
-- INDEXES
-- ==========================================

create index if not exists idx_community_posts_created
on public.community_posts(created_at desc);

create index if not exists idx_community_posts_user
on public.community_posts(user_id);

create index if not exists idx_community_posts_category
on public.community_posts(category);

create index if not exists idx_community_comments_post
on public.community_comments(post_id, created_at);

create index if not exists idx_community_comments_parent
on public.community_comments(parent_id);

create index if not exists idx_community_likes_user
on public.community_likes(user_id);

create index if not exists idx_community_bookmarks_user
on public.community_bookmarks(user_id);

create index if not exists idx_community_reports_status
on public.community_reports(status);

create index if not exists idx_community_images_post
on public.community_images(post_id);

-- ==========================================
-- UPDATED AT
-- ==========================================

create or replace function public.community_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists community_posts_updated_at
on public.community_posts;

create trigger community_posts_updated_at
before update on public.community_posts
for each row
execute function public.community_set_updated_at();

drop trigger if exists community_comments_updated_at
on public.community_comments;

create trigger community_comments_updated_at
before update on public.community_comments
for each row
execute function public.community_set_updated_at();

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_bookmarks enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_images enable row level security;

-- ==========================================
-- RESET COMMUNITY POLICIES
-- ==========================================

do $$
declare
    p record;
begin
    for p in
        select schemaname, tablename, policyname
        from pg_policies
        where schemaname = 'public'
        and tablename in (
            'community_posts',
            'community_comments',
            'community_likes',
            'community_bookmarks',
            'community_reports',
            'community_images'
        )
        and policyname like 'symbio_%'
    loop
        execute format(
            'drop policy %I on %I.%I',
            p.policyname,
            p.schemaname,
            p.tablename
        );
    end loop;
end;
$$;

-- ==========================================
-- POSTS POLICIES
-- ==========================================

create policy symbio_posts_read
on public.community_posts
for select to authenticated
using (true);

create policy symbio_posts_insert
on public.community_posts
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy symbio_posts_update
on public.community_posts
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy symbio_posts_delete
on public.community_posts
for delete to authenticated
using ((select auth.uid()) = user_id);

-- ==========================================
-- COMMENTS POLICIES
-- ==========================================

create policy symbio_comments_read
on public.community_comments
for select to authenticated
using (true);

create policy symbio_comments_insert
on public.community_comments
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy symbio_comments_update
on public.community_comments
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy symbio_comments_delete
on public.community_comments
for delete to authenticated
using ((select auth.uid()) = user_id);

-- ==========================================
-- LIKES POLICIES
-- ==========================================

create policy symbio_likes_read
on public.community_likes
for select to authenticated
using (true);

create policy symbio_likes_insert
on public.community_likes
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy symbio_likes_delete
on public.community_likes
for delete to authenticated
using ((select auth.uid()) = user_id);

-- ==========================================
-- BOOKMARKS POLICIES
-- ==========================================

create policy symbio_bookmarks_read
on public.community_bookmarks
for select to authenticated
using ((select auth.uid()) = user_id);

create policy symbio_bookmarks_insert
on public.community_bookmarks
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy symbio_bookmarks_delete
on public.community_bookmarks
for delete to authenticated
using ((select auth.uid()) = user_id);

-- ==========================================
-- REPORTS POLICIES
-- ==========================================

create policy symbio_reports_insert
on public.community_reports
for insert to authenticated
with check (
    (select auth.uid()) = user_id
    and status = 'pending'
);

create policy symbio_reports_read
on public.community_reports
for select to authenticated
using ((select auth.uid()) = user_id);

-- ==========================================
-- IMAGES POLICIES
-- ==========================================

create policy symbio_images_read
on public.community_images
for select to authenticated
using (true);

create policy symbio_images_insert
on public.community_images
for insert to authenticated
with check (
    split_part(storage_path, '/', 1) =
        (select auth.uid())::text
    and exists (
        select 1
        from public.community_posts p
        where p.id = post_id
        and p.user_id = (select auth.uid())
    )
);

create policy symbio_images_delete
on public.community_images
for delete to authenticated
using (
    exists (
        select 1
        from public.community_posts p
        where p.id = post_id
        and p.user_id = (select auth.uid())
    )
);

-- ==========================================
-- EXPLICIT TABLE PERMISSIONS
-- ==========================================

revoke all on
    public.community_posts,
    public.community_comments,
    public.community_likes,
    public.community_bookmarks,
    public.community_reports,
    public.community_images
from anon, authenticated;

grant select, delete on public.community_posts
to authenticated;

grant insert (user_id, category, title, content)
on public.community_posts to authenticated;

grant update (category, title, content)
on public.community_posts to authenticated;

grant select, delete on public.community_comments
to authenticated;

grant insert (post_id, user_id, parent_id, content)
on public.community_comments to authenticated;

grant update (content)
on public.community_comments to authenticated;

grant select, insert, delete on
    public.community_likes,
    public.community_bookmarks
to authenticated;

grant select on public.community_reports
to authenticated;

grant insert (post_id, user_id, reason, description)
on public.community_reports to authenticated;

grant select, delete on public.community_images
to authenticated;

grant insert (post_id, storage_path, sort_order)
on public.community_images to authenticated;

commit;