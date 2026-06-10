import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, CopyButton, ErrorBanner, Input, Label, LoadingShimmer, PageHeader, Select, Textarea } from "./primitives";
import { RefreshCw, Send, Wand2 } from "lucide-react";

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "executive", label: "Executive" },
  { value: "apology", label: "Apology" },
  { value: "sales", label: "Sales" },
];

const AUDIENCES = [
  { value: "manager", label: "Manager" },
  { value: "client", label: "Client" },
  { value: "team", label: "Team member" },
  { value: "recruiter", label: "Recruiter" },
  { value: "customer", label: "Customer" },
  { value: "executive", label: "Executive" },
];

export function EmailGenerator() {
  const run = useServerFn(aiGenerate);
  const [recipient, setRecipient] = useState("");
  const [audience, setAudience] = useState("manager");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("formal");
  const [signature, setSignature] = useState("");
  const [intent, setIntent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!intent.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { text } = await run({
        data: {
          system:
            "You are an elite executive communications specialist. Produce a single, ready-to-send professional email with: a 'Subject: ...' line on the first line, a warm greeting, structured body paragraphs, a clear call-to-action, and a sign-off. Adapt language and formality to the audience and tone. Output ONLY the email — no commentary, no markdown headings.",
          prompt: `Recipient: ${recipient || "(unspecified)"}\nAudience type: ${audience}\nDesired subject: ${subject || "(generate one)"}\nTone: ${tone}\nSender signature: ${signature || "(use a generic professional sign-off)"}\n\nIntent / key points:\n${intent}`,
        },
      });
      setOutput(text.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Communications" title="Smart Email Generator" description="Generate polished, on-brand emails in seconds. Pick a tone and audience, describe the intent, refine inline." />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Recipient name</Label>
                <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah Chen" />
              </div>
              <div>
                <Label>Audience</Label>
                <Select value={audience} onChange={setAudience} options={AUDIENCES} />
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onChange={setTone} options={TONES} />
              </div>
              <div>
                <Label>Your name / signature</Label>
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Alex Rivera" />
              </div>
            </div>
            <div>
              <Label>Subject (optional)</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Q3 launch update" />
            </div>
            <div>
              <Label>Intent / Key Points</Label>
              <Textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Following up on yesterday's call. Need approval on the revised timeline by Friday. Highlight the 3 trade-offs we discussed…"
                className="min-h-[180px]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={generate} loading={loading} disabled={!intent.trim()}>
                <Wand2 className="h-4 w-4" /> {output ? "Generate again" : "Generate Email"}
              </Button>
              {output && (
                <Button variant="subtle" onClick={generate} loading={loading} disabled={!intent.trim()}>
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4" /> Draft preview
            </div>
            {output && <CopyButton text={output} />}
          </div>
          <ErrorBanner message={error} />
          {loading && !output ? (
            <LoadingShimmer lines={8} />
          ) : (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your AI-generated email will appear here. Every word is fully editable."
              className="min-h-[420px] font-mono text-[13px]"
            />
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">
            Tip: Refine the intent above and hit Regenerate for fresh variations.
          </p>
        </Card>
      </div>
    </div>
  );
}
