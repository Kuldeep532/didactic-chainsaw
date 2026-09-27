
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, LogOut, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";
const MAIN_ADMIN_EMAIL = "kuldeepky538@gmail.com";

async function api(path:string, token:string, init?:RequestInit){
  const res=await fetch(SUPABASE_URL+path,{...init,headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+token,"Content-Type":"application/json",...(init?.headers??{})}});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
type Application={id:string;email:string;full_name:string;application_type:string;languages:string[];message:string;availability:string|null;experience:string|null;status:string;created_at:string};

export default function TeamAdmin(){
  const {user,token,isLoading,logout}=useAuth();
  const [applications,setApplications]=useState<Application[]>([]);
  const [loading,setLoading]=useState(true);
  const mainAdmin=user?.email?.toLowerCase()===MAIN_ADMIN_EMAIL;

  const load=async()=>{if(!token||!mainAdmin)return;setLoading(true);try{setApplications(await api("/rest/v1/nexus_team_applications?select=*&order=created_at.desc",token));}finally{setLoading(false);}};
  useEffect(()=>{void load();},[token,mainAdmin]);

  const review=async(app:Application,approve:boolean)=>{
    if(!token)return;
    await api("/rest/v1/rpc/nexus_team_review_application",token,{method:"POST",body:JSON.stringify({
      p_application_id:app.id,p_status:approve?"approved":"rejected",
      p_member_type:app.application_type==="teacher"?"teacher":app.application_type==="volunteer"?"volunteer":"team_member",
      p_app_scope:"geeta_nexus",p_can_publish_spiritual_posts:true,
      p_can_publish_nexus_plus_posts:["marketing","content_editor","community"].includes(app.application_type)
    })});
    await load();
  };

  if(isLoading)return <div className="min-h-[60vh]" aria-busy="true"/>;
  if(!user)return <div className="mx-auto max-w-xl px-4 py-20"><Card><CardHeader><CardTitle>Admin sign-in required</CardTitle></CardHeader><CardContent><Button asChild><Link href="/login">Sign in</Link></Button></CardContent></Card></div>;
  if(!mainAdmin)return <div className="mx-auto max-w-xl px-4 py-20"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/>Access restricted</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Only the main Supabase account can open this panel.</p></CardContent></Card></div>;

  return <div className="bg-background py-16"><div className="container mx-auto max-w-screen-xl px-4 md:px-8">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-muted-foreground">Main admin</p><h1 className="text-3xl font-bold">Team & Community Admin</h1><p className="mt-2 text-sm text-muted-foreground">{user.email}</p></div><Button variant="outline" onClick={()=>void logout()}><LogOut className="mr-2 h-4 w-4"/>Sign out</Button></div>
    {loading?<div className="py-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/></div>:<div className="space-y-4">{applications.map(app=><Card key={app.id}><CardHeader className="pb-3"><div className="flex items-center justify-between gap-3"><CardTitle className="text-lg">{app.full_name}</CardTitle><Badge variant={app.status==="approved"?"default":app.status==="rejected"?"destructive":"outline"}>{app.status}</Badge></div><p className="text-sm text-muted-foreground">{app.email} · {app.application_type} · {app.languages.join(", ")}</p></CardHeader><CardContent className="space-y-3"><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{app.message}</p>{app.experience&&<p className="text-sm"><b>Experience:</b> {app.experience}</p>}{app.availability&&<p className="text-sm"><b>Availability:</b> {app.availability}</p>}{app.status==="pending"&&<div className="flex gap-2"><Button onClick={()=>void review(app,true)}><Check className="mr-2 h-4 w-4"/>Approve</Button><Button variant="outline" onClick={()=>void review(app,false)}><X className="mr-2 h-4 w-4"/>Reject</Button></div>}</CardContent></Card>)}</div>}
  </div></div>;
}
