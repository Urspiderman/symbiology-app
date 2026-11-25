export const navigation = [
  {
    label: "Beranda",
    shortLabel: "Beranda",
    href: "/dashboard",
    icon: "house",
    matchPaths: ["/dashboard", "/akuaponikku"],
  },
  {
    label: "Komunitas",
    shortLabel: "Komunitas",
    href: "/community",
    icon: "users",
    matchPaths: ["/community"],
  },
  {
    label: "AI Studio",
    shortLabel: "AI Studio",
    href: "/ai-studio",
    icon: "sparkles",
    matchPaths: ["/ai-studio"],
  },
  {
    label: "Marketplace",
    shortLabel: "Market",
    href: "/marketplace",
    icon: "shopping-bag",
    matchPaths: ["/marketplace"],
  },
  {
    label: "Akun",
    shortLabel: "Akun",
    href: "/profile",
    icon: "user-round",
    matchPaths: ["/profile"],
  },
] as const;

export function isNavigationActive(
  pathname: string,
  paths: readonly string[]
) {
  return paths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`)
  );
}