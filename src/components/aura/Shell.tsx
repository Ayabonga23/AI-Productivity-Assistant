import { useState, type ReactNode } from "react";
import { Mail, NotebookPen, CalendarRange, Sparkles, MessageSquare, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewKey = "email" | "notes" | "planner" | "research" | "chat";

const NAV: { key: ViewKey; label: string; icon: typeof Mail; desc: string }[] = [
  { key: "email", label: "Email Generator", icon: Mail, desc: "Craft polished emails" },
  { key: "notes", label: "Notes Summarizer", icon: NotebookPen, desc: "Distill meeting notes" },
  { key: "planner", label: "Task Planner", icon: CalendarRange, desc: "Plan your week" },
  { key: "research", label: "Research Assistant", icon: Sparkles, desc: "Topic deep-dives" },
  { key: "chat", label: "Workplace Chat", icon: MessageSquare, desc: "Conversational AI" },
];

export function Shell({
  active,
  setActive,
  children,
}: {
  active: ViewKey;
  setActive: (v: ViewKey) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const activeMeta = NAV.find((n) => n.key === active)!;

  return (
    <div className="min-h-screen flex w-full text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 glass-strong border-r border-glass-border transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center gap-3 px-2 pb-6">
            <div className="relative">
              <div className="absolute inset-0 aura-gradient rounded-xl blur-md opacity-70 animate-aura-pulse" />
              <div className="relative h-10 w-10 rounded-xl aura-gradient grid place-items-center">
                <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold tracking-tight">AURA</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">AI Workplace</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setOpen(false);
                  }}
                  className={cn(
                    "group w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-all",
                    isActive
                      ? "glass aura-glow border-glass-border"
                      : "hover:bg-secondary/50 border border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "h-9 w-9 shrink-0 rounded-lg grid place-items-center transition-colors",
                      isActive ? "aura-gradient text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={cn("text-sm font-medium", isActive && "text-foreground")}>{item.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="glass rounded-xl p-4 mt-4">
            <div className="text-xs text-muted-foreground">Powered by</div>
            <div className="text-sm font-semibold aura-text">Lovable AI</div>
            <div className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              All responses are AI-generated. Review before sending or sharing.
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass border-b border-glass-border">
          <div className="flex items-center gap-3 px-4 sm:px-8 h-16">
            <button
              className="lg:hidden h-9 w-9 grid place-items-center rounded-lg bg-secondary"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Workspace</div>
              <h1 className="text-base sm:text-lg font-semibold truncate">{activeMeta.label}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-muted-foreground">AI online</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-6xl w-full mx-auto">{children}</main>

        <footer className="px-4 sm:px-8 py-6 text-center text-xs text-muted-foreground border-t border-glass-border">
          <span className="aura-text font-medium">AURA</span> · Responsible AI:
          outputs are AI-generated and may be inaccurate. Always review before acting on them.
        </footer>
      </div>
    </div>
  );
}
