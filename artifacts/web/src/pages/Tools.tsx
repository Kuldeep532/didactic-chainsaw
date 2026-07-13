import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Mic, Square, Volume2, Type, StickyNote, Trash2, Download, Copy, RefreshCw,
  Calculator, Shuffle, Hash, Lock, Zap, Code2, Binary, Percent, Palette,
  AlignLeft, RotateCcw, CheckCircle2, AlertCircle, Info,
} from "lucide-react";

type TabId =
  | "text"
  | "developer"
  | "math"
  | "security"
  | "accessibility";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: Tab[] = [
  { id: "text", label: "Text Tools", icon: <Type className="h-4 w-4" />, description: "Word counter, case converter, lorem ipsum & more" },
  { id: "developer", label: "Developer", icon: <Code2 className="h-4 w-4" />, description: "JSON formatter, Base64, URL encoder, regex tester" },
  { id: "math", label: "Math & Conversion", icon: <Calculator className="h-4 w-4" />, description: "Calculator, unit converter, number base converter" },
  { id: "security", label: "Security", icon: <Lock className="h-4 w-4" />, description: "Password generator, UUID generator" },
  { id: "accessibility", label: "Accessibility", icon: <Volume2 className="h-4 w-4" />, description: "Text-to-speech and audio recording tools" },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState<TabId>("text");

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-muted/30 py-16 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Developer & Utility Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Free, browser-based tools — no sign-in, no data collection. Everything runs locally in your browser.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 max-w-screen-xl py-10">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4" role="tablist" aria-label="Tool categories">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === "text" && <TextToolsPanel />}
          {activeTab === "developer" && <DeveloperToolsPanel />}
          {activeTab === "math" && <MathPanel />}
          {activeTab === "security" && <SecurityPanel />}
          {activeTab === "accessibility" && <AccessibilityPanel />}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} disabled={!text}>
      {copied ? <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
      {copied ? "Copied!" : label}
    </Button>
  );
}

function ToolCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── TEXT TOOLS ───────────────────────────────────────────────────────────────

function TextToolsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WordCounter />
      <CaseConverter />
      <LoremIpsumGenerator />
      <FindAndReplace />
    </div>
  );
}

function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text ? text.split("\n").length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolCard title="Word & Character Counter" description="Analyse your text instantly">
      <Textarea
        placeholder="Paste or type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-32 mb-4 font-mono text-sm"
        aria-label="Text to count"
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Words", value: words },
          { label: "Characters", value: chars },
          { label: "No Spaces", value: charsNoSpace },
          { label: "Lines", value: lines },
          { label: "Sentences", value: sentences },
          { label: "Read Time", value: `~${readTime}m` },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted/40 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <CopyButton text={text} label="Copy Text" />
        <Button variant="outline" size="sm" onClick={() => setText("")}>
          <RotateCcw className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>
    </ToolCard>
  );
}

function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const convert = (mode: string) => {
    switch (mode) {
      case "upper": setOutput(input.toUpperCase()); break;
      case "lower": setOutput(input.toLowerCase()); break;
      case "title": setOutput(input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())); break;
      case "sentence": setOutput(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()); break;
      case "camel": setOutput(input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())); break;
      case "snake": setOutput(input.toLowerCase().replace(/\s+/g, "_")); break;
      case "kebab": setOutput(input.toLowerCase().replace(/\s+/g, "-")); break;
      case "reverse": setOutput(input.split("").reverse().join("")); break;
      default: break;
    }
  };

  const cases = [
    { id: "upper", label: "UPPER" },
    { id: "lower", label: "lower" },
    { id: "title", label: "Title Case" },
    { id: "sentence", label: "Sentence" },
    { id: "camel", label: "camelCase" },
    { id: "snake", label: "snake_case" },
    { id: "kebab", label: "kebab-case" },
    { id: "reverse", label: "Reverse" },
  ];

  return (
    <ToolCard title="Text Case Converter" description="Convert text between different casing styles">
      <Textarea
        placeholder="Enter text to convert..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-24 mb-3 font-mono text-sm"
        aria-label="Input text"
      />
      <div className="flex flex-wrap gap-2 mb-3">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => convert(c.id)}
            disabled={!input}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-muted disabled:opacity-40 transition-colors font-mono"
          >
            {c.label}
          </button>
        ))}
      </div>
      {output && (
        <div className="bg-muted/40 rounded-lg p-3 font-mono text-sm break-all mb-3">{output}</div>
      )}
      <div className="flex gap-2">
        <CopyButton text={output} />
        <Button variant="outline" size="sm" onClick={() => { setInput(""); setOutput(""); }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>
    </ToolCard>
  );
}

function LoremIpsumGenerator() {
  const LOREM_BASE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const SENTENCES = LOREM_BASE.match(/[^.!?]+[.!?]+/g) ?? [];
  const WORDS = LOREM_BASE.split(" ");

  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(2);
  const [output, setOutput] = useState("");

  const generate = () => {
    if (mode === "paragraphs") {
      setOutput(Array.from({ length: count }, () => LOREM_BASE).join("\n\n"));
    } else if (mode === "sentences") {
      const out: string[] = [];
      for (let i = 0; i < count; i++) out.push(SENTENCES[i % SENTENCES.length].trim());
      setOutput(out.join(" "));
    } else {
      const out: string[] = [];
      for (let i = 0; i < count; i++) out.push(WORDS[i % WORDS.length]);
      setOutput(out.join(" "));
    }
  };

  return (
    <ToolCard title="Lorem Ipsum Generator" description="Generate placeholder text for designs and mockups">
      <div className="flex gap-3 mb-4 flex-wrap">
        <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraphs">Paragraphs</SelectItem>
            <SelectItem value="sentences">Sentences</SelectItem>
            <SelectItem value="words">Words</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Label htmlFor="lorem-count" className="text-sm shrink-0">Count:</Label>
          <Input
            id="lorem-count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-20"
          />
        </div>
        <Button onClick={generate} size="sm">
          <Shuffle className="h-4 w-4 mr-1" /> Generate
        </Button>
      </div>
      {output && (
        <div className="bg-muted/40 rounded-lg p-3 text-sm max-h-40 overflow-y-auto mb-3 leading-relaxed">{output}</div>
      )}
      <CopyButton text={output} />
    </ToolCard>
  );
}

function FindAndReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [output, setOutput] = useState("");
  const [count, setCount] = useState(0);

  const doReplace = () => {
    if (!find) return;
    let flags = "g";
    if (!caseSensitive) flags += "i";
    try {
      const pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(pattern, flags);
      const matches = (text.match(re) ?? []).length;
      setCount(matches);
      setOutput(text.replace(re, replace));
    } catch {
      setOutput("Invalid regular expression.");
    }
  };

  return (
    <ToolCard title="Find & Replace" description="Bulk find and replace text with optional regex support">
      <Textarea
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-24 mb-3 font-mono text-sm"
        aria-label="Source text"
      />
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Input placeholder="Find..." value={find} onChange={(e) => setFind(e.target.value)} className="font-mono text-sm" />
        <Input placeholder="Replace with..." value={replace} onChange={(e) => setReplace(e.target.value)} className="font-mono text-sm" />
      </div>
      <div className="flex items-center gap-4 mb-3 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch checked={useRegex} onCheckedChange={setUseRegex} id="use-regex" />
          <span>Regex</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} id="case-sensitive" />
          <span>Case sensitive</span>
        </label>
      </div>
      <Button onClick={doReplace} size="sm" disabled={!text || !find} className="mb-3">
        <RefreshCw className="h-4 w-4 mr-1" /> Replace All
      </Button>
      {output && (
        <>
          <div className="text-xs text-muted-foreground mb-2">{count} match{count !== 1 ? "es" : ""} replaced</div>
          <div className="bg-muted/40 rounded-lg p-3 text-sm font-mono max-h-32 overflow-y-auto mb-3 whitespace-pre-wrap">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </ToolCard>
  );
}

// ─── DEVELOPER TOOLS ─────────────────────────────────────────────────────────

function DeveloperToolsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <JsonFormatter />
      <Base64Tool />
      <UrlEncoderDecoder />
      <ColorConverter />
      <RegexTester />
      <HashGenerator />
    </div>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolCard title="JSON Formatter & Validator" description="Pretty-print or minify JSON and catch syntax errors">
      <Textarea
        placeholder='{"key": "value"}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-28 mb-3 font-mono text-sm"
        aria-label="JSON input"
      />
      <div className="flex gap-2 items-center mb-3 flex-wrap">
        <Button size="sm" onClick={format} disabled={!input}>
          <AlignLeft className="h-4 w-4 mr-1" /> Format
        </Button>
        <Button size="sm" variant="outline" onClick={minify} disabled={!input}>Minify</Button>
        <div className="flex items-center gap-2 ml-auto text-sm">
          <Label htmlFor="json-indent">Indent:</Label>
          <Select value={String(indent)} onValueChange={(v) => setIndent(Number(v))}>
            <SelectTrigger id="json-indent" className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 4, 8].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs mb-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}
      {output && (
        <>
          <div className="bg-muted/40 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto mb-3 whitespace-pre">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </ToolCard>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(""); } catch { setError("Encoding failed"); } };
  const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); setError(""); } catch { setError("Invalid Base64 string"); } };

  return (
    <ToolCard title="Base64 Encoder / Decoder" description="Encode text or data to Base64 and decode it back">
      <Textarea
        placeholder="Enter text or Base64 string..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-24 mb-3 font-mono text-sm"
        aria-label="Base64 input"
      />
      <div className="flex gap-2 mb-3">
        <Button size="sm" onClick={encode} disabled={!input}>Encode →</Button>
        <Button size="sm" variant="outline" onClick={decode} disabled={!input}>← Decode</Button>
        <Button size="sm" variant="ghost" onClick={() => { setInput(output); setOutput(""); setError(""); }}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive flex items-center gap-1 mb-2"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
      {output && (
        <>
          <div className="bg-muted/40 rounded-lg p-3 font-mono text-xs break-all mb-3 max-h-28 overflow-y-auto">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </ToolCard>
  );
}

function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => { try { setOutput(encodeURIComponent(input)); setError(""); } catch { setError("Encoding failed"); } };
  const decode = () => { try { setOutput(decodeURIComponent(input)); setError(""); } catch { setError("Invalid encoded string"); } };

  return (
    <ToolCard title="URL Encoder / Decoder" description="Encode or decode URLs and query strings">
      <Textarea
        placeholder="Enter URL or encoded string..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-24 mb-3 font-mono text-sm"
        aria-label="URL input"
      />
      <div className="flex gap-2 mb-3">
        <Button size="sm" onClick={encode} disabled={!input}>Encode →</Button>
        <Button size="sm" variant="outline" onClick={decode} disabled={!input}>← Decode</Button>
      </div>
      {error && <p className="text-xs text-destructive flex items-center gap-1 mb-2"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
      {output && (
        <>
          <div className="bg-muted/40 rounded-lg p-3 font-mono text-xs break-all mb-3">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </ToolCard>
  );
}

function ColorConverter() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
        case gn: h = ((bn - rn) / d + 2) / 6; break;
        default: h = ((rn - gn) / d + 4) / 6;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (v: string) => {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      const r = hexToRgb(v);
      setRgb(r);
      setHsl(rgbToHsl(r.r, r.g, r.b));
    }
  };

  const handleRgbChange = (c: "r" | "g" | "b", v: number) => {
    const n = { ...rgb, [c]: v };
    setRgb(n);
    const h = `#${n.r.toString(16).padStart(2, "0")}${n.g.toString(16).padStart(2, "0")}${n.b.toString(16).padStart(2, "0")}`;
    setHex(h.toUpperCase());
    setHsl(rgbToHsl(n.r, n.g, n.b));
  };

  return (
    <ToolCard title="Color Converter" description="Convert between HEX, RGB and HSL color formats">
      <div className="flex gap-4 mb-5">
        <div
          className="w-16 h-16 rounded-xl border border-border shrink-0 shadow-inner"
          style={{ backgroundColor: hex }}
          aria-label={`Color preview: ${hex}`}
        />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2 items-center">
            <Label className="w-10 text-xs shrink-0">HEX</Label>
            <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} className="font-mono text-sm h-8" />
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-10 text-xs shrink-0">RGB</Label>
            <div className="flex gap-1">
              {(["r", "g", "b"] as const).map((c) => (
                <Input
                  key={c}
                  type="number" min={0} max={255}
                  value={rgb[c]}
                  onChange={(e) => handleRgbChange(c, Number(e.target.value))}
                  className="w-16 font-mono text-sm h-8"
                  aria-label={c.toUpperCase()}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="w-10 text-xs shrink-0">HSL</Label>
            <p className="font-mono text-sm text-muted-foreground">{hsl.h}°, {hsl.s}%, {hsl.l}%</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <CopyButton text={hex} label="Copy HEX" />
        <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} label="Copy RGB" />
        <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} label="Copy HSL" />
      </div>
      <div className="mt-4">
        <Label htmlFor="color-picker" className="text-xs text-muted-foreground">Pick a color</Label>
        <input
          id="color-picker"
          type="color"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="block mt-1 h-8 w-16 cursor-pointer rounded border border-border"
        />
      </div>
    </ToolCard>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    if (!pattern) return;
    try {
      const re = new RegExp(pattern, flags);
      const found = text.match(re) ?? [];
      setMatches(found);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  };

  return (
    <ToolCard title="Regex Tester" description="Test regular expressions against text in real time">
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <Label htmlFor="regex-pattern" className="text-xs text-muted-foreground mb-1 block">Pattern</Label>
          <Input id="regex-pattern" placeholder="[A-Z]+" value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono text-sm" />
        </div>
        <div className="w-24">
          <Label htmlFor="regex-flags" className="text-xs text-muted-foreground mb-1 block">Flags</Label>
          <Input id="regex-flags" placeholder="gim" value={flags} onChange={(e) => setFlags(e.target.value)} className="font-mono text-sm" />
        </div>
      </div>
      <Textarea
        placeholder="Test string..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-24 mb-3 font-mono text-sm"
        aria-label="Test string"
      />
      <Button size="sm" onClick={test} disabled={!pattern || !text} className="mb-3">Test Pattern</Button>
      {error && <p className="text-xs text-destructive flex items-center gap-1 mb-2"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
      {matches.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">{matches.length} match{matches.length !== 1 ? "es" : ""} found</p>
          <div className="flex flex-wrap gap-1.5">
            {matches.slice(0, 20).map((m, i) => (
              <Badge key={i} variant="secondary" className="font-mono text-xs">{m}</Badge>
            ))}
            {matches.length > 20 && <Badge variant="outline" className="text-xs">+{matches.length - 20} more</Badge>}
          </div>
        </div>
      )}
      {!error && matches.length === 0 && pattern && text && (
        <p className="text-xs text-muted-foreground">No matches found.</p>
      )}
    </ToolCard>
  );
}

function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    if (!input) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const results: Record<string, string> = {};
    for (const alg of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const) {
      const buffer = await crypto.subtle.digest(alg, data);
      results[alg] = Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(results);
  };

  return (
    <ToolCard title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes">
      <Textarea
        placeholder="Enter text to hash..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-20 mb-3 font-mono text-sm"
        aria-label="Text to hash"
      />
      <Button size="sm" onClick={generate} disabled={!input} className="mb-4">
        <Hash className="h-4 w-4 mr-1" /> Generate Hashes
      </Button>
      {Object.entries(hashes).map(([alg, hash]) => (
        <div key={alg} className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs font-mono font-semibold">{alg}</Label>
            <CopyButton text={hash} />
          </div>
          <div className="bg-muted/40 rounded-md px-3 py-2 font-mono text-xs break-all">{hash}</div>
        </div>
      ))}
    </ToolCard>
  );
}

// ─── MATH & CONVERSION ───────────────────────────────────────────────────────

function MathPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SimpleCalculator />
      <UnitConverter />
      <NumberBaseConverter />
      <PercentageCalculator />
    </div>
  );
}

function SimpleCalculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);

  const press = (val: string) => {
    if (display === "Error") { setDisplay("0"); setStored(null); setOp(null); return; }
    if (["+", "-", "×", "÷"].includes(val)) {
      setStored(parseFloat(display));
      setOp(val);
      setFresh(true);
      return;
    }
    if (val === "=") {
      if (stored === null || !op) return;
      const cur = parseFloat(display);
      let res = 0;
      if (op === "+") res = stored + cur;
      else if (op === "-") res = stored - cur;
      else if (op === "×") res = stored * cur;
      else if (op === "÷") { if (cur === 0) { setDisplay("Error"); return; } res = stored / cur; }
      setDisplay(String(parseFloat(res.toFixed(10))));
      setStored(null); setOp(null); setFresh(false);
      return;
    }
    if (val === "C") { setDisplay("0"); setStored(null); setOp(null); setFresh(false); return; }
    if (val === "±") { setDisplay(String(parseFloat(display) * -1)); return; }
    if (val === "%") { setDisplay(String(parseFloat(display) / 100)); return; }
    if (val === ".") {
      if (display.includes(".")) return;
      setDisplay((fresh ? "0" : display) + ".");
      setFresh(false); return;
    }
    setDisplay(fresh || display === "0" ? val : display + val);
    setFresh(false);
  };

  const rows = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <ToolCard title="Calculator" description="Simple calculator with basic arithmetic">
      <div className="bg-muted/60 rounded-lg px-4 py-3 mb-4 text-right font-mono text-3xl font-bold tracking-tight overflow-hidden min-h-[56px] flex items-center justify-end">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {rows.flat().map((key, i) => {
          const isOp = ["+", "-", "×", "÷"].includes(key);
          const isEq = key === "=";
          const isZero = key === "0";
          return (
            <button
              key={i}
              onClick={() => press(key)}
              className={`rounded-xl py-3 text-base font-semibold transition-all active:scale-95 ${
                isZero ? "col-span-2" : ""
              } ${
                isEq ? "bg-primary text-primary-foreground hover:opacity-90" :
                isOp ? "bg-primary/15 text-primary hover:bg-primary/25" :
                ["C", "±", "%"].includes(key) ? "bg-muted text-foreground hover:bg-muted/80" :
                "bg-card border border-border hover:bg-muted"
              }`}
            >
              {key}
            </button>
          );
        })}
      </div>
    </ToolCard>
  );
}

function UnitConverter() {
  type UnitType = "length" | "weight" | "temperature" | "speed";
  const UNITS: Record<UnitType, { units: string[]; toBase: Record<string, (v: number) => number>; fromBase: Record<string, (v: number) => number> }> = {
    length: {
      units: ["mm", "cm", "m", "km", "inch", "foot", "yard", "mile"],
      toBase: { mm: (v) => v / 1000, cm: (v) => v / 100, m: (v) => v, km: (v) => v * 1000, inch: (v) => v * 0.0254, foot: (v) => v * 0.3048, yard: (v) => v * 0.9144, mile: (v) => v * 1609.344 },
      fromBase: { mm: (v) => v * 1000, cm: (v) => v * 100, m: (v) => v, km: (v) => v / 1000, inch: (v) => v / 0.0254, foot: (v) => v / 0.3048, yard: (v) => v / 0.9144, mile: (v) => v / 1609.344 },
    },
    weight: {
      units: ["mg", "g", "kg", "ton", "lb", "oz"],
      toBase: { mg: (v) => v / 1e6, g: (v) => v / 1000, kg: (v) => v, ton: (v) => v * 1000, lb: (v) => v * 0.453592, oz: (v) => v * 0.0283495 },
      fromBase: { mg: (v) => v * 1e6, g: (v) => v * 1000, kg: (v) => v, ton: (v) => v / 1000, lb: (v) => v / 0.453592, oz: (v) => v / 0.0283495 },
    },
    temperature: {
      units: ["°C", "°F", "K"],
      toBase: { "°C": (v) => v, "°F": (v) => (v - 32) * 5 / 9, K: (v) => v - 273.15 },
      fromBase: { "°C": (v) => v, "°F": (v) => v * 9 / 5 + 32, K: (v) => v + 273.15 },
    },
    speed: {
      units: ["m/s", "km/h", "mph", "knot"],
      toBase: { "m/s": (v) => v, "km/h": (v) => v / 3.6, mph: (v) => v * 0.44704, knot: (v) => v * 0.514444 },
      fromBase: { "m/s": (v) => v, "km/h": (v) => v * 3.6, mph: (v) => v / 0.44704, knot: (v) => v / 0.514444 },
    },
  };

  const [type, setType] = useState<UnitType>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [value, setValue] = useState("1");

  useEffect(() => {
    const u = UNITS[type].units;
    setFromUnit(u[0]);
    setToUnit(u[1]);
  }, [type]);

  const result = (() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    const base = UNITS[type].toBase[fromUnit]?.(v) ?? v;
    const out = UNITS[type].fromBase[toUnit]?.(base) ?? base;
    return parseFloat(out.toFixed(8)).toString();
  })();

  return (
    <ToolCard title="Unit Converter" description="Convert between common units of length, weight, temperature, and speed">
      <Select value={type} onValueChange={(v) => setType(v as UnitType)}>
        <SelectTrigger className="mb-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="length">Length</SelectItem>
          <SelectItem value="weight">Weight</SelectItem>
          <SelectItem value="temperature">Temperature</SelectItem>
          <SelectItem value="speed">Speed</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{UNITS[type].units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{UNITS[type].units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value..."
        className="mb-3 font-mono"
      />
      {result && (
        <div className="bg-muted/40 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold font-mono">{result} <span className="text-primary">{toUnit}</span></p>
          <p className="text-xs text-muted-foreground mt-1">{value} {fromUnit} = {result} {toUnit}</p>
        </div>
      )}
    </ToolCard>
  );
}

function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("10");
  const [error, setError] = useState("");

  const decimal = (() => {
    try {
      const v = parseInt(input, parseInt(fromBase));
      if (isNaN(v)) return null;
      return v;
    } catch { return null; }
  })();

  const results = decimal !== null ? {
    Binary: decimal.toString(2),
    Octal: decimal.toString(8),
    Decimal: decimal.toString(10),
    Hexadecimal: decimal.toString(16).toUpperCase(),
  } : null;

  return (
    <ToolCard title="Number Base Converter" description="Convert between Binary, Octal, Decimal, and Hexadecimal">
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <Label htmlFor="base-input" className="text-xs text-muted-foreground mb-1 block">Number</Label>
          <Input
            id="base-input"
            value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
            placeholder="Enter number..."
            className="font-mono"
          />
        </div>
        <div className="w-40">
          <Label className="text-xs text-muted-foreground mb-1 block">From Base</Label>
          <Select value={fromBase} onValueChange={setFromBase}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Binary (2)</SelectItem>
              <SelectItem value="8">Octal (8)</SelectItem>
              <SelectItem value="10">Decimal (10)</SelectItem>
              <SelectItem value="16">Hex (16)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {results && (
        <div className="space-y-2">
          {Object.entries(results).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
              <div>
                <span className="text-xs text-muted-foreground">{label}: </span>
                <span className="font-mono text-sm font-medium">{val}</span>
              </div>
              <CopyButton text={val} />
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

function PercentageCalculator() {
  const [mode, setMode] = useState<"pct-of" | "what-pct" | "increase">("pct-of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b);
    if (isNaN(av) || isNaN(bv)) return;
    if (mode === "pct-of") setResult(`${((av / 100) * bv).toFixed(4)}`);
    else if (mode === "what-pct") setResult(`${((av / bv) * 100).toFixed(4)}%`);
    else setResult(`${(bv + (bv * av) / 100).toFixed(4)}`);
  };

  const labels: Record<typeof mode, [string, string, string]> = {
    "pct-of": ["Percentage (%)", "Of value", "Result"],
    "what-pct": ["Value", "Total", "Percentage"],
    "increase": ["Increase by (%)", "Original value", "New value"],
  };

  return (
    <ToolCard title="Percentage Calculator" description="Calculate percentages, ratios, and increases">
      <Select value={mode} onValueChange={(v) => { setMode(v as typeof mode); setResult(null); }}>
        <SelectTrigger className="mb-4"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="pct-of">X% of Y</SelectItem>
          <SelectItem value="what-pct">X is what % of Y</SelectItem>
          <SelectItem value="increase">Increase Y by X%</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">{labels[mode][0]}</Label>
          <Input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="0" className="font-mono" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">{labels[mode][1]}</Label>
          <Input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="0" className="font-mono" />
        </div>
      </div>
      <Button size="sm" onClick={calculate} disabled={!a || !b} className="mb-4">
        <Percent className="h-4 w-4 mr-1" /> Calculate
      </Button>
      {result && (
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{labels[mode][2]}</p>
          <p className="text-3xl font-bold font-mono text-primary">{result}</p>
        </div>
      )}
    </ToolCard>
  );
}

// ─── SECURITY TOOLS ──────────────────────────────────────────────────────────

function SecurityPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PasswordGenerator />
      <UUIDGenerator />
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState([16]);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const generate = useCallback(() => {
    const sets: string[] = [];
    if (opts.upper) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (opts.lower) sets.push("abcdefghijklmnopqrstuvwxyz");
    if (opts.numbers) sets.push("0123456789");
    if (opts.symbols) sets.push("!@#$%^&*()-_=+[]{}|;:,.<>?");
    if (!sets.length) return;
    const pool = sets.join("");
    let pw = "";
    sets.forEach((s) => { pw += s[Math.floor(Math.random() * s.length)]; });
    for (let i = pw.length; i < length[0]; i++) {
      pw += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(pw.split("").sort(() => Math.random() - 0.5).join(""));
  }, [length, opts]);

  useEffect(() => { generate(); }, [generate]);

  const strength = () => {
    let score = 0;
    if (opts.upper) score++;
    if (opts.lower) score++;
    if (opts.numbers) score++;
    if (opts.symbols) score++;
    if (length[0] >= 12) score++;
    if (length[0] >= 20) score++;
    return score;
  };

  const s = strength();
  const strengthLabel = s <= 2 ? "Weak" : s <= 3 ? "Fair" : s <= 4 ? "Good" : "Strong";
  const strengthColor = s <= 2 ? "bg-red-500" : s <= 3 ? "bg-yellow-500" : s <= 4 ? "bg-blue-500" : "bg-green-500";

  const toggle = (key: keyof typeof opts) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ToolCard title="Password Generator" description="Generate strong, cryptographically secure passwords">
      <div className="bg-muted/60 rounded-xl p-4 mb-4 flex items-center gap-3">
        <span className="font-mono text-sm flex-1 break-all select-all">{password}</span>
        <Button size="icon" variant="ghost" onClick={generate} aria-label="Regenerate">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <CopyButton text={password} />
      </div>

      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>Length: <strong>{length[0]}</strong></span>
        <span className={`font-semibold ${s <= 2 ? "text-red-500" : s <= 3 ? "text-yellow-500" : s <= 4 ? "text-blue-500" : "text-green-500"}`}>{strengthLabel}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full mb-4">
        <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${(s / 6) * 100}%` }} />
      </div>

      <Slider value={length} onValueChange={setLength} min={6} max={64} step={1} className="mb-4" aria-label="Password length" />

      <div className="grid grid-cols-2 gap-3">
        {(["upper", "lower", "numbers", "symbols"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={opts[key]} onCheckedChange={() => toggle(key)} />
            <span className="capitalize">{key === "upper" ? "A–Z" : key === "lower" ? "a–z" : key === "numbers" ? "0–9" : "Symbols"}</span>
          </label>
        ))}
      </div>
    </ToolCard>
  );
}

function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  };

  return (
    <ToolCard title="UUID v4 Generator" description="Generate cryptographically secure random UUIDs">
      <div className="flex gap-3 mb-4 items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="uuid-count" className="text-sm shrink-0">Count:</Label>
          <Input
            id="uuid-count"
            type="number" min={1} max={20}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-20"
          />
        </div>
        <Button onClick={generate}>
          <Zap className="h-4 w-4 mr-1" /> Generate
        </Button>
        {uuids.length > 0 && (
          <CopyButton text={uuids.join("\n")} label="Copy All" />
        )}
      </div>
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2 gap-2">
              <span className="font-mono text-sm text-muted-foreground">{uuid}</span>
              <CopyButton text={uuid} />
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

// ─── ACCESSIBILITY TOOLS ─────────────────────────────────────────────────────

function AccessibilityPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TextToSpeechPanel />
      <AudioLabPanel />
      <SmartNotesPanel />
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
      if (available.length && !selectedVoice) setSelectedVoice(available[0].voiceURI);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = () => {
    if (!text.trim()) { toast({ title: "Enter some text first" }); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const v = voices.find((v) => v.voiceURI === selectedVoice);
    if (v) utt.voice = v;
    utt.rate = rate[0];
    utt.pitch = pitch[0];
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <ToolCard title="Text to Speech" description="Listen to any text using your browser's speech engine">
      <Textarea
        placeholder="Enter text to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-24 mb-4 font-mono text-sm"
        aria-label="Text to speak"
      />
      {voices.length > 0 && (
        <div className="mb-3">
          <Label className="text-xs text-muted-foreground mb-1 block">Voice</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger><SelectValue placeholder="Select voice" /></SelectTrigger>
            <SelectContent className="max-h-48">{voices.map((v) => <SelectItem key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</SelectItem>)}</SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Speed: {rate[0]}x</Label>
          <Slider value={rate} onValueChange={setRate} min={0.5} max={2} step={0.1} aria-label="Speech rate" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Pitch: {pitch[0]}</Label>
          <Slider value={pitch} onValueChange={setPitch} min={0} max={2} step={0.1} aria-label="Speech pitch" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={speak} disabled={speaking}><Volume2 className="h-4 w-4 mr-1" />{speaking ? "Speaking..." : "Speak"}</Button>
        {speaking && <Button variant="outline" onClick={stop}><Square className="h-4 w-4 mr-1" />Stop</Button>}
      </div>
    </ToolCard>
  );
}

function AudioLabPanel() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorder.current = mr;
      setRecording(true);
    } catch {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  const download = () => {
    if (!audioURL) return;
    const a = document.createElement("a");
    a.href = audioURL;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
  };

  return (
    <ToolCard title="Audio Recorder" description="Record audio from your microphone and download it">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${recording ? "bg-red-500/15 ring-4 ring-red-500/30 animate-pulse" : "bg-muted"}`}>
          <Mic className={`h-8 w-8 ${recording ? "text-red-500" : "text-muted-foreground"}`} aria-hidden="true" />
        </div>
        {recording
          ? <Button variant="destructive" onClick={stopRecording}><Square className="h-4 w-4 mr-1" />Stop Recording</Button>
          : <Button onClick={startRecording}><Mic className="h-4 w-4 mr-1" />Start Recording</Button>
        }
        {audioURL && (
          <div className="w-full space-y-3">
            <audio src={audioURL} controls className="w-full" />
            <Button variant="outline" onClick={download} className="w-full">
              <Download className="h-4 w-4 mr-1" /> Download Recording
            </Button>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

interface Note { id: string; title: string; body: string; createdAt: string; }

function SmartNotesPanel() {
  const KEY = "nwt_smart_notes";
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const save = (notes: Note[]) => { setNotes(notes); localStorage.setItem(KEY, JSON.stringify(notes)); };

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    save([{ id: Date.now().toString(), title, body, createdAt: new Date().toLocaleString() }, ...notes]);
    setTitle(""); setBody("");
    toast({ title: "Note saved" });
  };

  const del = (id: string) => save(notes.filter((n) => n.id !== id));

  return (
    <ToolCard title="Smart Notes" description="Quick notes saved locally in your browser">
      <form onSubmit={add} className="space-y-2 mb-4">
        <Input placeholder="Note title..." value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea placeholder="Note content (optional)..." value={body} onChange={(e) => setBody(e.target.value)} className="h-20 text-sm" />
        <Button type="submit" size="sm"><StickyNote className="h-4 w-4 mr-1" />Save Note</Button>
      </form>
      {notes.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No notes yet. Add one above.</p>}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notes.map((n) => (
          <div key={n.id} className="bg-muted/40 rounded-lg p-3 border border-border/50">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">{n.title}</p>
              <button onClick={() => del(n.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" aria-label="Delete note">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {n.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>}
            <p className="text-xs text-muted-foreground/60 mt-1">{n.createdAt}</p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}
