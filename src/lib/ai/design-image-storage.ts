
const DB_NAME = "symbiology-ai-studio";
const STORE_NAME = "design-images";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ||
          new Error("Gagal membuka database.")
      );
    };
  });
}

export async function saveDesignImage(
  designId: string,
  imageDataUrl: string
): Promise<void> {
  const db = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      transaction
        .objectStore(STORE_NAME)
        .put(imageDataUrl, designId);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () =>
        reject(
          transaction.error ||
            new Error("Gagal menyimpan gambar.")
        );
    });
  } finally {
    db.close();
  }
}

export async function getDesignImage(
  designId: string
): Promise<string | null> {
  const db = await openDatabase();

  try {
    return await new Promise<string | null>(
      (resolve, reject) => {
        const transaction = db.transaction(
          STORE_NAME,
          "readonly"
        );

        const request = transaction
          .objectStore(STORE_NAME)
          .get(designId);

        request.onsuccess = () => {
          resolve(
            typeof request.result === "string"
              ? request.result
              : null
          );
        };

        request.onerror = () =>
          reject(
            request.error ||
              new Error("Gagal membaca gambar.")
          );
      }
    );
  } finally {
    db.close();
  }
}
