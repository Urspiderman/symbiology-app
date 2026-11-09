
export type SpaceAnalysis = {
  isSuitablePhoto: boolean;
  roomType: string;
  description: string;
  lighting: string;
  visibleObjects: string[];
  obstacles: string[];
  potentialPlacement: string[];
  recommendations: string[];
  warnings: string[];
  confidence: "rendah" | "sedang" | "tinggi";
};

export type DesignInput = {
  length: number;
  width: number;
  height: number | null;
  budget: number;
  fish: string;
  plants: string[];
  priority: "hemat-biaya" | "hemat-ruang" | "produktivitas";
  notes: string;
  analysis: SpaceAnalysis;
};

export type CostItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
};

export type CostEstimate = {
  items: CostItem[];
  subtotal: number;
  contingency: number;
  total: number;
  budget: number;
  remainingBudget: number;
  withinBudget: boolean;
  priceNote: string;
};

export type SystemPlan = {
  packageId: string;
  packageName: string;
  systemType: string;
  tankVolume: number;
  installationLength: number;
  installationWidth: number;
  footprintArea: number;
  fish: string;
  plants: string[];
  components: CostItem[];
  cost: CostEstimate;
  feasible: boolean;
  warnings: string[];
};

type PackageDefinition = {
  id: string;
  name: string;
  systemType: string;
  tankVolume: number;
  length: number;
  width: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
};

// Harga berikut merupakan asumsi perencanaan awal,
// bukan harga pasar yang telah diverifikasi.
// Sesuaikan dengan pemasok lokal sebelum produksi.
const PACKAGES: PackageDefinition[] = [
  {
    id: "mini",
    name: "Akuaponik Mini",
    systemType: "Media Bed",
    tankVolume: 100,
    length: 1.2,
    width: 0.65,
    items: [
      { id: "tank", name: "Bak ikan 100 liter", quantity: 1, unit: "unit", unitPrice: 250000 },
      { id: "bed", name: "Grow bed dan media tanam", quantity: 1, unit: "set", unitPrice: 300000 },
      { id: "pump", name: "Pompa sirkulasi air", quantity: 1, unit: "unit", unitPrice: 150000 },
      { id: "pipe", name: "Pipa dan sambungan", quantity: 1, unit: "set", unitPrice: 120000 },
      { id: "frame", name: "Rangka penyangga", quantity: 1, unit: "set", unitPrice: 250000 },
      { id: "air", name: "Aerator dan perlengkapannya", quantity: 1, unit: "set", unitPrice: 120000 },
      { id: "test", name: "Alat uji kualitas air dasar", quantity: 1, unit: "set", unitPrice: 150000 },
      { id: "seed", name: "Benih ikan dan tanaman", quantity: 1, unit: "paket", unitPrice: 100000 },
    ],
  },
  {
    id: "compact",
    name: "Akuaponik Compact",
    systemType: "Media Bed",
    tankVolume: 200,
    length: 1.6,
    width: 0.8,
    items: [
      { id: "tank", name: "Bak ikan 200 liter", quantity: 1, unit: "unit", unitPrice: 450000 },
      { id: "bed", name: "Grow bed dan media tanam", quantity: 1, unit: "set", unitPrice: 550000 },
      { id: "pump", name: "Pompa sirkulasi air", quantity: 1, unit: "unit", unitPrice: 250000 },
      { id: "pipe", name: "Pipa dan sambungan", quantity: 1, unit: "set", unitPrice: 200000 },
      { id: "frame", name: "Rangka penyangga", quantity: 1, unit: "set", unitPrice: 500000 },
      { id: "air", name: "Aerator dan perlengkapannya", quantity: 1, unit: "set", unitPrice: 180000 },
      { id: "test", name: "Alat uji kualitas air dasar", quantity: 1, unit: "set", unitPrice: 150000 },
      { id: "seed", name: "Benih ikan dan tanaman", quantity: 1, unit: "paket", unitPrice: 150000 },
    ],
  },
  {
    id: "standard",
    name: "Akuaponik Standard",
    systemType: "Media Bed",
    tankVolume: 400,
    length: 2.2,
    width: 1.0,
    items: [
      { id: "tank", name: "Bak ikan 400 liter", quantity: 1, unit: "unit", unitPrice: 800000 },
      { id: "bed", name: "Grow bed dan media tanam", quantity: 2, unit: "set", unitPrice: 500000 },
      { id: "pump", name: "Pompa sirkulasi air", quantity: 1, unit: "unit", unitPrice: 350000 },
      { id: "pipe", name: "Pipa dan sambungan", quantity: 1, unit: "set", unitPrice: 300000 },
      { id: "frame", name: "Rangka penyangga", quantity: 1, unit: "set", unitPrice: 850000 },
      { id: "air", name: "Aerator dan perlengkapannya", quantity: 1, unit: "set", unitPrice: 250000 },
      { id: "test", name: "Alat uji kualitas air dasar", quantity: 1, unit: "set", unitPrice: 200000 },
      { id: "seed", name: "Benih ikan dan tanaman", quantity: 1, unit: "paket", unitPrice: 200000 },
    ],
  },
];

function createItems(
  definition: PackageDefinition
): CostItem[] {
  return definition.items.map((item) => ({
    ...item,
    subtotal: item.quantity * item.unitPrice,
  }));
}

function calculateCost(
  items: CostItem[],
  budget: number
): CostEstimate {
  const subtotal = items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const contingency = Math.ceil(
    (subtotal * 0.1) / 1000
  ) * 1000;

  const total = subtotal + contingency;

  return {
    items,
    subtotal,
    contingency,
    total,
    budget,
    remainingBudget: budget - total,
    withinBudget: total <= budget,
    priceNote:
      "Estimasi berdasarkan asumsi harga komponen. Belum termasuk ongkir, instalasi profesional, biaya listrik, dan penyesuaian bangunan. Harga perlu diverifikasi.",
  };
}

export function planAquaponics(
  input: DesignInput
): SystemPlan {
  const warnings: string[] = [];

  // Cadangan ruang untuk akses perawatan.
  // Ini aturan penyaringan awal, bukan validasi teknik.
  const maintenanceClearance = 0.6;

  const candidates = PACKAGES.map((pkg) => {
    const fits =
      pkg.length + maintenanceClearance <=
        input.length &&
      pkg.width + maintenanceClearance <=
        input.width;

    const items = createItems(pkg);
    const cost = calculateCost(items, input.budget);

    return {
      pkg,
      fits,
      items,
      cost,
    };
  });

  const fitting = candidates.filter(
    (candidate) => candidate.fits
  );

  const affordable = fitting.filter(
    (candidate) => candidate.cost.withinBudget
  );

  let selected:
    | (typeof candidates)[number]
    | undefined;

  if (input.priority === "hemat-ruang") {
    selected = affordable[0];
  } else if (input.priority === "produktivitas") {
    selected = affordable[affordable.length - 1];
  } else {
    selected = [...affordable].sort(
      (a, b) => a.cost.total - b.cost.total
    )[0];
  }

  // Jika tidak ada paket yang sesuai, gunakan
  // paket mini hanya sebagai pembanding biaya.
  if (!selected) {
    selected = candidates[0];

    warnings.push(
      "Belum ditemukan paket yang sekaligus sesuai dengan ukuran dan anggaran. Rancangan ini hanya referensi, bukan rekomendasi instalasi."
    );
  }

  const pkg = selected.pkg;

  if (!selected.fits) {
    warnings.push(
      "Ruang yang tersedia belum memenuhi asumsi dimensi instalasi dan akses perawatan."
    );
  }

  if (!selected.cost.withinBudget) {
    warnings.push(
      `Anggaran kurang Rp${Math.abs(
        selected.cost.remainingBudget
      ).toLocaleString("id-ID")} dari estimasi paket.`
    );
  }

  if (
    input.analysis.lighting.toLowerCase().includes(
      "kurang"
    ) ||
    input.analysis.lighting.toLowerCase().includes(
      "rendah"
    )
  ) {
    warnings.push(
      "Pencahayaan mungkin tidak mencukupi. Evaluasi kebutuhan lampu tanam; biayanya belum termasuk dalam paket."
    );
  }

  if (input.fish === "belum-tahu") {
    warnings.push(
      "Jenis ikan belum ditentukan. Pemilihan akhir perlu mempertimbangkan suhu air, oksigen, filtrasi, dan perawatan."
    );
  }

  warnings.push(
    "Kapasitas lantai, kelistrikan, waterproofing, dan akses air harus diperiksa sebelum instalasi."
  );

  const fish =
    input.fish === "belum-tahu"
      ? "Belum ditentukan"
      : input.fish === "hias"
      ? "Ikan hias"
      : input.fish.charAt(0).toUpperCase() +
        input.fish.slice(1);

  return {
    packageId: pkg.id,
    packageName: pkg.name,
    systemType: pkg.systemType,
    tankVolume: pkg.tankVolume,
    installationLength: pkg.length,
    installationWidth: pkg.width,
    footprintArea: pkg.length * pkg.width,
    fish,
    plants: [...input.plants],
    components: selected.items,
    cost: selected.cost,
    feasible:
      selected.fits && selected.cost.withinBudget,
    warnings,
  };
}

export function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isStringArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string"
    )
  );
}

export function isValidAnalysis(
  value: unknown
): value is SpaceAnalysis {
  if (!isRecord(value)) return false;

  return (
    typeof value.isSuitablePhoto === "boolean" &&
    typeof value.roomType === "string" &&
    typeof value.description === "string" &&
    typeof value.lighting === "string" &&
    isStringArray(value.visibleObjects) &&
    isStringArray(value.obstacles) &&
    isStringArray(value.potentialPlacement) &&
    isStringArray(value.recommendations) &&
    isStringArray(value.warnings) &&
    ["rendah", "sedang", "tinggi"].includes(
      String(value.confidence)
    )
  );
}

export function isValidInput(
  value: unknown
): value is DesignInput {
  if (!isRecord(value)) return false;

  return (
    typeof value.length === "number" &&
    Number.isFinite(value.length) &&
    value.length >= 0.01 &&
    value.length <= 100 &&
    typeof value.width === "number" &&
    Number.isFinite(value.width) &&
    value.width >= 0.01 &&
    value.width <= 100 &&
    (value.height === null ||
      (typeof value.height === "number" &&
        Number.isFinite(value.height) &&
        value.height >= 0.01 &&
        value.height <= 100)) &&
    typeof value.budget === "number" &&
    Number.isSafeInteger(value.budget) &&
    value.budget >= 100000 &&
    typeof value.fish === "string" &&
    ["nila", "lele", "mas", "hias", "belum-tahu"].includes(
      value.fish
    ) &&
    isStringArray(value.plants) &&
    value.plants.length > 0 &&
    value.plants.length <= 6 &&
    value.plants.every((plant) =>
      [
        "Selada",
        "Pakcoy",
        "Kangkung",
        "Bayam",
        "Sawi",
        "Kemangi",
      ].includes(plant)
    ) &&
    ["hemat-biaya", "hemat-ruang", "produktivitas"].includes(
      String(value.priority)
    ) &&
    typeof value.notes === "string" &&
    value.notes.length <= 500 &&
    isValidAnalysis(value.analysis) &&
    value.analysis.isSuitablePhoto
  );
}
