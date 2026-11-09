
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import {
  generateAquaponicsImage,
  type AquaponicsRenderDesign,
} from "@/lib/ai/image-generator";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidDesign(
  value: unknown
): value is AquaponicsRenderDesign {
  if (!isRecord(value) || !isRecord(value.input)) {
    return false;
  }

  const input = value.input;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    typeof value.fish === "string" &&
    typeof value.plant === "string" &&
    typeof value.systemType === "string" &&
    typeof value.area === "number" &&
    Number.isFinite(value.area) &&
    value.area > 0 &&
    typeof value.tankVolume === "number" &&
    Number.isFinite(value.tankVolume) &&
    value.tankVolume > 0 &&
    typeof value.estimatedCost === "number" &&
    Number.isFinite(value.estimatedCost) &&
    typeof input.length === "number" &&
    Number.isFinite(input.length) &&
    input.length >= 0.01 &&
    input.length <= 100 &&
    typeof input.width === "number" &&
    Number.isFinite(input.width) &&
    input.width >= 0.01 &&
    input.width <= 100 &&
    typeof input.budget === "number" &&
    Number.isFinite(input.budget) &&
    input.budget >= 100000 &&
    JSON.stringify(value).length <= 20000
  );
}

export async function POST(request: Request) {
  try {
    // Verifikasi pengguna Supabase
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // Baca foto dan rancangan
    const formData = await request.formData();

    const image = formData.get("image");
    const designRaw = formData.get("design");
    const aiConsent = formData.get("aiConsent");

    if (aiConsent !== "true") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Persetujuan pemrosesan foto oleh AI diperlukan.",
        },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Foto ruangan tidak ditemukan.",
        },
        { status: 400 }
      );
    }

    if (
      !ALLOWED_TYPES.includes(image.type) ||
      image.size === 0 ||
      image.size > MAX_IMAGE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gunakan foto JPG, PNG, atau WebP maksimal 5 MB.",
        },
        { status: 400 }
      );
    }

    if (
      typeof designRaw !== "string" ||
      designRaw.length > 20000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Data rancangan tidak valid.",
        },
        { status: 400 }
      );
    }

    let design: unknown;

    try {
      design = JSON.parse(designRaw);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Format JSON rancangan tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!isValidDesign(design)) {
      return NextResponse.json(
        {
          success: false,
          error: "Informasi rancangan tidak lengkap.",
        },
        { status: 400 }
      );
    }

    // Generate foto AFTER melalui Cloudflare
    const imageBuffer = Buffer.from(
      await image.arrayBuffer()
    );

    const output = await generateAquaponicsImage({
      imageBuffer,
      mimeType: image.type,
      design,
    });

    // Format respons tetap sama seperti sebelumnya.
    return NextResponse.json(
      {
        success: true,
        image: `data:${output.mimeType};base64,${output.imageBase64}`,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "SYMBIOLOGY Cloudflare render-photo error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan tidak dikenal.";

    const isQuotaError =
      /quota|limit|429|capacity/i.test(message);

    const isAccessError =
      /not allowed|forbidden|403|unauthorized/i.test(
        message
      );

    const isTimeout =
      /timeout|aborted|timed out/i.test(message);

    return NextResponse.json(
      {
        success: false,
        error: isQuotaError
          ? "Kuota Cloudflare Workers AI sedang tidak tersedia. Coba lagi setelah kuota pulih."
          : isAccessError
          ? "Akun Cloudflare tidak memiliki izin untuk menggunakan model gambar."
          : isTimeout
          ? "Pembuatan gambar terlalu lama. Silakan coba lagi."
          : process.env.NODE_ENV === "development"
          ? message
          : "Gagal menghasilkan foto akuaponik melalui Cloudflare.",
      },
      {
        status: isQuotaError
          ? 429
          : isAccessError
          ? 403
          : isTimeout
          ? 504
          : 502,
      }
    );
  }
}
