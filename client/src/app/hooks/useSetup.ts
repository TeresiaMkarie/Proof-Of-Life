import { useCallback } from "react";
import { CallData, shortString, RpcProvider } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext"; // Adjust path to your context

const HUB_ADDRESS = import.meta.env.VITE_HUB_ADDRESS;

// Define the Heir type to match your Cairo Struct
export interface Heir {
  address: string;
  percentage: number; // e.g., 5000 for 50%
}

export const useSetup = () => {
  const { account } = useWallet();

  const setupProfile = useCallback(
    async (threshold: number, heirs: Heir[]) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return;
      }

      const toastId = toast.loading("Preparing your legacy configuration...");

      try {
        // 1. Validate inputs
        const totalPercentage = heirs.reduce((acc, h) => acc + h.percentage, 0);
        if (totalPercentage !== 10000) {
          throw new Error(
            "Total percentage must equal 100% (10000 basis points)",
          );
        }

        // 2. Format the arguments for the 'setup_switch' function
        // Starknet.js handles the Array of Structs if passed as an array of objects
        const callData = CallData.compile({
          threshold: threshold,
          heirs: heirs.map((heir) => ({
            address: heir.address,
            percentage: heir.percentage,
          })),
        });

        // 3. Execute the transaction
        const result = await account.execute({
          contractAddress: HUB_ADDRESS,
          entrypoint: "setup_switch",
          calldata: callData,
        });

        toast.loading("Transaction sent. Waiting for confirmation...", {
          id: toastId,
        });

        // 4. Wait for transaction
        const provider = new RpcProvider({
          nodeUrl: import.meta.env.VITE_RPC_URL,
        });
        await provider.waitForTransaction(result.transaction_hash);

        toast.success("Legacy profile updated successfully!", { id: toastId });
        return result;
      } catch (error: any) {
        console.error("Setup Error:", error);
        toast.error(error.message || "Failed to update profile", {
          id: toastId,
        });
      }
    },
    [account],
  );

  return { setupProfile };
};
