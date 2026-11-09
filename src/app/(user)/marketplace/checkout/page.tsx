
import { Suspense } from "react";
import CheckoutForm from "@/components/marketplace/CheckoutForm";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-[#194D33]">
          Memuat checkout...
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
