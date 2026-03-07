import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  FileText,
  Globe,
  Upload,
  ChevronRight,
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

const steps = [
  { id: "type", label: "Role & Language", icon: Briefcase },
  { id: "cv", label: "Resume", icon: FileText },
  { id: "timer", label: "Duration", icon: Clock },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"type" | "cv" | "timer">("type");
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

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative flex flex-col items-center gap-10 px-6 max-w-md w-full">
          {/* Animated logo ring */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                <Sparkles className="w-9 h-9 text-primary-foreground animate-pulse" />
              </div>
            </div>
            {/* Spinning ring */}
            <svg className="absolute inset-0 w-28 h-28 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="54" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
              <circle cx="56" cy="56" r="54" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80 260" strokeLinecap="round" className="text-primary" />
            </svg>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Preparing Your Interview
            </h2>
            <p className="text-muted-foreground text-sm">Hang tight — we're customizing everything for you</p>
          </div>

          {/* Animated steps */}
          <div className="w-full space-y-3">
            {loadingSteps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === loadingStep;
              const isCompleted = i < loadingStep;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                    isCompleted
                      ? "bg-primary/5 border-primary/20"
                      : isActive
                      ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10 scale-[1.02]"
                      : "bg-muted/30 border-transparent opacity-40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-500 ${
                    isCompleted ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                  {isCompleted && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Step {loadingStep + 1} of {loadingSteps.length}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b bg-background/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : isActive
                          ? "bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium transition-colors ${
                        isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-16 md:w-24 h-0.5 mx-2 transition-colors duration-300 ${
                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">Error</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* STEP 1 - Role + Language combined */}
        {step === "type" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Set Up Your Interview</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tell us what role you're targeting and your preferred language
              </p>
            </div>

            <Card className="p-6 sm:p-8 shadow-lg border-0 bg-card/50 backdrop-blur">
              <div className="space-y-7">
                {/* Interview Role Input */}
                <div className="space-y-2">
                  <Label htmlFor="interviewRole" className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Target Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="interviewRole"
                    placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="h-11 text-base bg-background/60 border-muted-foreground/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3" />
                    Be specific — &ldquo;Senior Frontend Engineer&rdquo; works better than just &ldquo;Developer&rdquo;
                  </p>
                </div>

                {/* Language Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Interview Language <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {languages.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedLanguage(l.id as Language)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedLanguage === l.id
                            ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                            : "border-muted-foreground/15 hover:border-primary/40 hover:bg-muted/40 bg-background/40"
                        }`}
                      >
                        <span className="text-2xl">{l.flag}</span>
                        <span className="text-sm font-medium">{l.label}</span>
                        {selectedLanguage === l.id && (
                          <span className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                      Optional
                    </span>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Job Description
                    <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">optional</span>
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here for highly personalized questions..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[130px] text-sm resize-y bg-background/60 border-muted-foreground/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                    Including a JD lets AI generate questions that match the exact skills the employer wants.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!interviewRole.trim() || !selectedLanguage}
                onClick={() => setStep("cv")}
                className="min-w-[200px] h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 - CV Upload */}
        {step === "cv" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">       
              <h1 className="text-2xl sm:text-3xl font-bold">Upload Your Resume</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Share your CV to receive personalized questions based on your experience
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                <Lightbulb className="w-3 h-3" />
                Optional but recommended
              </span>
            </div>

            <Card
              className={`p-8 sm:p-10 border-2 border-dashed transition-all duration-300 bg-card/50 backdrop-blur ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/20"
                  : cvFile
                  ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                  : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
              />

              {cvFile ? (
                <div className="text-center">
                  {isExtracting ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Analyzing your resume...</p>
                        <p className="text-sm text-muted-foreground mt-1">Extracting skills and experience</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full mx-auto w-fit">
                        <FileText className="w-4 h-4" />
                        <span>{cvFile.name}</span>
                      </div>
                    </div>
                  ) : cvText ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-green-700 dark:text-green-400">Resume uploaded successfully!</p>
                        <p className="text-sm text-muted-foreground mt-1">Your experience will be used to personalize questions</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm bg-muted/50 px-4 py-2 rounded-full mx-auto w-fit">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{cvFile.name}</span>
                        <span className="text-xs text-muted-foreground">({(cvFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-4 text-left max-h-32 overflow-y-auto mx-auto max-w-md border border-muted">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {cvText.substring(0, 250)}{cvText.length > 250 ? "..." : ""}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <X className="w-4 h-4 mr-1" /> Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">File uploaded!</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                          <FileText className="w-4 h-4" />
                          <span>{cvFile.name}</span>
                          <span className="text-xs">({(cvFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <X className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div
                    className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging 
                        ? "bg-primary/20 scale-110" 
                        : "bg-gradient-to-br from-primary/10 to-primary/5"
                    }`}
                  >
                    <Upload
                      className={`w-10 h-10 transition-all duration-300 ${
                        isDragging ? "text-primary scale-110" : "text-primary/60"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-xl">
                      {isDragging ? "Release to upload" : "Drop your resume here"}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      or click the button below to browse
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleBrowseClick}
                    className="h-12 px-6"
                  >
                    <Upload className="mr-2 w-5 h-5" /> Browse Files
                  </Button>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> PDF
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> DOC
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> DOCX
                    </span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>Max 5MB</span>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("type")}
                className="h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={() => setStep("timer")}
                className="min-w-[200px] h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {cvFile ? "Continue" : "Skip this step"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 - Timer */}
        {step === "timer" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Set Interview Duration</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose how long you'd like your practice session to last
              </p>
            </div>

            <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur">
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {timerDuration}
                  </span>
                  <span className="text-2xl text-muted-foreground font-medium">minutes</span>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(+e.target.value)}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>90 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[15, 30, 45].map((mins) => (
                  <Button
                    key={mins}
                    variant={timerDuration === mins ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimerDuration(mins)}
                    className="h-10"
                  >
                    {mins} min
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Recommended duration</p>
                    <p className="text-muted-foreground mt-0.5">
                      30-45 minutes is ideal for a comprehensive practice session with 6-8 questions and follow-ups.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("cv")}
                className="h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={startInterview}
                disabled={loading}
                className="min-w-[220px] h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
