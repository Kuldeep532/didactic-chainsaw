import { useMemo, useState } from "react";
import { Copy, Eraser, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sentenceCase(value: string) {
  const trimmed = value.trim().toLowerCase();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : "";
}

export default function Utilities() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [countText, setCountText] = useState("");

  const stats = useMemo(() => {
    const words = countText.trim() ? countText.trim().split(/\s+/).length : 0;
    const characters = countText.length;
    const charactersNoSpaces = countText.replace(/\s/g, "").length;
    return { words, characters, charactersNoSpaces };
  }, [countText]);

  const copyText = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied", description: "The text is ready to paste anywhere." });
    } catch {
      toast({ title: "Copy unavailable", description: "Select the text and copy it manually.", variant: "destructive" });
    }
  };

  const cleanText = () => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    setProcessedText(cleaned);
  };

  return (
    <div className="flex w-full flex-col pb-20">
      <section className="border-b border-border bg-background px-4 pb-16 pt-24 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Nexus Web Technology Utilities</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Small helpers for everyday work</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Simple, fast tools inspired by the text and accessibility utilities in Nexus products. They run in your browser and do not require an account.
          </p>
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:px-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Word & character counter</h2>
            </div>
            <Label htmlFor="counter-text">Text</Label>
            <Textarea
              id="counter-text"
              value={countText}
              onChange={(event) => setCountText(event.target.value)}
              placeholder="Paste or type text here…"
              className="mt-2 min-h-40"
            />
            <div className="mt-5 grid grid-cols-3 gap-3" aria-live="polite">
              <div className="rounded-xl border border-border p-3 text-center">
                <p className="text-2xl font-bold">{stats.words}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <p className="text-2xl font-bold">{stats.characters}</p>
                <p className="text-xs text-muted-foreground">Characters</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <p className="text-2xl font-bold">{stats.charactersNoSpaces}</p>
                <p className="text-xs text-muted-foreground">No spaces</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Text format converter</h2>
            </div>
            <Label htmlFor="format-text">Text</Label>
            <Textarea
              id="format-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setProcessedText("");
              }}
              placeholder="Paste text to clean or reformat…"
              className="mt-2 min-h-40"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Button variant="outline" onClick={() => setProcessedText(text.toUpperCase())}>UPPERCASE</Button>
              <Button variant="outline" onClick={() => setProcessedText(text.toLowerCase())}>lowercase</Button>
              <Button variant="outline" onClick={() => setProcessedText(titleCase(text))}>Title Case</Button>
              <Button variant="outline" onClick={() => setProcessedText(sentenceCase(text))}>Sentence case</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="outline" onClick={cleanText}>
                <Eraser className="mr-2 h-4 w-4" aria-hidden="true" />
                Clean extra spaces
              </Button>
            </div>

            {processedText && (
              <div className="mt-6">
                <Label htmlFor="processed-text">Result</Label>
                <Textarea id="processed-text" readOnly value={processedText} className="mt-2 min-h-32" />
                <Button className="mt-3" onClick={() => void copyText(processedText)}>
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  Copy result
                </Button>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
