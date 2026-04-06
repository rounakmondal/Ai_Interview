import { useState, useEffect } from "react";
import { useVacancyAlert } from "@/hooks/use-vacancy-alert";
import { VacancyCard } from "@/components/VacancyCard";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const EXAM_TYPES = [
  "All",
  "WBCS", 
  "WBP Constable", 
  "WBP SI", 
  "WBPSC Clerkship", 
  "Primary TET", 
  "Upper Primary TET", 
  "Group D"
];

export default function VacancyAlertCenter() {
  const { vacancies, loading, status, subscribe, fetchVacancies } = useVacancyAlert();
  const [selectedExam, setSelectedExam] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchVacancies(selectedExam);
  }, [selectedExam, fetchVacancies]);

  const handleTogglePref = (exam: string) => {
    setSelectedPrefs(prev => 
      prev.includes(exam) 
        ? prev.filter(e => e !== exam) 
        : [...prev, exam]
    );
  };

  const handleSubscribe = async () => {
    if (selectedPrefs.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one exam for notifications.",
        variant: "destructive"
      });
      return;
    }
    
    await subscribe(selectedPrefs, email);
    setIsModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12">
      {/* Hero Header */}
      <div className="bg-orange-700 text-white py-12 px-4 mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            West Bengal Vacancy Alert Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto"
          >
            Stay updated with the latest recruitment notifications from WBP, WBPSC, WBCS, and more. 
            Never miss an opportunity again.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-8 shadow-lg">
                  <Bell className="w-5 h-5 mr-2" />
                  Notify Me
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center">
                    <Bell className="w-6 h-6 mr-2 text-orange-600" />
                    Set Preferences
                  </DialogTitle>
                  <DialogDescription>
                    Choose the exams you want to receive push notifications for.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {EXAM_TYPES.filter(e => e !== "All").map((exam) => (
                      <div key={exam} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 transition-colors">
                        <Checkbox 
                          id={`exam-${exam}`} 
                          checked={selectedPrefs.includes(exam)}
                          onCheckedChange={() => handleTogglePref(exam)}
                        />
                        <Label 
                          htmlFor={`exam-${exam}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {exam}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor="email" className="text-sm font-bold flex items-center">
                      <Mail className="w-4 h-4 mr-1" /> Email Notifications (Optional)
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      We'll send you a confirmation and important updates via email.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={handleSubscribe}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center bg-orange-800/50 rounded-lg px-4 py-2 border border-orange-500/30">
              <span className="text-orange-200 text-sm font-medium flex items-center">
                Status: 
                {status === "success" ? (
                  <span className="ml-2 flex items-center text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Subscribed ✅
                  </span>
                ) : status === "error" ? (
                  <span className="ml-2 flex items-center text-red-400">
                    <AlertCircle className="w-4 h-4 mr-1" /> Failed ❌
                  </span>
                ) : (
                  <span className="ml-2 text-orange-300">Not Subscribed</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center mr-2 text-slate-500">
            <Filter className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          {EXAM_TYPES.map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedExam === exam
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            Latest Vacancies
            <span className="ml-2 text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {vacancies.length} Found
            </span>
          </h2>
        </div>

        {/* Grid Feed */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[200px] bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
            ))}
          </div>
        ) : vacancies.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No vacancies found for {selectedExam}.</p>
            <Button 
              variant="link" 
              className="text-orange-600"
              onClick={() => setSelectedExam("All")}
            >
              Clear filters and see all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
