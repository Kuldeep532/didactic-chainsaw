import { useState, useEffect, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, Play, Pause, Volume2, Type, StickyNote, Trash2, Download } from "lucide-react";

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function Tools() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"tts" | "notes" | "audio">("tts");

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-5xl py-10">
      <h1 className="text-3xl font-bold mb-2">Accessibility Tools</h1>
      <p className="text-muted-foreground mb-8">
        Browser-based tools designed for keyboard navigation and screen-reader compatibility.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("tts")}
          className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${activeTab === "tts" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
          aria-pressed={activeTab === "tts"}
        >
          <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium">Text to Speech</p>
            <p className="text-xs text-muted-foreground">Listen to any text</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${activeTab === "notes" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
          aria-pressed={activeTab === "notes"}
        >
          <StickyNote className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium">Smart Notes</p>
            <p className="text-xs text-muted-foreground">Save quick notes locally</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("audio")}
          className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${activeTab === "audio" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
          aria-pressed={activeTab === "audio"}
        >
          <Mic className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium">Audio Lab</p>
            <p className="text-xs text-muted-foreground">Record and playback</p>
          </div>
        </button>
      </div>

      {activeTab === "tts" && <TextToSpeechPanel />}
      {activeTab === "notes" && <SmartNotesPanel />}
      {activeTab === "audio" && <AudioLabPanel />}
    </div>
  );
}

function TextToSpeechPanel() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length && !selectedVoice) {
        setSelectedVoice(available[0].voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({ title: "Enter some text first", variant: "destructive" });
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate[0]!;
    utterance.pitch = pitch[0]!;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      toast({ title: "Speech synthesis failed", variant: "destructive" });
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5" aria-hidden="true" />
          Text to Speech
        </CardTitle>
        <CardDescription>Reads text aloud using your browser&apos;s built-in voices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="tts-text">Text</Label>
          <Textarea id="tts-text" value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Type or paste text to read aloud..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="tts-voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="tts-voice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tts-rate" className="flex items-center gap-2">
              <Type className="h-4 w-4" aria-hidden="true" />
              Speed: {rate[0]}x
            </Label>
            <Slider id="tts-rate" value={rate} onValueChange={setRate} min={0.5} max={2} step={0.1} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tts-pitch">Pitch: {pitch[0]}</Label>
          <Slider id="tts-pitch" value={pitch} onValueChange={setPitch} min={0.5} max={2} step={0.1} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSpeak} disabled={speaking}>
            <Play className="h-4 w-4 mr-1" aria-hidden="true" />
            {speaking ? "Speaking..." : "Speak"}
          </Button>
          <Button variant="outline" onClick={handleStop}>
            <Square className="h-4 w-4 mr-1" aria-hidden="true" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SmartNotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("nexus-smart-notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved) as Note[]);
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus-smart-notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) {
      toast({ title: "Note cannot be empty", variant: "destructive" });
      return;
    }
    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled note",
      body,
      createdAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
    setTitle("");
    setBody("");
    toast({ title: "Note saved" });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Note deleted" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="h-5 w-5" aria-hidden="true" />
            Smart Notes
          </CardTitle>
          <CardDescription>Notes are stored locally in your browser. They are not synced to the server.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-body">Body</Label>
              <Textarea id="note-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write your note here..." />
            </div>
            <Button type="submit">Save Note</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-muted-foreground">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{note.title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.body}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => deleteNote(note.id)} aria-label={`Delete note ${note.title}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AudioLabPanel() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ id: string; url: string; createdAt: string }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((prev) => [{ id: crypto.randomUUID(), url, createdAt: new Date().toISOString() }, ...prev]);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5" aria-hidden="true" />
            Audio Lab
          </CardTitle>
          <CardDescription>Record short audio clips directly in your browser. Recordings stay local.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {!recording ? (
              <Button onClick={startRecording}>
                <Mic className="h-4 w-4 mr-1" aria-hidden="true" />
                Start Recording
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopRecording}>
                <Square className="h-4 w-4 mr-1" aria-hidden="true" />
                Stop Recording
              </Button>
            )}
            {recording && <span className="text-sm text-destructive animate-pulse" aria-live="polite">Recording...</span>}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {recordings.length === 0 ? (
          <p className="text-muted-foreground">No recordings yet.</p>
        ) : (
          recordings.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Recording</p>
                    <p className="text-xs text-muted-foreground">{new Date(rec.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <audio controls src={rec.url} className="max-w-[200px]" aria-label="Recorded audio playback" />
                    <Button variant="ghost" size="icon" asChild aria-label="Download recording">
                      <a href={rec.url} download={`recording-${rec.id}.webm`}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
