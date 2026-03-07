import { RequestHandler } from "express";
import {
  ExamType,
  Subject,
  Difficulty,
  GovtQuestion,
  NewsItem,
  WeeklyQuizItem,
  MonthlyTopic,
  LeaderboardEntry,
  DashboardStats,
} from "@shared/api";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const QUESTION_BANK: GovtQuestion[] = [
  { id: 1, exam: "WBCS", subject: "History", difficulty: "Easy", year: 2023, question: "Who was the first Governor-General of Independent India?", options: ["Lord Mountbatten", "C. Rajagopalachari", "Lord Wavell", "Lord Lytton"], correctIndex: 0, explanation: "Lord Mountbatten became the first Governor-General of Independent India on 15 August 1947.", explanationBn: "লর্ড মাউন্টব্যাটেন ১৯৪৭ সালের ১৫ আগস্ট স্বাধীন ভারতের প্রথম গভর্নর-জেনারেল হন।" },
  { id: 2, exam: "WBCS", subject: "History", difficulty: "Medium", year: 2022, question: "The Battle of Plassey (1757) was fought between the British East India Company and whom?", options: ["Hyder Ali", "Siraj ud-Daulah", "Tipu Sultan", "Mir Kasim"], correctIndex: 1, explanation: "The Battle of Plassey on 23 June 1757 was fought between Robert Clive and Siraj ud-Daulah, the Nawab of Bengal.", explanationBn: "পলাশীর যুদ্ধ ১৭৫৭ সালের ২৩ জুন রবার্ট ক্লাইভ ও সিরাজউদ্দৌলার মধ্যে হয়েছিল।" },
  { id: 3, exam: "SSC", subject: "History", difficulty: "Easy", year: 2023, question: "Mahatma Gandhi launched the Non-Cooperation Movement in which year?", options: ["1915", "1919", "1920", "1922"], correctIndex: 2, explanation: "Gandhi launched the Non-Cooperation Movement in September 1920.", explanationBn: "মহাত্মা গান্ধী ১৯২০ সালের সেপ্টেম্বরে অসহযোগ আন্দোলন শুরু করেন।" },
  { id: 4, exam: "WBCS", subject: "History", difficulty: "Hard", year: 2021, question: "Which is correctly matched — Revolt of 1857 and its leader?", options: ["Kanpur — Nana Sahib", "Lucknow — Mangal Pandey", "Delhi — Tantia Tope", "Jhansi — Kunwar Singh"], correctIndex: 0, explanation: "The revolt at Kanpur was led by Nana Sahib.", explanationBn: "কানপুরের বিদ্রোহের নেতা ছিলেন নানা সাহেব।" },
  { id: 5, exam: "Railway", subject: "History", difficulty: "Easy", question: "India's first railway line was inaugurated in which year?", options: ["1845", "1853", "1860", "1868"], correctIndex: 1, explanation: "India's first railway ran from Bori Bunder to Thane on 16 April 1853.", explanationBn: "ভারতের প্রথম রেলপথ ১৮৫৩ সালের ১৬ এপ্রিল চালু হয়েছিল।" },
  { id: 6, exam: "Police", subject: "History", difficulty: "Medium", question: "Who founded the Indian National Congress in 1885?", options: ["Bal Gangadhar Tilak", "Dadabhai Naoroji", "A.O. Hume", "Gopal Krishna Gokhale"], correctIndex: 2, explanation: "A.O. Hume, a retired British civil servant, founded the INC in 1885.", explanationBn: "A.O. হিউম ১৮৮৫ সালে ভারতীয় জাতীয় কংগ্রেস প্রতিষ্ঠা করেন।" },
  { id: 7, exam: "WBCS", subject: "History", difficulty: "Easy", year: 2022, question: "Swami Vivekananda delivered his famous speech at the Parliament of the World's Religions in which city?", options: ["London", "New York", "Chicago", "Boston"], correctIndex: 2, explanation: "Swami Vivekananda spoke in Chicago on September 11, 1893.", explanationBn: "স্বামী বিবেকানন্দ ১৮৯৩ সালের ১১ সেপ্টেম্বর শিকাগোতে বক্তৃতা দিয়েছিলেন।" },
  { id: 8, exam: "WBCS", subject: "History", difficulty: "Medium", year: 2020, question: "Rabindranath Tagore returned his knighthood as a protest against which event?", options: ["Partition of Bengal (1905)", "Jallianwala Bagh Massacre (1919)", "Non-Cooperation Movement (1920)", "Simon Commission (1927)"], correctIndex: 1, explanation: "Tagore renounced his knighthood in protest of the Jallianwala Bagh Massacre.", explanationBn: "রবীন্দ্রনাথ ঠাকুর জালিয়ানওয়ালাবাগ হত্যাকাণ্ডের প্রতিবাদে নাইটহুড ত্যাগ করেন।" },
  { id: 9, exam: "SSC", subject: "History", difficulty: "Hard", question: "The Vedic text dealing primarily with music and melodies is:", options: ["Rigveda", "Yajurveda", "Samaveda", "Atharvaveda"], correctIndex: 2, explanation: "The Samaveda deals primarily with music and melodies.", explanationBn: "সামবেদ মূলত সঙ্গীত ও সুর নিয়ে কাজ করে।" },
  { id: 10, exam: "Banking", subject: "History", difficulty: "Easy", year: 2019, question: "The Quit India Movement was launched in which year?", options: ["1940", "1942", "1944", "1946"], correctIndex: 1, explanation: "Gandhi launched the Quit India Movement on 8 August 1942.", explanationBn: "গান্ধী ১৯৪২ সালের ৮ আগস্ট ভারত ছাড়ো আন্দোলন শুরু করেন।" },
  { id: 11, exam: "WBCS", subject: "Geography", difficulty: "Easy", year: 2023, question: "Which river is known as the 'Sorrow of Bengal'?", options: ["Ganga", "Brahmaputra", "Damodar", "Hooghly"], correctIndex: 2, explanation: "The Damodar River was known as the 'Sorrow of Bengal' due to devastating floods.", explanationBn: "দামোদর নদকে 'বাংলার দুঃখ' বলা হত।" },
  { id: 12, exam: "SSC", subject: "Geography", difficulty: "Medium", question: "Sundarbans mangrove forest is shared between India and which other country?", options: ["Myanmar", "Sri Lanka", "Bangladesh", "Nepal"], correctIndex: 2, explanation: "Sundarbans is shared between India (West Bengal) and Bangladesh.", explanationBn: "সুন্দরবন ভারত ও বাংলাদেশের মধ্যে ভাগ করা।" },
  { id: 13, exam: "WBCS", subject: "Geography", difficulty: "Medium", year: 2022, question: "Which district of West Bengal has the highest literacy rate as per Census 2011?", options: ["Kolkata", "Darjeeling", "Hooghly", "Burdwan"], correctIndex: 0, explanation: "Kolkata has the highest literacy rate (~87.1%) in West Bengal.", explanationBn: "কলকাতা জেলার পশ্চিমবঙ্গে সর্বোচ্চ সাক্ষরতার হার (~৮৭.১%)।" },
  { id: 14, exam: "Banking", subject: "Geography", difficulty: "Easy", question: "The Tropic of Cancer passes through how many Indian states?", options: ["6", "8", "10", "12"], correctIndex: 1, explanation: "The Tropic of Cancer passes through 8 Indian states.", explanationBn: "কর্কটক্রান্তি ৮টি ভারতীয় রাজ্যের মধ্য দিয়ে যায়।" },
  { id: 15, exam: "Railway", subject: "Geography", difficulty: "Hard", question: "Which peninsular river flows westward into the Arabian Sea?", options: ["Godavari", "Krishna", "Tapti", "Cauvery"], correctIndex: 2, explanation: "The Tapti (Tapi) River flows westward into the Arabian Sea near Surat.", explanationBn: "তাপ্তি নদী পশ্চিমে প্রবাহিত হয়ে আরব সাগরে মিলিত হয়।" },
  { id: 16, exam: "Police", subject: "Geography", difficulty: "Medium", question: "Which state is known as the 'Land of Rising Sun'?", options: ["Assam", "Manipur", "Arunachal Pradesh", "Nagaland"], correctIndex: 2, explanation: "Arunachal Pradesh is called 'Land of Rising Sun' as the sun rises first there.", explanationBn: "অরুণাচল প্রদেশ 'উদীয়মান সূর্যের দেশ' নামে পরিচিত।" },
  { id: 17, exam: "SSC", subject: "Geography", difficulty: "Hard", question: "Which of the following is NOT a tributary of the Ganga?", options: ["Yamuna", "Gomti", "Mahanadi", "Ghaghra"], correctIndex: 2, explanation: "Mahanadi is NOT a tributary of the Ganga; it flows into the Bay of Bengal.", explanationBn: "মহানদী গঙ্গার উপনদী নয়, এটি বঙ্গোপসাগরে পড়ে।" },
  { id: 18, exam: "WBCS", subject: "Geography", difficulty: "Hard", year: 2019, question: "The 'Teesta River' dispute is between India and which country?", options: ["China", "Nepal", "Bangladesh", "Bhutan"], correctIndex: 2, explanation: "The Teesta water sharing dispute is between India and Bangladesh.", explanationBn: "তিস্তা নদীর পানি-বণ্টন বিরোধ ভারত ও বাংলাদেশের মধ্যে।" },
  { id: 19, exam: "WBCS", subject: "Polity", difficulty: "Easy", year: 2023, question: "Article 370 of the Indian Constitution was related to which state/UT?", options: ["Assam", "Manipur", "Jammu & Kashmir", "Nagaland"], correctIndex: 2, explanation: "Article 370 granted special autonomous status to Jammu & Kashmir, abrogated in 2019.", explanationBn: "৩৭০ অনুচ্ছেদ জম্মু ও কাশ্মীরকে বিশেষ মর্যাদা দিয়েছিল, ২০১৯ সালে বাতিল হয়।" },
  { id: 20, exam: "SSC", subject: "Polity", difficulty: "Medium", question: "Which Fundamental Right is the 'heart and soul' of the Constitution per Dr. Ambedkar?", options: ["Right to Equality", "Right to Freedom", "Right to Constitutional Remedies", "Right against Exploitation"], correctIndex: 2, explanation: "Dr. Ambedkar called Article 32 the 'heart and soul' of the Constitution.", explanationBn: "ড. আম্বেদকর ৩২ অনুচ্ছেদকে সংবিধানের 'হৃদয় ও আত্মা' বলেছিলেন।" },
  { id: 21, exam: "Banking", subject: "Polity", difficulty: "Easy", question: "How many members does the Rajya Sabha have?", options: ["245", "250", "252", "260"], correctIndex: 0, explanation: "The Rajya Sabha currently has 245 members (max 250).", explanationBn: "রাজ্যসভায় বর্তমানে ২৪৫ জন সদস্য রয়েছেন।" },
  { id: 22, exam: "Police", subject: "Polity", difficulty: "Medium", question: "The President of India is elected by members of which bodies?", options: ["Both Houses of Parliament", "Lok Sabha only", "Elected members of both Houses + Legislative Assemblies", "Rajya Sabha + State Governors"], correctIndex: 2, explanation: "The President is elected by an Electoral College of elected members of Parliament and state legislatures.", explanationBn: "রাষ্ট্রপতি সংসদ ও রাজ্য বিধানসভার নির্বাচিত সদস্যদের দ্বারা নির্বাচিত হন।" },
  { id: 23, exam: "WBCS", subject: "Polity", difficulty: "Hard", year: 2021, question: "Which Schedule of the Indian Constitution deals with anti-defection provisions?", options: ["Eighth Schedule", "Ninth Schedule", "Tenth Schedule", "Eleventh Schedule"], correctIndex: 2, explanation: "The Tenth Schedule (52nd Amendment, 1985) contains anti-defection provisions.", explanationBn: "দশম তফসিল (৫২তম সংশোধনী, ১৯৮৫) দলত্যাগ বিরোধী বিধান রয়েছে।" },
  { id: 24, exam: "WBCS", subject: "Polity", difficulty: "Medium", year: 2022, question: "The Kesavananda Bharati case (1973) established which constitutional doctrine?", options: ["Right to Property as Fundamental Right", "Basic Structure Doctrine", "Doctrine of Eclipse", "Pith and Substance"], correctIndex: 1, explanation: "The 1973 case established the 'Basic Structure Doctrine'.", explanationBn: "১৯৭৩ সালের মামলায় 'মৌলিক কাঠামো মতবাদ' প্রতিষ্ঠিত হয়।" },
  { id: 25, exam: "WBCS", subject: "Polity", difficulty: "Easy", year: 2023, question: "Directive Principles of State Policy in the Indian Constitution were borrowed from which country?", options: ["USA", "UK", "Ireland", "Australia"], correctIndex: 2, explanation: "Directive Principles were borrowed from Ireland's Constitution (1937).", explanationBn: "রাষ্ট্রনীতির নির্দেশমূলক নীতিগুলি আয়ারল্যান্ডের সংবিধান (১৯৩৭) থেকে নেওয়া হয়েছিল।" },
  { id: 26, exam: "Banking", subject: "Polity", difficulty: "Hard", question: "Which Constitutional Amendment introduced Panchayati Raj?", options: ["70th", "73rd", "52nd", "91st"], correctIndex: 1, explanation: "The 73rd Constitutional Amendment Act (1992) introduced Panchayati Raj.", explanationBn: "৭৩তম সংশোধনী আইন (১৯৯২) পঞ্চায়েতি রাজ প্রবর্তন করে।" },
  { id: 27, exam: "SSC", subject: "Reasoning", difficulty: "Easy", question: "Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64", options: ["17", "26", "37", "64"], correctIndex: 3, explanation: "Pattern is n²+1. 8²+1=65, not 64. So 64 is the odd one out.", explanationBn: "প্যাটার্ন n²+1। 8²+1=65, 64 নয়। তাই 64 আলাদা।" },
  { id: 28, exam: "Banking", subject: "Reasoning", difficulty: "Medium", question: "In a row of 40 students, Aisha is 15th from left and Bimal is 20th from right. How many students are between them?", options: ["4", "5", "6", "7"], correctIndex: 1, explanation: "Bimal is at position 21 from left. Between them: 21 - 15 - 1 = 5.", explanationBn: "বিমল বাম থেকে ২১তম। তাদের মধ্যে: ২১ - ১৫ - ১ = ৫।" },
  { id: 29, exam: "Police", subject: "Reasoning", difficulty: "Easy", question: "If CAT = 3120 and DOG = 4157, what is BIRD?", options: ["2894", "2984", "2994", "2948"], correctIndex: 1, explanation: "Each letter = alphabet position: B=2,I=9,R=18,D=4 → 2984.", explanationBn: "প্রতিটি অক্ষর = বর্ণমালার অবস্থান: B=2,I=9,R=18,D=4 → 2984।" },
  { id: 30, exam: "Railway", subject: "Reasoning", difficulty: "Medium", question: "A is B's sister. C is B's mother. D is C's father. How is A related to D?", options: ["Granddaughter", "Grandmother", "Daughter", "Great-granddaughter"], correctIndex: 0, explanation: "A and B are siblings (C's children). D is C's father → D is A's grandfather → A is D's granddaughter.", explanationBn: "A ও B ভাইবোন (C-এর সন্তান)। D হল C-এর বাবা → A হল D-এর নাতনি।" },
  { id: 31, exam: "SSC", subject: "Reasoning", difficulty: "Hard", question: "Statements: All pens are books. Some books are tables. Conclusions: I. Some pens are tables. II. Some tables are pens.", options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], correctIndex: 3, explanation: "The books that are tables may not be pens. Neither conclusion follows.", explanationBn: "বইগুলি যেগুলি টেবিল সেগুলি পেন নাও হতে পারে। কোনো সিদ্ধান্তই অনুসরণ করে না।" },
  { id: 32, exam: "Banking", subject: "Reasoning", difficulty: "Hard", question: "Five friends P,Q,R,S,T sit in a row. R is 2nd from left. T not at either end. S is immediately right of T. P is right of Q. Who is at extreme right?", options: ["P", "Q", "S", "T"], correctIndex: 0, explanation: "Arrangement: Q(1), R(2), T(3), S(4), P(5). P is at extreme right.", explanationBn: "বিন্যাস: Q(1), R(2), T(3), S(4), P(5)। P সবচেয়ে ডানে।" },
  { id: 33, exam: "Police", subject: "Reasoning", difficulty: "Hard", question: "Which number comes next: 2, 6, 12, 20, 30, 42, ?", options: ["52", "56", "60", "64"], correctIndex: 1, explanation: "Pattern is n(n+1): 7×8 = 56.", explanationBn: "প্যাটার্ন n(n+1): 7×8 = 56।" },
  { id: 34, exam: "SSC", subject: "Math", difficulty: "Easy", question: "If 20% of a number is 80, what is 35% of that number?", options: ["120", "140", "160", "175"], correctIndex: 1, explanation: "Number = 400. 35% of 400 = 140.", explanationBn: "সংখ্যা = ৪০০। ৪০০-এর ৩৫% = ১৪০।" },
  { id: 35, exam: "Banking", subject: "Math", difficulty: "Medium", question: "₹5,000 at 10% compound interest per annum. Amount after 2 years?", options: ["₹5,500", "₹6,000", "₹6,050", "₹5,900"], correctIndex: 2, explanation: "A = 5000 × (1.1)² = ₹6,050.", explanationBn: "A = 5000 × (1.1)² = ₹৬,০৫০।" },
  { id: 36, exam: "Railway", subject: "Math", difficulty: "Easy", question: "A train travels 360 km in 4 hours. Speed in m/s?", options: ["20 m/s", "25 m/s", "30 m/s", "36 m/s"], correctIndex: 1, explanation: "Speed = 90 km/h = 25 m/s.", explanationBn: "গতি = ৯০ কিমি/ঘণ্টা = ২৫ মি/সেকেন্ড।" },
  { id: 37, exam: "Police", subject: "Math", difficulty: "Hard", question: "The average of 5 consecutive odd numbers is 51. What is the largest?", options: ["53", "55", "57", "59"], correctIndex: 1, explanation: "Middle number = 51. Five numbers: 47,49,51,53,55. Largest = 55.", explanationBn: "মধ্যম সংখ্যা = ৫১। পাঁচটি সংখ্যা: ৪৭,৪৯,৫১,৫৩,৫৫। সবচেয়ে বড় = ৫৫।" },
  { id: 38, exam: "WBCS", subject: "Math", difficulty: "Medium", year: 2022, question: "Ratio of ages A:B is 4:5. After 10 years it becomes 6:7. A's current age?", options: ["15", "20", "25", "30"], correctIndex: 1, explanation: "2x=10 → x=5. A = 4×5 = 20.", explanationBn: "2x=10 → x=5। A = 4×5 = ২০ বছর।" },
  { id: 39, exam: "SSC", subject: "Math", difficulty: "Hard", question: "Shopkeeper marks goods 40% above CP, gives 20% discount. Profit%?", options: ["12%", "15%", "18%", "20%"], correctIndex: 0, explanation: "CP=100, MP=140, SP=112. Profit = 12%.", explanationBn: "ক্রয়মূল্য=১০০, চিহ্নিত মূল্য=১৪০, বিক্রয়মূল্য=১১২। লাভ = ১২%।" },
  { id: 40, exam: "Railway", subject: "Math", difficulty: "Hard", question: "Two trains 200m and 300m run towards each other at 60 km/h and 40 km/h. Time to cross?", options: ["18 seconds", "20 seconds", "22 seconds", "25 seconds"], correctIndex: 0, explanation: "Total 500m, relative speed 100 km/h = 250/9 m/s. Time = 18s.", explanationBn: "মোট ৫০০ মিটার, আপেক্ষিক গতি ২৫০/৯ মি/সে। সময় = ১৮ সেকেন্ড।" },
  { id: 41, exam: "WBCS", subject: "Current Affairs", difficulty: "Easy", year: 2024, question: "Which country hosted the G20 Summit in 2023?", options: ["Japan", "India", "South Africa", "Brazil"], correctIndex: 1, explanation: "India hosted the G20 Summit in New Delhi on Sep 9-10, 2023.", explanationBn: "ভারত ২০২৩ সালের ৯-১০ সেপ্টেম্বর নয়াদিল্লিতে জি-২০ শীর্ষ সম্মেলনের আয়োজন করেছিল।" },
  { id: 42, exam: "Banking", subject: "Current Affairs", difficulty: "Easy", year: 2024, question: "Who is the current Governor of the Reserve Bank of India (as of 2024)?", options: ["Shaktikanta Das", "Sanjay Malhotra", "Raghuram Rajan", "Urjit Patel"], correctIndex: 1, explanation: "Sanjay Malhotra was appointed as 26th RBI Governor in December 2024.", explanationBn: "সঞ্জয় মালহোত্রা ২০২৪ সালের ডিসেম্বরে ২৬তম RBI গভর্নর নিযুক্ত হন।" },
  { id: 43, exam: "SSC", subject: "Current Affairs", difficulty: "Medium", year: 2024, question: "Operation Kaveri (2023) evacuated Indian nationals from which country?", options: ["Ukraine", "Syria", "Sudan", "Afghanistan"], correctIndex: 2, explanation: "Operation Kaveri evacuated Indians from Sudan during the 2023 armed conflict.", explanationBn: "অপারেশন কাবেরি ২০২৩ সালে সুদানে আটকে পড়া ভারতীয়দের সরিয়ে আনে।" },
  { id: 44, exam: "Railway", subject: "Current Affairs", difficulty: "Medium", year: 2024, question: "India's first underwater Metro line is in which city?", options: ["Mumbai", "Delhi", "Chennai", "Kolkata"], correctIndex: 3, explanation: "Kolkata's East-West Metro runs under the Hooghly River.", explanationBn: "কলকাতার ইস্ট-ওয়েস্ট মেট্রো হুগলি নদীর নিচে চলে।" },
  { id: 45, exam: "Police", subject: "Current Affairs", difficulty: "Easy", year: 2024, question: "Who won the FIFA Women's World Cup 2023?", options: ["USA", "England", "Sweden", "Spain"], correctIndex: 3, explanation: "Spain won the 2023 FIFA Women's World Cup, defeating England 1-0.", explanationBn: "স্পেন ২০২৩ FIFA মহিলা বিশ্বকাপ জিতেছিল, ইংল্যান্ডকে ১-০ গোলে হারিয়ে।" },
  { id: 46, exam: "WBCS", subject: "Current Affairs", difficulty: "Medium", year: 2024, question: "Chandrayaan-3 successfully landed on the lunar south pole in which year?", options: ["2022", "2023", "2024", "2025"], correctIndex: 1, explanation: "ISRO's Chandrayaan-3 landed near the lunar south pole on August 23, 2023.", explanationBn: "ইসরোর চন্দ্রযান-৩ ২০২৩ সালের ২৩ আগস্ট চাঁদের দক্ষিণ মেরুতে অবতরণ করে।" },
  { id: 47, exam: "Banking", subject: "Current Affairs", difficulty: "Hard", year: 2024, question: "The 'Unified Lending Interface (ULI)' was launched by which organization?", options: ["SEBI", "RBI", "NPCI", "Finance Ministry"], correctIndex: 1, explanation: "RBI launched ULI in August 2024 to streamline credit delivery.", explanationBn: "RBI ২০২৪ সালের আগস্ট মাসে ঋণ বিতরণ সহজ করতে ULI চালু করে।" },
  { id: 48, exam: "Railway", subject: "Current Affairs", difficulty: "Hard", year: 2024, question: "The 'Amrit Bharat Station Scheme' aims to redevelop how many railway stations?", options: ["508", "1275", "2000", "5000"], correctIndex: 1, explanation: "Amrit Bharat Station Scheme covers 1,275 railway stations.", explanationBn: "অমৃত ভারত স্টেশন প্রকল্পে ১,২৭৫টি রেলওয়ে স্টেশন পুনর্বিকাশ হবে।" },
  { id: 49, exam: "Police", subject: "Current Affairs", difficulty: "Medium", year: 2024, question: "The 'Viksit Bharat 2047' initiative aims to make India developed by which year?", options: ["2035", "2047", "2050", "2075"], correctIndex: 1, explanation: "Viksit Bharat 2047 aims to make India developed by 2047, India's centenary of independence.", explanationBn: "বিকশিত ভারত ২০৪৭ স্বাধীনতার শতবর্ষে ভারতকে উন্নত দেশ করার লক্ষ্য নেয়।" },
  { id: 50, exam: "Banking", subject: "Math", difficulty: "Hard", question: "A pipe fills a tank in 12 hours, another empties in 18 hours. Tank is half full; both opened together. Time to fill completely?", options: ["18 hours", "36 hours", "27 hours", "54 hours"], correctIndex: 0, explanation: "Net fill rate = 1/12 - 1/18 = 1/36 per hour. Half tank: (0.5)/(1/36) = 18 hours.", explanationBn: "নেট পূরণের হার = 1/36। অর্ধেক ট্যাঙ্ক: (0.5)/(1/36) = ১৮ ঘণ্টা।" },
];

const DAILY_NEWS: NewsItem[] = [
  { id: 1, date: "2026-03-08", headline: "India launches 7th Generation Weather Satellite INSAT-3DS", summary: "ISRO successfully launched the INSAT-3DS meteorological satellite to enhance weather forecasting and disaster warning capabilities across South Asia.", tags: ["ISRO", "Technology", "Science & Tech"], importance: "high" },
  { id: 2, date: "2026-03-07", headline: "RBI keeps repo rate unchanged at 6.25%", summary: "The Reserve Bank of India's Monetary Policy Committee held the repo rate steady at 6.25% citing stable inflation and growth outlook.", tags: ["RBI", "Economy", "Banking"], importance: "high" },
  { id: 3, date: "2026-03-06", headline: "West Bengal government expands 'Kanyashree Prakalpa' scheme", summary: "The West Bengal government announced an expanded Kanyashree scheme covering girls up to Class XII with increased scholarship amounts.", tags: ["West Bengal", "Education", "Welfare"], importance: "high" },
  { id: 4, date: "2026-03-05", headline: "India signs trade agreement with UAE and UK", summary: "India signed comprehensive trade and investment agreements with UAE and UK during a high-level summit.", tags: ["International Relations", "Economy", "Trade"], importance: "medium" },
  { id: 5, date: "2026-03-04", headline: "Kolkata East-West Metro Phase 2 construction begins", summary: "Construction of the second phase extending to Barasat was inaugurated by the Railway Minister.", tags: ["Kolkata", "Infrastructure", "Railway", "West Bengal"], importance: "high" },
  { id: 6, date: "2026-03-03", headline: "India wins gold in World Wrestling Championship", summary: "Indian wrestler Bajrang Punia won the gold medal in the 65kg freestyle category at the World Wrestling Championship in Budapest.", tags: ["Sports", "Wrestling", "Achievement"], importance: "medium" },
  { id: 7, date: "2026-03-02", headline: "Supreme Court verdict on Uniform Civil Code implementation", summary: "The Supreme Court urged the government to consider a phased approach to implementing the Uniform Civil Code.", tags: ["Supreme Court", "Polity", "Law", "UCC"], importance: "high" },
];

const WEEKLY_QUIZ: WeeklyQuizItem[] = [
  { id: 1, week: "March 1-7, 2026", question: "Which country topped the medals tally at the 2026 Winter Olympics?", options: ["USA", "Norway", "Germany", "Canada"], correctIndex: 1, explanation: "Norway topped the 2026 Winter Olympics medals tally with 37 medals." },
  { id: 2, week: "March 1-7, 2026", question: "The Union Budget 2026-27 allocated highest expenditure to which ministry?", options: ["Defence", "Education", "Health", "Railways"], correctIndex: 0, explanation: "Defence received the highest allocation at ₹6.21 lakh crore (~13% of total)." },
  { id: 3, week: "March 1-7, 2026", question: "Which Indian state launched the 'Green Hydrogen Mission' first?", options: ["Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu"], correctIndex: 1, explanation: "Gujarat became the first state to launch a state-level Green Hydrogen Mission." },
];

const MONTHLY_TOPICS: MonthlyTopic[] = [
  { title: "Union Budget 2026-27 Key Highlights", description: "Important allocations and policy announcements from the Union Budget relevant for competitive exams.", keyPoints: ["GDP Growth target: 6.8–7.2%", "Capital expenditure: ₹11.11 lakh crore", "Fiscal deficit target: 4.4% of GDP", "Focus on green energy, railways, and rural infra", "New PLI schemes for electronics and textiles"], relevantExams: ["WBCS", "Banking", "SSC"] },
  { title: "West Bengal's Socio-Economic Profile 2025", description: "Key data points about West Bengal's economy and demographics that WBCS aspirants must know.", keyPoints: ["Population: ~10.7 crore (3rd largest state)", "State capital: Kolkata", "Major sectors: Agriculture, Jute, IT", "Literacy rate: 76.26% (Census 2011)", "Major dams: Farakka, DVC, Massanjore"], relevantExams: ["WBCS", "Police"] },
  { title: "Constitutional Amendments in Focus", description: "Recent and historically important constitutional amendments frequently asked in exams.", keyPoints: ["105th (2021): Restored state power to identify OBCs", "106th (2023): Women's reservation (33%) in Lok Sabha", "104th (2020): Extended SC/ST reservations for 10 years", "102nd (2018): Constitutional status to NCBC"], relevantExams: ["WBCS", "SSC", "Banking", "Police"] },
];

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "Subhasish Mondal", district: "Kolkata", state: "WB", avatar: "SM", weeklyScore: 94, monthlyScore: 91, totalTests: 87, badge: "gold" },
  { rank: 2, name: "Priya Chakraborty", district: "Howrah", state: "WB", avatar: "PC", weeklyScore: 92, monthlyScore: 89, totalTests: 74, badge: "gold" },
  { rank: 3, name: "Anirban Das", district: "Burdwan", state: "WB", avatar: "AD", weeklyScore: 89, monthlyScore: 88, totalTests: 92, badge: "gold" },
  { rank: 4, name: "Souvik Roy", district: "North 24 Parganas", state: "WB", avatar: "SR", weeklyScore: 87, monthlyScore: 85, totalTests: 65, badge: "silver" },
  { rank: 5, name: "Moumita Ghosh", district: "Murshidabad", state: "WB", avatar: "MG", weeklyScore: 85, monthlyScore: 84, totalTests: 81, badge: "silver" },
  { rank: 6, name: "Debashis Sen", district: "Hooghly", state: "WB", avatar: "DS", weeklyScore: 83, monthlyScore: 82, totalTests: 56, badge: "silver" },
  { rank: 7, name: "Arpita Banerjee", district: "South 24 Parganas", state: "WB", avatar: "AB", weeklyScore: 81, monthlyScore: 80, totalTests: 70, badge: "bronze" },
  { rank: 8, name: "Rahul Mukherjee", district: "Darjeeling", state: "WB", avatar: "RM", weeklyScore: 79, monthlyScore: 79, totalTests: 48, badge: "bronze" },
  { rank: 9, name: "Tanmoy Das", district: "Nadia", state: "WB", avatar: "TD", weeklyScore: 77, monthlyScore: 77, totalTests: 63, badge: "bronze" },
  { rank: 10, name: "Shreya Pal", district: "Malda", state: "WB", avatar: "SP", weeklyScore: 75, monthlyScore: 75, totalTests: 52, badge: "standard" },
  { rank: 11, name: "Arijit Bose", district: "Birbhum", state: "WB", avatar: "AB2", weeklyScore: 73, monthlyScore: 73, totalTests: 45, badge: "standard" },
  { rank: 12, name: "Poulami Dey", district: "Cooch Behar", state: "WB", avatar: "PD", weeklyScore: 72, monthlyScore: 72, totalTests: 38, badge: "standard" },
];

const MOCK_DASHBOARD: DashboardStats = {
  totalTests: 23,
  averageScore: 68,
  weeklyTests: 4,
  strongSubjects: ["History", "Polity"],
  weakSubjects: ["Math", "Reasoning"],
  recentTests: [
    { date: "2026-03-07", exam: "WBCS", score: 18, total: 25 },
    { date: "2026-03-05", exam: "SSC", score: 35, total: 50 },
    { date: "2026-03-03", exam: "Banking", score: 7, total: 10 },
    { date: "2026-02-28", exam: "WBCS", score: 20, total: 25 },
  ],
  subjectScores: [
    { subject: "History", score: 82, tests: 5 },
    { subject: "Polity", score: 78, tests: 4 },
    { subject: "Geography", score: 70, tests: 4 },
    { subject: "Current Affairs", score: 72, tests: 4 },
    { subject: "Reasoning", score: 55, tests: 3 },
    { subject: "Math", score: 48, tests: 3 },
  ],
  progressData: [
    { week: "Jan W1", score: 52 }, { week: "Jan W2", score: 58 },
    { week: "Jan W3", score: 61 }, { week: "Jan W4", score: 59 },
    { week: "Feb W1", score: 64 }, { week: "Feb W2", score: 67 },
    { week: "Feb W3", score: 65 }, { week: "Feb W4", score: 70 },
    { week: "Mar W1", score: 68 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const VALID_EXAMS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];
const VALID_SUBJECTS: Subject[] = ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"];
const VALID_DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

// ─── Handlers ─────────────────────────────────────────────────────────────────

/** GET /api/govt/questions?exam=&subject=&difficulty=&count= */
export const handleGetQuestions: RequestHandler = (req, res) => {
  const { exam, subject, difficulty } = req.query as Record<string, string>;
  const count = Math.min(parseInt((req.query.count as string) || "10", 10), 100);

  if (isNaN(count) || count < 1) {
    res.status(400).json({ error: "Invalid count parameter" });
    return;
  }
  if (exam && !VALID_EXAMS.includes(exam as ExamType)) {
    res.status(400).json({ error: `Invalid exam. Must be one of: ${VALID_EXAMS.join(", ")}` });
    return;
  }
  if (subject && !VALID_SUBJECTS.includes(subject as Subject)) {
    res.status(400).json({ error: `Invalid subject. Must be one of: ${VALID_SUBJECTS.join(", ")}` });
    return;
  }
  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
    res.status(400).json({ error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}` });
    return;
  }

  let pool = QUESTION_BANK.filter((q) => {
    if (exam && q.exam !== exam) return false;
    if (subject && q.subject !== subject) return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    return true;
  });

  // Fallback: relax difficulty, then subject
  if (pool.length === 0 && difficulty) {
    pool = QUESTION_BANK.filter((q) => {
      if (exam && q.exam !== exam) return false;
      if (subject && q.subject !== subject) return false;
      return true;
    });
  }
  if (pool.length === 0) pool = QUESTION_BANK;

  res.json(shuffle(pool).slice(0, count));
};

/** GET /api/govt/prev-year-questions?exam=&year=&subject= */
export const handleGetPrevYearQuestions: RequestHandler = (req, res) => {
  const { exam, subject } = req.query as Record<string, string>;
  const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

  if (exam && !VALID_EXAMS.includes(exam as ExamType)) {
    res.status(400).json({ error: `Invalid exam` });
    return;
  }
  if (subject && !VALID_SUBJECTS.includes(subject as Subject)) {
    res.status(400).json({ error: `Invalid subject` });
    return;
  }
  if (year !== undefined && isNaN(year)) {
    res.status(400).json({ error: "Invalid year" });
    return;
  }

  const results = QUESTION_BANK.filter((q) => {
    if (!q.year) return false;
    if (exam && q.exam !== exam) return false;
    if (year && q.year !== year) return false;
    if (subject && q.subject !== subject) return false;
    return true;
  });

  res.json(results);
};

/** GET /api/govt/current-affairs */
export const handleGetCurrentAffairs: RequestHandler = (_req, res) => {
  res.json({
    news: DAILY_NEWS,
    weeklyQuiz: WEEKLY_QUIZ,
    monthlyTopics: MONTHLY_TOPICS,
  });
};

/** GET /api/govt/leaderboard?filter=weekly|monthly */
export const handleGetLeaderboard: RequestHandler = (req, res) => {
  const filter = (req.query.filter as string) || "weekly";
  if (filter !== "weekly" && filter !== "monthly") {
    res.status(400).json({ error: "filter must be 'weekly' or 'monthly'" });
    return;
  }

  const sorted = [...LEADERBOARD_DATA]
    .sort((a, b) =>
      filter === "weekly"
        ? b.weeklyScore - a.weeklyScore
        : b.monthlyScore - a.monthlyScore
    )
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  res.json(sorted);
};

/** GET /api/govt/dashboard */
export const handleGetDashboard: RequestHandler = (_req, res) => {
  res.json(MOCK_DASHBOARD);
};
