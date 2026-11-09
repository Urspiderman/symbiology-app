"use client"; export default function ErrorPage({reset}:{reset:()=>void}){return <main className="p-10"><p>Terjadi kesalahan.</p><button onClick={reset}>Coba lagi</button></main>}
