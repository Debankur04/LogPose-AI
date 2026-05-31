"use client";
// Expand on the idea of the main page with a lot more things like a globe rotating from shadcn some interesting things to make the page look more beautiful and interactive. Also add a lot more content to the page to make it look more complete and less empty. Add a lot more sections to the page like a section for testimonials, a section for features, a section for contact us, etc. Make the page look more like a real product landing page with all the necessary sections and content.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe as GlobeComp } from "@/components/ui/globe";
import { ArrowRight, Plane, Map, Compass, MessageSquare, ChevronLeft, ChevronRight, Sparkles, Globe, Zap, Heart, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Featured destinations carousel data
const destinations = [
  {
    name: "Tokyo, Japan",
    image: "🗾",
    description: "Experience ancient temples and neon-lit streets",
    emoji: "🌸",
  },
  {
    name: "Paris, France",
    image: "🗼",
    description: "The city of lights and romance awaits",
    emoji: "🥐",
  },
  {
    name: "Bali, Indonesia",
    image: "🏝️",
    description: "Tropical paradise with rich cultural heritage",
    emoji: "🌴",
  },
  {
    name: "New York, USA",
    image: "🗽",
    description: "The city that never sleeps",
    emoji: "🍎",
  },
  {
    name: "Barcelona, Spain",
    image: "🏖️",
    description: "Architecture and Mediterranean beauty",
    emoji: "🍷",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Miller",
    role: "Adventurer",
    quote: "LogPose AI planned my entire 2-week Asian tour. It was the best trip I've ever had!",
    avatar: "👩‍🦱",
  },
  {
    name: "James Chen",
    role: "Business Traveler",
    quote: "Finally, an AI that understands my travel needs. Saves me hours of planning every month.",
    avatar: "👨‍💼",
  },
  {
    name: "Emma Rodriguez",
    role: "Family Travel",
    quote: "The family-friendly itineraries are fantastic. Kids loved every moment!",
    avatar: "👩‍👧‍👦",
  },
];

// How it works steps
const steps = [
  {
    number: "01",
    title: "Tell Us Your Vision",
    description: "Chat naturally about your travel dreams, preferences, and constraints.",
    icon: MessageSquare,
    color: "from-cyan-400 to-slate-300",
  },
  {
    number: "02",
    title: "AI Plans Your Journey",
    description: "Our intelligent agent creates personalized itineraries in seconds.",
    icon: Sparkles,
    color: "from-teal-400 to-cyan-400",
  },
  {
    number: "03",
    title: "Explore & Customize",
    description: "Fine-tune your plans, get local insights, and discover hidden gems.",
    icon: Globe,
    color: "from-cyan-500 to-teal-500",
  },
  {
    number: "04",
    title: "Travel Confidently",
    description: "Execute your perfect itinerary with all details at your fingertips.",
    icon: Plane,
    color: "from-slate-400 to-cyan-400",
  },
];

export default function Home() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState("");
  const [traceId, setTraceId] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [traceError, setTraceError] = useState("");
  const [isTracing, setIsTracing] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error("API health check failed");
      }
      const data = await response.json();
      setHealth(data);
      setHealthError("");
    } catch (error) {
      setHealth(null);
      setHealthError("Unable to reach backend health endpoint.");
    }
  };

  const handleTraceLookup = async () => {
    if (!traceId.trim()) return;
    setTraceError("");
    setTraceData(null);
    setIsTracing(true);

    try {
      const response = await fetch(`${apiUrl}/debug/trace/${traceId.trim()}`);
      if (!response.ok) {
        throw new Error("Trace request failed");
      }
      const data = await response.json();
      setTraceData(data);
    } catch (error) {
      setTraceError("Unable to fetch trace for the provided request id.");
    } finally {
      setIsTracing(false);
    }
  };

  const nextDestination = () => {
    setCarouselIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevDestination = () => {
    setCarouselIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/60 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
              <Plane className="h-5 w-5 text-slate-950" />
            </div>
            <span className="font-bold text-xl text-white">LogPose</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-200 hover:text-cyan-300 transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24 relative z-10"
          >
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-cyan-300">
                <Sparkles className="h-4 w-4 mr-2" />
                Agentic AI Travel Planning
              </div>

              <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-cyan-300 via-slate-100 to-teal-300 bg-clip-text text-transparent">Your Personal</span>
                <br />
                <span className="text-slate-100">Travel Agent</span>
              </h1>

              <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                Chat with an intelligent AI agent that understands your travel dreams, crafts personalized itineraries, and helps you discover extraordinary experiences around the world.
              </p>

              <div className="flex gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base bg-linear-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 shadow-lg group">
                    Start Planning Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700">
                <div>
                  <div className="text-3xl font-bold text-cyan-300">50K+</div>
                  <p className="text-sm text-slate-400">Journeys Planned</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-300">180+</div>
                  <p className="text-sm text-slate-400">Destinations</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-300">4.9★</div>
                  <p className="text-sm text-slate-400">User Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
          </div>

          {/* Globe Feature Section */}
          <section className="py-24 border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/80">Worldwide Travel</p>
                <h2 className="text-5xl font-bold text-slate-100">Travel Anywhere, As You Want</h2>
                <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                  Explore the world with an interactive globe built for discovery. Spin the planet, pick destinations, and let LogPose turn your ideas into intelligent itineraries.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
                    <p className="text-sm text-cyan-300 uppercase tracking-[0.18em] mb-2">Instant discovery</p>
                    <p className="text-slate-400 text-sm">Explore destinations, local highlights, and smart recommendations in one place.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
                    <p className="text-sm text-cyan-300 uppercase tracking-[0.18em] mb-2">Global intelligence</p>
                    <p className="text-slate-400 text-sm">Use the globe to visualize travel paths and uncover the perfect next adventure.</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-4xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl overflow-hidden h-105 sm:h-130">
                <GlobeComp className="absolute inset-0 h-full w-full rounded-3xl bg-slate-950" />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-24 border-t border-slate-800">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-slate-100">
                How <span className="bg-linear-to-r from-cyan-400 to-slate-200 bg-clip-text text-transparent">LogPose</span> Works
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Four simple steps to transform your travel dreams into reality
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Connecting line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-4 w-8 h-1 bg-linear-to-r from-cyan-400 to-transparent" />
                  )}

                  <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 h-full hover:shadow-2xl transition-shadow">
                    <div className={`w-16 h-16 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center mb-6 text-2xl font-bold text-black shadow-lg`}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 border-t border-slate-800">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-slate-100">
                Powerful <span className="bg-linear-to-r from-cyan-400 to-slate-200 bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Everything you need for the perfect trip
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: MessageSquare, title: "Natural Chat", desc: "Conversation-based planning feels natural and intuitive" },
                { icon: Map, title: "Smart Itineraries", desc: "AI-optimized daily plans tailored to your style" },
                { icon: Compass, title: "Local Insights", desc: "Discover authentic experiences and hidden gems" },
                { icon: Heart, title: "Preferences Learning", desc: "The more you chat, the better it understands you" },
                { icon: TrendingUp, title: "Real-Time Updates", desc: "Get alerts on deals, weather, and travel trends" },
                { icon: Globe, title: "Global Coverage", desc: "Support for 180+ destinations worldwide" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-cyan-500 to-teal-400 flex items-center justify-center mb-4 shadow-md">
                    <feature.icon className="h-6 w-6 text-slate-950" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 border-t border-slate-800">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-slate-100">
                Loved by <span className="bg-linear-to-r from-cyan-400 to-slate-200 bg-clip-text text-transparent">Travelers</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                See what our community has to say
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-3xl bg-linear-to-br from-cyan-500 to-teal-400 p-4 text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-slate-100">{testimonial.name}</h4>
                      <p className="text-sm text-cyan-300">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4 text-cyan-300">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl">★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 border-t border-slate-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-linear-to-r from-cyan-500 via-slate-900 to-slate-950 rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
            >
              <Plane className="h-16 w-16 mx-auto text-white mb-6" />
              <h2 className="text-5xl font-bold text-white mb-4">Ready to Explore the World?</h2>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
                Join thousands of travelers already discovering their next adventure with LogPose AI
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base bg-slate-100 text-slate-950 hover:bg-slate-200 shadow-lg font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#02050d]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-linear-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-slate-950" />
                </div>
                <span className="font-bold text-slate-100">LogPose</span>
              </div>
              <p className="text-sm text-slate-400">Agentic AI travel planning for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/chat" className="hover:text-cyan-300">Start Planning</Link></li>
                <li><Link href="#features" className="hover:text-cyan-300">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-cyan-300">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/AboutUs" className="hover:text-cyan-300">About Us</Link></li>
                <li><Link href="/Blog" className="hover:text-cyan-300">Blog</Link></li>
                <li><Link href="/Contact" className="hover:text-cyan-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/Privacy" className="hover:text-cyan-300">Privacy</Link></li>
                <li><Link href="/Terms" className="hover:text-cyan-300">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col gap-4 lg:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2026 LogPose AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="hover:text-cyan-300">Twitter</a>
              <a href="https://linkedin.com" className="hover:text-cyan-300">LinkedIn</a>
              <a href="https://instagram.com" className="hover:text-cyan-300">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
