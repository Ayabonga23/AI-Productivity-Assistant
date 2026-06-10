import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, CopyButton, ErrorBanner, Input, Label, LoadingShimmer, PageHeader, Select, Textarea } from "./primitives";
import { CalendarDays, Flame, Plus, Trash2, Wand2 } from "lucide-react";

type Task = { id: string; title: string; priority: "high" | "medium" | "low" };

type DaySchedule = { day: string; blocks: { time: string; task: string; priority?: string }[] };
type PlanResult = {
  recommendations: string[];
  daily: DaySchedule;
  weekly: DaySchedule[];
};

function extractJson(text: string): PlanResult | null {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const p = JSON.parse(m[0]);
    return {
      recommendations: Array.isArray(p.recommendations) ? p.recommendations.map(String) : [],
      daily: { day: String(p.daily?.day ?? "Today"), blocks: Array.isArray(p.daily?.blocks) ? p.daily.blocks : [] },
      weekly: Array.isArray(p.weekly) ? p.weekly : [],
    };
  } catch {
    return null;
  }
}

export function TaskPlanner() {
  const run = useServerFn(aiGenerate);
  const [tasks, setTasks] = useState<Task[]>([
    { id: crypto.randomUUID(), title: "Finalize Q3 roadmap", priority: "high" },
    { id: crypto.randomUUID(), title: "Review marketing brief", priority: "medium" },
  ]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPriority, setDraftPriority] = useState<Task["priority"]>("medium");
  const [context, setContext] = useState("");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTask() {
    if (!draftTitle.trim()) return;
    setTasks((t) => [...t, { id: crypto.randomUUID(), title: draftTitle.trim(), priority: draftPriority }]);
    setDraftTitle("");
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const payload = tasks.map((t) => `[${t.priority.toUpperCase()}] ${t.title}`).join("\n");
      const { text } = await run({
        data: {
          system:
            'You are an elite executive productivity coach. Build a realistic schedule. Respond ONLY with JSON: { "recommendations": string[] (3-5 short prioritization tips), "daily": { "day": "Today", "blocks": [{ "time": "9:00 – 10:30", "task": "...", "priority": "high|medium|low" }] }, "weekly": [ { "day": "Monday", "blocks": [...] }, ... 5 weekdays ] }. Use deep-work blocks for high-priority tasks.',
          prompt: `Tasks:\n${payload}\n\nContext / constraints:\n${context || "Standard 9–5 workday."}`,
        },
      });
      const parsed = extractJson(text);
      if (!parsed) throw new Error("Could not parse plan. Try again.");
      setPlan(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const planText = plan
    ? `Recommendations:\n${plan.recommendations.map((r) => `- ${r}`).join("\n")}\n\nToday:\n${plan.daily.blocks.map((b) => `${b.time}  ${b.task}`).join("\n")}\n\nWeek:\n${plan.weekly.map((d) => `${d.day}\n${d.blocks.map((b) => `  ${b.time}  ${b.task}`).join("\n")}`).join("\n\n")}`
    : "";

  return (
    <div>
      <PageHeader eyebrow="Planning" title="AI Task Planner" description="Drop in your tasks and priorities. AURA crafts a focused daily schedule plus a balanced weekly plan." />

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-2">
          <Label>Add a task</Label>
          <div className="flex gap-2">
            <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="e.g. Prepare board update" onKeyDown={(e) => e.key === "Enter" && addTask()} />
            <Select
              value={draftPriority}
              onChange={(v) => setDraftPriority(v as Task["priority"])}
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
            <Button onClick={addTask} variant="subtle">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-2 max-h-64 overflow-auto scrollbar-thin pr-1">
            {tasks.map((t) => (
              <div key={t.id} className="glass rounded-xl px-3 py-2.5 flex items-center gap-3">
                <PriorityDot p={t.priority} />
                <span className="text-sm flex-1 truncate">{t.title}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.priority}</span>
                <button className="text-muted-foreground hover:text-destructive" onClick={() => setTasks((all) => all.filter((x) => x.id !== t.id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {!tasks.length && <p className="text-sm text-muted-foreground">No tasks yet.</p>}
          </div>

          <div className="mt-4">
            <Label>Context (optional)</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Mornings are for deep work. Team standup at 10am. No meetings on Friday."
              className="min-h-[90px]"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={generate} loading={loading} disabled={!tasks.length}>
              <Wand2 className="h-4 w-4" /> Build my plan
            </Button>
            {plan && <CopyButton text={planText} label="Copy plan" />}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-5">
          <ErrorBanner message={error} />

          {loading && (
            <Card>
              <LoadingShimmer lines={8} />
            </Card>
          )}

          {plan && (
            <>
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 text-accent" />
                  <div className="font-semibold">Priority recommendations</div>
                </div>
                <ul className="space-y-2">
                  {plan.recommendations.map((r, i) => (
                    <li key={i} className="text-sm flex gap-2 leading-relaxed">
                      <span className="aura-text font-semibold w-5 shrink-0">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <div className="font-semibold">{plan.daily.day}</div>
                </div>
                <ScheduleBlocks blocks={plan.daily.blocks} />
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  <div className="font-semibold">Weekly view</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {plan.weekly.map((d) => (
                    <div key={d.day} className="glass rounded-xl p-3">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{d.day}</div>
                      <ScheduleBlocks blocks={d.blocks} compact />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PriorityDot({ p }: { p: Task["priority"] }) {
  const cls = p === "high" ? "bg-destructive" : p === "medium" ? "bg-primary" : "bg-accent";
  return <span className={`h-2 w-2 rounded-full ${cls}`} />;
}

function ScheduleBlocks({ blocks, compact }: { blocks: { time: string; task: string; priority?: string }[]; compact?: boolean }) {
  if (!blocks.length) return <p className="text-xs text-muted-foreground">Nothing scheduled.</p>;
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => (
        <div key={i} className={`flex gap-3 items-start ${compact ? "" : "border-l-2 border-primary/40 pl-3"}`}>
          <div className={`text-[11px] font-mono text-muted-foreground shrink-0 ${compact ? "w-20" : "w-24"}`}>{b.time}</div>
          <div className="text-sm leading-snug">{b.task}</div>
        </div>
      ))}
    </div>
  );
}
