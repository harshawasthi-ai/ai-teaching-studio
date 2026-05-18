import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { UserMenu } from "@/components/UserMenu";

export function AppHeader({ right, tagline }: { right?: ReactNode; tagline?: string }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-all duration-200 hover:opacity-90">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">AI Teaching Studio</h1>
            {tagline && <p className="text-xs text-slate-400">{tagline}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {right}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
