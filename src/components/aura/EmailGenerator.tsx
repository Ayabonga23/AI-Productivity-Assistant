import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, CopyButton, ErrorBanner, Input, Label, LoadingShimmer, PageHeader, Select, Textarea } from "./primitives";
import { Send, Wand2 } from "lucide-react";

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "executive", label: "Executive" },
];

export function EmailGenerator() {
  const run = useServerFn(aiGenerate);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("formal");
  const [intent, setIntent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const { text } = await run({
        data: {
          system:
            "You are an elite executive communications writer. Produce a single, ready-to-send email. Use clean structure: greeting, body paragraphs, sign-off. Do not include any commentary, labels, or markdown headings — only the email body itself.",
          prompt: `Recipient: ${recipient || "the reader"}\nSubject: ${subject || "(write a fitting subject line on the first line as 'Subject: ...')"}\nTone: ${tone}\nIntent / key points:\n${intent}`,
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
      <PageHeader eyebrow="Communications" title="Smart Email Generator" description="Generate polished, on-brand emails in seconds. Choose a tone, describe the intent, and refine the draft inline." />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Recipient</Label>
                <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, VP of Product" />
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onChange={setTone} options={TONES} />
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
            <Button onClick={generate} loading={loading} disabled={!intent.trim()}>
              <Wand2 className="h-4 w-4" /> Generate Email
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4" /> Draft
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
              placeholder="Your AI-generated email will appear here. It's fully editable."
              className="min-h-[360px] font-mono text-[13px]"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
