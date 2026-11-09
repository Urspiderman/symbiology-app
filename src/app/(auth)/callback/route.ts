
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const requestedNext = url.searchParams.get("next");
  const next =
    requestedNext === "/reset-password"
      ? "/reset-password"
      : "/dashboard";

  const supabase = await createClient();

  let verificationError = true;

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    verificationError = Boolean(error);
  } else if (
    tokenHash &&
    (type === "signup" || type === "recovery")
  ) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    verificationError = Boolean(error);
  }

  if (verificationError) {
    return NextResponse.redirect(
      new URL(
        next === "/reset-password"
          ? "/forgot-password?error=verification"
          : "/login?error=verification",
        url.origin
      )
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.redirect(
    new URL(user ? next : "/login", url.origin)
  );
}
