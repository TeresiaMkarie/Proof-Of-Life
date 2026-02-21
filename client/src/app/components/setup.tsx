import { useState } from "react";
import { Link } from "react-router";
import { Heart, Clock, Users, CheckCircle2, X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from "motion/react";

type Step = "duration" | "heirs" | "assets" | "complete";

interface Heir {
  id: string;
  name: string;
  address: string;
  percentage: number;
}

export function Setup() {
  const [currentStep, setCurrentStep] = useState<Step>("duration");
  const [inactivityDays, setInactivityDays] = useState(90);
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: "1", name: "", address: "", percentage: 50 },
    { id: "2", name: "", address: "", percentage: 50 },
  ]);

  const totalPercentage = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
  const isHeirsValid = totalPercentage === 100 && heirs.every(h => h.name && h.address);

  const addHeir = () => {
    setHeirs([...heirs, { id: Date.now().toString(), name: "", address: "", percentage: 0 }]);
  };

  const removeHeir = (id: string) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter(h => h.id !== id));
    }
  };

  const updateHeir = (id: string, field: keyof Heir, value: string | number) => {
    setHeirs(heirs.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40">
      {/* Header */}
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
        {/* Progress Steps */}
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
          {/* Step 1: Duration */}
          {currentStep === "duration" && (
            <motion.div
              key="duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg"
            >
              <h2 className="text-3xl mb-3">Set Inactivity Duration</h2>
              <p className="text-slate-600 mb-8">
                Choose how long of inactivity before inheritance triggers. You'll receive warnings before the deadline.
              </p>

              <div className="mb-8">
                <Label className="text-lg mb-4 block">Inactivity Period</Label>
                <div className="text-5xl text-purple-600 mb-6">{inactivityDays} days</div>
                <Slider
                  value={[inactivityDays]}
                  onValueChange={(value) => setInactivityDays(value[0])}
                  min={30}
                  max={365}
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-slate-500">
                  <span>30 days</span>
                  <span>365 days</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <PresetButton days={60} current={inactivityDays} onClick={setInactivityDays} />
                <PresetButton days={90} current={inactivityDays} onClick={setInactivityDays} />
                <PresetButton days={180} current={inactivityDays} onClick={setInactivityDays} />
              </div>

              <Button 
                size="lg" 
                onClick={() => setCurrentStep("heirs")}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Continue to Heirs
              </Button>
            </motion.div>
          )}

          {/* Step 2: Heirs */}
          {currentStep === "heirs" && (
            <motion.div
              key="heirs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg"
            >
              <h2 className="text-3xl mb-3">Add Your Heirs</h2>
              <p className="text-slate-600 mb-8">
                Designate beneficiaries and assign percentage allocations. Total must equal 100%.
              </p>

              <div className="space-y-6 mb-6">
                {heirs.map((heir, index) => (
                  <div key={heir.id} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg">Heir {index + 1}</span>
                      {heirs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeir(heir.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={heir.name}
                          onChange={(e) => updateHeir(heir.id, "name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Wallet Address</Label>
                        <Input
                          placeholder="0x..."
                          value={heir.address}
                          onChange={(e) => updateHeir(heir.id, "address", e.target.value)}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="flex items-center justify-between">
                          <span>Allocation</span>
                          <span className="text-2xl text-purple-600">{heir.percentage}%</span>
                        </Label>
                        <Slider
                          value={[heir.percentage]}
                          onValueChange={(value) => updateHeir(heir.id, "percentage", value[0])}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addHeir}
                className="w-full rounded-full mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Heir
              </Button>

              <div className={`p-4 rounded-xl mb-6 ${totalPercentage === 100 ? 'bg-emerald-50/80 border border-emerald-200/60' : 'bg-amber-50/80 border border-amber-200/60'}`}>
                <p className={totalPercentage === 100 ? 'text-emerald-900' : 'text-amber-900'}>
                  Total Allocation: {totalPercentage}%
                </p>
                {totalPercentage !== 100 && (
                  <p className="text-sm text-amber-700 mt-1">
                    Must equal 100% to continue
                  </p>
                )}
              </div>

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
                  onClick={() => setCurrentStep("assets")}
                  disabled={!isHeirsValid}
                  className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Complete */}
          {currentStep === "assets" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl mb-3">Setup Complete!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your Proof of Life inheritance plan is now active. Remember to send heartbeats regularly to keep your legacy protected.
              </p>

              <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/60 mb-8 text-left">
                <h3 className="text-lg mb-4">Summary</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Inactivity Period:</span>
                    <span className="font-medium">{inactivityDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Heirs:</span>
                    <span className="font-medium">{heirs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Allocation:</span>
                    <span className="font-medium text-emerald-600">100%</span>
                  </div>
                </div>
              </div>

              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepIndicator({ icon, label, active, completed }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        completed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' :
        active ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' :
        'bg-slate-200 text-slate-400'
      }`}>
        {icon}
      </div>
      <span className={`text-sm ${active || completed ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

function PresetButton({ days, current, onClick }: { days: number; current: number; onClick: (days: number) => void }) {
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
