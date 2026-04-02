import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBPSCPreparationBengali() {
  return (
    <BlogPostLayout slug="wbpsc-preparation-in-bengali">
      <h2>WBPSC পরীক্ষার প্রস্তুতি — সম্পূর্ণ বাংলা গাইড</h2>
      <p>
        পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন (WBPSC) দ্বারা পরিচালিত পরীক্ষাগুলি রাজ্যে সরকারি চাকরি পাওয়ার অন্যতম প্রধান পথ। 
        এই গাইডে আমরা WBPSC ক্লার্কশিপ, WBCS, এবং অন্যান্য পরীক্ষার প্রস্তুতির একটি সম্পূর্ণ রোডম্যাপ দেব।
      </p>

      <h2>WBPSC পরীক্ষার ধরন</h2>
      <table>
        <thead><tr><th>পরীক্ষা</th><th>পদ</th><th>যোগ্যতা</th></tr></thead>
        <tbody>
          <tr><td>WBCS</td><td>Group A, B, C, D</td><td>স্নাতক</td></tr>
          <tr><td>Clerkship</td><td>Lower Division Clerk</td><td>মাধ্যমিক পাশ</td></tr>
          <tr><td>Food SI</td><td>Food Sub-Inspector</td><td>স্নাতক</td></tr>
          <tr><td>Miscellaneous</td><td>বিভিন্ন পদ</td><td>ভিন্ন ভিন্ন</td></tr>
        </tbody>
      </table>

      <h2>বিষয়ভিত্তিক প্রস্তুতি পরিকল্পনা</h2>

      <h3>ইতিহাস (History)</h3>
      <ul>
        <li><strong>প্রাচীন ভারত:</strong> সিন্ধু সভ্যতা, বৈদিক যুগ, মৌর্য সাম্রাজ্য, গুপ্ত সাম্রাজ্য</li>
        <li><strong>মধ্যযুগ:</strong> সুলতানী শাসন, মোগল সাম্রাজ্য, মারাঠা শক্তি</li>
        <li><strong>আধুনিক ভারত:</strong> ব্রিটিশ শাসন, স্বাধীনতা আন্দোলন, বাংলার নবজাগরণ</li>
        <li><strong>বই:</strong> বিপান চন্দ্রের 'আধুনিক ভারতের ইতিহাস', NCERT ক্লাস ৬–৮</li>
      </ul>

      <h3>ভূগোল (Geography)</h3>
      <ul>
        <li>ভারতের ভৌত ভূগোল — নদী, পর্বত, জলবায়ু</li>
        <li>পশ্চিমবঙ্গের ভূগোল — জেলা, নদী, শিল্প</li>
        <li>বিশ্ব ভূগোল — মহাদেশ, সমুদ্র, জলবায়ু পরিবর্তন</li>
      </ul>

      <h3>রাষ্ট্রবিজ্ঞান (Polity)</h3>
      <ul>
        <li>ভারতীয় সংবিধান — প্রস্তাবনা, মৌলিক অধিকার, নির্দেশমূলক নীতি</li>
        <li>সংসদ, রাষ্ট্রপতি, প্রধানমন্ত্রী এবং তাদের ক্ষমতা</li>
        <li>পঞ্চায়েতি রাজ ব্যবস্থা (73 তম সংশোধনী)</li>
      </ul>

      <h3>গণিত (Arithmetic)</h3>
      <ul>
        <li>শতকরা, অনুপাত, সময় ও কাজ, গড়</li>
        <li>সরল সুদ, চক্রবৃদ্ধি সুদ, লাভ-ক্ষতি</li>
        <li>সংখ্যা পদ্ধতি, গসাগু, লসাগু</li>
      </ul>

      <h3>ইংরেজি (English)</h3>
      <ul>
        <li>Grammar: Tenses, Voice, Narration, Prepositions</li>
        <li>Vocabulary: Synonyms, Antonyms, Idioms</li>
        <li>Comprehension passage</li>
      </ul>

      <h2>প্রস্তুতির সময়সূচি</h2>
      <table>
        <thead><tr><th>মাস</th><th>কাজ</th></tr></thead>
        <tbody>
          <tr><td>১ম–২য় মাস</td><td>ইতিহাস + ভূগোলের ভিত শক্ত করুন</td></tr>
          <tr><td>৩য়–৪র্থ মাস</td><td>রাষ্ট্রবিজ্ঞান + বিজ্ঞান + গণিত</td></tr>
          <tr><td>৫ম মাস</td><td>চলতি ঘটনা + রিভিশন</td></tr>
          <tr><td>৬ষ্ঠ মাস</td><td>মক টেস্ট + ফাইনাল রিভিশন</td></tr>
        </tbody>
      </table>

      <h2>বিনামূল্যে অনুশীলন করুন</h2>
      <ul>
        <li>📝 <Link to="/question-hub">প্রশ্নব্যাংক</Link> — সমস্ত আগের বছরের প্রশ্নপত্র ডাউনলোড এবং অনলাইনে অনুশীলন</li>
        <li>🎯 <Link to="/govt-practice">বিষয়ভিত্তিক অনুশীলন</Link> — প্রতিটি বিষয়ের আলাদা MCQ সেট</li>
        <li>📰 <Link to="/current-affairs">চলতি ঘটনা</Link> — প্রতিদিনের GK আপডেট</li>
      </ul>

      <blockquote>
        <p><strong>💡 টিপ:</strong> প্রতিদিন কমপক্ষে ২ ঘন্টা পড়ুন এবং সপ্তাহে অন্তত ১টি মক টেস্ট দিন। ধারাবাহিকতাই সাফল্যের চাবিকাঠি।</p>
      </blockquote>
    </BlogPostLayout>
  );
}
