import { useState, useEffect, useCallback } from "react";
import { RpcProvider, Contract, uint256 } from "starknet";
import { useWallet } from "../context/WalletContext";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

// We include a hardcoded fiat price here just so your UI math works.
// In production, you would fetch these from a free API like CoinGecko.
const SUPPORTED_TOKENS = [
  {
    symbol: "ETH",
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
    price: 3400,
    icon: "Ξ",
  },
  {
    symbol: "STRK",
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
    price: 1.2,
    icon: "⬡",
  },
  {
    symbol: "USDC",
    address:
      "0x0512feac6339ff7889822cb5aa2a86c848e9d392bb0e3e237c008674feed8343",
    decimals: 6,
    price: 1.0,
    icon: "$",
  },
];

export const useVaultData = () => {
  const { address } = useWallet();
  const [vaultAssets, setVaultAssets] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [heirsCount, setHeirsCount] = useState<number | null>(null);
  const [thresholdDays, setThresholdDays] = useState<number>(90); // default
  const [isLoading, setIsLoading] = useState(true);
  const [heirsList, setHeirsList] = useState<any[]>([]);

  const fetchVaultData = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);

    try {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });

      // Define the exact view functions from your Cairo contract
      // 1. Fetch the exact, live ABI directly from your deployed contract
      const { abi: liveAbi } = await provider.getClassAt(HUB_ADDRESS);

      // 2. Initialize using the correct v6 positional syntax

      const contract = new Contract({
        abi: liveAbi,
        address: HUB_ADDRESS,
        providerOrAccount: provider,
      });

      // 1. Fetch Token Balances
      let calcTotalValue = 0;

      const assetsData = await Promise.all(
        SUPPORTED_TOKENS.map(async (token) => {
          try {
            // Read from your contract map: vault_balances.read((user, token))
            const res = await contract.get_vault_balance(
              address,
              token.address,
            );

            // Convert Starknet u256 to a standard BigInt, then to a readable decimal
            const balanceBigInt = uint256.uint256ToBN(res);
            const balanceFormatted =
              Number(balanceBigInt) / 10 ** token.decimals;
            const fiatValue = balanceFormatted * token.price;

            calcTotalValue += fiatValue;

            return {
              ...token,
              name:
                token.symbol === "ETH"
                  ? "Ethereum"
                  : token.symbol === "STRK"
                    ? "Starknet"
                    : "USD Coin",
              balance: balanceFormatted,
              value: fiatValue,
            };
          } catch (e) {
            console.warn(
              `Failed to fetch ${token.symbol} balance. Is contract deployed?`,
            );
            // Return zero balance if it fails so the UI doesn't crash
            return { ...token, name: token.symbol, balance: 0, value: 0 };
          }
        }),
      );

      setVaultAssets(assetsData);
      setTotalValue(calcTotalValue);

      // 2. Fetch Heirs Count
      try {
        const heirs = await contract.get_heirs(address);
        setHeirsCount(heirs.length);

        const formattedHeirs = heirs.map((h: any) => ({
          // Format Starknet felt252 address back to standard hex
          address: "0x" + h.address.toString(16),
          // Convert basis points (e.g., 5000) back to normal UI percentage (50%)
          percentage: Number(h.percentage) / 100,
        }));
        setHeirsList(formattedHeirs);
      } catch (e) {
        console.warn("Could not fetch heirs");
      }

      // 3. Fetch Threshold Setup
      try {
        const thresholdSeconds = await contract.get_threshold(address);
        if (Number(thresholdSeconds) > 0) {
          setThresholdDays(Number(thresholdSeconds) / 86400); // convert seconds to days
        }
      } catch (e) {
        console.warn("Could not fetch threshold");
      }
    } catch (error) {
      console.error("Error fetching vault data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch automatically on load or when wallet connects
  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  return {
    vaultAssets,
    totalValue,
    heirsCount,
    heirsList,
    thresholdDays,
    isLoading,
    refetch: fetchVaultData,
  };
};
