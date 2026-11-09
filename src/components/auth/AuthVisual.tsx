
import Image from "next/image";
import { Fish, Leaf, Box as BoxIcon } from "lucide-react";

type AuthVisualProps = {
  mode: "login" | "register";
};

export default function AuthVisual({ mode }: AuthVisualProps) {
  const isLogin = mode === "login";

  return (
    <section className="relative isolate hidden min-h-screen overflow-hidden bg-[#F5F9EC] lg:flex lg:flex-col">
      <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#DDEBCB]/70" />
      <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#FFE58C]/50" />

      <div className="relative z-10 px-10 pt-10 xl:px-16">
        <Image
          src="/images/logo/logo.svg"
          alt="SYMBIOLOGY"
          width={220}
          height={80}
          priority
          className="h-auto w-44 xl:w-52"
        />

        <h1 className="mt-12 max-w-md text-4xl font-extrabold leading-tight tracking-tight text-[#153F2B] xl:text-5xl">
          {isLogin ? (
            <>
              Pangan Segar
              <span className="block text-[#418C53]">
                dari Rumah Sendiri
              </span>
            </>
          ) : (
            <>
              Bergabung Bersama
              <span className="block text-[#418C53]">
                SYMBIOLOGY
              </span>
            </>
          )}
        </h1>

        <p className="mt-5 max-w-sm text-base leading-7 text-[#66796D]">
          {isLogin
            ? "Akuaponik cerdas untuk kehidupan yang lebih sehat dan berkelanjutan."
            : "Mulai perjalanan akuaponik cerdas untuk masa depan yang lebih hijau."}
        </p>

        <div className="mt-9 space-y-5">
          {[
            {
              icon: Leaf,
              text: "Tanaman sehat dan segar",
            },
            {
              icon: Fish,
              text: "Budidaya ikan lebih mudah",
            },
            {
              icon: BoxIcon,
              text: "Solusi berkelanjutan untuk rumah",
            },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#28794C] shadow-sm">
                <Icon size={19} />
              </span>
              <span className="text-sm font-medium text-[#315740]">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-auto h-[370px] xl:h-[460px]">
        <Image
          src="/images/auth/window.png"
          alt=""
          fill
          sizes="50vw"
          className="object-contain object-right-bottom opacity-75"
        />

        <Image
          src="/images/auth/aquaponics.png"
          alt="Sistem akuaponik SYMBIOLOGY"
          fill
          priority
          sizes="50vw"
          className="object-contain object-left-bottom drop-shadow-2xl"
        />

        <Image
          src="/images/auth/leaves.png"
          alt=""
          width={230}
          height={180}
          className="pointer-events-none absolute -bottom-10 -left-12 w-48 xl:w-60"
        />
      </div>
    </section>
  );
}
