
import { NextResponse } from "next/server";

import {
  isValidInput,
  planAquaponics,
} from "@/lib/ai/aquaponics-planner";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidInput(body)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Data perhitungan biaya tidak valid.",
        },
        { status: 400 }
      );
    }

    const plan = planAquaponics(body);

    return NextResponse.json({
      success: true,
      packageId: plan.packageId,
      packageName: plan.packageName,
      systemType: plan.systemType,
      tankVolume: plan.tankVolume,
      installation: {
        length: plan.installationLength,
        width: plan.installationWidth,
        area: plan.footprintArea,
      },
      components: plan.components,
      costBreakdown: plan.cost,
      estimatedCost: plan.cost.total,
      withinBudget: plan.cost.withinBudget,
      feasible: plan.feasible,
      warnings: plan.warnings,
    });
  } catch (error) {
    console.error(
      "SYMBIOLOGY Predict Cost Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Gagal menghitung estimasi biaya.",
      },
      { status: 500 }
    );
  }
}
