import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";

type InterviewType =
  | "government"
  | "private"
  | "it"
  | "non-it"
  | null;
type Language = "english" | "hindi" | "bengali" | null;

const interviewTypes = [
  {
    id: "government",
    label: "Government",
    description: "Civil services, banking, and government job interviews",
    icon: Briefcase,
  },
  {
    id: "private",
    label: "Private Sector",
    description: "Corporate and private company interviews",
    icon: Briefcase,
  },
  {
    id: "it",
    label: "IT / Software",
    description: "Technical interviews for software engineers",
    icon: Code,
  },
  {
    id: "non-it",
    label: "Non-IT",
    description: "Interviews for non-technical roles",
    icon: Briefcase,
  },
];

const languages = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi (हिंदी)" },
  { id: "bengali", label: "Bengali (বাংলা)" },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<InterviewType>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [step, setStep] = useState<"type" | "language" | "cv">("type");

  const handleTypeSelect = (type: string) => {
    setSelectedType(type as InterviewType);
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang as Language);
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleStartInterview = () => {
    if (selectedType && selectedLanguage) {
      // Navigate to interview room with state
      navigate("/interview", {
        state: {
          interviewType: selectedType,
          language: selectedLanguage,
          cvUploaded: !!cvFile,
        },
      });
    }
  };

  const isReadyToStart =
    selectedType && selectedLanguage;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              AI
            </div>
            <span className="font-bold text-foreground hidden sm:inline">
              InterviewAI
            </span>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold">
                Setup Your Interview
              </h1>
              <div className="text-sm text-muted-foreground">
                Step {step === "type" ? 1 : step === "language" ? 2 : 3} of 3
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex gap-2">
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step === "type" || step === "language" || step === "cv"
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step === "language" || step === "cv" ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step === "cv" ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          </div>

          {/* Step 1: Interview Type */}
          {step === "type" && (
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  What type of interview?
                </h2>
                <p className="text-muted-foreground">
                  Select the interview category that matches your target job or
                  exam.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {interviewTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <Card
                      key={type.id}
                      className={`p-6 cursor-pointer border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/50 hover:bg-primary/2"
                      }`}
                      onClick={() => handleTypeSelect(type.id)}
                    >
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex justify-end pt-2">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep("language")}
                  disabled={!selectedType}
                  size="lg"
                  className="gradient-primary text-base font-semibold"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Language Selection */}
          {step === "language" && (
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Select Interview Language
                </h2>
                <p className="text-muted-foreground">
                  Choose the language in which you want to conduct the interview.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <Card
                      key={lang.id}
                      className={`p-6 cursor-pointer border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/50"
                      }`}
                      onClick={() => handleLanguageSelect(lang.id)}
                    >
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                          <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">{lang.label}</h3>
                        {isSelected && (
                          <div className="flex justify-end pt-2">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep("type")}
                  variant="outline"
                  size="lg"
                  className="text-base font-semibold"
                >
                  <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep("cv")}
                  disabled={!selectedLanguage}
                  size="lg"
                  className="gradient-primary text-base font-semibold"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: CV Upload (Optional) */}
          {step === "cv" && (
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upload Your CV</h2>
                <p className="text-muted-foreground">
                  Optional: Upload your CV to help the AI interviewer ask
                  relevant questions about your experience.
                </p>
              </div>

              <Card className="border-2 border-dashed border-border/40 p-8 sm:p-12">
                <div className="space-y-4 text-center">
                  {!cvFile ? (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mx-auto">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          Drag your CV here
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (PDF, DOC up to 10MB)
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                        />
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-base font-semibold"
                          asChild
                        >
                          <span>
                            <Upload className="w-5 h-5 mr-2" />
                            Choose File
                          </span>
                        </Button>
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mx-auto">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {cvFile.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ready to upload
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary text-base font-semibold"
                          asChild
                        >
                          <span>Change File</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
                <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  ℹ️
                </div>
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  Your CV is optional and helps personalize the interview
                  questions. You can skip this step if you prefer.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep("language")}
                  variant="outline"
                  size="lg"
                  className="text-base font-semibold"
                >
                  <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={handleStartInterview}
                  disabled={!isReadyToStart}
                  size="lg"
                  className="gradient-primary text-base font-semibold px-8"
                >
                  Start Interview
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
