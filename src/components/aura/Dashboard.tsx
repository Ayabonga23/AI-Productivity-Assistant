import { Card, PageHeader } from "./primitives";
import type { ViewKey } from "./Shell";
import { Activity, Brain, Mail, MessageSquare, NotebookPen, Search, Sparkles, TrendingUp, Zap } from "lucide-react";

const STATS = [
  { label: "Productivity score", value: "92", suffix: "/100", icon: TrendingUp, tone: "primary" as const },
  { label: "AI tasks this week", value: "148", icon: Sparkles, tone: "accent" as const },
  { label: "Time saved", value: "12.4h", icon: Zap, tone: "primary" as const },
  { label: "Focus sessions", value: "27", icon: Brain, tone: "accent" as const },
];

const TOOLS: { key: ViewKey; label: string; desc: string; icon: typeof Mail }[] = [
  { key: "email", label: "Smart Email", desc: "Draft polished emails in any tone.", icon: Mail },
  { key: "notes", label: "Notes Summarizer", desc: "Turn raw notes into action items.", icon: NotebookPen },
  { key: "planner", label: "Task Planner", desc: "Build a focused daily schedule.", icon: Activity },
  { key: "research", label: "Research Assistant", desc: "Brief any topic in seconds.", icon: Search },
  { key: "chat", label: "Workplace Chat", desc: "Ask AURA anything, anytime.", icon: MessageSquare },
];

const ACTIVITY = [
  { time: "2m ago", text: "Generated executive update email to leadership team", icon: Mail },
  { time: "18m ago", text: "Summarized 42-min product sync into 6 action items", icon: NotebookPen },
  { time: "1h ago", text: "Built weekly plan with 4 deep-work blocks", icon: Activity },
  { time: "3h ago", text: "Researched 'AI adoption in mid-market SaaS'", icon: Search },
];

export function Dashboard({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Welcome back to AURA"
        description="Your AI workplace command center. Jump into a tool, review recent activity, and track productivity at a glance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <Card key={s.label} className="!p-5">
            <div className="flex items-start justify-between">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className={`h-8 w-8 rounded-lg grid place-items-center ${s.tone === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight aura-text">
              {s.value}
              {s.suffix && <span className="text-base text-muted-foreground font-normal">{s.suffix}</span>}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="font-semibold">Jump back in</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {TOOLS.map((t) => (
              <button
                key={t.key}
                onClick={() => onNavigate(t.key)}
                className="glass rounded-xl p-4 text-left hover:-translate-y-0.5 hover:aura-glow transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg aura-gradient grid place-items-center">
                    <t.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="font-medium text-sm">{t.label}</div>
                </div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-accent" />
            <div className="font-semibold">Recent activity</div>
          </div>
          <ul className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="h-7 w-7 rounded-lg glass grid place-items-center shrink-0">
                  <a.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm leading-snug">{a.text}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
