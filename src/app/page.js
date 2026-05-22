"use client";
// Expand on the idea of the main page with a lot more things like a globe rotating from shadcn some interesting things to make the page look more beautiful and interactive. Also add a lot more content to the page to make it look more complete and less empty. Add a lot more sections to the page like a section for testimonials, a section for features, a section for contact us, etc. Make the page look more like a real product landing page with all the necessary sections and content.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    color: "from-orange-400 to-orange-500",
  },
  {
    number: "02",
    title: "AI Plans Your Journey",
    description: "Our intelligent agent creates personalized itineraries in seconds.",
    icon: Sparkles,
    color: "from-amber-400 to-orange-400",
  },
  {
    number: "03",
    title: "Explore & Customize",
    description: "Fine-tune your plans, get local insights, and discover hidden gems.",
    icon: Globe,
    color: "from-orange-500 to-rose-500",
  },
  {
    number: "04",
    title: "Travel Confidently",
    description: "Execute your perfect itinerary with all details at your fingertips.",
    icon: Plane,
    color: "from-rose-400 to-orange-400",
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white dark:from-zinc-950 dark:via-orange-950 dark:to-zinc-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-orange-200 dark:border-orange-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">LogPose</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
          >
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 text-sm text-orange-700 dark:text-orange-300">
                <Sparkles className="h-4 w-4 mr-2" />
                Agentic AI Travel Planning
              </div>

              <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 dark:from-orange-400 dark:via-amber-400 dark:to-rose-400 bg-clip-text text-transparent">Your Personal</span>
                <br />
                <span className="text-zinc-900 dark:text-white">Travel Agent</span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
                Chat with an intelligent AI agent that understands your travel dreams, crafts personalized itineraries, and helps you discover extraordinary experiences around the world.
              </p>

              <div className="flex gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg group">
                    Start Planning Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    Try Demo
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-orange-200 dark:border-orange-700">
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">50K+</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Journeys Planned</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">180+</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Destinations</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">4.9★</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">User Rating</p>
                </div>
              </div>
            </div>

            {/* Right - Destination Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden border-4 border-orange-200 dark:border-orange-700 shadow-2xl">
                {/* Carousel Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 dark:from-orange-600 dark:via-amber-600 dark:to-rose-600 flex items-center justify-center">
                  <span className="text-9xl opacity-20">{destinations[carouselIndex].emoji}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-transparent to-transparent">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-4xl font-bold text-white mb-2">{destinations[carouselIndex].name}</h3>
                    <p className="text-white/90 text-lg">{destinations[carouselIndex].description}</p>
                  </motion.div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevDestination}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-700 rounded-full p-2 transition-all shadow-lg"
                  aria-label="Previous destination"
                >
                  <ChevronLeft className="h-6 w-6 text-zinc-900 dark:text-white" />
                </button>
                <button
                  onClick={nextDestination}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-700 rounded-full p-2 transition-all shadow-lg"
                  aria-label="Next destination"
                >
                  <ChevronRight className="h-6 w-6 text-zinc-900 dark:text-white" />
                </button>

                {/* Carousel indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {destinations.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === carouselIndex ? "bg-white w-8" : "bg-white/50 w-2"
                      }`}
                      aria-label={`Go to destination ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* How It Works Section */}
          <section className="py-24 border-t border-orange-200 dark:border-orange-700">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
                How <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">LogPose</span> Works
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
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
                    <div className="hidden lg:block absolute top-12 -right-4 w-8 h-1 bg-gradient-to-r from-orange-400 to-transparent" />
                  )}

                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-orange-100 dark:border-orange-800 h-full hover:shadow-lg transition-shadow">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg`}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 border-t border-orange-200 dark:border-orange-700">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
                Powerful <span className="bg-gradient-to-r from-orange-600 to-rose-600 dark:from-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
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
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-orange-100 dark:border-orange-800 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 shadow-md">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 border-t border-orange-200 dark:border-orange-700">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
                Loved by <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">Travelers</span>
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
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
                  className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-8 border border-orange-200 dark:border-orange-700"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl">⭐</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 border-t border-orange-200 dark:border-orange-700">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 dark:from-orange-700 dark:via-amber-700 dark:to-rose-700 rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
            >
              <Plane className="h-16 w-16 mx-auto text-white mb-6" />
              <h2 className="text-5xl font-bold text-white mb-4">Ready to Explore the World?</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Join thousands of travelers already discovering their next adventure with LogPose AI
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base bg-white text-orange-600 hover:bg-orange-50 shadow-lg font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-200 dark:border-orange-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-orange-600 dark:text-orange-400">LogPose</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Agentic AI travel planning for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/chat" className="hover:text-orange-600 dark:hover:text-orange-400">Start Planning</Link></li>
                <li><Link href="#features" className="hover:text-orange-600 dark:hover:text-orange-400">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-orange-600 dark:hover:text-orange-400">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">About Us</a></li>
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Blog</a></li>
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-200 dark:border-orange-700 pt-8 flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>&copy; 2026 LogPose AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Twitter</a>
              <a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">LinkedIn</a>
              <a href="#" className="hover:text-orange-600 dark:hover:text-orange-400">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
