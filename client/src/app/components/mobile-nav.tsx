import { Link } from "react-router";
import { Activity, Settings, Vault, Bell, PieChart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4 mt-8">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-lg">Dashboard</span>
          </Link>
          <Link to="/setup" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
            <span className="text-lg">Setup</span>
          </Link>
          <Link to="/vault" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <Vault className="w-5 h-5 text-slate-600" />
            <span className="text-lg">Vault</span>
          </Link>
          <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="text-lg">Notifications</span>
          </Link>
          <Link to="/preview" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <PieChart className="w-5 h-5 text-slate-600" />
            <span className="text-lg">Preview</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
