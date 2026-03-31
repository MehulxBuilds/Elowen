"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  Send,
  ArrowRight,
  Zap,
  Brain,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

interface StatCardProps {
  value: string;
  label: string;
  sub: string;
  index: number;
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  handle: string;
  avatar: { from: string; to: string; emoji: string };
}

// ─── Constants ───────────────────────────────────────────────

const TESTIMONIALS: TestimonialCardProps[] = [
  {
    quote:
      "Replaced 3 different AI apps. Elowen just lives in Telegram where I already am. Genuinely game-changing.",
    name: "Priya K.",
    handle: "@priyabuilds",
    avatar: { from: "#F4500A", to: "#C8003A", emoji: "🌸" },
  },
  {
    quote:
      "The context memory is wild. Came back 4 days later and it remembered exactly what we were working on.",
    name: "Marcus T.",
    handle: "@marcus_dev",
    avatar: { from: "#7C3AED", to: "#4F46E5", emoji: "⚡" },
  },
  {
    quote:
      "Honestly thought all Telegram bots were trash. Elowen proved me very, very wrong.",
    name: "Sasha L.",
    handle: "@sashacreates",
    avatar: { from: "#059669", to: "#0284C7", emoji: "🎯" },
  },
  {
    quote:
      "I use it every single day. Writes emails, helps me think through problems, researches things instantly.",
    name: "Devon W.",
    handle: "@devon_w",
    avatar: { from: "#D97706", to: "#DC2626", emoji: "🦊" },
  },
  {
    quote:
      "Lightning fast and actually understands context. This is what AI assistants should feel like.",
    name: "Nour A.",
    handle: "@nouradesign",
    avatar: { from: "#0EA5E9", to: "#6366F1", emoji: "✨" },
  },
  {
    quote:
      "Set it up in literally 10 seconds. No new app, no account — just started chatting.",
    name: "Jake F.",
    handle: "@jakefoster",
    avatar: { from: "#F43F5E", to: "#EC4899", emoji: "🚀" },
  },
];

const STATS: Omit<StatCardProps, "index">[] = [
  { value: "2,400+", label: "Active users", sub: "and growing daily" },
  { value: "~120ms", label: "Avg response time", sub: "real-time streaming" },
  { value: "99.9%", label: "Uptime", sub: "enterprise reliability" },
];

const FEATURES: Omit<FeatureCardProps, "index">[] = [
  {
    icon: <MessageCircle size={22} color="#F4500A" />,
    title: "Native to Telegram",
    description:
      "No extra apps, no new accounts. Search Elowen in Telegram and start talking instantly — zero friction from thought to answer.",
  },
  {
    icon: <Zap size={22} color="#F4500A" />,
    title: "Lightning Fast",
    description:
      "Built on an optimized Turborepo backend that streams responses in real-time. You'll feel the difference on your very first message.",
  },
  {
    icon: <Brain size={22} color="#F4500A" />,
    title: "Remembers Everything",
    description:
      "Elowen maintains context across conversations. Come back days later and pick up exactly where you left off — like a real assistant.",
  },
];

// ─── Variants ─────────────────────────────────────────────────

const easing = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: easing },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const messagePop = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.55, duration: 0.5, ease: easing },
  }),
};

// ─── Inline styles ─────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080808; color: #E8E0D8; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  * { -webkit-font-smoothing: antialiased; }

  :root {
    --orange: #F4500A;
    --red: #C8003A;
    --bg: #080808;
    --muted: #6B6460;
    --border: rgba(255,255,255,0.07);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 8px 30px rgba(244,80,10,0.3); }
    50%      { box-shadow: 0 8px 60px rgba(244,80,10,0.6); }
  }
  @keyframes dotPulse {
    0%,100% { transform: scale(1); opacity: 0.6; }
    50%      { transform: scale(1.6); opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes orbDrift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(50px,-35px) scale(1.08); }
    70%     { transform: translate(-25px,45px) scale(0.94); }
  }
  @keyframes orbDrift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    35%     { transform: translate(-45px,28px) scale(0.92); }
    65%     { transform: translate(38px,-55px) scale(1.06); }
  }

  .marquee-track { animation: marquee 30s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  .shimmer-text {
    background: linear-gradient(90deg, #E8E0D8 0%, #fff 38%, #F4500A 50%, #fff 62%, #E8E0D8 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .orb-1 { animation: orbDrift1 14s ease-in-out infinite; }
  .orb-2 { animation: orbDrift2 18s ease-in-out infinite; }

  .online-dot {
    display: inline-block; width: 8px; height: 8px;
    border-radius: 50%; background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: dotPulse 2s ease-in-out infinite;
  }

  .dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(244,80,10,0.28) 30%, rgba(244,80,10,0.28) 70%, transparent 100%);
  }
`;

// ─── Logo ─────────────────────────────────────────────────────

const Logo: React.FC<{ size?: number; white?: boolean }> = ({ size = 24, white = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 40 40">
    <path fill={white ? "#fff" : "#F4500A"} d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z" />
    <path fill={white ? "#fff" : "#F4500A"} d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
  </svg>
);

// ─── Magnetic Button ──────────────────────────────────────────

const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, style, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ ...style, x: springX, y: springY, cursor: "pointer", border: "none", fontFamily: "var(--font-body)" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// ─── Phone Mockup ─────────────────────────────────────────────

const PhoneMockup: React.FC = () => {
  const messages = [
    { type: "user", text: "Write a polite decline for tomorrow's meeting. I'm swamped.", time: "2:14 PM" },
    { type: "typing" },
    {
      type: "bot",
      text: (
        <>
          <p style={{ marginBottom: 8 }}>Here you go ✨</p>
          <div style={{
            borderLeft: "2px solid #F4500A",
            paddingLeft: 10,
            color: "#999",
            fontSize: 12,
            fontStyle: "italic",
            lineHeight: 1.5,
            background: "rgba(244,80,10,0.04)",
            padding: "8px 10px",
            borderRadius: "0 8px 8px 0",
            marginBottom: 8,
          }}>
            "Hi [Name], I'm heads-down on deadlines tomorrow and can't make it. Could we find a slot later this week?"
          </div>
          <p style={{ fontSize: 11.5, color: "#666" }}>Want me to adjust the tone? 🎯</p>
        </>
      ),
      time: "2:14 PM",
    },
    { type: "chips" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: -20,
        background: "radial-gradient(ellipse at 50% 60%, rgba(244,80,10,0.22) 0%, transparent 70%)",
        filter: "blur(20px)", pointerEvents: "none", zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 1, perspective: 1000 }}
      >
        {/* Shell */}
        <div style={{
          background: "linear-gradient(160deg, #222 0%, #111 100%)",
          borderRadius: 44,
          padding: 10,
          boxShadow: "0 48px 96px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          {/* Screen */}
          <div style={{
            background: "#0a0a0a",
            borderRadius: 36,
            overflow: "hidden",
            height: 620,
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            {/* Status bar */}
            <div style={{ padding: "14px 22px 6px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", fontWeight: 600 }}>
              <span>9:41</span>
              <div style={{ width: 80, height: 18, background: "#151515", borderRadius: 9 }} />
              <span>100%</span>
            </div>

            {/* Header */}
            <div style={{
              padding: "10px 16px 12px",
              background: "rgba(244,80,10,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "linear-gradient(135deg, #F4500A, #C8003A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(244,80,10,0.45)", flexShrink: 0,
              }}>
                <Logo size={20} white />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: 14 }}>Elowen AI</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                    padding: "2px 6px", borderRadius: 4,
                    background: "rgba(244,80,10,0.18)", color: "#F4500A", border: "1px solid rgba(244,80,10,0.3)",
                  }}>BOT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <span className="online-dot" />
                  <span style={{ fontSize: 11, color: "#22c55e" }}>online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, padding: "16px 14px",
              display: "flex", flexDirection: "column", gap: 12,
              overflowY: "hidden",
              background: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.012) 28px)",
            }}>
              <div style={{ textAlign: "center", fontSize: 10, color: "#3a3a3a" }}>
                <span style={{ padding: "3px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>Today · 2:14 PM</span>
              </div>

              {messages.map((msg, i) => {
                if (msg.type === "user") return (
                  <motion.div key={i} custom={i} variants={messagePop} initial="hidden" animate="visible" style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
                    <div style={{
                      background: "linear-gradient(135deg, #F4500A, #C8003A)",
                      color: "#fff", borderRadius: "18px 18px 4px 18px",
                      padding: "10px 14px", fontSize: 12.5, lineHeight: 1.55,
                      boxShadow: "0 4px 18px rgba(244,80,10,0.38)",
                    }}>{msg.text as string}</div>
                    <div style={{ fontSize: 9, color: "#333", textAlign: "right", marginTop: 3 }}>{msg.time} ✓✓</div>
                  </motion.div>
                );

                if (msg.type === "typing") return (
                  <motion.div key={i} custom={i} variants={messagePop} initial="hidden" animate="visible"
                    style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #F4500A, #C8003A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🌿</div>
                    <div style={{
                      background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "18px 18px 18px 4px", padding: "10px 14px",
                      display: "flex", gap: 5, alignItems: "center",
                    }}>
                      {[0, 0.15, 0.3].map((d, j) => (
                        <motion.div key={j}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: "easeInOut" }}
                          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(244,80,10,0.7)" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                );

                if (msg.type === "bot") return (
                  <motion.div key={i} custom={i} variants={messagePop} initial="hidden" animate="visible"
                    style={{ alignSelf: "flex-start", maxWidth: "88%", display: "flex", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #F4500A, #C8003A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>🌿</div>
                    <div>
                      <div style={{
                        background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "18px 18px 18px 4px", padding: "12px 14px",
                        fontSize: 12.5, lineHeight: 1.6, color: "#ccc",
                      }}>{msg.text as React.ReactNode}</div>
                      <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>{msg.time}</div>
                    </div>
                  </motion.div>
                );

                if (msg.type === "chips") return (
                  <motion.div key={i} custom={i} variants={messagePop} initial="hidden" animate="visible"
                    style={{ alignSelf: "flex-start", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["More formal", "Add reason", "Shorter ✂️"].map((t) => (
                      <motion.button key={t} whileHover={{ scale: 1.05, background: "rgba(244,80,10,0.16)" }} whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "5px 12px", borderRadius: 100,
                          border: "1px solid rgba(244,80,10,0.35)",
                          background: "rgba(244,80,10,0.07)", color: "#F4500A",
                          fontSize: 11, fontWeight: 500, cursor: "pointer",
                          fontFamily: "var(--font-body)",
                        }}>{t}</motion.button>
                    ))}
                  </motion.div>
                );

                return null;
              })}
            </div>

            {/* Input */}
            <div style={{
              padding: "10px 12px", background: "#0e0e0e",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                flex: 1, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 22, padding: "9px 16px", fontSize: 12, color: "#3a3a3a",
                fontFamily: "var(--font-body)",
              }}>Message Elowen…</div>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #F4500A, #C8003A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 4px 14px rgba(244,80,10,0.45)", flexShrink: 0,
              }}>
                <Send size={15} color="#fff" style={{ marginLeft: 1 }} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
        transition={{
          opacity: { delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          x: { delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
        style={{
          position: "absolute", top: 70, left: -56, zIndex: 10,
          background: "rgba(14,14,14,0.95)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
          padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ width: 36, height: 36, background: "rgba(244,80,10,0.12)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brain size={18} color="#F4500A" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)" }}>Memory</div>
          <div style={{ fontSize: 10, color: "#555" }}>Persistent context</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          x: { delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
        }}
        style={{
          position: "absolute", bottom: 110, right: -52, zIndex: 10,
          background: "rgba(14,14,14,0.95)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
          padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ width: 36, height: 36, background: "rgba(244,80,10,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={18} color="#F4500A" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)" }}>~120ms</div>
          <div style={{ fontSize: 10, color: "#555" }}>Avg. response</div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({ value, label, sub, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      variants={fadeUp}
      style={{
        padding: "28px 32px", borderRadius: 20, textAlign: "center",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 46, lineHeight: 1,
        background: "linear-gradient(135deg, #fff 0%, #F4500A 100%)",
        WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{value}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#E8E0D8", marginTop: 8 }}>{label}</div>
      <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{sub}</div>
    </motion.div>
  );
};

// ─── Feature Card ─────────────────────────────────────────────

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -6, borderColor: "rgba(244,80,10,0.35)", background: "rgba(244,80,10,0.03)" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: 32, borderRadius: 24, cursor: "default", position: "relative", overflow: "hidden",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 120, height: 120, borderRadius: "50%",
        background: "rgba(244,80,10,0.08)", filter: "blur(40px)", pointerEvents: "none",
      }} />
      <motion.div
        whileHover={{ scale: 1.12, background: "rgba(244,80,10,0.14)" }}
        transition={{ duration: 0.25 }}
        style={{
          width: 52, height: 52, borderRadius: 16,
          background: "rgba(244,80,10,0.09)", border: "1px solid rgba(244,80,10,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}
      >{icon}</motion.div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#6B6460" }}>{description}</p>
    </motion.div>
  );
};

// ─── Testimonial Card ─────────────────────────────────────────

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, handle, avatar }) => (
  <div style={{
    padding: 24, borderRadius: 20, flexShrink: 0, width: 300,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
  }}>
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="#F4500A" color="#F4500A" />)}
    </div>
    <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#888", marginBottom: 16, fontStyle: "italic" }}>"{quote}"</p>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: `linear-gradient(135deg, ${avatar.from}, ${avatar.to})`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
      }}>{avatar.emoji}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D8" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#555" }}>{handle}</div>
      </div>
    </div>
  </div>
);

// ─── Cursor Glow ──────────────────────────────────────────────

const CursorGlow: React.FC = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,80,10,0.07) 0%, transparent 70%)",
        translateX: useTransform(springX, (v: number) => v - 200),
        translateY: useTransform(springY, (v: number) => v - 200),
      }}
    />
  );
};

// ─── Main Page ────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Section refs for inView triggers
  const statsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <div style={{ background: "#080808", color: "#E8E0D8", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{globalStyles}</style>
      <CursorGlow />

      {/* Scroll progress bar */}
      <motion.div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 200,
        background: "linear-gradient(90deg, #F4500A, #C8003A)",
        transformOrigin: "0%",
        scaleX: progressScaleX,
      }} />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: 64,
          background: scrolled ? "rgba(8,8,8,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div style={{
          maxWidth: 1180, margin: "0 auto", padding: "0 24px",
          height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            whileHover={{ opacity: 0.8 }}
          >
            <Logo size={26} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Elowen</span>
          </motion.div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.div whileHover={{ color: "#fff" }}>
              {["Features", "Reviews"].map((label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  style={{ fontSize: 13, fontWeight: 500, color: "#6B6460", textDecoration: "none", padding: "6px 14px" }}
                >{label}</Link>
              ))}
            </motion.div>
            <Link href={'/dashboard'}>
              <MagneticButton style={{
                borderRadius: 100,
                background: "linear-gradient(135deg, #F4500A, #C8003A)",
                padding: "9px 20px",
                fontSize: 13, fontWeight: 600, color: "#fff",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 20px rgba(244,80,10,0.3)",
              }}>
                <Send size={13} /> Add to Telegram
              </MagneticButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", padding: "100px 24px 80px", overflow: "hidden",
      }}>
        {/* BG orbs */}
        <div className="orb-1" style={{
          position: "absolute", top: "12%", left: "4%",
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,80,10,0.16) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div className="orb-2" style={{
          position: "absolute", bottom: "8%", right: "4%",
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,0,58,0.12) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6 }} />

        <div style={{
          maxWidth: 1180, margin: "0 auto", width: "100%",
          display: "flex", flexDirection: "row", alignItems: "center", gap: 80,
        }}>
          {/* Left copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ flex: "1 1 500px", minWidth: 0 }}
          >
            <motion.div variants={fadeUp} custom={0} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100, marginBottom: 28,
              background: "rgba(244,80,10,0.1)", border: "1px solid rgba(244,80,10,0.25)",
            }}>
              <Sparkles size={12} color="#F4500A" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#F4500A", letterSpacing: "0.08em", textTransform: "uppercase" }}>Meet your new assistant</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 72px)",
              fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
              color: "#fff", marginBottom: 24,
            }}>
              AI that lives<br />
              <span style={{
                background: "linear-gradient(135deg, #F4500A 0%, #FF8B6B 50%, #C8003A 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>where you chat.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} style={{
              fontSize: 17, lineHeight: 1.8, color: "#6B6460", maxWidth: 480, marginBottom: 40,
            }}>
              Elowen is an AI assistant living inside Telegram. No extra apps, no new tabs — instant, contextual intelligence right where conversations already happen.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
              <Link href={'/dashboard'}>
                <MagneticButton style={{
                  borderRadius: 100,
                  background: "linear-gradient(135deg, #F4500A, #C8003A)",
                  padding: "14px 28px", fontSize: 15, fontWeight: 600, color: "#fff",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 8px 30px rgba(244,80,10,0.35)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}>
                  <Send size={16} /> Start Chatting Free
                </MagneticButton>
              </Link>

              <motion.button
                whileHover={{ borderColor: "rgba(244,80,10,0.4)", background: "rgba(244,80,10,0.05)", x: 2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  borderRadius: 100, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "14px 24px", fontSize: 15, fontWeight: 500, color: "#E8E0D8",
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  display: "flex", alignItems: "center", gap: 8,
                  backdropFilter: "blur(10px)",
                }}
              >
                See how it works <ArrowRight size={16} />
              </motion.button>
            </motion.div>

            {/* Social proof mini */}
            <motion.div variants={fadeUp} custom={4} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {["🌸", "⚡", "🎯", "🦊", "✨"].map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.06 }}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
                      border: "2px solid #080808",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, marginLeft: i > 0 ? -9 : 0,
                      position: "relative", zIndex: 5 - i,
                    }}
                  >{e}</motion.div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={10} fill="#F4500A" color="#F4500A" />)}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>Loved by <span style={{ color: "#E8E0D8", fontWeight: 600 }}>2,400+</span> users</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right mockup */}
          <div style={{ flex: "0 0 auto", position: "relative" }}>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="section-divider" />
      <section ref={statsRef} style={{ padding: "64px 24px", background: "rgba(255,255,255,0.008)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} index={i} />)}
        </div>
      </section>
      <div className="section-divider" />

      {/* ── FEATURES ── */}
      <section id="features" ref={featuresRef} style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <motion.div variants={fadeUp} custom={0} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 100, marginBottom: 20,
              background: "rgba(244,80,10,0.1)", border: "1px solid rgba(244,80,10,0.25)",
            }}>
              <Zap size={12} color="#F4500A" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#F4500A", letterSpacing: "0.08em", textTransform: "uppercase" }}>What makes Elowen different</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 50px)",
              fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 16,
            }}>
              Everything you need.<br />
              <span className="shimmer-text">Nothing you don't.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ fontSize: 16, color: "#6B6460", maxWidth: 460, margin: "0 auto" }}>
              Built to feel more like messaging a real assistant than navigating yet another clunky AI tool.
            </motion.p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <div className="section-divider" />
      <section id="reviews" ref={testimonialsRef} style={{ padding: "100px 0", overflow: "hidden" }}>
        <motion.div
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={staggerContainer}
          style={{ textAlign: "center", marginBottom: 52, padding: "0 24px" }}
        >
          <motion.div variants={fadeUp} custom={0} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 100, marginBottom: 20,
            background: "rgba(244,80,10,0.1)", border: "1px solid rgba(244,80,10,0.25)",
          }}>
            <Star size={12} fill="#F4500A" color="#F4500A" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#F4500A", letterSpacing: "0.08em", textTransform: "uppercase" }}>What users are saying</span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 800, letterSpacing: "-0.03em", color: "#fff",
          }}>Real people. Real results.</motion.h2>
        </motion.div>

        {/* Marquee */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to right, #080808, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: "linear-gradient(to left, #080808, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="marquee-track" style={{ display: "flex", gap: 16, width: "max-content", padding: "8px 0 8px 16px" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{ padding: "120px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(244,80,10,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />

        <motion.div
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={staggerContainer}
          style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} custom={0} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 18px", borderRadius: 100, marginBottom: 28,
            background: "rgba(244,80,10,0.1)", border: "1px solid rgba(244,80,10,0.25)",
          }}>
            <span className="online-dot" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#F4500A", letterSpacing: "0.05em" }}>READY TO START</span>
          </motion.div>

          <motion.h2 variants={fadeUp} custom={1} style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800, letterSpacing: "-0.03em", color: "#fff",
            marginBottom: 20, lineHeight: 1.05,
          }}>
            Your smarter inbox<br />awaits.
          </motion.h2>

          <motion.p variants={fadeUp} custom={2} style={{ fontSize: 17, lineHeight: 1.7, color: "#6B6460", marginBottom: 44 }}>
            Join thousands upgrading their workflow with Elowen. Free to start, zero setup required.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <MagneticButton style={{
              borderRadius: 100,
              background: "linear-gradient(135deg, #F4500A, #C8003A)",
              padding: "16px 36px", fontSize: 16, fontWeight: 700, color: "#fff",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 40px rgba(244,80,10,0.4)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}>
              <Send size={17} /> Add Elowen to Telegram — Free
            </MagneticButton>
          </motion.div>

          <motion.p variants={fadeUp} custom={4} style={{ fontSize: 12, color: "#333", marginTop: 20 }}>
            No credit card · No new app · Works in 10 seconds
          </motion.p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 24px", maxWidth: 1180, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={18} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#333", fontSize: 14 }}>Elowen AI</span>
        </div>
        <div style={{ fontSize: 12, color: "#2a2a2a" }}>© {new Date().getFullYear()} Elowen AI. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <motion.div whileHover={{ color: "#F4500A" }}>
            {["Privacy", "Terms", "Contact"].map((t) => (
              <Link key={t} href="#" style={{ fontSize: 12, color: "#3a3a3a", textDecoration: "none" }}>{t}</Link>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;