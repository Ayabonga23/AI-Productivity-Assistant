import { Card, PageHeader } from "./primitives";
import { AlertTriangle, Eye, Lock, Scale, ShieldCheck, Users } from "lucide-react";

const PRINCIPLES = [
  {
    icon: AlertTriangle,
    title: "Accuracy is not guaranteed",
    body: "AI-generated content may contain factual errors, outdated information, or fabricated details. Always verify critical information before sharing or acting on it.",
  },
  {
    icon: Eye,
    title: "Human review required",
    body: "AURA accelerates your work — it does not replace your judgment. Review every output before sending emails, scheduling tasks, or making business decisions.",
  },
  {
    icon: Scale,
    title: "Bias awareness",
    body: "Language models reflect biases present in their training data. Be mindful when generating content about people, groups, or sensitive workplace topics.",
  },
  {
    icon: Lock,
    title: "Privacy considerations",
    body: "Avoid pasting confidential customer data, credentials, or regulated information into AI tools. Treat AI inputs the same way you treat any third-party system.",
  },
  {
    icon: Users,
    title: "Inclusive communication",
    body: "Adjust generated content to respect cultural context, accessibility needs, and tone appropriate for your specific audience.",
  },
  {
    icon: ShieldCheck,
    title: "Ethical usage",
    body: "Do not use AURA to deceive, impersonate, manipulate, or generate content that violates your organization's code of conduct or applicable law.",
  },
];

export function ResponsibleAI() {
  return (
    <div>
      <PageHeader
        eyebrow="Principles"
        title="Responsible AI"
        description="AURA is designed to support you, not to replace your expertise. Here is how we approach AI safety, transparency, and ethical use in the workplace."
      />

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl aura-gradient grid place-items-center shrink-0">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold mb-1">{p.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border border-primary/30">
        <div className="text-xs uppercase tracking-wider text-primary mb-2">Disclaimer</div>
        <p className="text-sm leading-relaxed">
          AI-generated content may contain inaccuracies. Users should verify critical
          information before professional use. AURA does not store personally identifiable
          information beyond what you provide in your active session.
        </p>
      </Card>
    </div>
  );
}
