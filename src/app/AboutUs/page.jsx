import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#000] text-slate-200">
      <div className="max-w-4xl mx-auto bg-[#07101a] p-12 rounded-2xl border border-slate-800 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">About LogPose</h1>
        <p className="text-slate-300 leading-relaxed mb-6">
          LogPose AI is an agentic travel planning assistant designed to help travelers discover, plan, and execute exceptional trips. Our platform combines modern UI, intelligent routing, and curated local knowledge.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-slate-300">Make travel planning delightful and efficient using AI while preserving the human touch.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Team</h2>
          <p className="text-slate-300">Small, passionate team of travel and machine learning enthusiasts building helpful tools for modern travelers.</p>
        </section>

        <div className="mt-8 text-right">
          <Link href="/" className="text-cyan-400 hover:underline">Return home</Link>
        </div>
      </div>
    </div>
  );
}