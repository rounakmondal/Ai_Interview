import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBPoliceConstablePYP() {
  return (
    <BlogPostLayout slug="wb-police-constable-previous-year-paper">
      <h2>WB Police Constable Recruitment — Overview</h2>
      <p>
        The West Bengal Police Constable exam is conducted by the West Bengal Police Recruitment Board (WBPRB) for recruitment into the state police force. With thousands of vacancies each year, it's one of the most popular govt job exams in West Bengal.
      </p>

      <h2>Exam Pattern</h2>
      <table>
        <thead><tr><th>Stage</th><th>Type</th><th>Marks</th></tr></thead>
        <tbody>
          <tr><td>Preliminary (MCQ)</td><td>100 questions (GK, Math, Reasoning, English)</td><td>100</td></tr>
          <tr><td>PMT/PET</td><td>Physical Measurement & Efficiency Test</td><td>Qualifying</td></tr>
          <tr><td>Final Merit</td><td>Based on Preliminary marks + PMT</td><td>—</td></tr>
        </tbody>
      </table>

      <h2>Available Previous Year Papers</h2>
      <p>Practice with actual WB Police Constable papers from our <Link to="/question-hub">Question Bank</Link>:</p>
      <table>
        <thead><tr><th>Paper</th><th>Year</th><th>Questions</th><th>Format</th></tr></thead>
        <tbody>
          <tr><td>WBP Constable Preliminary</td><td>2021</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Constable Preliminary (Bengali)</td><td>2021</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Constable Preliminary</td><td>2018</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Constable Preliminary</td><td>2016</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Constable Preliminary</td><td>2015</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Constable Preliminary</td><td>2013</td><td>100</td><td>PDF</td></tr>
          <tr><td>WBP Lady Constable Preliminary</td><td>2018</td><td>100</td><td>PDF</td></tr>
        </tbody>
      </table>
      <p><Link to="/question-hub">→ Download All Papers & Start Mock Tests</Link></p>

      <h2>Topic-Wise Analysis (2013–2021)</h2>

      <h3>General Knowledge (35–40%)</h3>
      <ul>
        <li><strong>Most common topics:</strong> Indian History, West Bengal GK, Indian Polity</li>
        <li><strong>Current Affairs:</strong> 8–10 questions from last 6 months</li>
        <li><strong>West Bengal specific:</strong> 5–8 questions on state geography, culture, politics</li>
      </ul>

      <h3>Mathematics (25–30%)</h3>
      <ul>
        <li><strong>High-frequency:</strong> Percentage, ratio, time & work, average</li>
        <li><strong>Medium-frequency:</strong> Profit/loss, simple interest, number system</li>
        <li><strong>Difficulty:</strong> Class 8–10 level — focus on speed</li>
      </ul>

      <h3>Reasoning (15–20%)</h3>
      <ul>
        <li>Series completion, coding-decoding</li>
        <li>Blood relations, direction sense</li>
        <li>Analogies, odd one out</li>
      </ul>

      <h3>English / Bengali (10–15%)</h3>
      <ul>
        <li>Basic grammar, vocabulary, comprehension</li>
        <li>Fill in the blanks, error spotting</li>
      </ul>

      <h2>Preparation Strategy</h2>
      <ol>
        <li><strong>Solve all available PYQs first:</strong> This gives you the exact exam pattern and difficulty level</li>
        <li><strong>Focus on GK + Math:</strong> Together they make up 65–70% of the paper</li>
        <li><strong>Start physical preparation early:</strong> Running, push-ups, and long jump practice</li>
        <li><strong>Study West Bengal GK:</strong> Districts, rivers, CM list, festivals, cultural facts</li>
        <li><strong>Use our <Link to="/govt-practice">Practice Platform</Link></strong> for daily topic-wise practice</li>
      </ol>

      <blockquote>
        <p><strong>Tip:</strong> WB Police papers repeat similar question patterns. Solving 5+ previous year papers will prepare you for 70% of the actual exam.</p>
      </blockquote>
    </BlogPostLayout>
  );
}
