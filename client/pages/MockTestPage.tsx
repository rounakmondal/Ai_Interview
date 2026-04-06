import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye, Timer, Download, ChevronLeft, ChevronRight,
  CheckCircle2, ArrowLeft, Brain, TrendingUp,
  RotateCcw, BookOpen, ChevronDown, ChevronUp,
  AlertTriangle, PenLine, Clock, Flag,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  fetchMockTestPaper,
  type MockPaperMeta,
  type MockQuestion,
} from "@/lib/mock-test-paper";
import PremiumNavbar from "@/components/premium/PremiumNavbar";

const EXAM_DURATION_SECONDS = 60 * 60;
type Mode = "choice" | "loading" | "viewing" | "attempting" | "submitted";

const SUBJECT_PALETTE: Record<string, { gradient: string; badge: string; dot: string; barColor: string }> = {
  History:           { gradient: "from-amber-400 to-orange-400",    badge: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-400",   barColor: "#f59e0b" },
  Geography:         { gradient: "from-emerald-400 to-teal-400",    badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", barColor: "#10b981" },
  Polity:            { gradient: "from-orange-400 to-red-400",      badge: "bg-blue-50 text-blue-700 border-blue-200",        dot: "bg-blue-400",    barColor: "#3b82f6" },
  Reasoning:         { gradient: "from-violet-400 to-purple-400",    badge: "bg-orange-50 text-orange-700 border-orange-200",   dot: "bg-violet-400",  barColor: "#7c3aed" },
  Math:              { gradient: "from-rose-400 to-pink-400",        badge: "bg-rose-50 text-rose-700 border-rose-200",        dot: "bg-rose-400",    barColor: "#f43f5e" },
  "Current Affairs": { gradient: "from-cyan-400 to-sky-400",        badge: "bg-cyan-50 text-cyan-700 border-cyan-200",        dot: "bg-cyan-400",    barColor: "#06b6d4" },
  Science:           { gradient: "from-teal-400 to-green-400",       badge: "bg-teal-50 text-teal-700 border-teal-200",        dot: "bg-teal-400",    barColor: "#14b8a6" },
  Economics:         { gradient: "from-orange-400 to-amber-400",     badge: "bg-orange-50 text-orange-700 border-orange-200",  dot: "bg-orange-400",  barColor: "#f97316" },
};
const DEFAULT_PALETTE = { gradient: "from-slate-400 to-slate-500", badge: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", barColor: "#94a3b8" };

const DIFF_CONFIG = {
  Easy:   { label: "Easy",   cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  Medium: { label: "Medium", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  Hard:   { label: "Hard",   cls: "bg-red-50 text-red-600 border-red-200" },
};
const OPTION_LABELS = ["A", "B", "C", "D"];

function hasUnicodeText(t: string) { return /[^\u0000-\u00ff]/.test(t); }
function escapeHtml(t: string) { return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function formatTime(s: number) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60).toString().padStart(2,"0"), sec=(s%60).toString().padStart(2,"0");
  return h>0?`${h}:${m}:${sec}`:`${m}:${sec}`;
}
function pal(s: string) { return SUBJECT_PALETTE[s] ?? DEFAULT_PALETTE; }

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
  .mk * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .mk .serif { font-family: 'Playfair Display', serif; }
  .mk .hide-scroll::-webkit-scrollbar { display:none; }
  .mk .hide-scroll { -ms-overflow-style:none; scrollbar-width:none; }
  @keyframes mk-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mk-scale { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
  @keyframes mk-spin { to{transform:rotate(360deg)} }
  .mk .up1{animation:mk-up 0.45s cubic-bezier(.16,1,.3,1) 0.04s both}
  .mk .up2{animation:mk-up 0.45s cubic-bezier(.16,1,.3,1) 0.10s both}
  .mk .up3{animation:mk-up 0.45s cubic-bezier(.16,1,.3,1) 0.16s both}
  .mk .up4{animation:mk-up 0.45s cubic-bezier(.16,1,.3,1) 0.22s both}
  .mk .scl{animation:mk-scale 0.4s cubic-bezier(.16,1,.3,1) both}
  .mk .lift{transition:transform 0.22s cubic-bezier(.16,1,.3,1),box-shadow 0.22s ease}
  .mk .lift:hover{transform:translateY(-4px);box-shadow:0 24px 56px -12px rgba(15,23,42,0.10),0 8px 20px -8px rgba(15,23,42,0.06)}
  .mk .opt-btn{transition:all 0.14s cubic-bezier(.16,1,.3,1);cursor:pointer}
  .mk .opt-btn:active{transform:scale(0.99)}
  .mk .opt-sel{background:linear-gradient(135deg,#fff7ed,#fef2f2)!important;border-color:#f97316!important;box-shadow:0 0 0 3px rgba(99,102,241,0.12)!important}
  .mk .spin-arc{animation:mk-spin 1.6s linear infinite;transform-origin:center}
  .mk .gauge{transition:stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1)}
  .mk .prog-fill{transition:width 0.5s cubic-bezier(.16,1,.3,1)}
  .mk .chip{transition:all 0.15s ease}
  .mk .chip:hover{transform:translateY(-1px)}
  .mk .palbtn{transition:transform 0.1s ease}
  .mk .palbtn:hover{transform:scale(1.12)}
  .mk .dot-grid{background-image:radial-gradient(circle,rgba(99,102,241,0.10) 1px,transparent 1px);background-size:24px 24px}
  .mk .card-accent-brand::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:12px 12px 0 0;background:linear-gradient(90deg,#f97316,#ef4444)}
  .mk .card-accent-amber::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:12px 12px 0 0;background:linear-gradient(90deg,#f59e0b,#f97316)}
  .mk .stat-card{transition:transform 0.18s ease,box-shadow 0.18s ease}
  .mk .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px -8px rgba(15,23,42,0.10)}
  .mk .subj-bar{transition:width 0.8s cubic-bezier(.16,1,.3,1)}
`;

export default function MockTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("exam") ?? "WBCS";

  const [mode, setMode] = useState<Mode>("choice");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [meta, setMeta] = useState<MockPaperMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const LOADING_MSGS = ["Connecting to AI engine…","Personalising your paper…","Curating questions…","Checking difficulty balance…","Almost ready…"];

  useEffect(() => {
    const s = document.createElement("style"); s.textContent = STYLES; document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  useEffect(() => {
    if (mode!=="loading") return;
    const id = setInterval(()=>setLoadingMsg(p=>Math.min(p+1,LOADING_MSGS.length-1)),1200);
    return ()=>clearInterval(id);
  }, [mode]);

  useEffect(() => {
    if (mode!=="attempting") return;
    timerRef.current = setInterval(()=>{
      setTimeLeft(p=>{
        if(p<=1){clearInterval(timerRef.current!);setAutoSubmitted(true);setMode("submitted");return 0;}
        return p-1;
      });
    },1000);
    return ()=>{if(timerRef.current)clearInterval(timerRef.current!);};
  },[mode]);

  const fetchPaper = useCallback(async(next:"viewing"|"attempting")=>{
    setMode("loading");setError(null);setLoadingMsg(0);
    try{
      const data = await fetchMockTestPaper(examType);
      setQuestions(data.questions);
      setMeta({exam:data.meta.exam,paper_title:data.meta.paper_title,total_questions:data.meta.total_questions,duration_minutes:data.meta.duration_minutes,generated_at:data.meta.generated_at});
      if(next==="viewing"){setSubjectFilter("All");setExpanded(new Set());setMode("viewing");}
      else{setCurrentIdx(0);setAnswers({});setFlagged(new Set());setTimeLeft(EXAM_DURATION_SECONDS);setAutoSubmitted(false);setMode("attempting");}
    }catch(e){setError(e instanceof Error?e.message:"Unknown error");setMode("choice");}
  },[examType]);

  const handleSubmit = useCallback(()=>{
    if(timerRef.current)clearInterval(timerRef.current!);
    setShowSubmitConfirm(false);setMode("submitted");
  },[]);

  const calcResult = useCallback(()=>{
    let correct=0,wrong=0,skipped=0;
    const bySubject:Record<string,{correct:number;total:number}>={};
    for(const q of questions){
      if(!bySubject[q.subject])bySubject[q.subject]={correct:0,total:0};
      bySubject[q.subject].total++;
      const a=answers[q.id];
      if(a===undefined||a===null)skipped++;
      else if(a===q.correct_index){correct++;bySubject[q.subject].correct++;}
      else wrong++;
    }
    return{correct,wrong,skipped,bySubject,timeTaken:EXAM_DURATION_SECONDS-timeLeft,score:questions.length>0?Math.round((correct/questions.length)*100):0};
  },[questions,answers,timeLeft]);

  const downloadPDF = useCallback(()=>{
    const visible=subjectFilter==="All"?questions:questions.filter(q=>q.subject===subjectFilter);
    if(visible.some(q=>hasUnicodeText(q.question)||q.options.some(o=>hasUnicodeText(o)))){
      const html=`<!doctype html><html><head><meta charset="UTF-8"/><title>${escapeHtml(meta?.paper_title??"Mock Test")}</title><style>body{font-family:"Nirmala UI",sans-serif;margin:24px;}.q{margin:16px 0;}.qt{font-weight:700;}.opt{margin:3px 0;}.exp{font-size:12px;color:#555;}</style></head><body><h1>${escapeHtml(meta?.paper_title??"Mock Test")}</h1>${visible.map((q,i)=>`<div class="q"><div class="qt">Q${i+1}. ${escapeHtml(q.question)}</div>${q.options.map((o,oi)=>`<div class="opt">${OPTION_LABELS[oi]}. ${escapeHtml(o)}${oi===q.correct_index?" ✓":""}</div>`).join("")}<div class="exp">↳ ${escapeHtml(q.explanation)}</div></div>`).join("")}</body></html>`;
      const blob=new Blob([`\ufeff${html}`],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${examType}_paper.html`;a.rel="noopener";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
      return;
    }
    const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    const pH=doc.internal.pageSize.height,pW=doc.internal.pageSize.width,mg=15,maxW=pW-mg*2;let y=20;
    const add=(t:string,fs=11,bold=false,rgb:[number,number,number]=[30,30,30])=>{
      if(y>pH-18){doc.addPage();y=18;}
      doc.setFontSize(fs);doc.setFont("helvetica",bold?"bold":"normal");doc.setTextColor(...rgb);
      const ls=doc.splitTextToSize(t,maxW) as string[];doc.text(ls,mg,y);y+=ls.length*(fs*0.42)+1.5;
    };
    doc.setFillColor(15,23,42);doc.rect(0,0,pW,36,"F");doc.setFont("helvetica","bold");doc.setFontSize(15);doc.setTextColor(255,255,255);doc.text(meta?.paper_title??`${examType} Mock Test`,mg,15);
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(170,180,200);doc.text(`${visible.length} Questions | ${meta?.duration_minutes??60} min | ${meta?.generated_at?new Date(meta.generated_at).toLocaleDateString("en-IN"):new Date().toLocaleDateString("en-IN")}`,mg,25);doc.text("Answer Key Included",mg,32);y=44;
    visible.forEach((q,i)=>{if(y>pH-50){doc.addPage();y=18;}add(`Q${i+1}.  ${q.question}`,11,true,[15,23,42]);q.options.forEach((o,oi)=>add(`    ${OPTION_LABELS[oi]}. ${o}${oi===q.correct_index?"  ✓":""}`,10,oi===q.correct_index,oi===q.correct_index?[5,120,60]:[60,70,85]));add(`   ↳ ${q.explanation}`,9,false,[110,120,140]);y+=3;});
    doc.save(`${examType}_paper_${new Date().toISOString().split("T")[0]}.pdf`);
  },[questions,meta,examType,subjectFilter]);

  const subjects=["All",...Array.from(new Set(questions.map(q=>q.subject)))];
  const visibleQs=subjectFilter==="All"?questions:questions.filter(q=>q.subject===subjectFilter);
  const currentQ=questions[currentIdx];
  const totalAnswered=Object.values(answers).filter(a=>a!==null&&a!==undefined).length;
  const timerCritical=timeLeft<=300;
  const timerWarning=timeLeft<=900;

  // ════════════════ 1. CHOICE ════════════════
  if(mode==="choice"){
    return(
      <div className="mk h-screen bg-white flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-50"/>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-400"/>

        <header className="relative z-10 border-b border-slate-100 bg-white/90 backdrop-blur-sm shrink-0">
         <PremiumNavbar/>
        </header>

        <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12 up1">
           
            <h3 className="serif text-3xl sm:text-3xl font-extrabold text-slate-600 leading-tight tracking-tight">
              Today's Mock
              <span className="text-orange-600"> Test</span>
            </h3>
        
          </div>

          {error&&(
            <div className="mb-8 max-w-lg w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm up2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">

            {/* View Paper */}
            <div onClick={()=>fetchPaper("viewing")}
              className="card-accent-brand relative rounded-3xl border border-slate-200 bg-white cursor-pointer lift overflow-hidden up2"
              style={{boxShadow:"0 4px 32px -8px rgba(99,102,241,0.10),0 2px 8px -4px rgba(0,0,0,0.04)"}}>
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-7">
                  <Eye className="w-6 h-6 text-orange-500"/>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Option 01</div>
                <h2 className="serif text-2xl font-bold text-slate-900 mb-3">View Paper</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Study all questions at your own pace. Filter by subject, reveal explanations, and export the full paper as PDF.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["60+ Questions","Answer Key","PDF Export"].map(t=>(
                    <span key={t} className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-semibold border border-slate-200">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-orange-600 uppercase">
                  Explore Paper <ChevronRight className="w-3.5 h-3.5"/>
                </div>
              </div>
            </div>

            {/* Take Exam */}
            <div onClick={()=>fetchPaper("attempting")}
              className="card-accent-amber relative rounded-3xl border border-slate-200 bg-white cursor-pointer lift overflow-hidden up3"
              style={{boxShadow:"0 4px 32px -8px rgba(245,158,11,0.10),0 2px 8px -4px rgba(0,0,0,0.04)"}}>
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-7">
                  <Timer className="w-6 h-6 text-amber-500"/>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Option 02</div>
                <h2 className="serif text-2xl font-bold text-slate-900 mb-3">Take Mock Exam</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Real exam simulation with a 60-minute countdown. Get instant scoring and a detailed subject-wise performance report.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["60 Min Timer","Live Score","AI Review"].map(t=>(
                    <span key={t} className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-semibold border border-slate-200">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-amber-600 uppercase">
                  Launch Exam <ChevronRight className="w-3.5 h-3.5"/>
                </div>
              </div>
            </div>

          </div>
          <p className="mt-10 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] up4">Questions Generated Fresh Daily</p>
        </main>
      </div>
    );
  }

  // ════════════════ 2. LOADING ════════════════
  if(mode==="loading"){
    return(
      <div className="mk h-screen bg-white flex flex-col items-center justify-center gap-10 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-400"/>
        <button onClick={()=>setMode("choice")} className="absolute top-5 left-5 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4"/><span className="font-semibold">Back</span>
        </button>
        <div className="relative text-center space-y-8 z-10 scl">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-slate-100"/>
            <svg className="w-24 h-24 spin-arc" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="url(#g)" strokeWidth="5" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="188"/>
              <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><Brain className="w-9 h-9 text-orange-400"/></div>
          </div>
          <div>
            <h2 className="serif text-2xl font-bold text-slate-900">Generating Your Paper</h2>
            <p className="text-slate-400 text-sm mt-2 min-h-[20px]">{LOADING_MSGS[loadingMsg]}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {LOADING_MSGS.map((_,i)=>(
              <div key={i} className={`rounded-full transition-all duration-500 ${i<loadingMsg?"w-2 h-2 bg-orange-500":i===loadingMsg?"w-3 h-3 bg-orange-400 animate-pulse":"w-2 h-2 bg-slate-200"}`}/>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.18em] uppercase">{examType} · Daily Paper</p>
        </div>
      </div>
    );
  }

  // ════════════════ 3. VIEW PAPER ════════════════
  if(mode==="viewing"){
    return(
      <div className="mk h-screen bg-slate-50 flex flex-col overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 z-50"/>
        <header className="shrink-0 border-b border-slate-200 bg-white z-40 shadow-sm mt-[3px]">
          <div className="container px-5 max-w-5xl mx-auto">
            <div className="h-16 flex items-center gap-4">
              <button onClick={()=>setMode("choice")} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
                <ArrowLeft className="w-4 h-4"/><span className="font-semibold">Back</span>
              </button>
              <div className="w-px h-5 bg-slate-200"/>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{meta?.paper_title??`${examType} Mock Paper`}</p>
                <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">{visibleQs.length} questions</p>
              </div>
              <button onClick={downloadPDF} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold tracking-wide transition-colors">
                <Download className="w-3.5 h-3.5"/>PDF
              </button>
            </div>
            <div className="pb-4 flex items-center gap-2 overflow-x-auto hide-scroll">
              {subjects.map(s=>{
                const p=pal(s);const isActive=subjectFilter===s;
                const count=s==="All"?questions.length:questions.filter(q=>q.subject===s).length;
                return(
                  <button key={s} onClick={()=>setSubjectFilter(s)}
                    className={`chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border flex-shrink-0 ${isActive?s==="All"?"bg-slate-900 text-white border-slate-900":`${p.badge} shadow-sm`:"bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                    {s!=="All"&&<span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.dot}`}/>}
                    {s}
                    <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-bold leading-none ${isActive&&s!=="All"?"bg-black/10":"bg-slate-100 text-slate-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container px-5 py-6 max-w-5xl mx-auto space-y-4">
            {visibleQs.map(q=>{
              const p=pal(q.subject);const diff=DIFF_CONFIG[q.difficulty]??DIFF_CONFIG.Medium;
              const isExp=expanded.has(q.id);const qNo=questions.indexOf(q)+1;
              return(
                <div key={q.id} className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md hover:shadow-slate-100 transition-all duration-200">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${p.gradient}`}/>
                  <div className="pl-5 pr-6 py-5">
                    <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-extrabold text-slate-500 flex-shrink-0">{qNo}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${p.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}/>{q.subject}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${diff.cls}`}>{diff.label}</span>
                      {q.topic&&<span className="text-[11px] text-slate-400 hidden sm:block truncate">{q.topic}</span>}
                    </div>
                    <p className="text-[15px] font-semibold text-slate-800 leading-relaxed mb-5">{q.question}</p>
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      {q.options.map((opt,oi)=>{
                        const correct=oi===q.correct_index;
                        return(
                          <div key={oi} className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${correct?"bg-emerald-50 border-emerald-200":"bg-slate-50 border-slate-200"}`}>
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${correct?"bg-emerald-500 text-white":"bg-slate-200 text-slate-500"}`}>{OPTION_LABELS[oi]}</span>
                            <span className={`leading-snug text-sm ${correct?"text-emerald-800 font-semibold":"text-slate-600"}`}>{opt}</span>
                            {correct&&<CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0 mt-0.5"/>}
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={()=>setExpanded(prev=>{const n=new Set(prev);if(n.has(q.id))n.delete(q.id);else n.add(q.id);return n;})}
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-orange-600 hover:text-orange-500 transition-colors">
                      {isExp?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
                      {isExp?"Hide":"Show"} Explanation
                    </button>
                    {isExp&&(
                      <div className="mt-3 flex gap-3 px-4 py-3.5 rounded-xl bg-orange-50 border border-orange-100">
                        <div className="w-0.5 rounded-full bg-orange-300 flex-shrink-0 self-stretch"/>
                        <p className="text-[13px] text-slate-600 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {visibleQs.length===0&&(
              <div className="text-center py-24 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                <p className="font-semibold">No questions found for this subject.</p>
              </div>
            )}
            <div className="sticky bottom-4 flex justify-center pt-4">
              <button onClick={downloadPDF} className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold shadow-xl shadow-slate-900/15 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Download className="w-4 h-4"/>
                Download Full Paper as PDF
                <span className="bg-white/15 rounded-lg px-2.5 py-0.5 text-[10px] font-bold">{visibleQs.length} Qs</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ════════════════ 4. ATTEMPT ════════════════
  if(mode==="attempting"&&currentQ){
    const p=pal(currentQ.subject);const diff=DIFF_CONFIG[currentQ.difficulty]??DIFF_CONFIG.Medium;
    const curAns=answers[currentQ.id];const isFlagged=flagged.has(currentQ.id);
    const pct=(totalAnswered/questions.length)*100;

    return(
      <div className="mk h-screen bg-white flex flex-col overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-200 z-50">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 prog-fill" style={{width:`${pct}%`}}/>
        </div>
        <header className="sticky top-0 border-b border-slate-200 bg-white shrink-0 z-40 mt-[3px]">
          <div className="container px-5 max-w-7xl mx-auto h-16 flex items-center gap-3">
            <button type="button" onClick={()=>{if(timerRef.current)clearInterval(timerRef.current!);setMode("choice");}} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4"/><span className="font-semibold hidden sm:block">Exit</span>
            </button>

            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-slate-900 text-sm truncate">{meta?.paper_title??`${examType} Mock Test`}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                <span>Q {currentIdx+1} of {questions.length}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{totalAnswered}/{questions.length} answered</span>
              </div>
            </div>

            <div className={`hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl border font-mono transition-all ${timerCritical?"bg-red-50 border-red-200 text-red-600 shadow-[0_0_16px_rgba(239,68,68,0.12)]":timerWarning?"bg-amber-50 border-amber-200 text-amber-600":"bg-slate-50 border-slate-200 text-slate-800"}`}>
              <Clock className="w-4 h-4"/>
              <span className="text-lg font-extrabold tabular-nums tracking-widest">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={()=>setShowSubmitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold tracking-wide transition-colors shadow-sm">
                <PenLine className="w-3.5 h-3.5"/>Submit
              </button>
            </div>
          </div>

          <div className="sm:hidden border-t border-slate-100">
            <div className="container px-5 py-3 max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono ${timerCritical?"bg-red-50 border-red-200 text-red-600":timerWarning?"bg-amber-50 border-amber-200 text-amber-600":"bg-slate-50 border-slate-200 text-slate-800"}`}>
                <Clock className="w-3.5 h-3.5"/>
                <span className="text-base font-extrabold tabular-nums tracking-widest">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-semibold tabular-nums">{totalAnswered}/{questions.length}</span>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full prog-fill" style={{width:`${pct}%`}}/>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="container px-5 py-8 max-w-4xl mx-auto space-y-5">
               <div className="relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
  {/* The decorative left accent bar */}
  <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${p.gradient} z-10`} />

  {/* MAIN CONTENT AREA: Now with Blue Gradient and White text */}
  <div className="px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-br from-orange-500 to-red-600 text-white">
    <div className="flex items-start gap-4">
      <div className="flex-1 min-w-0">
        
        {/* TOP BADGE ROW */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Question Badge - Slightly darker for contrast */}
          <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            Question {currentIdx + 1}
          </span>
          
          {/* Subject Badge - Adapted for dark background */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-white/10 ${p.badge.includes('text') ? 'text-white border-white/20' : p.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
            {currentQ.subject}
          </span>

          {/* Difficulty Badge */}
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-white/10 border-white/20 text-white`}>
            {diff.label}
          </span>

          {/* Topic - Changed text-slate-400 to white/70 for readability */}
          {currentQ.topic && (
            <span className="text-[11px] text-blue-100/80 font-medium truncate hidden sm:block">
              {currentQ.topic}
            </span>
          )}
        </div>

        {/* QUESTION TEXT - Switched to white and slightly boosted tracking */}
        <p className="mt-4 text-[16px] sm:text-[17px] font-bold text-white leading-relaxed tracking-tight">
          {currentQ.question}
        </p>
      </div>

      {/* FLAG BUTTON - Updated for better contrast against blue */}
      <button 
        type="button" 
        onClick={() => setFlagged(prev => {
          const n = new Set(prev);
          if (n.has(currentQ.id)) n.delete(currentQ.id);
          else n.add(currentQ.id);
          return n;
        })}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[10px] font-extrabold border transition-all duration-200 ${
          isFlagged 
            ? "bg-amber-400 text-amber-950 border-amber-300 shadow-lg shadow-amber-900/20" 
            : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
        }`}
      >
        <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-current" : ""}`} />
        {isFlagged ? "Flagged" : "Flag"}
      </button>
    </div>
  </div>
</div>

                <div className="space-y-2.5">
                  {currentQ.options.map((opt,oi)=>{
                    const isSel=curAns===oi;
                    return(
                      <button key={oi} type="button" aria-pressed={isSel} onClick={()=>setAnswers(prev=>({...prev,[currentQ.id]:oi}))}
                        className={`opt-btn group w-full flex items-start gap-4 px-5 py-4 rounded-2xl border text-left bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2 ${isSel?"opt-sel border-orange-200 bg-orange-50/30":"border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                        <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 transition-all ${isSel?"bg-orange-600 text-white shadow-md shadow-orange-200/40":"bg-slate-100 text-slate-600 group-hover:bg-slate-200"}`}>{OPTION_LABELS[oi]}</div>
                        <span className={`text-[15px] leading-relaxed ${isSel?"text-orange-900 font-semibold":"text-slate-700"}`}>{opt}</span>
                        {isSel&&<CheckCircle2 className="w-5 h-5 text-orange-600 ml-auto flex-shrink-0 mt-0.5"/>}
                      </button>
                    );
                  })}
                </div>

                {curAns!==undefined&&curAns!==null&&(
                  <button type="button" onClick={()=>setAnswers(prev=>{const n={...prev};delete n[currentQ.id];return n;})} className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">
                    Clear selection
                  </button>
                )}
              </div>
            </div>

            <footer className="border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 p-4 shrink-0">
              <div className="container max-w-4xl mx-auto flex items-center justify-between gap-3">
                <button type="button" onClick={()=>setCurrentIdx(p=>Math.max(0,p-1))} disabled={currentIdx===0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-extrabold hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="w-4 h-4"/>Previous
                </button>
                <span className="text-xs text-slate-400 font-semibold sm:hidden tabular-nums">{currentIdx+1}/{questions.length}</span>
                {currentIdx<questions.length-1
                  ?<button type="button" onClick={()=>setCurrentIdx(p=>p+1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold transition-all">Next<ChevronRight className="w-4 h-4"/></button>
                  :<button type="button" onClick={()=>setShowSubmitConfirm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold transition-all"><PenLine className="w-4 h-4"/>Submit Test</button>
                }
              </div>
            </footer>
          </main>

          <aside className="hidden lg:flex flex-col w-80 border-l border-slate-200 bg-white overflow-y-auto">
            <div className="p-7 border-b border-slate-100">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-900">Question Palette</p>
              <p className="mt-1 text-sm text-slate-500 font-semibold">Jump to any question.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600">
                {[{cls:"bg-orange-600",l:"Answered"},{cls:"bg-slate-200 border border-slate-300",l:"Not visited"},{cls:"bg-amber-400",l:"Flagged"},{cls:"bg-slate-300",l:"Visited"}].map(({cls,l})=>(
                  <div key={l} className="flex items-center gap-2.5"><div className={`w-3.5 h-3.5 rounded ${cls}`}/><span className="font-semibold">{l}</span></div>
                ))}
              </div>
            </div>

            <div className="p-6 grid grid-cols-6 gap-3">
              {questions.map((q,i)=>{
                const isAns=answers[q.id]!==undefined&&answers[q.id]!==null;
                const isFlaggedQ=flagged.has(q.id);const isCurr=i===currentIdx;const isVis=i<currentIdx||isAns;
                return(
                  <button key={q.id} type="button" onClick={()=>setCurrentIdx(i)}
                    className={`palbtn w-full aspect-square rounded-2xl text-xs font-extrabold relative transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2 ${isCurr?"ring-2 ring-orange-500 ring-offset-2":""} ${isFlaggedQ&&isAns?"bg-amber-500 text-white":isFlaggedQ?"bg-amber-100 text-amber-800 border border-amber-300":isAns?"bg-orange-600 text-white":isVis?"bg-slate-200 text-slate-800":"bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                    {i+1}
                    {isFlaggedQ&&<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white"/>}
                  </button>
                );
              })}
            </div>

            <div className="p-7 mt-auto border-t border-slate-100 space-y-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-semibold">Answered</span>
                  <span className="font-extrabold tabular-nums text-orange-600">{totalAnswered}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-semibold">Flagged</span>
                  <span className="font-extrabold tabular-nums text-amber-600">{flagged.size}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-semibold">Remaining</span>
                  <span className="font-extrabold tabular-nums text-slate-600">{questions.length-totalAnswered}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {showSubmitConfirm&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-7 space-y-6 scl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600"/>
                </div>
                <div className="min-w-0">
                  <h3 className="serif font-bold text-slate-900 text-xl">Submit test?</h3>
                  <p className="text-sm text-slate-400 mt-0.5">You can’t change answers after submitting.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{l:"Answered",v:totalAnswered,c:"text-emerald-700",bg:"bg-emerald-50 border-emerald-200"},{l:"Skipped",v:questions.length-totalAnswered,c:"text-red-600",bg:"bg-red-50 border-red-200"},{l:"Flagged",v:flagged.size,c:"text-amber-700",bg:"bg-amber-50 border-amber-200"}].map(({l,v,c,bg})=>(
                  <div key={l} className={`rounded-2xl border p-4 text-center ${bg}`}>
                    <p className={`font-extrabold text-2xl tabular-nums ${c}`}>{v}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-extrabold uppercase tracking-wider">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{questions.length-totalAnswered>0?`You have ${questions.length-totalAnswered} unanswered question${questions.length-totalAnswered>1?"s":""}. Submit anyway?`:"All questions answered. Submit now?"}</p>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setShowSubmitConfirm(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-extrabold transition-colors">Continue</button>
                <button type="button" onClick={handleSubmit} className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2"><PenLine className="w-4 h-4"/>Submit now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════ 5. RESULTS ════════════════
  if(mode==="submitted"){
    const result=calcResult();const pct=result.score;
    const C=2*Math.PI*52;
    const scoreColor=pct>=70?"#16a34a":pct>=40?"#d97706":"#dc2626";
    const scoreLabel=pct>=80?"Outstanding!":pct>=60?"Well Done!":pct>=40?"Keep Practising":"Needs More Work";

    return(
      <div className="mk h-screen bg-slate-50 flex flex-col overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 z-50"/>
        <header className="relative z-40 border-b border-slate-200 bg-white shadow-sm shrink-0 mt-[3px]">
          <div className="container px-5 h-16 flex items-center gap-3 max-w-5xl mx-auto">
            <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4"/><span className="font-semibold">Dashboard</span>
            </button>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5"/>Submitted
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container px-5 py-8 max-w-5xl mx-auto space-y-6">
            {autoSubmitted&&(
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm up1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0"/>Time expired — your test was automatically submitted.
              </div>
            )}

            {/* Score hero */}
            <div className="relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm up1">
              <div className="h-1.5" style={{background:`linear-gradient(90deg,${scoreColor}50,${scoreColor})`}}/>
              <div className="p-8 flex flex-col sm:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <svg width="144" height="144" viewBox="0 0 128 128" className="-rotate-90">
                    <circle cx="64" cy="64" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                    <circle cx="64" cy="64" r="52" fill="none" stroke={scoreColor} strokeWidth="10"
                      strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} className="gauge"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-extrabold text-4xl tabular-nums" style={{color:scoreColor}}>{pct}%</span>
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Score</span>
                  </div>
                </div>
                <div className="flex-1 space-y-5">
                  <div>
                    <h2 className="serif text-3xl font-bold text-slate-900">{scoreLabel}</h2>
                    <p className="text-slate-400 text-sm mt-1">{meta?.paper_title??`${examType} Mock Test`}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {label:"Correct",val:result.correct,c:"text-emerald-600",bg:"bg-emerald-50 border-emerald-200"},
                      {label:"Wrong",val:result.wrong,c:"text-red-500",bg:"bg-red-50 border-red-200"},
                      {label:"Skipped",val:result.skipped,c:"text-slate-500",bg:"bg-slate-100 border-slate-200"},
                      {label:"Time",val:formatTime(result.timeTaken),c:"text-orange-600",bg:"bg-orange-50 border-orange-200"},
                    ].map(({label,val,c,bg})=>(
                      <div key={label} className={`stat-card rounded-2xl border p-4 text-center ${bg}`}>
                        <p className={`font-extrabold text-2xl tabular-nums ${c}`}>{val}</p>
                        <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm up2">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-500"/>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Subject-wise Breakdown</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(result.bySubject).map(([subj,stats])=>{
                  const p=pal(subj);const sp=stats.total>0?Math.round((stats.correct/stats.total)*100):0;
                  const bc=sp>=70?"#16a34a":sp>=40?"#d97706":"#dc2626";
                  return(
                    <div key={subj} className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-1 h-10 rounded-full ${p.dot} flex-shrink-0`}/>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">{subj}</span>
                          <span className="text-sm font-extrabold tabular-nums" style={{color:bc}}>{stats.correct}/{stats.total}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full subj-bar" style={{width:`${sp}%`,background:bc}}/>
                        </div>
                      </div>
                      <span className="font-extrabold text-sm tabular-nums w-12 text-right" style={{color:bc}}>{sp}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 up3">
              <button onClick={()=>{setMode("choice");setQuestions([]);}} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-all">
                <RotateCcw className="w-4 h-4"/>Back to Options
              </button>
              <button onClick={()=>{setCurrentIdx(0);setShowSubmitConfirm(false);setMode("viewing");}} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold transition-all shadow-lg shadow-slate-900/15">
                <Eye className="w-4 h-4"/>Review Paper & Answers
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
