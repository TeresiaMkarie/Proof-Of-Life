import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { Contract, RpcProvider } from "starknet";
import { toast } from "sonner";
import {
  Heart,
  Settings,
  Vault,
  Bell,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { useWallet } from "../context/WalletContext";
import { useVaultData } from "../hooks/useVaultData";

// Environment variables for your network
const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

console.log(RPC_URL);

export function Dashboard() {
  const navigate = useNavigate();
  const { account, disconnectWallet, address } = useWallet();
  const { vaultAssets, totalValue, heirsCount, thresholdDays, isLoading } =
    useVaultData();
  const isLoggedIn = !!account;

  // Real on-chain state
  const [lastPulseTime, setLastPulseTime] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isHeartbeating, setIsHeartbeating] = useState(false);

  // Defaulting to 90 days for UI. In a production app, you'd fetch this from the contract's threshold map.
  const inactivityDurationSeconds = 90 * 24 * 60 * 60;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Fetch the Last Pulse from Starknet
  const fetchDashboardData = useCallback(async () => {
    if (!address) return;

    try {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });

      // Minimal ABI to read the state
      const abi = [
        {
          name: "get_last_pulse",
          type: "function",
          inputs: [
            {
              name: "user",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [{ type: "core::integer::u64" }],
          state_mutability: "view",
        },
      ];

      const contract = new Contract({
        abi: abi,
        address: HUB_ADDRESS,
        providerOrAccount: provider,
      });

      const pulse = await contract.get_last_pulse(address);

      setLastPulseTime(Number(pulse));
    } catch (error) {
      console.error("Failed to fetch on-chain data:", error);
    } finally {
      setIsFetching(false);
    }
  }, [address]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Execute Heartbeat Transaction
  const handleHeartbeat = async () => {
    if (!account) return;
    setIsHeartbeating(true);
    const toastId = toast.loading("Sending heartbeat to Starknet...");

    try {
      const result = await account.execute({
        contractAddress: HUB_ADDRESS,
        entrypoint: "heartbeat",
        calldata: [],
      });

      toast.loading("Transaction sent. Waiting for block...", { id: toastId });
      await account.waitForTransaction(result.transaction_hash);

      toast.success("Heartbeat successful! Your legacy is secured.", {
        id: toastId,
      });

      // Refresh the data to show the new countdown!
      fetchDashboardData();
    } catch (error: any) {
      console.error("Heartbeat error:", error);
      toast.error(error.message || "Failed to send heartbeat", { id: toastId });
    } finally {
      setIsHeartbeating(false);
    }
  };

  // --- Date Math & Logic ---
  const nowSeconds = Math.floor(Date.now() / 1000);
  const isSetup = lastPulseTime > 0;

  let daysRemaining = 0;
  let progressPercentage = 0;
  let isWarning = false;
  let lastHeartbeatDate = new Date();
  let triggerDate = new Date();

  if (isSetup) {
    const deadlineSeconds = lastPulseTime + inactivityDurationSeconds;
    const secondsRemaining = deadlineSeconds - nowSeconds;

    daysRemaining = Math.max(0, Math.floor(secondsRemaining / 86400));
    progressPercentage = Math.max(0, Math.min(100, (daysRemaining / 90) * 100)); // Assuming 90 days max for UI bar
    isWarning = daysRemaining <= 30;

    lastHeartbeatDate = new Date(lastPulseTime * 1000);
    triggerDate = new Date(deadlineSeconds * 1000);
  }

  // Calculate days ago for the UI
  const daysAgo = isSetup
    ? Math.floor((nowSeconds - lastPulseTime) / 86400)
    : 0;

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
            <Link
              to="/dashboard"
              className="text-purple-600 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/setup"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Setup
            </Link>
            <Link
              to="/vault"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2"
            >
              <Vault className="w-4 h-4" /> Vault
            </Link>
            <Link
              to="/notifications"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link
              to="/preview"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2"
            >
              <PieChart className="w-4 h-4" /> Preview
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block px-4 py-2 rounded-full bg-emerald-100/60 dark:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-sm font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hidden sm:inline-flex"
              onClick={() => disconnectWallet()}
            >
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
          <p className="text-slate-600 mb-8">
            {isSetup
              ? "Your legacy protection is active and secure."
              : "Complete your setup to secure your legacy."}
          </p>

          {/* Main Status Card */}
          <div className="rounded-3xl p-8 md:p-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart
                      className={`w-6 h-6 ${isSetup ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`}
                    />
                    <h2 className="text-2xl">Last Heartbeat</h2>
                  </div>
                  {isFetching ? (
                    <p className="text-xl text-slate-500 animate-pulse">
                      Checking chain status...
                    </p>
                  ) : isSetup ? (
                    <>
                      <p className="text-3xl text-purple-600 dark:text-purple-400">
                        {lastHeartbeatDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
                      </p>
                    </>
                  ) : (
                    <p className="text-xl text-slate-500">Not configured yet</p>
                  )}
                </div>

                {isSetup ? (
                  <Button
                    size="lg"
                    onClick={handleHeartbeat}
                    disabled={isHeartbeating}
                    className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isHeartbeating ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Heart className="w-5 h-5 mr-2" />
                    )}
                    {isHeartbeating ? "Confirming..." : "Send Heartbeat Now"}
                  </Button>
                ) : (
                  <Link to="/setup">
                    <Button
                      size="lg"
                      className="rounded-full px-8 bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    >
                      Configure Proof of Life
                    </Button>
                  </Link>
                )}
              </div>

              {/* Countdown Timer */}
              {isSetup && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-600 dark:text-slate-400">
                      Time Remaining Before Trigger
                    </span>
                    <span className="text-2xl font-medium">
                      {daysRemaining} days
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Inheritance will trigger on{" "}
                    {triggerDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Status Indicator */}
              {isSetup ? (
                isWarning ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-amber-900 dark:text-amber-200 font-medium">
                        Warning: Less than 30 days remaining
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Please send a heartbeat to reset the countdown.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-900 dark:text-emerald-200 font-medium">
                        All systems active
                      </p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Your legacy protection is working smoothly.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <AlertTriangle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 dark:text-slate-200 font-medium">
                      Action Required
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You must configure your heirs and duration to activate
                      protection.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Total Vault Value"
              value={
                isLoading
                  ? "Loading..."
                  : `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
              subtitle="Across supported assets"
              icon={<Vault className="w-5 h-5" />}
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Heirs Designated"
              value={
                heirsCount === null
                  ? "..."
                  : heirsCount > 0
                    ? `${heirsCount} Active`
                    : "None"
              }
              subtitle="Setup required"
              icon={<CheckCircle2 className="w-5 h-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Inactivity Period"
              value={isLoading ? "..." : `${thresholdDays} days`}
              subtitle="Standard duration"
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
                <p className="text-slate-600 dark:text-slate-400">
                  Deposit, withdraw, or view your asset balances.
                </p>
              </motion.div>
            </Link>

            <Link to="/preview">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow cursor-pointer"
              >
                <PieChart className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl mb-2">View Distribution</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  See how assets will be divided among heirs.
                </p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-600 dark:text-slate-400">{title}</span>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-medium mb-1">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
