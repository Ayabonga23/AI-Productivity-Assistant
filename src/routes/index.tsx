import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, type ViewKey } from "@/components/aura/Shell";
import { EmailGenerator } from "@/components/aura/EmailGenerator";
import { NotesSummarizer } from "@/components/aura/NotesSummarizer";
import { TaskPlanner } from "@/components/aura/TaskPlanner";
import { ResearchAssistant } from "@/components/aura/ResearchAssistant";
import { Chatbot } from "@/components/aura/Chatbot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURA — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "AURA is a premium AI workplace assistant: smart email, meeting summaries, task planning, research briefs, and a workplace chatbot — all in one futuristic dashboard.",
      },
      { property: "og:title", content: "AURA — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Premium AI productivity suite for modern professionals.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [active, setActive] = useState<ViewKey>("email");
  return (
    <Shell active={active} setActive={setActive}>
      {active === "email" && <EmailGenerator />}
      {active === "notes" && <NotesSummarizer />}
      {active === "planner" && <TaskPlanner />}
      {active === "research" && <ResearchAssistant />}
      {active === "chat" && <Chatbot />}
    </Shell>
  );
}
