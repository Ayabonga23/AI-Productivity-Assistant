import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, CopyButton, ErrorBanner, Label, LoadingShimmer, PageHeader, Textarea } from "./primitives";
import { CheckCircle2, Clock, Lightbulb, ScrollText, Sparkles } from "lucide-react";

type Result = {
  summary: string;
  actions: string[];
  deadlines: string[];
  decisions: string[];
};

function extractJson(text: string): Result | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return {
      summary: String(parsed.summary ?? ""),
      actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : [],
      deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines.map(String) : [],
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions.map(String) : [],
    };
  } catch {
    return null;
  }
}

export function NotesSummarizer() {
  const run = useServerFn(aiGenerate);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { text } = await run({
        data: {
          system:
            'You are a senior chief-of-staff. Summarize meeting notes and extract structured items. Respond ONLY with valid JSON matching: { "summary": string (2-4 concise sentences), "actions": string[] (each "Owner — task"), "deadlines": string[] (each "What — date/timeframe"), "decisions": string[] }. No prose outside JSON.',
          prompt: notes,
        },
      });
      const parsed = extractJson(text);
      if (!parsed) throw new Error("Could not parse AI response. Try again.");
      setResult(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const exportText = result
    ? `SUMMARY\n${result.summary}\n\nACTION ITEMS\n${result.actions.map((a) => `• ${a}`).join("\n")}\n\nDEADLINES\n${result.deadlines.map((d) => `• ${d}`).join("\n")}\n\nDECISIONS\n${result.decisions.map((d) => `• ${d}`).join("\n")}`
    : "";

  return (
    <div>
      <PageHeader eyebrow="Productivity" title="Meeting Notes Summarizer" description="Paste raw meeting notes. AURA extracts the summary, owners, deadlines, and decisions into clean cards." />

      <Card className="mb-6">
        <Label>Meeting notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste meeting notes, transcript, or bullet points here…"
          className="min-h-[200px]"
        />
        <div className="mt-4 flex gap-3">
          <Button onClick={generate} loading={loading} disabled={!notes.trim()}>
            <Sparkles className="h-4 w-4" /> Summarize
          </Button>
          {result && <CopyButton text={exportText} label="Copy all" />}
        </div>
      </Card>

      <ErrorBanner message={error} />

      {loading && (
        <Card>
          <LoadingShimmer lines={6} />
        </Card>
      )}

      {result && (
        <div className="grid sm:grid-cols-2 gap-5">
          <ResultCard icon={ScrollText} title="Summary" tone="primary">
            <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
          </ResultCard>
          <ResultCard icon={CheckCircle2} title="Action Items" tone="accent" count={result.actions.length}>
            <BulletList items={result.actions} empty="No action items identified." />
          </ResultCard>
          <ResultCard icon={Clock} title="Deadlines" tone="primary" count={result.deadlines.length}>
            <BulletList items={result.deadlines} empty="No deadlines mentioned." />
          </ResultCard>
          <ResultCard icon={Lightbulb} title="Decisions" tone="accent" count={result.decisions.length}>
            <BulletList items={result.decisions} empty="No decisions captured." />
          </ResultCard>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  icon: Icon,
  title,
  tone,
  count,
  children,
}: {
  icon: typeof CheckCircle2;
  title: string;
  tone: "primary" | "accent";
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${tone === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="font-semibold">{title}</div>
        {typeof count === "number" && (
          <div className="ml-auto text-xs px-2 py-0.5 rounded-full glass">{count}</div>
        )}
      </div>
      {children}
    </Card>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="text-sm flex gap-2 leading-relaxed">
          <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
