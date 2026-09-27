import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 md:px-8">
      <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus Web Technology community</p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Join Our Team</h1>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Join Geeta Nexus and Nexus Plus as a contributor, teacher, translator, audio creator, volunteer or community member.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card key="Bhagavad Gita audio recording"><CardContent className="p-6"><h2 className="font-semibold">Bhagavad Gita audio recording</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Hindi or English reading and recitation.</p></CardContent></Card>
        <Card key="Ramayana audio recording"><CardContent className="p-6"><h2 className="font-semibold">Ramayana audio recording</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Hindi or English narration or recitation.</p></CardContent></Card>
        <Card key="Translation"><CardContent className="p-6"><h2 className="font-semibold">Translation</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Hindi/English translation and language review.</p></CardContent></Card>
        <Card key="Volunteer / promotion"><CardContent className="p-6"><h2 className="font-semibold">Volunteer / promotion</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Help introduce Geeta Nexus and Nexus Plus to users and communities.</p></CardContent></Card>
        <Card key="Teacher / Gita educator"><CardContent className="p-6"><h2 className="font-semibold">Teacher / Gita educator</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Teach Bhagavad Gita using Geeta Nexus and Nexus Plus as learning aids.</p></CardContent></Card>
        <Card key="Accessibility QA"><CardContent className="p-6"><h2 className="font-semibold">Accessibility QA</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Help test accessible and screen-reader-friendly experiences.</p></CardContent></Card>
      </div>
      <Card className="mt-8">
        <CardHeader><CardTitle>Application</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Team applications are temporarily handled through the Nexus account system while the new backend architecture is being finalized.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Contact <a className="underline" href="mailto:info@nexusweb.co.in">info@nexusweb.co.in</a> to start.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
