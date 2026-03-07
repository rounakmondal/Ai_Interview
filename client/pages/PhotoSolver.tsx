import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  ImagePlus,
  Cpu,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  FileQuestion,
  Target,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Simulated OCR + solution result
interface SolverResult {
  detectedText: string;
  steps: string[];
  finalAnswer: string;
  explanation: string;
  subject: string;
  difficulty: string;
}

// Mock solver responses keyed by detected keyword
function mockSolve(imageDataUrl: string): Promise<SolverResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated result — in production this would call a vision API
      resolve({
        detectedText:
          "A train travels 360 km in 4 hours. What is its speed in metres per second?",
        subject: "Mathematics – Speed & Distance",
        difficulty: "Easy",
        steps: [
          "Step 1: Identify given values — Distance = 360 km, Time = 4 hours",
          "Step 2: Calculate speed in km/h — Speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h",
          "Step 3: Convert km/h to m/s — multiply by 1000/3600 (i.e., 5/18)",
          "Step 4: Speed in m/s = 90 × (5/18) = 90 × 5 / 18 = 450/18 = 25 m/s",
        ],
        finalAnswer: "25 m/s",
        explanation:
          "To convert km/h to m/s, always multiply by 5/18. This is because 1 km = 1000 m and 1 hour = 3600 s, so the conversion factor is 1000/3600 = 5/18. This conversion is extremely common in Railway, SSC, and Banking exams.",
      });
    }, 2500);
  });
}

export default function PhotoSolver() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [result, setResult] = useState<SolverResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setStatus("processing");
      setResult(null);
      const res = await mockSolve(dataUrl);
      setResult(res);
      setStatus("done");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setImage(null);
    setStatus("idle");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/govt-practice" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Photo Question Solver</span>
          <Badge variant="secondary" className="ml-2 text-xs">AI Powered</Badge>
        </div>
      </header>

      <main className="container px-4 py-10 max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" />
            AI Photo Solver
          </div>
          <h1 className="text-3xl font-bold">Solve Questions from Photos</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Upload an image of any exam question — our AI will detect the text, solve it step-by-step, and explain the answer.
          </p>
        </div>

        {/* Upload Zone */}
        {status === "idle" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <ImagePlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-semibold text-foreground">
              Drag & drop your question image here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse — JPG, PNG, WEBP supported
            </p>
            <Button variant="outline" size="sm" className="mt-4 gap-1.5 pointer-events-none">
              <Upload className="w-3.5 h-3.5" />
              Upload Image
            </Button>
          </div>
        )}

        {/* Preview + processing */}
        {image && status !== "idle" && (
          <Card className="overflow-hidden border-border/40">
            <div className="relative">
              <img
                src={image}
                alt="Uploaded question"
                className="w-full max-h-64 object-contain bg-muted/30"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === "processing" && (
              <div className="p-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                <p className="text-sm font-medium text-foreground">Analyzing image...</p>
                <p className="text-xs text-muted-foreground">Detecting question text and solving...</p>
              </div>
            )}
          </Card>
        )}

        {/* Result */}
        {result && status === "done" && (
          <div className="space-y-5">
            {/* Detected text */}
            <Card className="p-5 sm:p-6 border-border/40 space-y-3">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Detected Question</h2>
                <div className="ml-auto flex gap-2">
                  <Badge variant="secondary" className="text-xs">{result.subject}</Badge>
                  <Badge variant="outline" className="text-xs">{result.difficulty}</Badge>
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-4">
                <p className="text-sm leading-relaxed font-medium">{result.detectedText}</p>
              </div>
            </Card>

            {/* Steps */}
            <Card className="p-5 sm:p-6 border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold">Step-by-Step Solution</h2>
              </div>
              <div className="space-y-3">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/85 pt-1 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Final Answer */}
            <Card className="p-5 sm:p-6 border-green-500/30 bg-green-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="font-bold text-green-700 dark:text-green-300">Final Answer</h2>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{result.finalAnswer}</p>
            </Card>

            {/* Explanation */}
            <Card className="p-5 sm:p-6 border-border/40 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold">Explanation & Exam Tips</h2>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                <p className="text-sm text-foreground/80 leading-relaxed">{result.explanation}</p>
              </div>
            </Card>

            {/* Retry */}
            <Button variant="outline" onClick={reset} className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Solve Another Question
            </Button>
          </div>
        )}

        {/* How it works */}
        {status === "idle" && (
          <Card className="p-5 border-border/40">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">How it works</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { num: "1", title: "Upload Photo", desc: "Take a photo of any printed or handwritten question" },
                { num: "2", title: "AI Detects Text", desc: "Our AI reads the question text from the image accurately" },
                { num: "3", title: "Get Solution", desc: "Receive step-by-step explanation with the final answer" },
              ].map((s) => (
                <div key={s.num} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
