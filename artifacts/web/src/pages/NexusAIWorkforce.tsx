import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Command,
  Gauge,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const agents = [
  { id: "ceo", name: "CEO Agent", role: "Strategy & decisions", status: "Working", icon: Target, metric: "12 priorities" },
  { id: "sales", name: "Sales Agent", role: "Leads & follow-ups", status: "Working", icon: Users, metric: "48 leads" },
  { id: "research", name: "Research Agent", role: "Market intelligence", status: "Working", icon: Search, metric: "7 signals" },
  { id: "marketing", name: "Marketing Agent", role: "Campaigns & content", status: "Idle", icon: Sparkles, metric: "3 drafts" },
  { id: "finance", name: "Finance Agent", role: "Revenue & spend", status: "Working", icon: CircleDollarSign, metric: "₹2.4L tracked" },
  { id: "support", name: "Support Agent", role: "Customers & tickets", status: "Idle", icon: MessageSquareText, metric: "9 tickets" },
];

const activities = [
  ["09:42", "Sales Agent", "Qualified Acme Labs as a high-value lead", "high"],
  ["09:36", "Research Agent", "Found 3 competitor pricing changes", "info"],
  ["09:21", "Finance Agent", "Flagged a 14% month-over-month spend increase", "warn"],
  ["09:04", "Marketing Agent", "Prepared a personalized campaign draft", "info"],
];

export default function NexusAIWorkforce() {
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [activeView, setActiveView] = useState("Overview");
  const [approval, setApproval] = useState(0);
  const [autopilot, setAutopilot] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("ceo");

  const selected = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);

  const runGoal = () => {
    if (!goal.trim()) return;
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1400);
  };

  const approve = () => setApproval((value) => Math.max(0, value - 1));

  return (
    <main id="main-content" className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-slate-950 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-slate-800" aria-label="Nexus navigation">
          <div className="flex items-center justify-between px-5 py-5 lg:block">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-white text-slate-950" aria-hidden="true"><Sparkles size={20} /></div>
                <div>
                  <p className="text-lg font-bold tracking-tight">Nexus</p>
                  <p className="text-xs text-slate-400">AI Workforce</p>
                </div>
              </div>
            </div>
            <button className="rounded-lg border border-slate-700 p-2 lg:hidden" aria-label="Open navigation"><Command size={18} /></button>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-6 lg:block lg:space-y-1 lg:px-3" aria-label="Primary">
            {["Overview", "AI Workforce", "Goals", "Approvals", "Activity", "Integrations"].map((item) => (
              <button key={item} onClick={() => setActiveView(item)} aria-current={activeView === item ? "page" : undefined} className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition lg:w-full ${activeView === item ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                <LayoutDashboard size={16} aria-hidden="true" />
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto hidden p-4 lg:block">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><ShieldCheck size={15} /> Governance</div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Sensitive actions require approval. Every agent action is auditable.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[#f6f7f9]/95 px-5 py-4 backdrop-blur lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Business command center</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Good morning. Nexus is on it.</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Globe2 size={16} /> Live systems</button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"><Plus size={16} /> Add agent</button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 p-5 lg:p-8">
            <section className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-sm lg:p-8" aria-labelledby="goal-heading">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300"><Zap size={16} /> Autopilot {autopilot ? "active" : "paused"}</div>
                  <h2 id="goal-heading" className="text-3xl font-bold tracking-tight lg:text-4xl">Tell Nexus what outcome you want.</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Nexus turns the goal into a plan, assigns specialist agents, executes approved actions, verifies results, and continuously optimizes.</p>
                </div>
                <button onClick={() => setAutopilot((value) => !value)} aria-pressed={autopilot} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold hover:bg-slate-800"><Activity size={16} /> {autopilot ? "Pause autopilot" : "Resume autopilot"}</button>
              </div>
              <div className="mt-7 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:flex-row">
                <label htmlFor="nexus-goal" className="sr-only">Business goal</label>
                <input id="nexus-goal" value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runGoal(); }} placeholder="e.g. Increase qualified sales by 30% this quarter" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                <button onClick={runGoal} disabled={running || !goal.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"><Play size={16} fill="currentColor" /> {running ? "Planning…" : "Run goal"}</button>
              </div>
            </section>

            <section aria-labelledby="metrics-heading">
              <h2 id="metrics-heading" className="sr-only">Business metrics</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Active agents", "6", "+2 this week", Bot],
                  ["Tasks completed", "184", "+21%", Check],
                  ["Hours saved", "37.5", "this month", Clock3],
                  ["AI spend", "₹8,420", "18% under budget", WalletCards],
                ].map(([label, value, detail, Icon]) => (
                  <article key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><Icon size={17} className="text-slate-400" aria-hidden="true" /></div>
                    <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="workforce-heading">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="workforce-heading" className="font-bold">Your AI workforce</h2><p className="mt-1 text-xs text-slate-500">Specialists coordinating toward your goals</p></div><button className="text-xs font-bold text-slate-700 hover:text-slate-950">Manage team <ArrowUpRight className="inline" size={14} /></button></div>
                <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                  {agents.map((agent) => { const Icon = agent.icon; return <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`bg-white p-5 text-left transition hover:bg-slate-50 ${selectedAgent === agent.id ? "ring-2 ring-inset ring-slate-950" : ""}`} aria-pressed={selectedAgent === agent.id}>
                    <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-700"><Icon size={19} /></span><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${agent.status === "Working" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{agent.status}</span></div>
                    <p className="mt-4 font-bold">{agent.name}</p><p className="mt-1 text-xs text-slate-500">{agent.role}</p><p className="mt-3 text-xs font-semibold text-slate-700">{agent.metric}</p>
                  </button>; })}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="agent-detail-heading">
                <div className="border-b border-slate-200 px-5 py-4"><h2 id="agent-detail-heading" className="font-bold">Agent control</h2><p className="mt-1 text-xs text-slate-500">Selected: {selected.name}</p></div>
                <div className="space-y-5 p-5">
                  <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-slate-950 text-white"><selected.icon size={20} /></span><div><p className="font-bold">{selected.name}</p><p className="text-xs text-slate-500">{selected.role}</p></div></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current mission</p><p className="mt-2 text-sm font-semibold">Review high-value opportunities and surface decisions that need your approval.</p></div>
                  <div className="space-y-3 text-sm"><div className="flex items-center justify-between"><span className="text-slate-500">Autonomy</span><span className="font-bold">Approval required</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Budget</span><span className="font-bold">₹2,000 / day</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Heartbeat</span><span className="font-bold">Every 15 min</span></div></div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold hover:bg-slate-50"><Workflow size={16} /> Configure agent</button>
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="approval-heading">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="approval-heading" className="font-bold">Approval queue</h2><p className="mt-1 text-xs text-slate-500">Human control for sensitive actions</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{approval || 2} waiting</span></div>
                <div className="space-y-3 p-5">
                  {["Send ₹4.8L proposal to Acme Labs", "Publish Q3 retargeting campaign"].map((item, index) => <div key={item} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start gap-3"><div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700"><LockKeyhole size={15} /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item}</p><p className="mt-1 text-xs text-slate-500">{index === 0 ? "Sales Agent · ₹4.8L potential value" : "Marketing Agent · scheduled for 11:00"}</p></div></div><div className="mt-3 flex gap-2"><button onClick={approve} className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-2 text-xs font-bold text-white"><Check size={14} /> Approve</button><button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-bold"><X size={14} /> Reject</button></div></div>)}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="activity-heading">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="activity-heading" className="font-bold">Live activity</h2><p className="mt-1 text-xs text-slate-500">Auditable agent actions</p></div><div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><span className="size-2 rounded-full bg-emerald-500" /> Live</div></div>
                <div className="divide-y divide-slate-100">{activities.map(([time, actor, message, type]) => <div key={time + actor} className="flex gap-4 px-5 py-4"><time className="w-12 shrink-0 pt-0.5 text-xs font-mono text-slate-400">{time}</time><div className="min-w-0 flex-1"><p className="text-sm"><span className="font-bold">{actor}</span> <span className="text-slate-600">{message}</span></p><p className="mt-1 text-xs text-slate-400">{type === "warn" ? "Requires review" : "Verified execution"}</p></div><ChevronRight size={16} className="mt-1 text-slate-300" /></div>)}</div>
              </section>
            </div>

            <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Nexus AI Workforce · MVP control plane</p><p>Model-agnostic · Approval-first · Audit-ready</p></footer>
          </div>
        </section>
      </div>
    </main>
  );
}
