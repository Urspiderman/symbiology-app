
"use client";

import { useEffect, useState } from "react";
import {
  advanceDemoState,
  DemoState,
  loadDemoState,
  saveDemoState,
  updateDemoState,
} from "./demo";

export function useDemoIoT(systemId: string) {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    if (!systemId) return;

    const refresh = () => {
      const current = loadDemoState(systemId);
      const next = advanceDemoState(current);

      saveDemoState(systemId, next);
      setState(next);
    };

    refresh();

    const timer = window.setInterval(refresh, 5000);

    const onUpdate = (event: Event) => {
      const custom = event as CustomEvent<{
        systemId: string;
      }>;

      if (custom.detail?.systemId === systemId) {
        refresh();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === `symbiology-iot-demo-v1:${systemId}`) {
        refresh();
      }
    };

    window.addEventListener(
      "symbiology-demo-update",
      onUpdate
    );
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(
        "symbiology-demo-update",
        onUpdate
      );
      window.removeEventListener("storage", onStorage);
    };
  }, [systemId]);

  function change(
    updater: (previous: DemoState) => DemoState
  ) {
    if (!systemId) return;

    const next = updateDemoState(systemId, updater);
    setState(next);
  }

  return { state, change };
}
