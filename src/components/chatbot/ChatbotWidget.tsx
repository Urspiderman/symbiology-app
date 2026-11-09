
"use client";

import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-28 right-4 z-50 sm:right-6 lg:bottom-7 lg:right-8">
      {open && (
        <section
          aria-label="Asisten SYMBIOLOGY"
          className="mb-3 flex h-[min(440px,60vh)] w-[min(350px,calc(100vw-32px))] flex-col overflow-hidden rounded-[24px] border border-[#E0E9DF] bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-[#194D33] p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-[#FFDA57]" />
              <div>
                <h3 className="font-bold">SYMBIO Assistant</h3>
                <p className="text-xs text-white/75">
                  Asisten akuaponik
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Tutup chatbot"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAF6] p-4">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm leading-relaxed text-[#355647] shadow-sm">
              Halo! Saya asisten SYMBIOLOGY. Nantinya saya bisa
              membantu kamu memahami sistem akuaponik,
              memilih ikan dan tanaman, serta membaca kondisi air.
            </div>

            <p className="text-center text-xs text-[#8A9990]">
              Fitur percakapan AI belum diaktifkan.
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex items-center gap-2 border-t border-[#E8EFE6] p-3"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tanya tentang akuaponik..."
              aria-label="Pesan chatbot"
              disabled
              className="h-11 min-w-0 flex-1 rounded-xl bg-[#F3F7F1] px-3 text-sm outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled
              aria-label="Kirim pesan"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#194D33] text-white disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? "Tutup asisten" : "Buka asisten"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#194D33] text-white shadow-xl transition hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={25} />}
      </button>
    </div>
  );
}
