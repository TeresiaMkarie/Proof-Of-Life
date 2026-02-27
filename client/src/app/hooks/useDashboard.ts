// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from "react";
import { RpcProvider } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;
const RPC_URL =
  import.meta.env.VITE_RPC_URL ||
  "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";

export const useDashboard = () => {
  const { account, address } = useWallet();
  const [lastPulse, setLastPulse] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchPulse = useCallback(async () => {
    if (!address) return;
    try {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });

      // Read the contract state (Free, no gas)
      const result = await provider.callContract({
        contractAddress: HUB_ADDRESS,
        entrypoint: "get_last_pulse",
        calldata: [address],
      });

      // Starknet returns hex strings. Convert the first element to a number (Unix timestamp)
      const pulseTimestamp = parseInt(result.result[0], 16);
      setLastPulse(pulseTimestamp);
    } catch (error) {
      console.error("Error fetching pulse:", error);
    } finally {
      setIsFetching(false);
    }
  }, [address]);

  // Fetch immediately when the dashboard loads
  useEffect(() => {
    fetchPulse();
  }, [fetchPulse]);

  const sendHeartbeat = async () => {
    if (!account) return;
    setIsSending(true);
    const toastId = toast.loading("Confirming heartbeat in wallet...");

    try {
      const result = await account.execute({
        contractAddress: HUB_ADDRESS,
        entrypoint: "heartbeat",
        calldata: [],
      });

      toast.loading("Heartbeat sent! Waiting for block...", { id: toastId });
      await account.waitForTransaction(result.transaction_hash);

      toast.success("Heartbeat registered successfully!", { id: toastId });
      await fetchPulse(); // Refresh the UI with the new timestamp
    } catch (error: any) {
      console.error("Heartbeat error:", error);
      toast.error(error.message || "Failed to send heartbeat", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return { lastPulse, isFetching, isSending, sendHeartbeat };
};
