
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Check, HeartHandshake, Loader2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";

const OPPORTUNITIES = [
  ["bhagavad_gita_audio","Bhagavad Gita audio recording","Hindi or English reading and recitation."],
  ["ramayana_audio","Ramayana audio recording","Hindi or English narration or recitation."],
  ["spiritual_audio","Other spiritual audio recording","Devotional and spiritual reading projects."],
  ["gita_translation","Bhagavad Gita translation","Hindi/English translation and language review."],
  ["spiritual_translation","Other spiritual text translation","Ramayana and other spiritual text translation."],
  ["volunteer","Volunteer / promotion","Help introduce Geeta Nexus and Nexus Plus to users and communities."],
  ["teacher","Teacher / Gita educator","Teach Bhagavad Gita using Geeta Nexus and Nexus Plus as learning aids."]
];

const TEAMS = ["Spiritual Content","Audio & Voice","Translation","Teaching & Education","Marketing & Outreach","Community","Social Media","Design","Accessibility QA","User Support","Content Review"];

export default function JoinTeam() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [form,setForm]=useState({fullName:"",applicationType:"volunteer",languages:"",availability:"",experience:"",message:"",consent:false});

  useEffect(()=>{ if(user?.email) setForm(v=>({...v,fullName:v.fullName||user.name||""})); },[user]);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();
    if(!user||!token) return;
    setLoading(true);
    try{
      const res=await fetch(SUPABASE_URL+"/rest/v1/rpc/nexus_team_apply",{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({
        p_full_name:form.fullName,p_application_type:form.applicationType,p_app_scope:"geeta_nexus",
        p_languages:form.languages.split(",").map(v=>v.trim()).filter(Boolean),
        p_message:form.message,p_availability:form.availability,p_experience:form.experience,p_consent:form.consent
      })});
      if(!res.ok) throw new Error();
      setSubmitted(true);
      toast({title:"Application received",description:"Your request is now available in the main admin review panel."});
    }catch{
      toast({title:"Application could not be submitted",description:"Please check the form and try again.",variant:"destructive"});
    }finally{setLoading(false);}
  };

  return <div className="flex w-full flex-col pb-20">
    <section className="border-b border-border bg-background px-4 pb-16 pt-24 md:px-8"><div className="mx-auto max-w-4xl text-center">
      <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus Wave community</p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Join Our Team</h1>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">Join Geeta Nexus as a contributor, teacher, translator, audio creator, volunteer or community member.</p>
    </div></section>

    <section className="border-b border-border bg-card py-14"><div className="mx-auto max-w-5xl px-4 md:px-8">
      <div className="mb-10 flex items-start gap-4"><HeartHandshake className="mt-1 h-6 w-6 shrink-0"/><div><h2 className="text-2xl font-bold">Current opportunities</h2><p className="mt-2 text-sm text-muted-foreground">Applications are submitted through Geeta Nexus. Nexus Plus roles can be granted after review when relevant.</p></div></div>
      <div className="grid gap-4 md:grid-cols-2">{OPPORTUNITIES.map(([value,label,description])=><Card key={value}><CardContent className="p-6"><div className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0"/><div><h3 className="font-semibold">{label}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p></div></div></CardContent></Card>)}</div>
      <div className="mt-8 rounded-2xl border border-border bg-background p-6"><h3 className="mb-3 font-semibold">Teams we may need</h3><div className="flex flex-wrap gap-2">{TEAMS.map(team=><span key={team} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{team}</span>)}</div></div>
    </div></section>

    <section className="bg-background py-14"><div className="mx-auto grid max-w-5xl gap-8 px-4 md:px-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-5">
        <Card><CardHeader><CardTitle>Volunteer conditions and responsibilities</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>Volunteering is voluntary and does not guarantee payment, employment or a fixed role.</p>
          <p>Contributors must communicate respectfully, protect private user information, follow content standards and never promise outcomes on behalf of Nexus Wave.</p>
          <p>Spiritual contributions should be respectful and clearly distinguish the contributor's interpretation from official Nexus Wave statements.</p>
          <p>Promotion volunteers may share official Geeta Nexus and Nexus Plus information and links, but must not impersonate Nexus Wave or use deceptive marketing.</p>
          <p>Teachers may use both Geeta Nexus and Nexus Plus as teaching aids. Teaching accuracy, context and classroom conduct remain the teacher's responsibility.</p>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Founder</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Nexus Wave is developed by <strong className="text-foreground">Kuldeep</strong>.</CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>Apply through your Nexus account</CardTitle></CardHeader><CardContent>
        {!user ? <div className="space-y-4 text-sm text-muted-foreground"><p>You need a Nexus Supabase account before applying.</p><Button asChild className="w-full"><Link href="/login">Sign in / Create account</Link></Button></div>
        : submitted ? <div className="space-y-3 text-sm"><Check className="h-7 w-7"/><p className="font-medium">Application submitted successfully.</p><p className="text-muted-foreground">Your request is now in the admin review queue.</p></div>
        : <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={form.fullName} onChange={e=>setForm(v=>({...v,fullName:e.target.value}))} required/></div>
          <div className="space-y-2"><Label htmlFor="role">Opportunity</Label><select id="role" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.applicationType} onChange={e=>setForm(v=>({...v,applicationType:e.target.value}))}>{OPPORTUNITIES.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="languages">Languages</Label><Input id="languages" placeholder="Hindi, English" value={form.languages} onChange={e=>setForm(v=>({...v,languages:e.target.value}))} required/></div>
          <div className="space-y-2"><Label htmlFor="availability">Availability</Label><Input id="availability" placeholder="e.g. 3 hours per week" value={form.availability} onChange={e=>setForm(v=>({...v,availability:e.target.value}))}/></div>
          <div className="space-y-2"><Label htmlFor="experience">Relevant experience</Label><Textarea id="experience" value={form.experience} onChange={e=>setForm(v=>({...v,experience:e.target.value}))} className="min-h-24"/></div>
          <div className="space-y-2"><Label htmlFor="message">Why would you like to join?</Label><Textarea id="message" value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))} className="min-h-28" required/></div>
          <div className="flex items-start gap-3 rounded-xl border border-border p-4"><Checkbox id="consent" checked={form.consent} onCheckedChange={checked=>setForm(v=>({...v,consent:checked===true}))}/><Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">I agree that the information I submit may be used to review this team application and contact me about it.</Label></div>
          <Button type="submit" className="w-full" disabled={loading||!form.consent}>{loading?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<UsersRound className="mr-2 h-4 w-4"/>}{loading?"Submitting…":"Submit application"}</Button>
        </form>}
      </CardContent></Card>
    </div></section>
  </div>;
}
