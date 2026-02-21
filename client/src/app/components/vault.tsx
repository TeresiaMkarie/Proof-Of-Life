import { useState } from "react";
import { Link } from "react-router";
import { Heart, ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon: string;
}

export function Vault() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("ETH");

  const assets: Asset[] = [
    { symbol: "ETH", name: "Ethereum", balance: 12.5, value: 42500, icon: "Ξ" },
    { symbol: "STRK", name: "Starknet", balance: 15000, value: 30000, icon: "⬡" },
    { symbol: "USDC", name: "USD Coin", balance: 25000, value: 25000, icon: "$" },
    { symbol: "USDT", name: "Tether", balance: 18542.8, value: 18542.8, icon: "₮" },
    { symbol: "DAI", name: "Dai", balance: 11500, value: 11500, icon: "◈" },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

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
              <p className="text-slate-600">Securely manage your inheritance assets</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="rounded-full w-full sm:w-auto">
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
              <p className="text-5xl mb-2">${totalValue.toLocaleString()}</p>
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
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white"
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                    >
                      {assets.map(asset => (
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
                      Available: 50.25 {selectedAsset}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <ArrowDown className="w-5 h-5 mr-2" />
                    Deposit to Vault
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="withdraw">
                <div className="space-y-4">
                  <div>
                    <Label>Select Asset</Label>
                    <select
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white"
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                    >
                      {assets.map(asset => (
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
                      Vault Balance: {assets.find(a => a.symbol === selectedAsset)?.balance} {selectedAsset}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-2"
                  >
                    <ArrowUp className="w-5 h-5 mr-2" />
                    Withdraw from Vault
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Asset Balances */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg">
            <h2 className="text-2xl mb-6">Asset Balances</h2>
            <div className="space-y-3">
              {assets.map((asset) => (
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
                      <p className="text-lg">{asset.balance.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">
                        ${asset.value.toLocaleString()}
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