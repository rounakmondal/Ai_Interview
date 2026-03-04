import { RequestHandler } from "express";
import {
    CareerMentorRequest,
    CareerMentorResponse,
    CareerIntent,
} from "@shared/api";

// ─────────────────────────────────────────────
//  Intent Detection
// ─────────────────────────────────────────────

const INTENT_PATTERNS: { intent: CareerIntent; patterns: RegExp[] }[] = [
    {
        intent: "no_job",
        patterns: [
            /no (job|offer|placement)/i,
            /not getting (job|hired|selected|calls)/i,
            /job(less| hunt| search)/i,
            /can't find (a )?job/i,
            /placement (issue|problem|struggle)/i,
            /months (and )?no job/i,
            /fresher.*(job|hired)/i,
            /unemployed/i,
            /applying (everywhere|jobs) but/i,
        ],
    },
    {
        intent: "layoff_fear",
        patterns: [
            /layoff/i,
            /afraid of (losing|job)/i,
            /job (insecurity|security)/i,
            /fear.*(fired|let go|job)/i,
            /company.*(downsizing|restructuring)/i,
            /PIP|performance improvement plan/i,
            /retrench/i,
        ],
    },
    {
        intent: "ai_impact",
        patterns: [
            /ai (taking|replacing|steal)/i,
            /will ai (replace|take)/i,
            /(replace|replace).*(ai|automation)/i,
            /automation.*(job|career)/i,
            /scared of (ai|chatgpt|automation)/i,
            /chatgpt.*(job|replace)/i,
            /is (my )?job (safe|secure).*(ai|automation)/i,
        ],
    },
    {
        intent: "career_gap",
        patterns: [
            /career gap/i,
            /gap (in|on) (my |resume|cv)/i,
            /(1|2|3|4|5|6)\s?year.*(gap|break)/i,
            /break (from|in) (career|job|work)/i,
            /explain.*gap/i,
            /gap year/i,
            /resume gap/i,
            /employment gap/i,
        ],
    },
    {
        intent: "low_salary",
        patterns: [
            /low (salary|pay|ctc|lpa)/i,
            /underpaid/i,
            /salary hike/i,
            /switch (for|to get).*(salary|money|pay|ctc)/i,
            /increase (my )?(salary|ctc|lpa)/i,
            /(3|4|5|6|7|8) lpa.*(stuck|low|bad)/i,
            /salary.*(not growing|stagnant|same)/i,
        ],
    },
    {
        intent: "tech_confusion",
        patterns: [
            /which (technology|tech|language|skill)/i,
            /java or (\.net|dotnet|python|react|node)/i,
            /(confused|confusion).*(tech|skill|career|language)/i,
            /(java|python|dotnet|\.net) vs/i,
            /what (should|to) (learn|study|pick)/i,
            /which (stack|path|domain|course)/i,
            /full.?stack vs/i,
            /data science or/i,
            /which (is|has) (better|more) (demand|salary|future|scope)/i,
        ],
    },
    {
        intent: "non_it_switch",
        patterns: [
            /(switch|transition|move).*(it|software|tech)/i,
            /non.?it.*(switch|career|move)/i,
            /from (bca|mca|b\.?sc|ba|commerce|mechanical|civil|electrical).*(it|software)/i,
            /non.?tech.*(it|software)/i,
            /career (change|switch).*(programming|coding|dev)/i,
            /mechanical to software/i,
            /arts to it/i,
        ],
    },
    {
        intent: "skill_roadmap",
        patterns: [
            /roadmap/i,
            /learning path/i,
            /how to (learn|start|begin).*(java|\.net|react|sql|python|ai|ml|node)/i,
            /where to start/i,
            /skill (plan|roadmap|path)/i,
            /skill (build|develop|improve)/i,
            /what (skills|topics) (should|to) (learn|cover)/i,
        ],
    },
];

function detectIntent(message: string): CareerIntent {
    const lower = message.toLowerCase();
    for (const { intent, patterns } of INTENT_PATTERNS) {
        if (patterns.some((p) => p.test(lower))) return intent;
    }
    return "general";
}

// ─────────────────────────────────────────────
//  Response Engine
// ─────────────────────────────────────────────

function buildResponse(
    intent: CareerIntent,
    message: string,
    context?: string,
): CareerMentorResponse {
    switch (intent) {
        case "no_job":
            return {
                intent,
                summary:
                    "Not getting job calls is a common fresher problem — but it's fixable with a focused 30-day sprint.",
                advice: [
                    "Fix your resume: 1 page, ATS-friendly, quantified bullets. Use a template from Novoresume or Canva.",
                    "Apply strategically: Use Naukri, LinkedIn, and Instahyre. Apply to 10-15 jobs every single day.",
                    "Build a visible GitHub: Upload 2-3 projects with README. Recruiters actively check this.",
                    "Top service companies hiring freshers: TCS, Infosys, Wipro, Cognizant, Capgemini — apply directly via their portals.",
                    "Upskill in parallel: Complete one free course on Java/Python/SQL on NPTEL or freeCodeCamp.",
                    "Network actively: Comment on LinkedIn posts by recruiters, connect with seniors from your college.",
                ],
                roadmap: {
                    title: "30-Day 'Get Hired' Action Plan",
                    weeks: [
                        {
                            week: "Week 1 – Fix Foundation",
                            tasks: [
                                "Rewrite resume using ATS format (Novoresume free)",
                                "Update LinkedIn (photo, headline, summary, skills)",
                                "Create GitHub with at least 2 projects",
                                "Apply to 10 jobs per day on Naukri + LinkedIn",
                            ],
                        },
                        {
                            week: "Week 2 – Build Skills + Visibility",
                            tasks: [
                                "Start Java/Python/Full Stack short course (freeCodeCamp)",
                                "Complete 20 SQL queries on HackerRank",
                                "Solve 5 easy DSA problems on LeetCode/GFG",
                                "Attend 1 virtual job fair or online hackathon",
                            ],
                        },
                        {
                            week: "Week 3 – Practice Interviews",
                            tasks: [
                                "Do 2 mock interviews using InterviewAI or Pramp",
                                "Prepare answers to Top 20 HR questions",
                                "Research target company (culture, tech stack, recent news)",
                                "Apply to 10 more per day, track all in a Google Sheet",
                            ],
                        },
                        {
                            week: "Week 4 – Referrals + Follow-up",
                            tasks: [
                                "Message 5 LinkedIn connections for internal referrals",
                                "Follow up on all pending applications via email",
                                "Try internship platforms: Internshala, LetsIntern",
                                "Consider contract/freelance projects while searching",
                            ],
                        },
                    ],
                },
                salaryExpectation: "3.5–6 LPA for freshers in service companies. 6–12 LPA at product/startup for strong candidates.",
                resources: [
                    "Naukri.com – Best for fresher job search",
                    "LinkedIn Jobs – Use 'Easy Apply' filter",
                    "Instahyre / Cutshort – For startup roles",
                    "TCS NQT / Infosys Instep – Direct fresher portals",
                    "freeCodeCamp / NPTEL – Free upskilling",
                ],
            };

        case "layoff_fear":
            return {
                intent,
                summary:
                    "Layoff fear is real, especially in 2024–25. The best defense is being valuable AND having a backup plan.",
                advice: [
                    "Become the person who is hard to let go: own a critical module, document processes, mentor juniors.",
                    "Upskill now, not after layoff: Learn AI tools (GitHub Copilot, ChatGPT API), Cloud (AWS free tier), or System Design.",
                    "Build an emergency fund: 3–6 months of salary in a savings account. Non-negotiable.",
                    "Keep your profile active: Update LinkedIn, keep GitHub green, stay visible so recruiters find you.",
                    "Build referral network: Connect with 20+ people in different companies. Most jobs come via referrals.",
                    "Have a side income plan: Freelance on Fiverr/Upwork, teach on Udemy, or do part-time consulting.",
                ],
                roadmap: {
                    title: "Layoff-Proof Action Plan",
                    weeks: [
                        {
                            week: "Immediate (This Week)",
                            tasks: [
                                "Update resume and LinkedIn — right now, not when layoff happens",
                                "Save 3-6 months of salary in a liquid fund",
                                "Identify your top 10 skills that are currently in demand",
                                "Connect with 5 recruiters on LinkedIn proactively",
                            ],
                        },
                        {
                            week: "Short-Term (Next 30 Days)",
                            tasks: [
                                "Complete an AWS Cloud Practitioner or Azure Fundamentals certification (free prep available)",
                                "Learn one AI tool deeply: GitHub Copilot, LangChain, or OpenAI API",
                                "Create 1 portfolio project using new skills and push to GitHub",
                                "Apply to 2-3 jobs to calibrate your current market value",
                            ],
                        },
                        {
                            week: "Long-Term (3 Months)",
                            tasks: [
                                "Get at least 1 cloud or AI certification",
                                "Build a freelance profile on Upwork with your current skill set",
                                "Join a professional community (Discord, Reddit: r/cscareerquestions_india)",
                                "Have a target company list ready for quick applications if needed",
                            ],
                        },
                    ],
                },
                salaryExpectation: "Mid-level professionals with cloud/AI skills command 15–35 LPA in the current market.",
                resources: [
                    "AWS Free Tier – Free cloud practice",
                    "Google Cloud Skill Boost – Free AI/ML courses",
                    "Upwork / Toptal – Freelance backup income",
                    "LinkedIn Premium – Career insights (1 free month)",
                    "Naukri RSD (Resume Display Service) – Recruiter visibility",
                ],
            };

        case "ai_impact":
            return {
                intent,
                summary:
                    "AI won't fully replace IT jobs for years — but it will replace people who don't use AI. Here's the honest picture.",
                advice: [
                    "Reality check: AI replaces tasks, not entire jobs. A developer using GitHub Copilot replaces 3 developers who don't.",
                    "Safest roles right now: Prompt Engineering, AI/ML roles, Data Engineering, Cloud DevOps, Cybersecurity, Solution Architecture.",
                    "What AI cannot (yet) replace: Client communication, system design decisions, business context understanding, debugging complex systems.",
                    "Skills to learn before anyone else at your company: GitHub Copilot, LangChain, RAG pipelines, Vector databases (Pinecone, Weaviate).",
                    "Medium-risk roles (adapt now): Manual QA Testing, basic data entry, simple CRUD developers with no system design knowledge.",
                    "Low-risk roles: Tech leads, architects, DevOps engineers, AI/ML engineers, product managers with technical background.",
                ],
                roadmap: {
                    title: "Stay Relevant in the AI Era – Action Plan",
                    weeks: [
                        {
                            week: "Learn AI Tools That Make You 10x Productive",
                            tasks: [
                                "GitHub Copilot / Cursor – AI coding assistant (start today)",
                                "ChatGPT API – Learn to integrate AI into your projects",
                                "Figma AI, Framer AI – If you're into frontend design",
                                "Notion AI, Linear – For project management roles",
                            ],
                        },
                        {
                            week: "Build AI-Adjacent Skills",
                            tasks: [
                                "Complete CS50's AI course (Harvard, free on edX)",
                                "Learn Python if you don't know it (Automate the Boring Stuff – free)",
                                "Build a simple RAG chatbot using LangChain + OpenAI",
                                "Understand Prompt Engineering basics (Deeplearning.ai short courses)",
                            ],
                        },
                        {
                            week: "Position Yourself as AI-Forward",
                            tasks: [
                                "Add AI tools to your LinkedIn skills and resume",
                                "Write 1 LinkedIn post about how you used AI at work",
                                "Build a project that combines your specialty + AI (e.g., Java app with AI summarization)",
                                "Apply to roles that require AI tool familiarity",
                            ],
                        },
                    ],
                },
                salaryExpectation: "AI/ML roles: 8–40 LPA depending on experience. Prompt engineers: 6–20 LPA in Indian market.",
                resources: [
                    "Deeplearning.ai – Best free AI/ML short courses",
                    "fast.ai – Practical deep learning (free)",
                    "GitHub Copilot – Free for students, affordable otherwise",
                    "Hugging Face – Free AI models and datasets",
                    "Kaggle – Free hands-on AI competitions",
                ],
            };

        case "career_gap":
            return {
                intent,
                summary:
                    "A career gap is not a disqualifier — but how you explain it in interviews decides everything.",
                advice: [
                    "Own your gap confidently — nervousness about it is the real red flag, not the gap itself.",
                    "Frame it positively: 'During my gap, I upskilled in X, completed Y certification, and worked on Z project.'",
                    "If the gap was personal (health, family): Say 'I took time off for personal commitments, which is now fully resolved.' Do NOT over-explain.",
                    "Use the gap productively NOW: Get certified, build a project, contribute to GitHub open source.",
                    "Apply to startups first: They care more about skill than continuous employment timelines.",
                    "Address the gap proactively in your cover letter — don't hide it, own it.",
                ],
                roadmap: {
                    title: "Return to Work After Gap – 45-Day Plan",
                    weeks: [
                        {
                            week: "Week 1-2 – Reskill Fast",
                            tasks: [
                                "Take a 15-day intensive course relevant to your target role",
                                "Build 1 complete project and push to GitHub",
                                "Write a compelling 'career gap explanation' script (practice daily)",
                                "Update LinkedIn: add gap period as 'Career Break – Upskilling' (LinkedIn has this option officially)",
                            ],
                        },
                        {
                            week: "Week 3 – Apply Strategically",
                            tasks: [
                                "Target startups and mid-size companies first (less strict on gaps)",
                                "Use referrals: connect with former colleagues who may have moved to new companies",
                                "Apply to contract/freelance roles to generate fresh employment history",
                                "Register on Internshala for returnship programs",
                            ],
                        },
                        {
                            week: "Week 4-6 – Interview Prep",
                            tasks: [
                                "Practice gap explanation in mock interviews (use InterviewAI!)",
                                "Prepare a 2-minute 'gap story' — gap → what you did → ready now",
                                "Research companies known for hiring people with gaps (IBM, Accenture, Infosys all have returnship programs)",
                                "Don't accept below-market offers just because of the gap — know your worth",
                            ],
                        },
                    ],
                },
                salaryExpectation: "Expect 10–20% lower initial offer after a long gap. Negotiate after 6 months of re-entry.",
                resources: [
                    "LinkedIn Career Break feature – Add officially to profile",
                    "Accenture Returnship Program – Google it for current openings",
                    "Infosys Step In (Instep) – Returnship for women",
                    "Internshala – Short-term courses + gig work",
                    "iRelaunch.com – Global returnship platform",
                ],
            };

        case "low_salary":
            return {
                intent,
                summary:
                    "Stuck at a low salary in a service company? Here's a proven roadmap to 2x your CTC in 12–18 months.",
                advice: [
                    "The biggest salary jump happens when you switch companies — internal hikes in TCS/Infosys/Wipro average only 5–10%.",
                    "Target product companies: Google, Microsoft, Atlassian, Freshworks, Razorpay, Zoho — these pay 2-4x service company salaries.",
                    "Certifications that directly boost salary: AWS/Azure (cloud pays 20-40% more), Spring/React (product companies need this), System Design.",
                    "Negotiate smartly: Never reveal current CTC. Quote expected CTC based on market research (use AmbitionBox, Glassdoor).",
                    "Build a visible portfolio: Projects on GitHub, writing on Medium/Dev.to, open source contributions — these get you direct recruiter outreach.",
                    "Consider startups with ESOPs: A 8 LPA + ESOPs at a funded startup can be worth more than 14 LPA at a big company.",
                ],
                roadmap: {
                    title: "Salary Doubling Roadmap (12–18 Months)",
                    weeks: [
                        {
                            week: "Month 1-2 – Identify Your Target",
                            tasks: [
                                "Research market salary for your skills on AmbitionBox + Glassdoor",
                                "Identify 20 target companies (mix of product, startup, services)",
                                "List the skill gaps between you and those roles",
                                "Start filling skill gaps (1 course per month minimum)",
                            ],
                        },
                        {
                            week: "Month 3-4 – Build Credibility",
                            tasks: [
                                "Complete 1 certification: AWS Cloud Practitioner, Google Cloud, or relevant tech cert",
                                "Build 1 impressive project that shows skills target companies need",
                                "Start applying: even rejections teach you interview patterns",
                                "Track all applications and feedback in a spreadsheet",
                            ],
                        },
                        {
                            week: "Month 5-6 – Interview & Negotiate",
                            tasks: [
                                "Aim for 5+ interviews in parallel (leverage competing offers)",
                                "Do not reveal current CTC — it's not legally required in most states",
                                "Quote expected CTC 30–40% higher than current",
                                "Get multiple offers before accepting — use them to negotiate",
                            ],
                        },
                    ],
                },
                salaryExpectation:
                    "Service companies (3-5 yrs exp): 6–10 LPA. Product companies same exp: 15–35 LPA. The gap is real — and bridgeable.",
                resources: [
                    "AmbitionBox – Indian salary benchmarks by company",
                    "Glassdoor – Salary + interview reviews",
                    "Cutshort / Instahyre – Direct startup hiring",
                    "LinkedIn Premium – See who viewed your profile + salary insights",
                    "System Design Primer (GitHub) – Free, interview-ready",
                ],
            };

        case "tech_confusion":
            return {
                intent,
                summary:
                    "Here's a clear comparison to help you pick the right technology based on Indian market demand, salary, and effort.",
                advice: [
                    "Java / Spring Boot: Highest demand in Indian service + banking sector. Massive job postings. Best for: TCS, Wipro, Bank IT divisions. Salary: 3–18 LPA.",
                    ".NET / C#: Strong in MNCs and Microsoft-stack companies. Good demand in Hyderabad, Pune, Bengaluru. Salary: 3–16 LPA.",
                    "Full Stack (React + Node.js): Best for startups and product companies. Faster career growth. Salary: 5–25 LPA for 2-3 years experience.",
                    "Python + AI/ML: Fastest growing. Required for data teams, AI startups. Takes more time to master but highest upside. Salary: 6–35 LPA.",
                    "SQL / Data Engineering: Underrated. Every company needs data. Azure Data, dbt, Databricks — learn these for high-paying niche roles.",
                    "Recommendation for freshers: Java or Full Stack first. Then add Python/AI as a second skill. Don't try to learn everything.",
                ],
                roadmap: {
                    title: "Tech Comparison – Indian Market 2024–25",
                    weeks: [
                        {
                            week: "If You Want Job Security + Volume",
                            tasks: [
                                "Learn: Java + Spring Boot + SQL",
                                "Time to hire-ready: 4–6 months",
                                "Target: TCS, Infosys, Wipro, HCL, Tech Mahindra, banking IT",
                                "Fresher salary range: 3.5–6 LPA",
                            ],
                        },
                        {
                            week: "If You Want High Growth + Product Companies",
                            tasks: [
                                "Learn: React.js + Node.js + MongoDB/PostgreSQL",
                                "Time to hire-ready: 5–8 months (needs portfolio projects)",
                                "Target: Razorpay, Freshworks, Swiggy, Groww, funded startups",
                                "Fresher salary range: 6–14 LPA",
                            ],
                        },
                        {
                            week: "If You Want Future-Proof + AI Era Career",
                            tasks: [
                                "Learn: Python + Pandas + ML basics + LangChain",
                                "Time to hire-ready: 6–12 months",
                                "Target: Mu Sigma, Fractal, AI startups, FAANG data teams",
                                "Fresher salary range: 6–18 LPA",
                            ],
                        },
                    ],
                },
                salaryExpectation: "Choose based on your timeline. Java: fastest to job. Full Stack: highest growth. Python/AI: highest ceiling.",
                resources: [
                    "freeCodeCamp – Full Stack (free, project-based)",
                    "NPTEL Java Programming – IIT-backed, free",
                    "CS50P (Harvard) – Best Python course, free",
                    "Kaggle – Free ML hands-on",
                    "Roadmap.sh – Visual tech learning roadmaps",
                ],
            };

        case "non_it_switch":
            return {
                intent,
                summary:
                    "Switching from non-IT to IT is 100% possible in India — thousands do it every year. Here's the real path.",
                advice: [
                    "Background doesn't matter as much as skills + portfolio. Companies hire for ability, not degree branch in many cases.",
                    "Fastest paths to switch: Manual QA Testing (3-4 months), Business Analyst (4-6 months), Data Analyst with SQL+Excel (3-4 months), Frontend Dev with React (6-9 months).",
                    "Avoid: Trying to become a core developer in 1 month. That sets you up for failure and frustration.",
                    "Targeted companies: TCS, Infosys, Wipro, Accenture take non-IT graduates regularly for specific roles.",
                    "Upskilling options: OnlineDataJobs.in, NIIT, Coursera, Udemy. Government scheme: PMKVY has free IT training.",
                    "Your non-IT background is often an advantage: Mechanical engineers make great embedded/IoT developers. Commerce graduates make great fintech BAs.",
                ],
                roadmap: {
                    title: "Non-IT to IT Switch – 6-Month Roadmap",
                    weeks: [
                        {
                            week: "Month 1 – Choose Your Entry Point Wisely",
                            tasks: [
                                "Evaluate: Manual QA, Data Analyst, BA, or Frontend Dev based on your strength",
                                "Enroll in a targeted 3-month course (NIIT, Imarticus, or Coursera)",
                                "Start learning SQL immediately — it's needed in ALL IT roles",
                                "Join IT communities on Reddit, LinkedIn, Discord",
                            ],
                        },
                        {
                            week: "Month 2-3 – Build Real Skills",
                            tasks: [
                                "Complete your primary course with hands-on projects",
                                "Get ISTQB Foundation (QA), Google Data Analytics cert, or similar",
                                "Build 1-2 projects that demonstrate your new skills",
                                "Rewrite your resume to highlight transferable skills from your old career",
                            ],
                        },
                        {
                            week: "Month 4-6 – Apply + Iterate",
                            tasks: [
                                "Apply to entry-level IT roles in your chosen path",
                                "Be open to lower initial salary — 3-4 LPA is fine if it gets you in",
                                "Use your first IT job to learn aggressively and upskill fast",
                                "Target 1.5-2x salary hike when switching after 12-18 months of IT experience",
                            ],
                        },
                    ],
                },
                salaryExpectation: "Initial IT salary after switch: 3–5 LPA. After 2 years of IT experience: 6–12 LPA is very realistic.",
                resources: [
                    "ISTQB Foundation – Gold standard QA certification",
                    "Google Data Analytics Certificate (Coursera) – Data analyst entry",
                    "SQL for Beginners – Mode Analytics / W3Schools (free)",
                    "PMKVY.gov.in – Free government IT training scheme",
                    "Imarticus / NIIT – Paid but placement-assisted programs",
                ],
            };

        case "skill_roadmap":
            return {
                intent,
                summary:
                    "Here's a practical, month-by-month skill-building roadmap tailored for the Indian IT market.",
                advice: [
                    "Start with one language/technology and go deep before branching out. Confusion comes from jumping between too many things.",
                    "Project > Certificate: A working project on GitHub impresses recruiters more than just a certificate.",
                    "Free > Paid (mostly): freeCodeCamp, NPTEL, CS50, Kaggle, and The Odin Project are as good as paid courses.",
                    "Practice coding daily: Even 45 minutes on LeetCode/HackerRank matters more than weekend marathons.",
                    "Track your progress publicly: GitHub commit history, LinkedIn posts — social accountability accelerates learning.",
                    "Set a deadline: 'I will be job-ready in 5 months' is more effective than open-ended learning.",
                ],
                roadmap: {
                    title: "Universal IT Skill-Building Roadmap",
                    weeks: [
                        {
                            week: "Month 1 – Core Fundamentals",
                            tasks: [
                                "Pick ONE language: Java (for service companies) OR Python (for AI/data) OR JavaScript (for Full Stack)",
                                "Learn: Variables, loops, arrays, functions, OOP basics",
                                "Complete freeCodeCamp or NPTEL introductory course in your chosen language",
                                "SQL: Learn SELECT, JOIN, GROUP BY, subqueries on W3Schools + 20 HackerRank SQL queries",
                            ],
                        },
                        {
                            week: "Month 2-3 – Framework & Tools",
                            tasks: [
                                "Java → Spring Boot | Python → Django/Flask | JS → React + Node.js",
                                "Build a CRUD project (e.g., Student Management System, To-Do App, Blog)",
                                "Git + GitHub: Learn commits, branches, pull requests — essential for any IT job",
                                "Linux basics: Navigate filesystem, basic commands (used in every backend role)",
                            ],
                        },
                        {
                            week: "Month 4-5 – Projects + Interview Prep",
                            tasks: [
                                "Build 2 projects total with proper README and deploy to GitHub/Vercel",
                                "Solve 50 easy LeetCode problems (focus on arrays, strings, hashmaps)",
                                "Practice 20 standard HR interview questions aloud or using InterviewAI",
                                "Apply for internships or junior roles to calibrate your readiness",
                            ],
                        },
                    ],
                },
                salaryExpectation: "Consistent 5-month effort → fresher offers of 4–8 LPA realistic in current market.",
                resources: [
                    "freeCodeCamp.org – Free comprehensive Full Stack curriculum",
                    "NPTEL (nptel.ac.in) – Free IIT courses with certification",
                    "Roadmap.sh – Visual, step-by-step tech roadmaps",
                    "LeetCode / HackerRank – Coding practice",
                    "The Odin Project – Free Full Stack curriculum with projects",
                ],
            };

        default:
            return {
                intent: "general",
                summary:
                    "I'm your AI Career Mentor for Indian IT professionals. Ask me anything about jobs, skills, salary, or career planning.",
                advice: [
                    "I can help you with: job search strategy, skill building roadmaps, salary negotiation, career gap explanation, switching to IT, and dealing with layoff fear.",
                    "Tell me your specific situation and I'll give you a step-by-step action plan.",
                    "Common questions I answer: 'Why am I not getting a job?', 'Should I learn Java or Python?', 'How do I explain my career gap?', 'How do I get a higher salary?'",
                ],
                roadmap: null,
                salaryExpectation: null,
                resources: [
                    "Naukri.com – India's largest job portal",
                    "LinkedIn – Professional networking + jobs",
                    "AmbitionBox – Indian salary benchmarks",
                    "freeCodeCamp – Free tech courses",
                    "InterviewAI – Practice mock interviews",
                ],
            };
    }
}

// ─────────────────────────────────────────────
//  Route Handler
// ─────────────────────────────────────────────

export const handleCareerMentor: RequestHandler = (req, res) => {
    const { message, context } = req.body as CareerMentorRequest;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
        res.status(400).json({
            error: "Message is required",
            hint: "Send a POST request with { \"message\": \"your question here\" }",
        });
        return;
    }

    if (message.trim().length > 2000) {
        res.status(400).json({
            error: "Message too long",
            hint: "Please keep your message under 2000 characters",
        });
        return;
    }

    const intent = detectIntent(message);
    const response = buildResponse(intent, message, context);

    res.status(200).json({
        success: true,
        userMessage: message.trim(),
        ...response,
        closing:
            "Do you want a structured roadmap for your situation? Tell me more about your background (years of experience, current skills, and target role) for a personalized plan.",
        meta: {
            detectedIntent: intent,
            respondedAt: new Date().toISOString(),
            apiVersion: "1.0.0",
        },
    });
};
