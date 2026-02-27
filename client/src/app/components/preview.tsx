import { Link } from "react-router"; // Fixed import for v7
import { Heart, Users, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "motion/react";
import { useVaultData } from "../hooks/useVaultData";

// Generate consistent colors for the pie chart slices
const CHART_COLORS = [
  "#9333ea",
  "#3b82f6",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
];

export function Preview() {
  const { vaultAssets, totalValue, heirsList, isLoading } = useVaultData();

  // Map the raw contract heirs into the format the UI needs
  const displayHeirs = heirsList.map((heir, index) => {
    const heirValue = (totalValue * heir.percentage) / 100;

    return {
      name: `Heir ${index + 1}`, // Smart contracts don't store names, so we generate a label
      address: heir.address,
      percentage: heir.percentage,
      value: heirValue,
      color: CHART_COLORS[index % CHART_COLORS.length], // Cycle through colors safely
    };
  });

  const pieData = displayHeirs.map((heir) => ({
    name: heir.name,
    value: heir.percentage,
    displayValue: heir.value,
  }));

  // Show a clean loading state while fetching from Starknet
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-slate-600 animate-pulse">
            Calculating on-chain distribution...
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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Inheritance Preview</h1>
              <p className="text-slate-600">
                Visualize how assets will be distributed
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

          {displayHeirs.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-white/70 border border-slate-200/60 shadow-lg mb-6">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">No Heirs Configured</h2>
              <p className="text-slate-600 mb-6">
                You need to set up your heirs to view the distribution preview.
              </p>
              <Link to="/setup">
                <Button className="rounded-full bg-purple-600 hover:bg-purple-700">
                  Go to Setup
                </Button>
              </Link>
            </div>
          ) : (
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
                          return window.innerWidth < 768
                            ? `${value}%`
                            : `${name}: ${value}%`;
                        }}
                        outerRadius={window.innerWidth < 768 ? 80 : 100}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={displayHeirs[index].color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(
                          value: number,
                          name: string,
                          props: any,
                        ) => [
                          `${value}% ($${props.payload.displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total Vault Value</span>
                    <span className="text-2xl font-medium">
                      $
                      {totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
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
                    <p className="text-5xl mb-3 font-medium">
                      $
                      {totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-emerald-600">
                      Across {vaultAssets.length} tracked tokens
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Only show assets that actually have a balance > 0 */}
                    {vaultAssets
                      .filter((a) => a.balance > 0)
                      .slice(0, 4)
                      .map((asset) => (
                        <div
                          key={asset.symbol}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-200/60"
                        >
                          <span className="font-medium flex items-center gap-2">
                            <span className="text-slate-400">{asset.icon}</span>
                            {asset.symbol}
                          </span>
                          <span className="text-slate-600">
                            $
                            {asset.value.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ))}
                    {vaultAssets.filter((a) => a.balance > 0).length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        Vault is currently empty.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Heirs Breakdown */}
          {displayHeirs.length > 0 && (
            <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg">
              <h2 className="text-2xl mb-6">Heir Distribution Breakdown</h2>
              <div className="space-y-4">
                {displayHeirs.map((heir, index) => (
                  <motion.div
                    key={heir.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/60"
                  >
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                          style={{
                            background: `linear-gradient(135deg, ${heir.color}, ${heir.color}dd)`,
                          }}
                        >
                          {heir.name.charAt(5)}{" "}
                          {/* Grabs the number from "Heir X" */}
                        </div>
                        <div>
                          <p className="text-lg font-medium">{heir.name}</p>
                          <p className="text-sm text-slate-600 font-mono">
                            {heir.address.slice(0, 6)}...
                            {heir.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-2xl font-medium"
                          style={{ color: heir.color }}
                        >
                          {heir.percentage}%
                        </p>
                        <p className="text-slate-600">
                          $
                          {heir.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Asset Breakdown for this Heir */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-3">
                        Will receive:
                      </p>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {vaultAssets
                          .filter((a) => a.balance > 0)
                          .map((asset) => {
                            const heirAmount =
                              (asset.balance * heir.percentage) / 100;
                            const heirValue =
                              (asset.value * heir.percentage) / 100;
                            return (
                              <div
                                key={asset.symbol}
                                className="text-sm p-2 rounded-lg bg-white/60 flex flex-col"
                              >
                                <span className="font-medium">
                                  {heirAmount.toLocaleString(undefined, {
                                    maximumFractionDigits: 4,
                                  })}{" "}
                                  {asset.symbol}
                                </span>
                                <span className="text-slate-500">
                                  $
                                  {heirValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-6 rounded-2xl p-6 bg-gradient-to-r from-purple-100/60 to-blue-100/60 border border-purple-200/60">
            <p className="text-slate-700">
              <strong>Note:</strong> This distribution will automatically
              execute when the inactivity period expires without a heartbeat.
              You can modify heir allocations anytime from the Setup page.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
