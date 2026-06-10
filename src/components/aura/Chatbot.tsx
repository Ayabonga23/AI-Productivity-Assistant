import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiGenerate } from "@/lib/ai.functions";
import { Button, Card, ErrorBanner, PageHeader, Textarea } from "./primitives";
import { Bot, Send, Sparkles, User } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are AURA, an upbeat, sharp AI workplace productivity assistant. Help the user with workplace questions: writing, prioritization, decision-making, communication, planning. Keep answers concise, practical, and warm. Use light markdown (bullets, bold) when helpful.";

export function Chatbot() {
  const run = useServerFn(aiGenerate);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hey 👋 I'm AURA — your AI workplace assistant. Ask me anything: drafting tricky messages, prioritizing your week, prepping for a meeting, or thinking through a decision.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, user]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const history = [...messages, user]
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      const { text: reply } = await run({
        data: { system: SYSTEM, prompt: `${history}\n\nAssistant:` },
      });
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply.trim() }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Conversation" title="AI Workplace Chatbot" description="Brainstorm, draft, decide. AURA is always-on for your work questions." />

      <Card className="flex flex-col h-[calc(100vh-22rem)] min-h-[460px] p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-6 space-y-5">
          {messages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
          {loading && (
            <div className="flex gap-3 items-start animate-[fade-in_0.3s_ease]">
              <Avatar role="assistant" />
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 inline-flex gap-1.5 items-center">
                <span className="typing-dot h-2 w-2 rounded-full bg-primary inline-block" />
                <span className="typing-dot h-2 w-2 rounded-full bg-primary inline-block" />
                <span className="typing-dot h-2 w-2 rounded-full bg-primary inline-block" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="px-5 pb-2">
            <ErrorBanner message={error} />
          </div>
        )}

        <div className="border-t border-glass-border p-3 sm:p-4 glass">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask AURA anything about your workday…"
              className="min-h-[52px] max-h-40"
            />
            <Button onClick={send} loading={loading} disabled={!input.trim()} className="h-[52px] px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            Press Enter to send · Shift+Enter for newline
          </div>
        </div>
      </Card>
    </div>
  );
}

function Avatar({ role }: { role: Msg["role"] }) {
  return role === "assistant" ? (
    <div className="h-8 w-8 rounded-lg aura-gradient grid place-items-center shrink-0">
      <Bot className="h-4 w-4 text-primary-foreground" />
    </div>
  ) : (
    <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center shrink-0">
      <User className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 items-start animate-[fade-in_0.3s_ease] ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={msg.role} />
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "aura-gradient text-primary-foreground rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}
