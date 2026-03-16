import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  FileText,
  Globe,
  Upload,
  ArrowLeft,
  AlertCircle,
  Loader2,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  Lightbulb,
  Check,
} from "lucide-react";
import type { Language } from "@shared/api";
import { extractCVText } from "@/lib/cv-extractor";

const languages = [
  { id: "english", label: "English", flag: "🇬🇧" },
  { id: "hindi", label: "Hindi", flag: "🇮🇳" },
  { id: "bengali", label: "Bengali", flag: "🇧🇩" },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [interviewRole, setInterviewRole] = useState(""); // Free text interview role/type
  const [jobDescription, setJobDescription] = useState(""); // Optional job description
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadingSteps = [
    { label: "Analyzing your profile", icon: FileText },
    { label: "Generating tailored questions", icon: Target },
    { label: "Configuring AI interviewer", icon: Sparkles },
    { label: "Setting up your session", icon: Lightbulb },
  ];

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [loading]);

  const acceptedFileTypes = [".pdf", ".doc", ".docx"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(extension)) {
      return "Please upload a PDF or Word document (.pdf, .doc, .docx)";
    }
    if (file.size > maxFileSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCvFile(file);
    setCvText(null);
    setIsExtracting(true);
    
    try {
      const extractedText = await extractCVText(file);
      setCvText(extractedText);
      console.log("Extracted CV text:", extractedText.substring(0, 200) + "...");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract text from CV";
      setError(message);
      setCvFile(null);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setCvFile(null);
    setCvText(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startInterview = () => {
    if (!interviewRole.trim() || !selectedLanguage) {
      setError("Please complete all steps");
      return;
    }

    setLoading(true);
    navigate("/interview", {
      state: {
        interviewType: interviewRole.trim(),
        language: selectedLanguage,
        timerDuration,
        cvText: cvText || undefined,
        jobDescription: jobDescription.trim() || undefined,
      },
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative flex flex-col items-center gap-6 px-6 max-w-sm w-full">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
            <svg className="absolute inset-0 w-20 h-20 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
              <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60 180" strokeLinecap="round" className="text-primary" />
            </svg>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold">Preparing Your Interview</h2>
            <p className="text-muted-foreground text-sm">Customizing everything for you</p>
          </div>
          <div className="w-full space-y-2">
            {loadingSteps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === loadingStep;
              const isCompleted = i < loadingStep;
              return (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-500 ${
                  isCompleted ? "bg-primary/5 border-primary/20" : isActive ? "bg-primary/10 border-primary/30 shadow-md" : "bg-muted/30 border-transparent opacity-40"
                }`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isCompleted ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StepIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-sm font-medium ${isCompleted ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out" style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canStart = interviewRole.trim() && selectedLanguage;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              InterviewAI Setup
            </span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Main — all sections in one view */}
      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 py-3 flex flex-col gap-3">
        {/* Error banner */}
        {error && (
          <div className="flex-shrink-0 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex gap-2 items-center text-sm">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* 3-column layout */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">

          {/* ── Column 1: Role & Language ─────────────────────────── */}
          <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Role & Language</h2>
                <p className="text-[10px] text-muted-foreground">Required fields</p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {/* Role */}
              <div className="space-y-1.5">
                <Label htmlFor="interviewRole" className="text-xs font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-primary" />
                  Target Position <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="interviewRole"
                  placeholder="e.g., Software Engineer, PM..."
                  value={interviewRole}
                  onChange={(e) => setInterviewRole(e.target.value)}
                  className="h-9 text-sm bg-background/60 border-muted-foreground/20 focus:border-primary"
                />
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-primary" />
                  Language <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((l) => (
                    <button key={l.id} type="button"
                      onClick={() => setSelectedLanguage(l.id as Language)}
                      className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border-2 transition-all text-center ${
                        selectedLanguage === l.id
                          ? "border-primary bg-primary/8 shadow-sm"
                          : "border-muted-foreground/15 hover:border-primary/40 bg-background/40"
                      }`}>
                      <span className="text-lg">{l.flag}</span>
                      <span className="text-[11px] font-medium">{l.label}</span>
                      {selectedLanguage === l.id && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-primary-foreground" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-1.5">
                <Label htmlFor="jobDescription" className="text-xs font-semibold flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-primary" />
                  Job Description
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">optional</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste JD for personalized questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[80px] max-h-[120px] text-xs resize-y bg-background/60 border-muted-foreground/20 focus:border-primary"
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-primary" />
                  Helps AI match questions to employer requirements
                </p>
              </div>
            </div>
          </div>

          {/* ── Column 2: Resume Upload ──────────────────────────── */}
          <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Resume</h2>
                <p className="text-[10px] text-muted-foreground">Optional but recommended</p>
              </div>
            </div>

            <div
              className={`flex-1 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : cvFile
                  ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                  : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" ref={fileInputRef} hidden accept=".pdf,.doc,.docx" onChange={handleInputChange} />

              {cvFile ? (
                <div className="text-center space-y-3">
                  {isExtracting ? (
                    <>
                      <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Analyzing resume…</p>
                        <p className="text-xs text-muted-foreground">{cvFile.name}</p>
                      </div>
                    </>
                  ) : cvText ? (
                    <>
                      <div className="w-14 h-14 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-green-700 dark:text-green-400">Resume uploaded!</p>
                        <p className="text-xs text-muted-foreground">{cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5 text-left max-h-20 overflow-y-auto w-full border border-muted">
                        <p className="text-[10px] text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {cvText.substring(0, 180)}{cvText.length > 180 ? "…" : ""}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={removeFile}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-7 text-xs">
                        <X className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-semibold text-sm">File uploaded!</p>
                      <p className="text-xs text-muted-foreground">{cvFile.name}</p>
                      <Button variant="outline" size="sm" onClick={removeFile}
                        className="text-red-500 hover:text-red-600 h-7 text-xs">
                        <X className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className={`mx-auto w-14 h-14 rounded-xl flex items-center justify-center ${isDragging ? "bg-primary/20 scale-110" : "bg-gradient-to-br from-primary/10 to-primary/5"}`}>
                    <Upload className={`w-7 h-7 ${isDragging ? "text-primary scale-110" : "text-primary/60"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{isDragging ? "Release to upload" : "Drop resume here"}</p>
                    <p className="text-xs text-muted-foreground">or browse files</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBrowseClick} className="h-8 px-4 text-xs">
                    <Upload className="mr-1.5 w-3.5 h-3.5" /> Browse
                  </Button>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                    <span>PDF</span><span>DOC</span><span>DOCX</span>
                    <span className="text-muted-foreground/40">•</span><span>Max 5MB</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Column 3: Duration & Start ───────────────────────── */}
          <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Duration</h2>
                <p className="text-[10px] text-muted-foreground">Set session length</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {/* Large display */}
              <div className="text-center py-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {timerDuration}
                </span>
                <span className="text-lg text-muted-foreground font-medium ml-1">min</span>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input type="range" min={5} max={120} step={5} value={timerDuration}
                  onChange={(e) => setTimerDuration(+e.target.value)}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-pointer" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>5m</span><span>30m</span><span>60m</span><span>90m</span><span>120m</span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((mins) => (
                  <Button key={mins} variant={timerDuration === mins ? "default" : "outline"} size="sm"
                    onClick={() => setTimerDuration(mins)} className="h-8 text-xs">
                    {mins} min
                  </Button>
                ))}
              </div>

              {/* Tip */}
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">30-45 min</span> is ideal for 6-8 questions with follow-ups.
                </p>
              </div>
            </div>

            {/* Start button at bottom */}
            <div className="mt-3 flex-shrink-0">
              <Button
                onClick={startInterview}
                disabled={loading || !canStart}
                className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
              {!canStart && (
                <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                  Fill in position & language to start
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
