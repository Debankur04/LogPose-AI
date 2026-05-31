import Link from "next/link";

export default function TermsPage() {
	return (
		<div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#000] text-slate-200">
			<div className="max-w-4xl mx-auto bg-[#07101a] p-12 rounded-2xl border border-slate-800 shadow-lg">
				<h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
				<p className="text-slate-300 leading-relaxed mb-6">
					Welcome to LogPose AI. These Terms and Conditions govern your use of our platform. By accessing or using the service, you agree to be bound by these terms. Please read them carefully.
				</p>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Use of Service</h2>
					<p className="text-slate-300">You may use LogPose AI for personal and lawful purposes. You are responsible for any content you provide to the service.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Account Security</h2>
					<p className="text-slate-300">Keep your account credentials secure. If you suspect unauthorized access, contact support immediately.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
					<p className="text-slate-300">LogPose AI provides travel planning assistance and recommendations. We are not liable for travel-related decisions made by users.</p>
				</section>

				<div className="mt-8 text-right">
					<Link href="/" className="text-cyan-400 hover:underline">Return home</Link>
				</div>
			</div>
		</div>
	);
}