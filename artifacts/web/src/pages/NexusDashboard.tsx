import { useMemo, useState } from "react";
import { Activity, Bot, Check, CircleDollarSign, Clock3, Command, Globe2, LayoutDashboard, LockKeyhole, MessageSquareText, Play, Plus, Search, ShieldCheck, Sparkles, Target, Users, WalletCards, Workflow, X, Zap } from "lucide-react";

const agents = [
  { id: "ceo", name: "CEO Agent", role: "Strategy & decisions", status: "Working", icon: Target, metric: "12 priorities" },
  { id: "sales", name: "Sales Agent", role: "Leads & follow-ups", status: "Working", icon: Users, metric: "48 leads" },
  { id: "research", name: "Research Agent", role: "Market intelligence", status: "Working", icon: Search, metric: "7 signals" },
  { id: "marketing", name: "Marketing Agent", role: "Campaigns & content", status: "Idle", icon: Sparkles, metric: "3 drafts" },
  { id: "finance", name: "Finance Agent", role: "Revenue & spend", status: "Working", icon: CircleDollarSign, metric: "₹2.4L tracked" },
  { id: "support", name: "Support Agent", role: "Customers & tickets", status: "Idle", icon: MessageSquareText, metric: "9 tickets" },
];

const metrics = [
  { label: "Active agents", value: "6", detail: "+2 this week", icon: Bot },
  { label: "Tasks completed", value: "184", detail: "+21%", icon: Check },
  { label: "Hours saved", value: "37.5", detail: "this month", icon: Clock3 },
  { label: "AI spend", value: "₹8,420", detail: "18% under budget", icon: WalletCards },
];

const activity = [
  { time: "09:42", actor: "Sales Agent", message: "Qualified Acme Labs as a high-value lead" },
  { time: "09:36", actor: "Research Agent", message: "Found 3 competitor pricing changes" },
  { time: "09:21", actor: "Finance Agent", message: "Flagged a 14% month-over-month spend increase" },
  { time: "09:04", actor: "Marketing Agent", message: "Prepared a personalized campaign draft" },
];

export default function NexusDashboard() {
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [autopilot, setAutopilot] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("ceo");
  const [approvals, setApprovals] = useState(2);
  const selected = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);
  const SelectedIcon = selected.icon;

  const runGoal = () => {
    if (!goal.trim()) return;
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1200);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800 bg-slate-950 text-white lg:min-h-screen lg:w-64 lg:border-b-0" aria-label="Nexus navigation">
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-slate-950" aria-hidden="true"><Sparkles size={20} /></div><div><p className="text-lg font-bold">Nexus</p><p className="text-xs text-slate-400">AI Workforce</p></div></div>
            <button className="rounded-lg border border-slate-700 p-2 lg:hidden" aria-label="Open navigation"><Command size={18} /></button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1" aria-label="Primary">
            {["Overview", "AI Workforce", "Goals", "Approvals", "Activity", "Integrations"].map((item, index) => <button key={item} className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm lg:w-full ${index === 0 ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}><LayoutDashboard size={16} aria-hidden="true" />{item}</button>)}
          </nav>
          <div className="m-4 hidden rounded-xl border border-slate-800 bg-slate-900 p-4 lg:block"><div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck size={15} /> Governance</div><p className="mt-2 text-xs leading-5 text-slate-500">Sensitive actions require approval. Every agent action is auditable.</p></div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Business command center</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Good morning. Nexus is on it.</h1></div><div className="flex gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"><Globe2 size={16} /> Live systems</button><button className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white"><Plus size={16} /> Add agent</button></div></div></header>

          <div className="mx-auto max-w-7xl space-y-6 p-5 lg:p-8">
            <section className="rounded-2xl bg-slate-950 p-6 text-white lg:p-8" aria-labelledby="goal-heading">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300"><Zap size={16} /> Autopilot {autopilot ? "active" : "paused"}</div><h2 id="goal-heading" className="text-3xl font-bold tracking-tight">Tell Nexus what outcome you want.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Nexus turns a business goal into a plan, assigns specialist agents, executes approved actions, verifies results, and optimizes.</p></div><button onClick={() => setAutopilot((value) => !value)} aria-pressed={autopilot} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold"><Activity size={16} /> {autopilot ? "Pause autopilot" : "Resume autopilot"}</button></div>
              <div className="mt-7 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:flex-row"><label htmlFor="nexus-goal" className="sr-only">Business goal</label><input id="nexus-goal" value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runGoal()} placeholder="e.g. Increase qualified sales by 30% this quarter" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500" /><button onClick={runGoal} disabled={running || !goal.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50"><Play size={16} fill="currentColor" /> {running ? "Planning…" : "Run goal"}</button></div>
            </section>

            <section aria-labelledby="metrics-heading"><h2 id="metrics-heading" className="sr-only">Business metrics</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, detail, icon: Icon }) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><Icon size={17} className="text-slate-400" aria-hidden="true" /></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p></article>)}</div></section>

            <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="workforce-heading"><div className="border-b border-slate-200 px-5 py-4"><h2 id="workforce-heading" className="font-bold">Your AI workforce</h2><p className="mt-1 text-xs text-slate-500">Specialists coordinating toward your goals</p></div><div className="grid gap-px bg-slate-200 sm:grid-cols-2">{agents.map((agent) => { const Icon = agent.icon; return <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} aria-pressed={selectedAgent === agent.id} className={`bg-white p-5 text-left hover:bg-slate-50 ${selectedAgent === agent.id ? "ring-2 ring-inset ring-slate-950" : ""}`}><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-lg bg-slate-100"><Icon size={19} /></span><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${agent.status === "Working" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{agent.status}</span></div><p className="mt-4 font-bold">{agent.name}</p><p className="mt-1 text-xs text-slate-500">{agent.role}</p><p className="mt-3 text-xs font-semibold">{agent.metric}</p></button>; })}</div></section>

              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="agent-detail-heading"><div className="border-b border-slate-200 px-5 py-4"><h2 id="agent-detail-heading" className="font-bold">Agent control</h2><p className="mt-1 text-xs text-slate-500">Selected: {selected.name}</p></div><div className="space-y-5 p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-slate-950 text-white"><SelectedIcon size={20} /></span><div><p className="font-bold">{selected.name}</p><p className="text-xs text-slate-500">{selected.role}</p></div></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current mission</p><p className="mt-2 text-sm font-semibold">Review high-value opportunities and surface decisions that need approval.</p></div><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">Autonomy</span><b>Approval required</b></div><div className="flex justify-between"><span className="text-slate-500">Budget</span><b>₹2,000 / day</b></div><div className="flex justify-between"><span className="text-slate-500">Heartbeat</span><b>Every 15 min</b></div></div><button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold"><Workflow size={16} /> Configure agent</button></div></section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="approval-heading"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="approval-heading" className="font-bold">Approval queue</h2><p className="mt-1 text-xs text-slate-500">Human control for sensitive actions</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{approvals} waiting</span></div><div className="space-y-3 p-5">{["Send ₹4.8L proposal to Acme Labs", "Publish Q3 retargeting campaign"].map((item, index) => <div key={item} className="rounded-lg border border-slate-200 p-4"><div className="flex gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700"><LockKeyhole size={15} /></div><div><p className="text-sm font-semibold">{item}</p><p className="mt-1 text-xs text-slate-500">{index === 0 ? "Sales Agent · ₹4.8L potential value" : "Marketing Agent · scheduled for 11:00"}</p></div></div><div className="mt-3 flex gap-2"><button onClick={() => setApprovals((value) => Math.max(0, value - 1))} disabled={approvals === 0} className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Check size={14} /> Approve</button><button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-bold"><X size={14} /> Reject</button></div></div>)}</div></section>

              <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="activity-heading"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="activity-heading" className="font-bold">Live activity</h2><p className="mt-1 text-xs text-slate-500">Auditable agent actions</p></div><span className="text-xs font-bold text-emerald-700">● Live</span></div><div className="divide-y divide-slate-100">{activity.map(({ time, actor, message }) => <div key={time + actor} className="flex gap-4 px-5 py-4"><time className="w-12 shrink-0 text-xs font-mono text-slate-400">{time}</time><p className="text-sm"><b>{actor}</b> <span className="text-slate-600">{message}</span></p></div>)}</div></section>
            </div>

            <footer className="border-t border-slate-200 pt-5 text-xs text-slate-500"><p>Nexus AI Workforce · MVP control plane · Model-agnostic · Approval-first · Audit-ready</p></footer>
          </div>
        </section>
      </div>
    </main>
  );
}
