import { Link } from "react-router";
import { Heart, Settings, Vault, Bell, PieChart, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Dashboard() {
  const lastHeartbeat = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15); // 15 days ago
  const inactivityDuration = 90; // days
  const daysRemaining = 75;
  const progressPercentage = (daysRemaining / inactivityDuration) * 100;
  const isWarning = daysRemaining <= 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40 dark:from-slate-950 dark:via-purple-950/30 dark:to-blue-950/40">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">Proof of Life</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-purple-600 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/setup" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Setup
            </Link>
            <Link to="/vault" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2">
              <Vault className="w-4 h-4" />
              Vault
            </Link>
            <Link to="/notifications" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Link>
            <Link to="/preview" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Preview
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block px-4 py-2 rounded-full bg-emerald-100/60 dark:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-sm">
              0x742d...89aB
            </div>
            <ThemeToggle />
            <Button variant="outline" size="sm" className="rounded-full hidden sm:inline-flex">
              Disconnect
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl mb-2">Welcome Back</h1>
          <p className="text-slate-600 mb-8">Your legacy protection is active and secure.</p>

          {/* Main Status Card */}
          <div className="rounded-3xl p-8 md:p-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl">Last Heartbeat</h2>
                  </div>
                  <p className="text-3xl text-purple-600 dark:text-purple-400">
                    {lastHeartbeat.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">15 days ago</p>
                </div>

                <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Send Heartbeat Now
                </Button>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-600 dark:text-slate-400">Time Remaining Before Trigger</span>
                  <span className="text-2xl">{daysRemaining} days</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Inheritance will trigger on {new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Status Indicator */}
              {isWarning ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-amber-900 dark:text-amber-200">Warning: Less than 30 days remaining</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">Please send a heartbeat to reset the countdown.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-900 dark:text-emerald-200">All systems active</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Your legacy protection is working smoothly.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Total Vault Value"
              value="$127,542.80"
              subtitle="Across 5 assets"
              icon={<Vault className="w-5 h-5" />}
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Heirs Designated"
              value="3"
              subtitle="100% allocated"
              icon={<CheckCircle2 className="w-5 h-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Inactivity Period"
              value="90 days"
              subtitle="With 3 reminders"
              icon={<Bell className="w-5 h-5" />}
              gradient="from-indigo-500 to-indigo-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/vault">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Vault className="w-8 h-8 mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl mb-2">Manage Vault</h3>
                <p className="text-slate-600 dark:text-slate-400">Deposit, withdraw, or view your asset balances.</p>
              </motion.div>
            </Link>

            <Link to="/preview">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow cursor-pointer"
              >
                <PieChart className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl mb-2">View Distribution</h3>
                <p className="text-slate-600 dark:text-slate-400">See how assets will be divided among heirs.</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, gradient }: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  gradient: string;
}) {
  return (
    <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-600 dark:text-slate-400">{title}</span>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl mb-1">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}