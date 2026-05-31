import Link from "next/link";

const posts = [
  {
    title: "Navigating City Travel with AI Itineraries",
    summary: "How smart recommendations help you build a perfect day in any city.",
  },
  {
    title: "Top 5 Hidden Destinations for 2026",
    summary: "Discover lesser-known travel spots that feel exclusive and unforgettable.",
  },
  {
    title: "Travel Planning Tips for Remote Work Trips",
    summary: "Make your next digital nomad adventure smooth, productive, and inspiring.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#000] text-slate-200 px-4 py-24">
      <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-white">Travel Insights</h1>
          <p className="text-slate-400">Explore our latest travel guides, destination stories, and tech-driven planning tips.</p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <article key={index} className="rounded-3xl border border-slate-800 bg-[#05101f] p-8 hover:border-cyan-400 transition-colors">
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">{post.title}</h2>
              <p className="text-slate-400 leading-relaxed">{post.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-right">
          <Link href="/" className="text-cyan-300 hover:text-cyan-100">Return home</Link>
        </div>
      </div>
    </div>
  );
}
