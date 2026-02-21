import { Link } from "react-router";
import { Heart, Users, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "motion/react";

interface Heir {
  name: string;
  address: string;
  percentage: number;
  value: number;
  color: string;
}

export function Preview() {
  const heirs: Heir[] = [
    {
      name: "Sarah Johnson",
      address: "0x742d...89aB",
      percentage: 50,
      value: 63771.4,
      color: "#9333ea",
    },
    {
      name: "Michael Chen",
      address: "0x8f3c...42eD",
      percentage: 30,
      value: 38262.84,
      color: "#3b82f6",
    },
    {
      name: "Emma Davis",
      address: "0x1a5f...67cF",
      percentage: 20,
      value: 25508.56,
      color: "#6366f1",
    },
  ];

  const totalValue = heirs.reduce((sum, heir) => sum + heir.value, 0);

  const pieData = heirs.map(heir => ({
    name: heir.name,
    value: heir.percentage,
    displayValue: heir.value,
  }));

  const assets = [
    { symbol: "ETH", name: "Ethereum", balance: 12.5, value: 42500 },
    { symbol: "STRK", name: "Starknet", balance: 15000, value: 30000 },
    { symbol: "USDC", name: "USD Coin", balance: 25000, value: 25000 },
    { symbol: "USDT", name: "Tether", balance: 18542.8, value: 18542.8 },
    { symbol: "DAI", name: "Dai", balance: 11500, value: 11500 },
  ];

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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Inheritance Preview</h1>
              <p className="text-slate-600">Visualize how assets will be distributed</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="rounded-full w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Distribution Chart */}
            <div className="rounded-3xl p-6 md:p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-2xl">Distribution Chart</h2>
              </div>

              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => {
                        // Simplified label for mobile
                        return window.innerWidth < 768 ? `${value}%` : `${name}: ${value}%`;
                      }}
                      outerRadius={window.innerWidth < 768 ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={heirs[index].color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% ($${props.payload.displayValue.toLocaleString()})`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Value</span>
                  <span className="text-2xl">${totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Total Value Card */}
            <div className="rounded-3xl p-6 md:p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl">Vault Summary</h2>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-slate-600 mb-2">Total Assets</p>
                  <p className="text-5xl mb-3">${totalValue.toLocaleString()}</p>
                  <p className="text-emerald-600">Across {assets.length} different tokens</p>
                </div>

                <div className="space-y-3">
                  {assets.slice(0, 3).map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-200/60">
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-slate-600">${asset.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <p className="text-sm text-slate-500 text-center pt-2">
                    +{assets.length - 3} more assets
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Heirs Breakdown */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg">
            <h2 className="text-2xl mb-6">Heir Distribution Breakdown</h2>
            <div className="space-y-4">
              {heirs.map((heir, index) => (
                <motion.div
                  key={heir.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                        style={{ background: `linear-gradient(135deg, ${heir.color}, ${heir.color}dd)` }}
                      >
                        {heir.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-medium">{heir.name}</p>
                        <p className="text-sm text-slate-600 font-mono">{heir.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl" style={{ color: heir.color }}>{heir.percentage}%</p>
                      <p className="text-slate-600">${heir.value.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Asset Breakdown for this Heir */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">Will receive:</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {assets.map((asset) => {
                        const heirAmount = (asset.balance * heir.percentage) / 100;
                        const heirValue = (asset.value * heir.percentage) / 100;
                        return (
                          <div key={asset.symbol} className="text-sm p-2 rounded-lg bg-white/60">
                            <span className="font-medium">{heirAmount.toFixed(4)} {asset.symbol}</span>
                            <span className="text-slate-500 ml-2">(${heirValue.toLocaleString()})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 rounded-2xl p-6 bg-gradient-to-r from-purple-100/60 to-blue-100/60 border border-purple-200/60">
            <p className="text-slate-700">
              <strong>Note:</strong> This distribution will automatically execute when the inactivity period expires without a heartbeat. You can modify heir allocations anytime from the Setup page.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}