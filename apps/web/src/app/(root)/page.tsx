import React from 'react';
import { MessageCircle, Zap, Brain, Send, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans text-zinc-300 selection:bg-orange-500/30">

      {/* Structural Background Texture (Grid) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px][mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Ambient Background Glows (Orange & Red) */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-orange-600 blur-[150px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-red-600 blur-[150px] opacity-20 pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto lg:px-8">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 40 40"><path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path><path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path></svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Elowen</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Features</a>
          <button className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-400 hover:to-red-400 transition-all shadow-orange-500/20 hover:shadow-orange-500/40">
            Add to Telegram
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-24 sm:pt-24 lg:pt-32 flex flex-col lg:flex-row items-center gap-16">

        {/* Left Column: Copy */}
        <div className="max-w-2xl lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8 backdrop-blur-sm">
            <Sparkles size={14} className="text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Meet your new assistant</span>
          </div>

          {/* Heading with White to Grey Shade Gradient */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 leading-[1.1]">
            AI that lives where <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">you already chat.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400 mb-8 max-w-lg">
            Elowen is a chill AI assistant built right into Telegram. No switching tabs, no extra apps. Just message the bot and get smart, contextual replies instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300">
              <Send size={18} />
              Start Chatting Free
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full bg-zinc-900/50 backdrop-blur-md px-8 py-4 text-base font-semibold text-white ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-all duration-300">
              See how it works <ArrowRight size={18} />
            </button>
          </div>
          <p className="mt-6 text-sm text-zinc-600">Powered by a blazing fast Turborepo architecture.</p>
        </div>

        {/* Right Column: App Mockup (Dark Mode) */}
        <div className="w-full lg:w-1/2 relative lg:translate-y-8">
          {/* Mockup Container */}
          <div className="relative mx-auto w-full max-w-[360px] bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black ring-1 ring-white/10">
            {/* Screen */}
            <div className="relative bg-black rounded-[2rem] overflow-hidden h-[600px] flex flex-col border border-white/5">

              {/* Telegram Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 z-10">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 40 40"><path fill="#fff" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path><path fill="#fff" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path></svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-white">Elowen AI</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">BOT</span>
                  </div>
                  <p className="text-xs text-orange-400">online</p>
                </div>
              </div>

              {/* Chat Area (with noise texture) */}
              <div className="flex-1 p-4 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-zinc-950/80 overflow-y-auto flex flex-col gap-4">
                <div className="text-center text-xs text-zinc-500 my-2 font-medium">Today</div>

                {/* User Message */}
                <div className="self-end max-w-[80%]">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm">
                    Hey Elowen! Can you draft a quick polite email declining a meeting for tomorrow? I'm swamped.
                  </div>
                </div>

                {/* Bot Message */}
                <div className="self-start max-w-[85%] flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-[10px] flex-shrink-0 mt-1">
                    🌿
                  </div>
                  <div className="bg-zinc-900 text-zinc-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm border border-white/5 backdrop-blur-sm">
                    <p className="mb-2">Of course! Here's a polite draft for you:</p>
                    <p className="italic text-zinc-400 border-l-2 border-orange-500 pl-2 mb-2 bg-zinc-950/50 p-2 rounded-r-md">
                      "Hi [Name], thanks for reaching out! I'm currently swamped with deadlines tomorrow and won't be able to meet. Could we reschedule for later this week?"
                    </p>
                    <p>Let me know if you want me to tweak the tone! ✨</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="px-4 py-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2 z-10">
                <div className="flex-1 bg-zinc-900 border border-white/5 rounded-full px-4 py-2.5 text-sm text-zinc-500">
                  Message...
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                  <Send size={16} className="ml-0.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Decorative Elements around mockup */}
          <div className="absolute top-20 -left-12 bg-zinc-900/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
            <div className="bg-red-500/20 p-2 rounded-xl text-red-400"><Brain size={20} /></div>
            <div className="text-sm font-semibold text-zinc-200">Context Aware</div>
          </div>
          <div className="absolute bottom-32 -right-8 bg-zinc-900/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-[float_5s_ease-in-out_infinite_reverse]">
            <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400"><Zap size={20} /></div>
            <div className="text-sm font-semibold text-zinc-200">Zero Latency</div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 sm:text-4xl">
              Everything you need, nothing you don't.
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Built to feel more like chatting with a real assistant than navigating a clunky interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="text-orange-400" size={24} />}
              title="Native to Telegram"
              description="No extra apps to download, no new accounts to create. Just search for Elowen and start talking right where you chat with friends."
            />
            <FeatureCard
              icon={<Zap className="text-red-400" size={24} />}
              title="Lightning Fast"
              description="Powered by a highly optimized Turborepo backend, Elowen streams responses in real-time so you're never left waiting."
            />
            <FeatureCard
              icon={<Brain className="text-orange-500" size={24} />}
              title="Remembers Context"
              description="Elowen actually remembers what you were talking about 5 minutes ago (or 5 days ago), making conversations flow naturally."
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative z-10 border-t border-white/5 py-16 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-6">
            Ready to upgrade your workflow?
          </h2>
          <button className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:bg-zinc-200 hover:scale-105 transition-all duration-300 mb-12">
            Start chatting with Elowen
          </button>
          <div className="flex items-center gap-2 text-zinc-600 text-sm font-medium">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 40 40"><path fill="#F06225" d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path><path fill="#F06225" d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path></svg>
            </span>
            <span>© {new Date().getFullYear()} Elowen AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Sub-component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:bg-zinc-900/80 hover:border-orange-500/30 transition-all duration-300">
      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-orange-500/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300">
        {title}
      </h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default LandingPage;