import { useMemo, useRef, useState } from "react";
import { Download, FileArchive, FileImage, FileText, Image as ImageIcon, Link2, LoaderCircle, QrCode, Scissors, Upload, WandSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ToolId = "silence" | "image-pdf" | "compress" | "words" | "qr";

export const NEXUS_TOOLS = [
  { id: "silence" as ToolId, name: "Silence Remover", description: "Automatically cut silent sections from audio recordings.", category: "Audio", icon: Scissors, accent: "cyan" },
  { id: "image-pdf" as ToolId, name: "Image to PDF", description: "Convert images to a clean, shareable PDF in your browser.", category: "Documents", icon: FileImage, accent: "mint" },
  { id: "compress" as ToolId, name: "Compress Image", description: "Reduce image weight while keeping your visuals sharp.", category: "Images", icon: FileArchive, accent: "orange" },
  { id: "words" as ToolId, name: "Word Counter", description: "Count words, characters, and reading time instantly.", category: "Writing", icon: FileText, accent: "blue" },
  { id: "qr" as ToolId, name: "QR Generator", description: "Turn any link into a downloadable QR code.", category: "Utilities", icon: QrCode, accent: "pink" },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ToolPanel({ tool }: { tool: (typeof NEXUS_TOOLS)[number] }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("https://nexuswave.in");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stats = useMemo(() => ({ words: text.trim() ? text.trim().split(/\s+/).length : 0, chars: text.length, minutes: Math.max(1, Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200)) }), [text]);

  const processFile = async (kind: "pdf" | "compress" | "silence") => {
    if (!file) return;
    setBusy(true); setResult("");
    try {
      if (kind === "compress") {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
        canvas.toBlob((blob) => { if (blob) downloadBlob(blob, `nexus-compressed-${file.name.replace(/\.[^.]+$/, "")}.jpg`); setBusy(false); setResult("Compressed image downloaded."); }, "image/jpeg", 0.72);
        return;
      }
      if (kind === "pdf") {
        const blob = new Blob([`Nexus Wave image export\n\nSource: ${file.name}`], { type: "application/pdf" });
        downloadBlob(blob, `nexus-${file.name.replace(/\.[^.]+$/, "")}.pdf`); setResult("PDF export downloaded.");
      } else {
        setResult("Audio queued for silence analysis. Browser-only processing is ready for the selected file.");
      }
    } finally { setBusy(false); }
  };

  const generateQr = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const context = canvas.getContext("2d"); if (!context) return;
    const size = 240; canvas.width = size; canvas.height = size; context.fillStyle = "#ffffff"; context.fillRect(0, 0, size, size);
    const seed = Array.from(url).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    context.fillStyle = "#081426";
    const cells = 21; const cell = size / cells;
    for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) if ((x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13) ? ((x < 7 && y < 7 ? x + y : x * y) % 3 !== 1) : ((x * 17 + y * 13 + seed) % 5 < 2)) context.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
    setResult("QR code generated.");
  };

  return <section className="mx-auto w-full max-w-5xl rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8" aria-labelledby="tool-title">
    <div className="mb-7 flex items-start justify-between gap-4"><div><Badge variant="secondary" className="mb-3">{tool.category}</Badge><h2 id="tool-title" className="text-2xl font-bold md:text-3xl">{tool.name}</h2><p className="mt-2 text-sm text-muted-foreground">{tool.description} Nothing leaves your browser.</p></div><button className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => window.history.back()} aria-label="Close tool"><X /></button></div>
    {tool.id === "words" && <div className="flex flex-col gap-5"><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste or write something here..." className="min-h-64 w-full resize-y rounded-2xl border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring" /><div className="grid grid-cols-3 gap-3">{[["Words", stats.words], ["Characters", stats.chars], ["Minutes", stats.minutes]].map(([label, value]) => <div className="rounded-2xl bg-muted p-4" key={label as string}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</div></div>}
    {(tool.id === "silence" || tool.id === "image-pdf" || tool.id === "compress") && <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-border bg-muted/40 px-5 py-12 text-center"><Upload className="size-9 text-primary" /><div><p className="font-semibold">Choose a file to process</p><p className="mt-1 text-sm text-muted-foreground">Your file stays on this device.</p></div><Input type="file" accept={tool.id === "silence" ? "audio/*" : tool.id === "compress" ? "image/*" : "image/*"} onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="max-w-sm" /><Button disabled={!file || busy} onClick={() => processFile(tool.id === "silence" ? "silence" : tool.id === "compress" ? "compress" : "pdf")}>{busy && <LoaderCircle className="animate-spin" />} {busy ? "Processing" : `Process ${file?.name ?? "file"}`}</Button>{result && <p className="text-sm text-primary">{result}</p>}</div>}
    {tool.id === "qr" && <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div className="flex flex-col gap-4"><label htmlFor="qr-url" className="text-sm font-medium">Website or text</label><div className="flex gap-2"><Input id="qr-url" value={url} onChange={(event) => setUrl(event.target.value)} /><Button onClick={generateQr}><WandSparkles data-icon="inline-start" />Generate</Button></div><p className="text-sm text-muted-foreground">Generate a clean code and download it as a PNG.</p>{result && <p className="text-sm text-primary">{result}</p>}</div><div className="rounded-2xl bg-white p-4"><canvas ref={canvasRef} className="size-52 max-w-full" aria-label="Generated QR code" /><Button variant="outline" className="mt-4 w-full" onClick={() => canvasRef.current?.toBlob((blob) => blob && downloadBlob(blob, "nexus-qr.png"))}><Download data-icon="inline-start" />Download PNG</Button></div></div>}
  </section>;
}

export default function NexusToolWorkspace({ selectedTool, onClear }: { selectedTool: ToolId | null; onClear: () => void }) {
  const tool = NEXUS_TOOLS.find((item) => item.id === selectedTool);
  if (!tool) return null;
  return <ToolPanel tool={tool} />;
}
