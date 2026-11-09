
import "server-only";

const isProduction =
  process.env.MIDTRANS_IS_PRODUCTION === "true";

export function midtransBaseUrl() {
  return isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

export function midtransApiUrl() {
  return `${midtransBaseUrl()}/snap/v1/transactions`;
}

export function midtransStatusUrl(orderId: string) {
  const base = isProduction
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";

  return `${base}/v2/${encodeURIComponent(orderId)}/status`;
}

export function midtransAuth() {
  const key = process.env.MIDTRANS_SERVER_KEY;

  if (!key) {
    throw new Error(
      "MIDTRANS_SERVER_KEY belum dikonfigurasi"
    );
  }

  return (
    "Basic " +
    Buffer.from(`${key}:`).toString("base64")
  );
}

export function midtransServerKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;

  if (!key) {
    throw new Error(
      "MIDTRANS_SERVER_KEY belum dikonfigurasi"
    );
  }

  return key;
}
