
export type DemoReading = {
  timestamp: number;
  temperature: number;
  ph: number;
  waterLevel: number;
};

export type DemoState = {
  readings: DemoReading[];
  pumpOn: boolean;
  autoMode: boolean;
  connected: boolean;
  deviceName: string;
  lastUpdated: number;
};

const PREFIX = "symbiology-iot-demo-v1:";
const INTERVAL = 5000;
const MAX_READINGS = 288;

function round(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function storageKey(systemId: string) {
  return PREFIX + systemId;
}

export function createDemoState(): DemoState {
  const now = Date.now();

  const readings: DemoReading[] = [];

  for (let i = 23; i >= 0; i--) {
    const timestamp = now - i * 60 * 60 * 1000;

    readings.push({
      timestamp,
      temperature: round(
        27 + Math.sin(i / 3) * 0.7
      ),
      ph: round(
        7 + Math.cos(i / 4) * 0.15,
        2
      ),
      waterLevel: round(
        82 + Math.sin(i / 5) * 2
      ),
    });
  }

  return {
    readings,
    pumpOn: true,
    autoMode: true,
    connected: false,
    deviceName: "ESP32 Akuaponik 01",
    lastUpdated: now,
  };
}

export function loadDemoState(systemId: string): DemoState {
  if (typeof window === "undefined") {
    return createDemoState();
  }

  try {
    const raw = localStorage.getItem(storageKey(systemId));

    if (raw) {
      const parsed: unknown = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed === "object" &&
        "readings" in parsed &&
        Array.isArray(parsed.readings) &&
        "pumpOn" in parsed &&
        typeof parsed.pumpOn === "boolean" &&
        "autoMode" in parsed &&
        typeof parsed.autoMode === "boolean" &&
        "connected" in parsed &&
        typeof parsed.connected === "boolean" &&
        "lastUpdated" in parsed &&
        typeof parsed.lastUpdated === "number"
      ) {
        return parsed as DemoState;
      }
    }
  } catch {
    // Data demo rusak: buat ulang.
  }

  const initial = createDemoState();
  saveDemoState(systemId, initial);
  return initial;
}

export function saveDemoState(
  systemId: string,
  state: DemoState
) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      storageKey(systemId),
      JSON.stringify(state)
    );
  } catch {
    // Browser mungkin membatasi penyimpanan.
  }
}

export function advanceDemoState(
  state: DemoState
): DemoState {
  const now = Date.now();
  const last = state.readings[state.readings.length - 1];

  if (!last) return createDemoState();

  const elapsed = now - state.lastUpdated;

  if (elapsed < INTERVAL) return state;

  const steps = Math.min(
    Math.floor(elapsed / INTERVAL),
    60
  );

  const readings = [...state.readings];

  for (let i = 0; i < steps; i++) {
    const previous = readings[readings.length - 1];

    readings.push({
      timestamp: now - (steps - i - 1) * INTERVAL,
      temperature: round(
        clamp(
          previous.temperature +
            (Math.random() - 0.5) * 0.25,
          24,
          32
        )
      ),
      ph: round(
        clamp(
          previous.ph +
            (Math.random() - 0.5) * 0.05,
          6,
          8
        ),
        2
      ),
      waterLevel: round(
        clamp(
          previous.waterLevel +
            (state.pumpOn ? -0.04 : -0.08) +
            Math.random() * 0.08,
          35,
          100
        )
      ),
    });
  }

  return {
    ...state,
    readings: readings.slice(-MAX_READINGS),
    lastUpdated: now,
  };
}

export function updateDemoState(
  systemId: string,
  updater: (previous: DemoState) => DemoState
) {
  const previous = loadDemoState(systemId);
  const next = updater(previous);

  saveDemoState(systemId, next);

  window.dispatchEvent(
    new CustomEvent("symbiology-demo-update", {
      detail: { systemId },
    })
  );

  return next;
}
