import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Code,
  FileText,
  Globe,
  Upload,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  X,
  CheckCircle,
} from "lucide-react";
import type { InterviewType, Language } from "@shared/api";

const interviewTypes = [
  { id: "government", label: "Government", icon: Briefcase },
  { id: "private", label: "Private Sector", icon: Briefcase },
  { id: "it", label: "IT / Software", icon: Code },
  { id: "non-it", label: "Non-IT", icon: Briefcase },
];

const languages = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "bengali", label: "Bengali" },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"type" | "language" | "cv" | "timer">("type");
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [timerDuration, setTimerDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCvFile(file);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startInterview = () => {
    if (!selectedType || !selectedLanguage) {
      setError("Please complete all steps");
      return;
    }

    setLoading(true);
    navigate("/interview", {
      state: {
        interviewType: selectedType,
        language: selectedLanguage,
        timerDuration,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm sm:text-base">
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </Link>
          <strong className="text-sm sm:text-base">InterviewAI</strong>
          <div className="w-12" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Setup Your Interview</h1>

        {error && (
          <div className="mb-4 sm:mb-6 flex gap-2 text-red-600 text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === "type" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">Select interview type</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {interviewTypes.map((t) => (
                <Card
                  key={t.id}
                  className={`p-4 sm:p-6 cursor-pointer transition-all active:scale-[0.98] ${
                    selectedType === t.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedType(t.id as InterviewType)}
                >
                  <t.icon className="mb-2 sm:mb-3 text-primary w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="font-semibold text-sm sm:text-base">{t.label}</h3>
                </Card>
              ))}
            </div>

            <Button
              disabled={!selectedType}
              onClick={() => setStep("language")}
              className="w-full sm:w-auto"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === "language" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">Select interview language</p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {languages.map((l) => (
                <Card
                  key={l.id}
                  className={`p-4 sm:p-6 cursor-pointer text-center transition-all active:scale-[0.98] ${
                    selectedLanguage === l.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedLanguage(l.id as Language)}
                >
                  <Globe className="mb-2 sm:mb-3 text-primary w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                  <span className="text-sm sm:text-base font-medium">{l.label}</span>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 sm:justify-between">
              <Button variant="outline" onClick={() => setStep("type")} className="flex-1 sm:flex-none">
                Back
              </Button>
              <Button
                disabled={!selectedLanguage}
                onClick={() => setStep("cv")}
                className="flex-1 sm:flex-none"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === "cv" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">Upload your CV (optional)</p>
            <Card
              className={`p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-dashed transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : cvFile
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-muted-foreground/30 hover:border-primary/50"
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
                  <CheckCircle className="mx-auto mb-4 text-green-500 w-12 h-12" />
                  <p className="font-semibold text-lg mb-2">File uploaded successfully!</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <FileText className="w-4 h-4" />
                    <span>{cvFile.name}</span>
                    <span className="text-xs">({(cvFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isDragging ? "bg-primary/20" : "bg-primary/10"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 transition-colors ${
                        isDragging ? "text-primary" : "text-primary/70"
                      }`}
                    />
                  </div>
                  <p className="font-semibold text-lg mb-2">
                    {isDragging ? "Drop your CV here" : "Upload your CV"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <Button variant="outline" onClick={handleBrowseClick}>
                    <Upload className="mr-2 w-4 h-4" /> Browse Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              )}
            </Card>

            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 text-center">
              This step is optional. You can skip it and continue without uploading a CV.
            </p>

            <div className="flex gap-3 sm:justify-between">
              <Button variant="outline" onClick={() => setStep("language")} className="flex-1 sm:flex-none">
                Back
              </Button>
              <Button onClick={() => setStep("timer")} className="flex-1 sm:flex-none">
                {cvFile ? "Continue" : "Skip & Continue"}
              </Button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === "timer" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">Set interview duration</p>
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="mb-3 sm:mb-4 font-semibold text-center text-lg sm:text-xl">
                {timerDuration} minutes
              </p>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={timerDuration}
                onChange={(e) => setTimerDuration(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>5 min</span>
                <span>120 min</span>
              </div>
            </Card>

            <div className="flex gap-3 sm:justify-between">
              <Button variant="outline" onClick={() => setStep("cv")} className="flex-1 sm:flex-none">
                Back
              </Button>
              <Button onClick={startInterview} disabled={loading} className="flex-1 sm:flex-none">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Starting...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
