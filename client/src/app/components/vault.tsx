import { useState } from "react";
import { Link } from "react-router";
import { Heart, ArrowDown, ArrowUp, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useVault } from "../hooks/useVault";
import { useVaultData } from "../hooks/useVaultData"; // Import the read hook

export function Vault() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("ETH");
  const [isProcessing, setIsProcessing] = useState(false);

  // Write functions (transactions)
  const { depositAsset, withdrawAsset } = useVault();

  // Read functions (live blockchain data)
  const { vaultAssets, totalValue, isLoading, refetch } = useVaultData();

  // Handle the case where the data is still loading
  const currentAsset =
    vaultAssets.find((a) => a.symbol === selectedAssetSymbol) ||
    vaultAssets[0] ||
    null;

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || !currentAsset) return;
    setIsProcessing(true);
    const toastId = toast.loading("Confirming deposit in wallet...");

    try {
      await depositAsset(
        currentAsset.address,
        depositAmount,
        currentAsset.decimals,
      );
      toast.success(
        `Successfully deposited ${depositAmount} ${currentAsset.symbol}`,
        { id: toastId },
      );
      setDepositAmount("");
      // Refresh balances immediately after transaction confirms!
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Deposit failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || !currentAsset)
      return;
    setIsProcessing(true);
    const toastId = toast.loading("Confirming withdrawal in wallet...");

    try {
      await withdrawAsset(
        currentAsset.address,
        withdrawAmount,
        currentAsset.decimals,
      );
      toast.success(
        `Successfully withdrew ${withdrawAmount} ${currentAsset.symbol}`,
        { id: toastId },
      );
      setWithdrawAmount("");
      // Refresh balances immediately!
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Withdrawal failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // Prevent UI rendering until assets are loaded to avoid index errors
  if (isLoading || vaultAssets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-slate-600 animate-pulse">
            Scanning vault balances...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40">
      {/* Header */}
      <header className="border-b border-slate-200/60 backdrop-blur-sm bg-white/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">Proof of Life</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Asset Vault</h1>
              <p className="text-slate-600">
                Securely manage your inheritance assets
              </p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-full w-full sm:w-auto"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Total Value Card */}
          <div className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-slate-600">
                <TrendingUp className="w-5 h-5" />
                <span>Total Vault Value</span>
              </div>
              <p className="text-5xl mb-2">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {/* Note: I kept the fake percentage bump for design, but in prod you'd compare historical values */}
              <p className="text-emerald-600 flex items-center gap-1">
                <span className="text-xl">+2.4%</span>
                <span className="text-sm">from last week</span>
              </p>
            </div>
          </div>

          {/* Deposit/Withdraw Section */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg mb-6">
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="deposit" className="rounded-full">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Deposit
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="rounded-full">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Withdraw
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit">
                <div className="space-y-4">
                  <div>
                    <Label>Select Asset</Label>
                    <select
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedAssetSymbol}
                      onChange={(e) => setSelectedAssetSymbol(e.target.value)}
                    >
                      {vaultAssets.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} - {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="mt-2 text-lg"
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      Ready to deposit to Vault
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleDeposit}
                    disabled={isProcessing || !depositAmount}
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ArrowDown className="w-5 h-5 mr-2" />
                    )}
                    {isProcessing ? "Processing..." : "Deposit to Vault"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="withdraw">
                <div className="space-y-4">
                  <div>
                    <Label>Select Asset</Label>
                    <select
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedAssetSymbol}
                      onChange={(e) => setSelectedAssetSymbol(e.target.value)}
                    >
                      {vaultAssets.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} - {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="mt-2 text-lg"
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      Vault Balance: {currentAsset?.balance.toLocaleString()}{" "}
                      {currentAsset?.symbol}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWithdraw}
                    disabled={isProcessing || !withdrawAmount}
                    className="w-full rounded-full border-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ArrowUp className="w-5 h-5 mr-2" />
                    )}
                    {isProcessing ? "Processing..." : "Withdraw from Vault"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Asset Balances */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg">
            <h2 className="text-2xl mb-6">Asset Balances</h2>
            <div className="space-y-3">
              {vaultAssets.map((asset) => (
                <motion.div
                  key={asset.symbol}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/60 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
                        {asset.icon}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{asset.symbol}</p>
                        <p className="text-sm text-slate-600">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">
                        {asset.balance.toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                      </p>
                      <p className="text-sm text-slate-600">
                        $
                        {asset.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
