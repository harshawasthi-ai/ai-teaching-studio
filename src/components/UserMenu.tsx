import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  const initial = (user.email || "?").charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate({ to: "/auth" });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="User menu"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
