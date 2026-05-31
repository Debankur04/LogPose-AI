import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#000] text-slate-200 px-4 py-24">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
        <p className="text-slate-400 leading-relaxed mb-6">
          We respect your privacy and protect your data with secure storage and responsible handling. This page explains how we collect, use, and safeguard your information.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">Data We Collect</h2>
          <p className="text-slate-300">We only store the minimum information needed to run your service and keep your account secure.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">How We Use It</h2>
          <p className="text-slate-300">Your data is used to authenticate you, personalize your experience, and respond to your travel planning requests.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">Security</h2>
          <p className="text-slate-300">We implement modern security practices to keep your account and personal information safe.</p>
        </section>

        <div className="mt-10 text-right">
          <Link href="/" className="text-cyan-300 hover:text-cyan-100">Return home</Link>
        </div>
      </div>
    </div>
  );
}
