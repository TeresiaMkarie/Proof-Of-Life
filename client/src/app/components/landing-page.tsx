import { Link } from "react-router";
import { Shield, Heart, Clock, Users, Lock, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ThemeToggle } from "./theme-toggle";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40 dark:from-slate-950 dark:via-purple-950/30 dark:to-blue-950/40">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">Proof of Life</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-full">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/60 border border-purple-200/60 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700">Secured on Starknet</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Protect Your Legacy.<br />Secure Their Future.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A digital dead man's switch for your crypto assets. Automatically transfer your wealth to loved ones if you become inactive—giving you peace of mind today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Proof of Life"
            description="Stay active with periodic check-ins. Your heirs only receive access if you stop responding."
            gradient="from-purple-500 to-purple-600"
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Smart Countdown"
            description="Set your preferred inactivity period. Receive multiple warnings before inheritance triggers."
            gradient="from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Multiple Heirs"
            description="Designate beneficiaries with custom percentage allocations for each asset class."
            gradient="from-indigo-500 to-indigo-600"
          />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl text-center mb-4">How It Works</h2>
          <p className="text-center text-slate-600 mb-16 text-lg">
            Four simple steps to secure your digital inheritance
          </p>

          <div className="space-y-6">
            <StepCard
              number="1"
              title="Connect & Configure"
              description="Connect your Starknet wallet and set your preferred inactivity duration (e.g., 90 days)."
            />
            <StepCard
              number="2"
              title="Add Heirs"
              description="Designate beneficiaries and assign percentage allocations. Total must equal 100%."
            />
            <StepCard
              number="3"
              title="Deposit Assets"
              description="Transfer tokens to your secure Proof of Life vault. Track all balances in one place."
            />
            <StepCard
              number="4"
              title="Stay Active"
              description="Check in periodically to reset the timer. Receive reminders via email or Telegram before deadlines."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl mb-4">Built on Trust & Security</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Your assets remain under your full control at all times. Smart contracts on Starknet ensure transparent, tamper-proof execution. No third parties. No surprises. Just peace of mind.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 mb-20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl mb-4">Ready to Secure Your Legacy?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join families protecting their digital wealth with confidence.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 bg-white text-purple-600 hover:bg-slate-50">
                Connect Wallet & Start
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600 dark:text-slate-400">
          <p>© 2026 Proof of Life. Built with care for families everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
        {number}
      </div>
      <div>
        <h3 className="text-xl mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}