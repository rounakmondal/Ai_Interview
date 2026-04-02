import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBPSCClerkshipPYP() {
  return (
    <BlogPostLayout slug="wbpsc-clerkship-previous-year-papers">
      <h2>WBPSC Clerkship Exam — Quick Overview</h2>
      <p>
        The WBPSC Clerkship exam is conducted for recruitment of Lower Division Clerks (LDC) in various government departments of West Bengal. The exam consists of two parts — a written test followed by a typing/computer skill test.
      </p>

      <h2>Exam Pattern</h2>
      <table>
        <thead><tr><th>Part</th><th>Subjects</th><th>Questions</th><th>Marks</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>Part I</td><td>English, GS, Arithmetic</td><td>100 MCQ</td><td>100</td><td>1.5 hours</td></tr>
          <tr><td>Part II</td><td>Bengali / Hindi / Urdu / Nepali / Santali</td><td>100 MCQ</td><td>100</td><td>1.5 hours</td></tr>
        </tbody>
      </table>
      <p><strong>Negative marking:</strong> 0.25 marks deducted per wrong answer.</p>

      <h2>Available WBPSC Clerkship Papers</h2>
      <p>We have digitized the following Clerkship papers for online practice and download:</p>
      <table>
        <thead><tr><th>Paper</th><th>Year</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>WBPSC Clerkship (1st Shift)</td><td>2024</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
          <tr><td>WBPSC Clerkship (2nd Shift)</td><td>2024</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
          <tr><td>WBPSC Clerkship (3rd Shift)</td><td>2024</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
          <tr><td>WBPSC Clerkship (4th Shift)</td><td>2024</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
          <tr><td>WBPSC Clerkship (Shift 2)</td><td>2020</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
          <tr><td>WBPSC Clerkship (Set 2)</td><td>2019</td><td><Link to="/question-hub">Attempt Test →</Link></td></tr>
        </tbody>
      </table>

      <h2>Section-Wise Analysis (2024 Papers)</h2>
      <h3>English (Q1–Q30)</h3>
      <ul>
        <li>Prepositions, synonyms/antonyms, idioms & phrases</li>
        <li>Active-passive voice, direct-indirect speech</li>
        <li>Sentence correction and parts of speech</li>
      </ul>

      <h3>Arithmetic (Q31–Q70)</h3>
      <ul>
        <li>Percentage, ratio & proportion, time & work</li>
        <li>Simple & compound interest</li>
        <li>Number system, HCF/LCM, average</li>
        <li>Profit & loss, speed/distance/time</li>
      </ul>

      <h3>General Studies (Q30–Q100)</h3>
      <ul>
        <li>Indian history (Ancient, Medieval, Modern)</li>
        <li>Geography of India and West Bengal</li>
        <li>Indian Polity and Constitution</li>
        <li>Current affairs (national & state level)</li>
        <li>Sports, awards, basic science</li>
      </ul>

      <h2>Preparation Tips for WBPSC Clerkship</h2>
      <ol>
        <li><strong>Start with Arithmetic:</strong> 40% of Part I is arithmetic — practice daily calculations</li>
        <li><strong>English grammar focus:</strong> No need for advanced vocabulary — master basics</li>
        <li><strong>Bengali in Part II:</strong> Read newspapers, practice comprehension passages</li>
        <li><strong>GS shortcut:</strong> Focus on last 2 years' current affairs + basic static GK</li>
        <li><strong>Practice with actual papers:</strong> Use our <Link to="/question-hub">Question Bank</Link> to attempt 2019–2024 papers</li>
      </ol>

      <blockquote>
        <p><strong>💡 Tip:</strong> The fastest way to prepare is by practicing 2–3 previous year papers per week on our platform with the exam timer feature.</p>
      </blockquote>
    </BlogPostLayout>
  );
}
