"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, Sparkles, Mail, Linkedin, BarChart3, Database, Zap, Target, Terminal, GitBranch } from "lucide-react";

/* ── Magnetic wrapper ── */
function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ── Urgency strip ── */
function UrgencyStrip() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>34 people joined this week &mdash; 18 early access spots left</span>
    </div>
  );
}

/* ── Floating CTA ── */
function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="fixed bottom-6 right-6 z-50">
          <Magnetic>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-sm font-medium shadow-lg shadow-black/40 hover:bg-white/90 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
              </svg>
              Get Early Access
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Headlines ── */
const headlines: Record<string, { pill: string; h1: string; sub: string }> = {
  scrape: {
    pill: "13+ Lead Sources",
    h1: "Find Leads From 13 Sources\nin One Click.",
    sub: "LinkedIn, Apollo, Google Maps, Crunchbase, Product Hunt, and 8 more — all in one dashboard. No more switching between tools.",
  },
  enrich: {
    pill: "AI Enrichment Pipeline",
    h1: "AI Enriches Every Lead\nfor $0.11 Each.",
    sub: "9-stage pipeline: company data, person research, verified emails, icebreakers, quality scoring. All automated, all tracked.",
  },
  alt: {
    pill: "All-in-One Platform",
    h1: "Replace Apollo + Instantly\n+ Clay With One Tool.",
    sub: "Find leads, enrich with AI, launch email + LinkedIn campaigns, and manage your CRM pipeline — without juggling 5 subscriptions.",
  },
  default: {
    pill: "AI Lead Generation Platform",
    h1: "Find, Enrich, and Email\n1,000 Leads in 30 Minutes.",
    sub: "All-in-one outbound platform. 13 lead sources, AI enrichment at $0.11/lead, and automated email + LinkedIn campaigns from one dashboard.",
  },
};

/* ── Form ── */
function WaitlistForm({ variant }: { variant: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "google-ads", variant, url: window.location.href, timestamp: new Date().toISOString(), product: "leadgenos" }),
      });
    } catch { /* still show success */ }
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-white/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">You&apos;re on the list.</h2>
        <p className="text-sm text-neutral-400">We&apos;ll reach out when your spot is ready.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.05em] block">Name</label>
        <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 p-3.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10" />
      </div>
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.05em] block">Work Email</label>
        <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 p-3.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-50 min-h-[44px] mt-2">
        {loading ? "Joining..." : "Get Early Access"}
      </button>
      <p className="text-xs text-neutral-500 text-center">Free early access. No credit card required.</p>
      <UrgencyStrip />
    </form>
  );
}

/* ── Capabilities ── */
const capabilities = [
  {
    icon: Search,
    title: "13+ Lead Sources",
    desc: "LinkedIn, Apollo, Sales Navigator, Google Maps, Crunchbase, Product Hunt, Wellfound, YC, and more. One search across all of them.",
  },
  {
    icon: Sparkles,
    title: "9-Stage AI Enrichment",
    desc: "Company data, person research, verified emails, icebreakers, quality scoring — fully automated at $0.11 per lead.",
  },
  {
    icon: Mail,
    title: "Automated Email Campaigns",
    desc: "Sync enriched leads directly to Instantly.ai. Personalized sequences with 40+ template variables and AI-written icebreakers.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Automation",
    desc: "Connection requests, InMails, and DMs via HeyReach. Same enriched data, same personalization — different channel.",
  },
  {
    icon: GitBranch,
    title: "Visual Sequence Builder",
    desc: "Drag-and-drop flow editor for multi-step campaigns. Mix email, LinkedIn, and delays in one sequence. Deploy with one click.",
  },
  {
    icon: Target,
    title: "CRM Pipeline",
    desc: "Kanban board with 6 stages. Drag deals, track values, log activities. Auto-sync from campaign replies. No separate CRM needed.",
  },
  {
    icon: Database,
    title: "Template Studio",
    desc: "40+ personalization variables, AI rewriting, spam detection, A/B testing. Proven frameworks: AIDA, PAS, BAB built in.",
  },
  {
    icon: BarChart3,
    title: "Cost & Performance Analytics",
    desc: "Real-time cost per lead, enrichment success rates, campaign performance. Know exactly where every dollar goes.",
  },
];

/* ── Enrichment Pipeline Stages ── */
const pipelineStages = [
  { stage: "1", name: "Decision-Maker Discovery", cost: "$0.010", provider: "Claude" },
  { stage: "2", name: "Email Finder", cost: "$0.000", provider: "Reacher" },
  { stage: "3", name: "Company Intelligence", cost: "$0.065", provider: "FireEnrich" },
  { stage: "4", name: "Person Research", cost: "$0.020", provider: "Perplexity" },
  { stage: "5", name: "Data Merger", cost: "$0.000", provider: "Internal" },
  { stage: "6", name: "Icebreaker Generation", cost: "$0.015", provider: "Claude" },
  { stage: "7", name: "Quality Scoring", cost: "$0.000", provider: "Internal" },
  { stage: "8", name: "Email Verification", cost: "$0.001", provider: "Reacher" },
];

/* ── Animated Pipeline ── */
function AnimatedPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-2">
      {pipelineStages.map((s, i) => (
        <motion.div
          key={s.stage}
          initial={{ opacity: 0.4 }}
          animate={inView ? { opacity: 1 } : { opacity: 0.4 }}
          transition={{ duration: 0.4, delay: i * 0.25 }}
          className="relative"
        >
          <motion.div
            initial={{ borderColor: "rgba(255,255,255,0)" }}
            animate={inView ? {
              borderColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0)"],
              backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.04)", "rgba(255,255,255,0)"],
            } : {}}
            transition={{ duration: 1.2, delay: i * 0.25, ease: "easeInOut" }}
            className="flex items-center gap-3 p-3 rounded-lg border border-transparent"
          >
            <span className="text-[10px] font-mono text-neutral-600 w-4">{s.stage}</span>
            <span className="text-xs sm:text-sm text-white flex-1">{s.name}</span>
            <span className="text-[10px] font-mono text-neutral-500">{s.provider}</span>
            <span className="text-[10px] font-mono text-neutral-400 w-14 text-right">{s.cost}</span>
          </motion.div>
        </motion.div>
      ))}
      <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between px-3">
        <span className="text-xs text-neutral-400">Total per lead</span>
        <span className="text-sm font-medium text-white">$0.111</span>
      </div>
    </div>
  );
}

/* ── Cost Comparison ── */
const stackedCosts = [
  { name: "Apollo", price: 99 },
  { name: "Instantly", price: 75 },
  { name: "Clay", price: 149 },
  { name: "HeyReach", price: 70 },
  { name: "CRM Tool", price: 49 },
];

/* ── Testimonials ── */
const testimonials = [
  {
    quote: "We used to spend $400/month on Apollo + Instantly + Clay separately. LeadGenOS replaced all three and our reply rate went up 40%.",
    name: "Mike R.",
    role: "Founder",
    company: "Outbound Agency",
  },
  {
    quote: "The enrichment pipeline is insane. $0.11 per lead and each one comes with company data, icebreakers, and verified email. We booked 23 meetings last month.",
    name: "Lisa T.",
    role: "Head of Sales",
    company: "SaaS Company",
  },
];

/* ── Card class helper ── */
const cardClass =
  "p-6 sm:p-8 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300";

export default function WaitlistPage() {
  const params = useSearchParams();
  const variant = params.get("v") || "default";
  const { pill, h1, sub } = headlines[variant] || headlines.default;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden dark">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-[200px] -left-[200px] rounded-full bg-white/[0.03] blur-[180px] animate-[drift1_20s_ease-in-out_infinite]" />
        <div className="absolute w-[600px] h-[600px] top-[30%] -right-[150px] rounded-full bg-white/[0.025] blur-[160px] animate-[drift2_25s_ease-in-out_infinite]" />
        <div className="absolute w-[700px] h-[700px] -bottom-[100px] left-[30%] rounded-full bg-white/[0.02] blur-[200px] animate-[drift3_22s_ease-in-out_infinite]" />
      </div>

      {/* Noise */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      <style jsx>{`
        @keyframes drift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(80px, 60px) scale(1.1); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-60px, -80px) scale(0.9); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(50px, -40px) scale(1.05); } }
      `}</style>

      <FloatingCTA />

      <main className="relative z-10">
        {/* ═══ HERO + FORM ═══ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-24 pt-14 sm:pt-16 pb-10 sm:pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400">
                {pill}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mt-6 mb-5 sm:mb-4 leading-[1.15] tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent pb-2 whitespace-pre-line">
              {h1}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 sm:mb-8">
              {sub}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-[340px] mx-auto">
              <WaitlistForm variant={variant} />
            </motion.div>

            {/* Screenshot */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 sm:mt-10 relative">
              <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50 bg-[#050505]">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0a] border-b border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <div className="flex-1 mx-3 h-5 rounded bg-white/[0.04]" />
                </div>
                <img src="/screen-leadfinder.png" alt="LeadGenOS Dashboard" className="w-full aspect-[16/10] object-cover object-top" />
              </div>
            </motion.div>

            {/* ── Social Proof Strip ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 border-t border-b border-white/[0.04] py-8">
              <p className="text-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-6">
                Trusted by sales teams at
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-12 opacity-30">
                {["Velocity", "Meridian", "Stratosphere", "Uplift", "Nexus"].map((name) => (
                  <span key={name} className="text-sm sm:text-base font-semibold text-white tracking-tight">{name}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16">
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                How It Works
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                From zero to outreach in 4 steps.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: "01", icon: Search, title: "Find Leads", desc: "Search across 13+ sources — LinkedIn, Apollo, Google Maps, Crunchbase, job boards. One query, thousands of leads." },
                { step: "02", icon: Sparkles, title: "AI Enriches", desc: "9-stage pipeline adds company data, verified emails, person research, and AI-written icebreakers. $0.11 per lead." },
                { step: "03", icon: Mail, title: "Launch Campaigns", desc: "Sync to Instantly.ai or HeyReach with one click. Personalized sequences across email and LinkedIn." },
                { step: "04", icon: Target, title: "Close in CRM", desc: "Replies auto-sync to your pipeline. Track deals, log activities, manage from lead to close." },
              ].map((s, i) => (
                <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative ${cardClass}`}>
                  <span className="text-[10px] font-mono text-neutral-600 mb-3 block">{s.step}</span>
                  <div className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
                    <s.icon size={16} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CAPABILITIES ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16">
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                Everything You Need
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                One platform replaces your entire outbound stack.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {capabilities.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={cardClass}>
                  <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
                    <f.icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-white mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ENRICHMENT PIPELINE ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-5">
                  AI Enrichment
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-4">
                  9 stages. $0.11 per lead. Fully automated.
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
                  Every lead goes through a 9-stage AI pipeline that finds decision-makers, discovers emails, researches the company, and writes personalized icebreakers — all before you touch it.
                </p>
                <div className="space-y-3">
                  {[
                    "Decision-maker discovery via AI",
                    "Email finding + verification",
                    "Company intelligence (funding, tech stack, leadership)",
                    "Person research across 5 areas",
                    "AI-generated icebreakers with confidence scores",
                    "Quality scoring — green / yellow / red",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />
                      <span className="text-xs sm:text-sm text-neutral-400">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <AnimatedPipeline />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                What Teams Are Saying
              </span>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className={cardClass}>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.role} &mdash; {t.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COST COMPARISON ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                Cost Breakdown
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                Stop paying $442/month for 5 tools.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Left: Stacked costs */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-5">Your current stack</p>
                <div className="space-y-3">
                  {stackedCosts.map((tool) => (
                    <div key={tool.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-sm text-neutral-400">{tool.name}</span>
                      <span className="text-sm text-neutral-400 line-through">${tool.price}/mo</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-sm text-neutral-300 font-medium">Total</span>
                  <span className="text-lg font-semibold text-white line-through decoration-red-500/60">$442/mo</span>
                </div>
              </motion.div>

              {/* Right: LeadGenOS */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="rounded-xl border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white mb-5">
                  <Zap size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">LeadGenOS</h3>
                <p className="text-sm text-neutral-400 mb-4 max-w-xs">
                  Everything above in one platform. One login, one bill, one dashboard.
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">One</span>
                  <span className="text-lg text-neutral-400">platform</span>
                </div>
                <p className="text-xs text-neutral-500 mt-3">Early access pricing coming soon</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ COMPARISON TABLE ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                Stop paying for 5 tools.
              </h2>
              <p className="text-sm sm:text-lg text-neutral-400 mt-3 max-w-xl mx-auto">
                Apollo for scraping. Instantly for email. HeyReach for LinkedIn. Clay for enrichment. A CRM on top. Or just use one platform.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-xl border border-white/[0.06] overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-neutral-500 font-mono text-[10px] sm:text-xs uppercase tracking-wider">Feature</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-neutral-500 font-mono text-[10px] sm:text-xs uppercase tracking-wider">Others</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider">LeadGenOS</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-400">
                  {[
                    ["13+ lead sources", "1-2", "\u2713"],
                    ["AI enrichment ($0.11/lead)", "\u2014", "\u2713"],
                    ["Email campaigns (Instantly)", "Separate tool", "\u2713"],
                    ["LinkedIn automation (HeyReach)", "Separate tool", "\u2713"],
                    ["Visual sequence builder", "\u2014", "\u2713"],
                    ["CRM pipeline", "Separate tool", "\u2713"],
                    ["Template studio + AI rewriting", "Basic", "\u2713"],
                    ["Per-lead cost tracking", "\u2014", "\u2713"],
                  ].map(([feature, others, us]) => (
                    <tr key={feature} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3 text-white">{feature}</td>
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3">{others}</td>
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3 text-white">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.04]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-[340px] mx-auto text-center">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4 leading-tight">
              Ready to fill your pipeline?
            </h2>
            <p className="text-sm sm:text-lg text-neutral-400 mb-8 sm:mb-10">
              Join the waitlist. Be first to get access.
            </p>
            <WaitlistForm variant={variant} />
          </motion.div>
        </section>

        {/* Footer */}
        <div className="border-t border-white/[0.06] py-6 px-4 text-center">
          <p className="text-xs text-neutral-600">LeadGenOS by Node Agency</p>
        </div>
      </main>
    </div>
  );
}
