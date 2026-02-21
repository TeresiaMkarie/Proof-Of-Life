import { useState } from "react";
import { Link } from "react-router";
import { Heart, Mail, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { motion } from "motion/react";

export function Notifications() {
  const [email, setEmail] = useState("user@example.com");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [reminder7Days, setReminder7Days] = useState(true);
  const [reminder3Days, setReminder3Days] = useState(true);
  const [reminder24Hours, setReminder24Hours] = useState(true);

  const handleSave = () => {
    // Mock save functionality
    alert("Notification preferences saved!");
  };

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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Notification Preferences</h1>
              <p className="text-slate-600">Stay informed about your heartbeat status</p>
            </div>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="rounded-full w-full sm:w-auto">
                Back
              </Button>
            </Link>
          </div>

          {/* Email Notifications */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl mb-1">Email Notifications</h3>
                    <p className="text-sm text-slate-600">
                      Receive reminders and alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                {emailEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      placeholder="you@example.com"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Telegram Notifications */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl mb-1">Telegram Notifications</h3>
                    <p className="text-sm text-slate-600">
                      Get instant messages via Telegram bot
                    </p>
                  </div>
                  <Switch
                    checked={telegramEnabled}
                    onCheckedChange={setTelegramEnabled}
                  />
                </div>

                {telegramEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/60">
                      <p className="text-sm text-purple-900 mb-3">
                        Connect your Telegram account to start receiving notifications
                      </p>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto rounded-full"
                      >
                        Connect Telegram
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Reminder Timing */}
          <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-lg mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl mb-1">Reminder Timing</h3>
                <p className="text-sm text-slate-600">
                  Choose when to receive inactivity warnings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ReminderOption
                label="7 Days Before"
                description="First warning when 7 days remain"
                checked={reminder7Days}
                onChange={setReminder7Days}
              />
              <ReminderOption
                label="3 Days Before"
                description="Second warning when 3 days remain"
                checked={reminder3Days}
                onChange={setReminder3Days}
              />
              <ReminderOption
                label="24 Hours Before"
                description="Final warning 24 hours before trigger"
                checked={reminder24Hours}
                onChange={setReminder24Hours}
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/60 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-900 mb-1">Notification Preview</p>
                <p className="text-sm text-emerald-700">
                  You'll receive {[reminder7Days, reminder3Days, reminder24Hours].filter(Boolean).length} reminder
                  {[reminder7Days, reminder3Days, reminder24Hours].filter(Boolean).length !== 1 ? 's' : ''} before your inheritance triggers via {emailEnabled && telegramEnabled ? "email and Telegram" : emailEnabled ? "email" : telegramEnabled ? "Telegram" : "no channels"}.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            size="lg"
            onClick={handleSave}
            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Save Preferences
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function ReminderOption({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-200/60">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}