import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, CopyButton, ErrorBanner, Input, Label, LoadingShimmer, PageHeader } from "./primitives";
import { BookOpen, Lightbulb, Search, ThumbsDown, ThumbsUp, Target } from "lucide-react";

type Research = {
  summary: string;
  insights: string[];
  recommendations: string[];
  pros: string[];
  cons: string[];
};

function extractJson(text: string): Research | null {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const p = JSON.parse(m[0]);
    return {
      summary: String(p.summary ?? ""),
      insights: Array.isArray(p.insights) ? p.insights.map(String) : [],
      recommendations: Array.isArray(p.recommendations) ? p.recommendations.map(String) : [],
      pros: Array.isArray(p.pros) ? p.pros.map(String) : [],
      cons: Array.isArray(p.cons) ? p.cons.map(String) : [],
    };
  } catch {
    return null;
  }
}

export function ResearchAssistant() {
  const run = useServerFn(aiGenerate);
  const [topic, setTopic] = useState("");
  const [data, setData] = useState<Research | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const { text } = await run({
        data: {
          system:
            'You are a senior research analyst. Produce a structured brief. Respond ONLY with JSON: { "summary": string (3-5 sentence overview), "insights": string[] (4-6 sharp insights), "recommendations": string[] (3-5 specific recommendations), "pros": string[] (3-5), "cons": string[] (3-5) }. Be specific, avoid filler.',
          prompt: `Topic: ${topic}`,
        },
      });
      const parsed = extractJson(text);
      if (!parsed) throw new Error("Could not parse research. Try again.");
      setData(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const exportText = data
    ? `SUMMARY\n${data.summary}\n\nINSIGHTS\n${data.insights.map((x) => `• ${x}`).join("\n")}\n\nRECOMMENDATIONS\n${data.recommendations.map((x) => `• ${x}`).join("\n")}\n\nPROS\n${data.pros.map((x) => `• ${x}`).join("\n")}\n\nCONS\n${data.cons.map((x) => `• ${x}`).join("\n")}`
    : "";

  return (
    <div>
      <PageHeader eyebrow="Intelligence" title="AI Research Assistant" description="Get a structured briefing on any topic — summary, insights, recommendations, plus pros and cons." />

      <Card className="mb-6">
        <Label>Research topic</Label>
        <div className="flex gap-2">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Adopting a 4-day work week for engineering teams"
            onKeyDown={(e) => e.key === "Enter" && topic.trim() && generate()}
          />
          <Button onClick={generate} loading={loading} disabled={!topic.trim()}>
            <Search className="h-4 w-4" /> Research
          </Button>
          {data && <CopyButton text={exportText} label="Copy" />}
        </div>
      </Card>

      <ErrorBanner message={error} />

      {loading && (
        <Card>
          <LoadingShimmer lines={8} />
        </Card>
      )}

      {data && (
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <div className="font-semibold">Executive summary</div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{data.summary}</p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-accent" />
                <div className="font-semibold">Key insights</div>
              </div>
              <List items={data.insights} />
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                <div className="font-semibold">Recommendations</div>
              </div>
              <List items={data.recommendations} />
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card className="border border-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="h-4 w-4 text-accent" />
                <div className="font-semibold">Pros</div>
              </div>
              <List items={data.pros} color="accent" />
            </Card>
            <Card className="border border-destructive/30">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="h-4 w-4 text-destructive" />
                <div className="font-semibold">Cons</div>
              </div>
              <List items={data.cons} color="destructive" />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function List({ items, color = "primary" }: { items: string[]; color?: "primary" | "accent" | "destructive" }) {
  const dot = color === "accent" ? "bg-accent" : color === "destructive" ? "bg-destructive" : "bg-primary";
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="text-sm flex gap-2 leading-relaxed">
          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
