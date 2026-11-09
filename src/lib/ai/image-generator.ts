
export type AquaponicsRenderDesign = {
  id: string;
  name: string;
  area: number;
  fish: string;
  plant: string;
  tankVolume: number;
  systemType: string;
  estimatedCost: number;
  withinBudget?: boolean;
  feasible?: boolean;
  packageId?: string;
  packageName?: string;
  installation?: {
    length: number;
    width: number;
    area: number;
  };
  components?: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
  }>;
  recommendation?: {
    summary?: string;
    placement?: string;
    recommendedPlants?: string[];
    maintenance?: string[];
    safetyNotes?: string[];
  };
  input: {
    length: number;
    width: number;
    height?: number | null;
    budget: number;
    priority?: string;
    analysis?: {
      roomType?: string;
      description?: string;
      lighting?: string;
      visibleObjects?: string[];
      obstacles?: string[];
      potentialPlacement?: string[];
    };
  };
};

type GenerateImageOptions = {
  imageBuffer: Buffer;
  mimeType: string;
  design: AquaponicsRenderDesign;
};

type CloudflareResponse = {
  success?: boolean;
  errors?: Array<{
    code?: number;
    message?: string;
  }>;
  result?: {
    image?: string;
    b64_json?: string;
    images?: Array<{
      image?: string;
      b64_json?: string;
    }>;
  };
};

const DEFAULT_MODEL =
  "@cf/black-forest-labs/flux-2-klein-4b";

function extractImage(
  response: CloudflareResponse
): string | null {
  const result = response.result;

  if (!result) return null;

  return (
    result.image ||
    result.b64_json ||
    result.images?.[0]?.image ||
    result.images?.[0]?.b64_json ||
    null
  );
}

function normalizeImage(value: string): {
  imageBase64: string;
  mimeType: string;
} {
  const match = value.match(
    /^data:(image\/[\w.+-]+);base64,([\s\S]+)$/
  );

  if (match) {
    return {
      mimeType: match[1],
      imageBase64: match[2],
    };
  }

  return {
    mimeType: "image/png",
    imageBase64: value,
  };
}

function buildPrompt(
  design: AquaponicsRenderDesign
): string {
  const plants =
    design.recommendation?.recommendedPlants
      ?.join(", ") ||
    design.plant;

  const components =
    design.components?.length
      ? design.components
          .map(
            (item) =>
              `${item.quantity} ${item.unit} ${item.name}`
          )
          .join("; ")
      : "One fish tank, one grow bed, water pump, pipes, and stable support frame";

  const installationLength =
    design.installation?.length ?? 1.2;

  const installationWidth =
    design.installation?.width ?? 0.65;

  const placement =
    design.recommendation?.placement ||
    "Place the installation in an accessible unobstructed area";

  const obstacles =
    design.input.analysis?.obstacles?.join(", ") ||
    "Not specified";

  return `
PHOTOREALISTIC ARCHITECTURAL PHOTO EDIT.

INPUT:
The uploaded image is the ORIGINAL REAL ROOM.
Use it as the visual reference.

PRIMARY OBJECTIVE:
Add ONE compact, realistic aquaponics
installation to the existing photographed room.

THIS IS A ROOM PHOTO EDIT, NOT A ROOM REDESIGN.

STRICT PRESERVATION:
- Keep the original room architecture.
- Keep the exact camera viewpoint.
- Keep the original perspective and composition.
- Keep the original walls and wall colors.
- Keep the original floor and floor pattern.
- Keep the original ceiling.
- Keep all existing windows and doors.
- Keep existing furniture in its original position.
- Keep the original lighting conditions.
- Keep the original background and surroundings.
- Do not replace the room with a different room.
- Do not renovate or redecorate the room.
- Do not change the layout.
- Do not create additional windows or doors.
- Do not remove visible objects.
- Do not add decorative objects unrelated
  to the aquaponics installation.

ONLY ALLOWED CHANGE:
Add a compact aquaponics installation
that is physically plausible and visually
integrated into the existing space.

AQUAPONICS SPECIFICATIONS:
Package: ${design.packageName || design.name}
System: ${design.systemType}
Fish: ${design.fish}
Plants: ${plants}
Fish tank volume: approximately ${design.tankVolume} liters
Installation footprint:
${installationLength} meters long,
${installationWidth} meters wide.

REQUIRED COMPONENTS:
${components}

INSTALLATION DESIGN:
- One coherent compact aquaponics system.
- A fish tank with visible water.
- A grow bed containing the specified plants.
- Realistic water circulation pipes.
- Stable support frame.
- Practical access for maintenance.
- No unnecessary additional fish tanks.
- No large commercial greenhouse structures.
- No oversized equipment.
- No floating objects.
- No impossible plumbing.

ROOM CONTEXT:
Room type:
${design.input.analysis?.roomType || "Unknown"}

Original room description:
${design.input.analysis?.description || "Use the uploaded photograph"}

Lighting:
${design.input.analysis?.lighting || "Preserve existing lighting"}

Known obstacles:
${obstacles}

PLACEMENT GUIDANCE:
${placement}

The installation must not block
doors, windows, or walking paths.

IMPORTANT SCALE RULE:
The installation should look compact
relative to the existing room.

Room dimensions:
${design.input.length} x ${design.input.width} meters.

The dimensions are user-provided planning
measurements and cannot be verified from
the photograph alone.

IMAGE OUTPUT:
- Exactly ONE final AFTER photograph.
- Photorealistic appearance.
- Natural shadows and reflections.
- Same room as the original photo.
- Same camera position.
- No split-screen comparison.
- No collage.
- No diagrams.
- No labels.
- No text.
- No watermark.

FINAL INSTRUCTION:
Preserve the source photograph as faithfully
as possible and add only the specified
aquaponics installation.
`.trim();
}

export async function generateAquaponicsImage({
  imageBuffer,
  mimeType,
  design,
}: GenerateImageOptions): Promise<{
  imageBase64: string;
  mimeType: string;
}> {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID;

  const apiToken =
    process.env.CLOUDFLARE_API_TOKEN;

  const model =
    process.env.CLOUDFLARE_IMAGE_MODEL ||
    DEFAULT_MODEL;

  if (!accountId || !apiToken) {
    throw new Error(
      "Konfigurasi Cloudflare belum lengkap."
    );
  }

  if (design.feasible === false) {
    throw new Error(
      "Rancangan belum memenuhi batas anggaran atau kebutuhan ruang. Sesuaikan input sebelum membuat foto."
    );
  }

  const prompt = buildPrompt(design);

  const formData = new FormData();

  formData.append("prompt", prompt);

  formData.append(
    "image",
    new Blob([new Uint8Array(imageBuffer)], {
      type: mimeType,
    }),
    mimeType === "image/png"
      ? "room.png"
      : mimeType === "image/webp"
      ? "room.webp"
      : "room.jpg"
  );

  const url =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${encodeURIComponent(accountId)}/ai/run/${model}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
    cache: "no-store",
    signal: AbortSignal.timeout(110000),
  });

  const contentType =
    response.headers.get("content-type") || "";

  if (
    response.ok &&
    contentType.startsWith("image/")
  ) {
    const bytes = Buffer.from(
      await response.arrayBuffer()
    );

    return {
      imageBase64: bytes.toString("base64"),
      mimeType: contentType.split(";")[0],
    };
  }

  const raw = await response.text();

  let payload: CloudflareResponse;

  try {
    payload = JSON.parse(raw) as CloudflareResponse;
  } catch {
    throw new Error(
      `Respons Cloudflare tidak valid (HTTP ${response.status}).`
    );
  }

  if (!response.ok || payload.success === false) {
    const message =
      payload.errors
        ?.map((error) => error.message)
        .filter(Boolean)
        .join("; ") ||
      `HTTP ${response.status}`;

    throw new Error(
      `Cloudflare gagal menghasilkan gambar: ${message}`
    );
  }

  const encodedImage = extractImage(payload);

  if (!encodedImage) {
    throw new Error(
      "Cloudflare tidak mengembalikan data gambar."
    );
  }

  return normalizeImage(encodedImage);
}
