import { useState } from "react";
import { Link, useNavigate } from "react-router"; // Added useNavigate
import {
  Heart,
  Clock,
  Users,
  CheckCircle2,
  X,
  Plus,
  Loader2,
} from "lucide-react"; // Added Loader2
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from "motion/react";
import { useSetup } from "../hooks/useSetup";
import { useWallet } from "../context/WalletContext";
import { toast } from "sonner"; // Assuming you use sonner for notifications

type Step = "duration" | "heirs" | "assets" | "complete";

interface Heir {
  id: string;
  name: string;
  address: string;
  percentage: number;
}

export function Setup() {
  const { address } = useWallet();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("duration");
  const [inactivityDays, setInactivityDays] = useState(90);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const [heirs, setHeirs] = useState<Heir[]>([
    { id: "1", name: "", address: "", percentage: 50 },
    { id: "2", name: "", address: "", percentage: 50 },
  ]);

  const { setupProfile } = useSetup(); // Hook from previous step

  const totalPercentage = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  const isHeirsValid =
    totalPercentage === 100 &&
    heirs.every((h) => h.name && h.address && h.address.startsWith("0x"));

  const addHeir = () => {
    setHeirs([
      ...heirs,
      { id: Date.now().toString(), name: "", address: "", percentage: 0 },
    ]);
  };

  const removeHeir = (id: string) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter((h) => h.id !== id));
    }
  };

  const updateHeir = (
    id: string,
    field: keyof Heir,
    value: string | number,
  ) => {
    setHeirs(heirs.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  // --- NEW: THE INTEGRATION FUNCTION ---
  const handleCompleteSetup = async () => {
    if (!isHeirsValid) return;

    setIsSubmitting(true);
    try {
      // 1. Convert days to seconds (Starknet timestamp)
      const thresholdInSeconds = inactivityDays * 24 * 60 * 60;

      // 2. Map UI heirs to Contract Heir format
      // Note: mapping percentage to basis points (x100)
      const formattedHeirs = heirs.map((h) => ({
        address: h.address,
        percentage: h.percentage * 100,
      }));

      // 3. Call the hook
      const success = await setupProfile(thresholdInSeconds, formattedHeirs);

      if (success) {
        setCurrentStep("complete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to finalize setup on-chain.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40">
      {/* Header stays same */}
      <header className="border-b border-slate-200/60 backdrop-blur-sm bg-white/40">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">Proof of Life</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Progress Indicator - same as your code */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <StepIndicator
              icon={<Clock className="w-5 h-5" />}
              label="Duration"
              active={currentStep === "duration"}
              completed={["heirs", "assets", "complete"].includes(currentStep)}
            />
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
            <StepIndicator
              icon={<Users className="w-5 h-5" />}
              label="Heirs"
              active={currentStep === "heirs"}
              completed={["assets", "complete"].includes(currentStep)}
            />
            <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
            <StepIndicator
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Complete"
              active={currentStep === "assets" || currentStep === "complete"}
              completed={currentStep === "complete"}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Duration - same as your code */}
          {currentStep === "duration" && (
            <motion.div
              key="duration"
              /* ... props */ className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg"
            >
              <h2 className="text-3xl mb-3">Set Inactivity Duration</h2>
              <p className="text-slate-600 mb-8">
                Choose how long of inactivity before inheritance triggers.
              </p>
              <div className="mb-8">
                <Label className="text-lg mb-4 block">Inactivity Period</Label>
                <div className="text-5xl text-purple-600 mb-6">
                  {inactivityDays} days
                </div>
                <Slider
                  value={[inactivityDays]}
                  onValueChange={(v) => setInactivityDays(v[0])}
                  min={30}
                  max={365}
                  step={1}
                  className="mb-4"
                />
              </div>
              <Button
                size="lg"
                onClick={() => setCurrentStep("heirs")}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Continue to Heirs
              </Button>
            </motion.div>
          )}

          {/* Step 2: Heirs */}
          {currentStep === "heirs" && (
            <motion.div
              key="heirs"
              /* ... props */ className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg"
            >
              <h2 className="text-3xl mb-3">Add Your Heirs</h2>
              {/* ... Heir map code ... */}
              {heirs.map((heir, index) => (
                <div
                  key={heir.id}
                  className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/60 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Label>Heir {index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeir(heir.id)}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Name"
                    value={heir.name}
                    onChange={(e) =>
                      updateHeir(heir.id, "name", e.target.value)
                    }
                    className="mb-2"
                  />
                  <Input
                    placeholder="0x... address"
                    value={heir.address}
                    onChange={(e) =>
                      updateHeir(heir.id, "address", e.target.value)
                    }
                    className="mb-4 font-mono"
                  />
                  <div className="flex justify-between mb-2">
                    <span>Allocation</span>
                    <span>{heir.percentage}%</span>
                  </div>
                  <Slider
                    value={[heir.percentage]}
                    onValueChange={(v) =>
                      updateHeir(heir.id, "percentage", v[0])
                    }
                    max={100}
                  />
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addHeir}
                className="w-full rounded-full mb-6"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Another Heir
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("duration")}
                  className="flex-1 rounded-full"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleCompleteSetup} // Updated to call transaction
                  disabled={!isHeirsValid || isSubmitting}
                  className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Sign & Finalize"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Complete screen stays same */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              /* ... props */ className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl mb-3">Setup Complete!</h2>
              {/* ... Summary display ... */}
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-full bg-slate-900 text-white mt-4"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Place these at the bottom of your setup.tsx file ---

function StepIndicator({
  icon,
  label,
  active,
  completed,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          completed
            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
            : active
              ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
              : "bg-slate-200 text-slate-400"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm ${active || completed ? "text-slate-900" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function PresetButton({
  days,
  current,
  onClick,
}: {
  days: number;
  current: number;
  onClick: (days: number) => void;
}) {
  return (
    <Button
      variant={current === days ? "default" : "outline"}
      onClick={() => onClick(days)}
      className={current === days ? "bg-purple-600 hover:bg-purple-700" : ""}
    >
      {days} days
    </Button>
  );
}
