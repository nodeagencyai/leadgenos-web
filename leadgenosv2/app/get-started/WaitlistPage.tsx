"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  Sparkles,
  Mail,
  Linkedin,
  BarChart3,
  Database,
  Zap,
  Target,
  GitBranch,
  Rocket,
  Briefcase,
  Users,
  X as XIcon,
  Check,
} from "lucide-react";

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
      className="block w-full"
    >
      {children}
    </motion.div>
  );
}

/* ── ⌘K craft-signal badge ── */
function CommandHint() {
  return (
    <div
      className="hidden sm:flex fixed top-4 right-4 z-40 items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm"
      aria-hidden="true"
    >
      <kbd className="text-[10px] font-mono text-white/60 leading-none">⌘</kbd>
      <kbd className="text-[10px] font-mono text-white/60 leading-none">K</kbd>
    </div>
  );
}

/* ── Urgency strip (generic — no fake counter per research) ── */
function UrgencyStrip() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>Early access &mdash; limited slots this cohort</span>
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
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Magnetic>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-sm font-medium shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:bg-white/90 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
              Get Early Access
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Headlines (variant-driven) ──
   Hero uses Pattern A (Linear: sentence H1 + sub + product below fold).
   All variants lead with the $442 stack-collapse wedge per research. */
const headlines: Record<string, { pill: string; h1: ReactNode; sub: string }> = {
  scrape: {
    pill: "13+ Lead Sources · One Platform",
    h1: (
      <>
        Replace your <span className="text-emerald-400">$442/mo</span> sales stack.
        <br />
        Pay <span className="text-emerald-400">$0.11</span> per verified lead.
      </>
    ),
    sub: "LinkedIn, Apollo, Google Maps, Crunchbase and 9 more — searched, enriched, and ready for outreach from one dashboard.",
  },
  enrich: {
    pill: "$0.11 per Enriched Lead",
    h1: (
      <>
        Verified emails, icebreakers,
        <br />
        company research &mdash; for <span className="text-emerald-400">11&cent;</span>.
      </>
    ),
    sub: "A 9-stage AI pipeline runs on every lead: decision-maker discovery, email verification, company intel, icebreakers, quality score. Pay what it costs, not a subscription markup.",
  },
  alt: {
    pill: "Stop Paying for 5 Tools",
    h1: (
      <>
        One platform. <span className="text-emerald-400">$442</span> saved.
        <br />
        Every month.
      </>
    ),
    sub: "Apollo for data. Instantly for email. Clay for enrichment. HeyReach for LinkedIn. A CRM on top. Or just LeadGenOS — $0.11 per lead, everything included.",
  },
  default: {
    pill: "All-in-One Outbound · $0.11/lead",
    h1: (
      <>
        Replace your <span className="text-emerald-400">$442/mo</span> sales stack.
        <br />
        Pay <span className="text-emerald-400">$0.11</span> per verified lead.
      </>
    ),
    sub: "One platform for leads, enrichment, outreach, and CRM. Built for founders and outbound teams who want results, not subscriptions.",
  },
};

/* ── Form ── */
function WaitlistForm({ variant, magnetic = false }: { variant: string; magnetic?: boolean }) {
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
        body: JSON.stringify({
          email,
          name,
          source: "google-ads",
          variant,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          product: "leadgenos",
        }),
      });
    } catch {
      /* still show success */
    }
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">You&apos;re on the list.</h2>
        <p className="text-sm text-neutral-400">We&apos;ll reach out when your spot is ready.</p>
      </motion.div>
    );
  }

  const submitBtn = (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 active:bg-white/80 transition-all disabled:opacity-50 min-h-[44px] mt-2 shadow-[0_0_0_0_rgba(16,185,129,0)] hover:shadow-[0_8px_32px_-4px_rgba(16,185,129,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      {loading ? "Joining..." : "Get Early Access"}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.05em] block">Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 p-3.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
        />
      </div>
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.05em] block">Work Email</label>
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 p-3.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
        />
      </div>
      {magnetic ? <Magnetic strength={0.2}>{submitBtn}</Magnetic> : submitBtn}
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

/* ── Animated Pipeline ──
   Emerald dot added per research: single accent on active stage. */
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
            animate={
              inView
                ? {
                    borderColor: ["rgba(255,255,255,0)", "rgba(52,211,153,0.2)", "rgba(255,255,255,0)"],
                    backgroundColor: ["rgba(255,255,255,0)", "rgba(52,211,153,0.04)", "rgba(255,255,255,0)"],
                  }
                : {}
            }
            transition={{ duration: 1.2, delay: i * 0.25, ease: "easeInOut" }}
            className="flex items-center gap-3 p-3 rounded-lg border border-transparent"
          >
            <motion.span
              initial={{ backgroundColor: "rgba(115,115,115,1)" }}
              animate={
                inView
                  ? {
                      backgroundColor: [
                        "rgba(115,115,115,1)",
                        "rgba(52,211,153,1)",
                        "rgba(115,115,115,1)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.2, delay: i * 0.25, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
            />
            <span className="text-[10px] font-mono text-neutral-600 w-4">{s.stage}</span>
            <span className="text-xs sm:text-sm text-white flex-1">{s.name}</span>
            <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">{s.provider}</span>
            <span className="text-[10px] font-mono text-neutral-400 w-14 text-right">{s.cost}</span>
          </motion.div>
        </motion.div>
      ))}
      <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between px-3">
        <span className="text-xs text-neutral-400">Total per lead</span>
        <span className="text-sm font-medium text-emerald-400">$0.111</span>
      </div>
    </div>
  );
}

/* ── Stack Dissolve section ──
   Research: Option 1, highest-impact new visual.
   Five competitor cards collapse / fade out as the single LeadGenOS card scales in. */
const stackTools = [
  { name: "Apollo", price: 99, tag: "Data" },
  { name: "Instantly", price: 75, tag: "Email" },
  { name: "Clay", price: 149, tag: "Enrichment" },
  { name: "HeyReach", price: 70, tag: "LinkedIn" },
  { name: "CRM Tool", price: 49, tag: "Pipeline" },
];

function StackDissolve() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left: stacked competitor tools with strikethrough X */}
      <div className="relative">
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4">What you&apos;re paying for</p>
        <div className="space-y-2.5">
          {stackTools.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center justify-between overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm text-white font-medium shrink-0">{t.name}</span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
                  {t.tag}
                </span>
              </div>
              <span className="text-sm text-neutral-400 font-mono">${t.price}/mo</span>

              {/* Strikethrough sweep */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.45, delay: 0.9 + i * 0.1, ease: "easeOut" }}
                style={{ transformOrigin: "left center" }}
                className="absolute left-4 right-4 top-1/2 h-px bg-red-400/50"
              />
              {/* Dim once crossed out */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.5 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}
                className="absolute inset-0 bg-black/30 pointer-events-none"
              />
              {/* Tiny X in the corner once crossed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, delay: 1.1 + i * 0.1 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-400/20 border border-red-400/40 flex items-center justify-center"
                aria-hidden="true"
              >
                <XIcon size={8} className="text-red-300" strokeWidth={3} />
              </motion.div>
            </motion.div>
          ))}

          {/* Total */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.6 }}
            className="pt-4 mt-2 border-t border-white/[0.08] flex items-center justify-between px-1"
          >
            <span className="text-sm text-neutral-400">Monthly total</span>
            <span className="text-lg font-semibold text-white line-through decoration-red-400/60 decoration-[1.5px]">
              $442/mo
            </span>
          </motion.div>
        </div>
      </div>

      {/* Right: single LeadGenOS card, scales in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, delay: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative"
      >
        <div className="relative rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 sm:p-10 text-center overflow-hidden">
          {/* Soft emerald halo */}
          <div className="absolute inset-0 bg-emerald-400/5 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative">
            <div className="inline-flex w-14 h-14 rounded-xl border border-emerald-400/30 bg-emerald-400/10 items-center justify-center text-emerald-400 mb-5">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest mb-2">
              One platform
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">LeadGenOS</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Leads, enrichment, email, LinkedIn, and CRM. One login. One bill.
            </p>
            <div className="inline-flex items-baseline gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2">
              <span className="text-2xl font-semibold text-emerald-400">$0.11</span>
              <span className="text-xs text-emerald-400/80 font-mono uppercase tracking-wider">per verified lead</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-4">
              1,000 leads &rarr; $110 &nbsp;·&nbsp; 5,000 leads &rarr; $550
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── ICP cards ── */
const icps: Array<{
  icon: typeof Rocket;
  title: string;
  pain: string;
  outcome: ReactNode;
}> = [
  {
    icon: Rocket,
    title: "Founders",
    pain: "Skip the SDR. Sign your first 50 customers.",
    outcome: "Run LeadGenOS 30 min/day. Book 5-10 meetings a week without a subscription stack.",
  },
  {
    icon: Briefcase,
    title: "Agencies",
    pain: "Deliver outbound at scale. Stop stitching tools.",
    outcome: (
      <>
        10 client accounts on one platform. $4,420 of stack cost &rarr; 1/10th, 10&times; the margin.
      </>
    ),
  },
  {
    icon: Users,
    title: "Sales teams",
    pain: "Cut your stack. Keep your quota.",
    outcome: "Consolidate 5 subscriptions. Know your cost-per-lead to the penny. Report it clean.",
  },
];

/* ── Objections ── */
const objections: Array<{ q: string; a: ReactNode }> = [
  {
    q: "Isn't $0.11 per lead expensive?",
    a: "Apollo charges $0.05 for one data call. We charge $0.11 for a verified, enriched, icebreaker-ready lead. That's 9 stages of work for 2× the price of one.",
  },
  {
    q: "What if leads bounce?",
    a: "We only charge for verified emails. If it bounces, you don't pay. Stage 8 of the pipeline runs before you ever see the lead.",
  },
  {
    q: "How is this different from Clay?",
    a: (
      <>
        Clay is a builder&apos;s tool &mdash; spreadsheets, columns, waterfall logic. LeadGenOS is a finished platform.
        Search, enrich, sequence, and close. No table-building required.
      </>
    ),
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

      {/* Noise — bumped to 0.035 per research */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        @keyframes drift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(80px, 60px) scale(1.1); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-60px, -80px) scale(0.9); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(50px, -40px) scale(1.05); } }
      `}</style>

      <CommandHint />
      <FloatingCTA />

      <main className="relative z-10">
        {/* ═══ HERO + FORM (Pattern A — Linear: sentence + sub + product below) ═══ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-24 pt-14 sm:pt-16 pb-10 sm:pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400">
                {pill}
              </span>
            </motion.div>

            {/* H1 — gradient bumped from /50 to /70 per research (descender clipping fix) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mt-6 mb-5 sm:mb-5 leading-[1.15] tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-2"
            >
              {h1}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 sm:mb-8"
            >
              {sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-[340px] mx-auto"
            >
              <WaitlistForm variant={variant} magnetic />
            </motion.div>

            {/* Below-fold product proof: AnimatedPipeline promoted to hero-proximity per research */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-14 sm:mt-16 relative"
            >
              <div className="max-w-3xl mx-auto">
                <p className="text-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-5">
                  What $0.11 actually buys
                </p>
                <AnimatedPipeline />
              </div>
            </motion.div>

            {/* Scroll indicator chevron (micro-luxury) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4, y: [0, 6, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1.2 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
              }}
              className="mt-14 sm:mt-16 inline-flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest"
              aria-hidden="true"
            >
              <span>Scroll to see the stack math</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </section>

        {/* ═══ STACK DISSOLVE — five tools → one platform ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                The Math
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                Five tools. One platform. One-tenth the cost.
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-xl mx-auto">
                You&apos;re paying $442/mo for five disconnected SaaS products. Here&apos;s what that actually looks like.
              </p>
            </motion.div>

            <StackDissolve />
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                How It Works
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                Four steps from search to booked meeting.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: "01", icon: Search, title: "Find Leads", desc: "Search across 13+ sources — LinkedIn, Apollo, Google Maps, Crunchbase, job boards. One query, thousands of leads." },
                { step: "02", icon: Sparkles, title: "AI Enriches", desc: "9-stage pipeline adds company data, verified emails, person research, and AI-written icebreakers. $0.11 per lead." },
                { step: "03", icon: Mail, title: "Launch Campaigns", desc: "Sync to Instantly.ai or HeyReach with one click. Personalized sequences across email and LinkedIn." },
                { step: "04", icon: Target, title: "Close in CRM", desc: "Replies auto-sync to your pipeline. Track deals, log activities, manage from lead to close." },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative ${cardClass}`}
                >
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
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                Everything You Need
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                The $442/mo stack, rebuilt as one platform.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {capabilities.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={cardClass}
                >
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

        {/* ═══ ENRICHMENT PIPELINE DEEP-DIVE ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-5">
                  AI Enrichment
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-4 pb-1">
                  9 stages. $0.11 per lead. Every cent accounted for.
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
                  Every lead goes through a 9-stage AI pipeline that finds decision-makers, discovers emails, researches the company, and writes personalized icebreakers &mdash; all before you touch it.
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
                      <span className="w-1 h-1 rounded-full bg-emerald-400/70 mt-2 shrink-0" />
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

        {/* ═══ BUILT FOR THREE PEOPLE (ICP) ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                Built For
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                You already know which one you are.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {icps.map((i, idx) => (
                <motion.div
                  key={i.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={cardClass}
                >
                  <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
                    <i.icon size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">{i.title}</p>
                  <h3 className="text-base sm:text-lg font-medium text-white mb-3 leading-snug">{i.pain}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{i.outcome}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COMPARISON TABLE ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                Feature by feature.
              </h2>
              <p className="text-sm sm:text-lg text-neutral-400 mt-3 max-w-xl mx-auto">
                Apollo for data. Instantly for email. HeyReach for LinkedIn. Clay for enrichment. A CRM on top. Or one platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-white/[0.06] overflow-hidden"
            >
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-neutral-500 font-mono text-[10px] sm:text-xs uppercase tracking-wider">Feature</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-neutral-500 font-mono text-[10px] sm:text-xs uppercase tracking-wider">Others</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider">LeadGenOS</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-400">
                  {(
                    [
                      ["13+ lead sources", "1-2"],
                      ["AI enrichment ($0.11/lead)", "\u2014"],
                      ["Email campaigns (Instantly)", "Separate tool"],
                      ["LinkedIn automation (HeyReach)", "Separate tool"],
                      ["Visual sequence builder", "\u2014"],
                      ["CRM pipeline", "Separate tool"],
                      ["Template studio + AI rewriting", "Basic"],
                      ["Per-lead cost tracking", "\u2014"],
                    ] as Array<[string, string]>
                  ).map(([feature, others]) => (
                    <tr key={feature} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3 text-white">{feature}</td>
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3">{others}</td>
                      <td className="px-4 sm:px-6 py-2.5 sm:py-3">
                        <Check size={14} strokeWidth={2.5} className="text-emerald-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ═══ OBJECTION HANDLER ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="inline-flex items-center px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest border border-white/10 text-neutral-400 mb-6">
                The Obvious Questions
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-1">
                Answered before you ask.
              </h2>
            </motion.div>

            <div className="space-y-3">
              {objections.map((o, i) => (
                <motion.div
                  key={o.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7"
                >
                  <h3 className="text-sm sm:text-base font-medium text-white mb-2.5 flex items-start gap-2">
                    <span className="text-emerald-400/70 font-mono text-xs shrink-0 mt-0.5">Q.</span>
                    <span>{o.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pl-5">{o.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-[340px] mx-auto text-center"
          >
            <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4 leading-tight">
              1,000 enriched leads.
              <br />
              <span className="text-emerald-400">$110</span>. This month.
            </h2>
            <p className="text-sm sm:text-lg text-neutral-400 mb-8 sm:mb-10">
              Join the waitlist. No card. No contract.
            </p>
            <WaitlistForm variant={variant} magnetic />
          </motion.div>
        </section>

        {/* Footer */}
        <div className="border-t border-white/[0.06] py-6 px-4 text-center">
          <p className="text-xs text-neutral-600">
            LeadGenOS by Node Agency &middot; Built for founders who hate the stack.
          </p>
        </div>
      </main>
    </div>
  );
}
