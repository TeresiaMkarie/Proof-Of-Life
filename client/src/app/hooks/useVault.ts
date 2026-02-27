// hooks/useVault.ts
import { useCallback } from "react";
import { uint256 } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;

export const useVault = () => {
  const { account } = useWallet();

  const depositAsset = useCallback(
    async (tokenAddress: string, amountStr: string, decimals: number) => {
      if (!account) {
        toast.error("Please connect your wallet");
        return;
      }

      const toastId = toast.loading("Confirming deposit in wallet...");

      try {
        // 1. Calculate correct decimals (e.g., 1.5 USDC -> 1500000)
        const amountBigInt = BigInt(parseFloat(amountStr) * 10 ** decimals);
        const amountWei = uint256.bnToUint256(amountBigInt);

        // 2. The Starknet Multicall
        const calls = [
          {
            contractAddress: tokenAddress,
            entrypoint: "approve",
            calldata: [HUB_ADDRESS, amountWei.low, amountWei.high],
          },
          {
            contractAddress: HUB_ADDRESS,
            entrypoint: "deposit",
            calldata: [tokenAddress, amountWei.low, amountWei.high],
          },
        ];

        // Execute both calls in one transaction
        const result = await account.execute(calls);

        toast.loading("Transaction sent! Waiting for confirmation...", {
          id: toastId,
        });

        // Wait for the block to be accepted
        await account.waitForTransaction(result.transaction_hash);

        toast.success("Deposit successful!", { id: toastId });
        return result;
      } catch (error: any) {
        console.error("Deposit Error:", error);
        toast.error(error.message || "Failed to deposit", { id: toastId });
      }
    },
    [account],
  );

  const withdrawAsset = useCallback(
    async (tokenAddress: string, amountStr: string, decimals: number) => {
      if (!account) throw new Error("Wallet not connected");

      const amountWei = uint256.bnToUint256(
        BigInt(parseFloat(amountStr) * 10 ** decimals),
      );

      // Single call: Withdraw from Hub
      const result = await account.execute({
        contractAddress: HUB_ADDRESS,
        entrypoint: "withdraw",
        calldata: [tokenAddress, amountWei.low, amountWei.high],
      });

      await account.waitForTransaction(result.transaction_hash);
      return result;
    },
    [account],
  );

  return { depositAsset, withdrawAsset };
};
