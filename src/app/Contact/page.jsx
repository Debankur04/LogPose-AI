import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#000] text-slate-200 px-4 py-24">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <h1 className="text-4xl font-bold mb-4 text-white">Contact</h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          Have a question or want to collaborate? Reach out through email or social channels and our team will get back to you quickly.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#05101f] p-8">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Email</h2>
            <p className="text-slate-300 mb-2">debankurdutta04@gmail.com</p>
            <p className="text-slate-500 text-sm">Send inquiries, partnership requests, or product feedback.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#05101f] p-8">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Social</h2>
            <ul className="space-y-3 text-slate-300">
              <li><a href="https://github.com/Debankur04" target="_blank" rel="noreferrer" className="hover:text-cyan-300">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/debankur-dutta-8871a22b0" target="_blank" rel="noreferrer" className="hover:text-cyan-300">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-right">
          <Link href="/" className="text-cyan-300 hover:text-cyan-100">Return home</Link>
        </div>
      </div>
    </div>
  );
}
