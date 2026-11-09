
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";

import {
  isRecord,
  isStringArray,
  isValidInput,
  planAquaponics,
} from "@/lib/ai/aquaponics-planner";

export const runtime = "nodejs";

type AIRecommendation = {
  summary: string;
  placement: string;
  maintenance: string[];
  safetyNotes: string[];
};

function isAIRecommendation(
  value: unknown
): value is AIRecommendation {
  if (!isRecord(value)) return false;

  return (
    typeof value.summary === "string" &&
    typeof value.placement === "string" &&
    isStringArray(value.maintenance) &&
    isStringArray(value.safetyNotes)
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidInput(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Data perancangan tidak valid.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY belum dikonfigurasi.",
        },
        { status: 500 }
      );
    }

    const input = body;
    const plan = planAquaponics(input);

    const area = input.length * input.width;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Kamu adalah konsultan perencanaan akuaponik
SYMBIOLOGY untuk rumah dan apartemen.

TUGAS:
Buat rekomendasi yang jelas, spesifik, dan
mudah dipahami pengguna awam.

PENTING:
Spesifikasi rancangan di bawah ini telah
ditentukan aplikasi. Jangan mengubahnya.

SPESIFIKASI TETAP:
${JSON.stringify({
  packageName: plan.packageName,
  systemType: plan.systemType,
  fish: plan.fish,
  plants: plan.plants,
  tankVolume: plan.tankVolume,
  installationLength: plan.installationLength,
  installationWidth: plan.installationWidth,
  components: plan.components,
  estimatedCost: plan.cost.total,
  budget: input.budget,
  withinBudget: plan.cost.withinBudget,
  feasible: plan.feasible,
  warnings: plan.warnings,
}, null, 2)}

KONDISI RUANGAN:
${JSON.stringify(input.analysis, null, 2)}

DATA PENGGUNA:
Panjang ruangan: ${input.length} meter
Lebar ruangan: ${input.width} meter
Tinggi: ${input.height ?? "tidak diketahui"}
Luas: ${area.toFixed(2)} m2
Prioritas: ${input.priority}
Catatan: ${input.notes || "Tidak ada"}

ATURAN REKOMENDASI:
1. Gunakan bahasa Indonesia sederhana.
2. Jelaskan mengapa paket ini dipilih.
3. Jelaskan posisi instalasi secara konkret
   berdasarkan analisis foto, tetapi jangan
   mengarang posisi pintu atau jendela.
4. Jangan mengklaim ruangan aman hanya
   berdasarkan foto.
5. Jika feasible=false, nyatakan bahwa
   rancangan belum layak dijalankan.
6. Jangan menyebut biaya baru atau komponen
   tambahan seolah sudah termasuk paket.
7. Jangan menjanjikan hasil panen atau
   jumlah ikan tanpa data kualitas air.
8. Bedakan pengamatan foto dari asumsi.
9. Jelaskan kebutuhan perawatan dasar.
10. Kembalikan JSON valid saja.

FORMAT JSON:
{
  "summary": "3-5 kalimat tentang rancangan dan kesesuaiannya",
  "placement": "2-4 kalimat penempatan yang spesifik",
  "maintenance": [
    "Langkah perawatan konkret"
  ],
  "safetyNotes": [
    "Catatan keamanan konkret"
  ]
}
`;

    const response = await ai.models.generateContent({
      model:
        process.env.GEMINI_VISION_MODEL ||
        "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 2200,
      },
    });

    if (!response.text) {
      throw new Error(
        "Gemini tidak mengembalikan rekomendasi."
      );
    }

    const parsed: unknown = JSON.parse(
      response.text
    );

    if (!isAIRecommendation(parsed)) {
      throw new Error(
        "Format rekomendasi Gemini tidak valid."
      );
    }

    const recommendation = {
      summary: parsed.summary,
      systemType: plan.systemType,
      recommendedFish: plan.fish,
      recommendedPlants: plan.plants,
      placement: parsed.placement,
      maintenance: parsed.maintenance,
      safetyNotes: [
        ...parsed.safetyNotes,
        ...plan.warnings,
      ],
    };

    const design = {
      id: randomUUID(),
      name: `${plan.packageName} - ${area.toFixed(2)} m²`,
      input,
      area,
      tankVolume: plan.tankVolume,
      estimatedCost: plan.cost.total,
      withinBudget: plan.cost.withinBudget,
      feasible: plan.feasible,
      fish: plan.fish,
      plant: plan.plants[0],
      systemType: plan.systemType,
      packageId: plan.packageId,
      packageName: plan.packageName,
      installation: {
        length: plan.installationLength,
        width: plan.installationWidth,
        area: plan.footprintArea,
      },
      components: plan.components,
      costBreakdown: plan.cost,
      recommendation,
      notes: [
        ...plan.warnings,
        "Harga komponen adalah estimasi awal dan harus diverifikasi sebelum pembelian.",
      ],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      design,
    });
  } catch (error) {
    console.error(
      "SYMBIOLOGY Generate Design Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Gagal menghasilkan rancangan. Periksa Gemini dan coba kembali.",
      },
      { status: 502 }
    );
  }
}
