import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBPoliceSIMockTest() {
  return (
    <BlogPostLayout slug="wb-police-si-mock-test-free">
      <h2>WB Police SI Exam — Overview</h2>
      <p>
        The West Bengal Police Sub-Inspector (SI) examination is one of the most sought-after police recruitment exams in the state. Conducted by the West Bengal Police Recruitment Board (WBPRB), it offers a career in law enforcement with excellent pay and benefits.
      </p>

      <h2>WB Police SI Exam Pattern</h2>
      <table>
        <thead><tr><th>Stage</th><th>Details</th><th>Marks</th></tr></thead>
        <tbody>
          <tr><td>Preliminary</td><td>100 MCQs (GK, Math, Reasoning, English)</td><td>100</td></tr>
          <tr><td>Physical Test</td><td>Running, Long Jump, High Jump</td><td>Qualifying</td></tr>
          <tr><td>Main Exam</td><td>Descriptive (English, Bengali, GS)</td><td>200</td></tr>
          <tr><td>Interview</td><td>Personality Test</td><td>15</td></tr>
        </tbody>
      </table>

      <h2>Free WB Police SI Mock Tests</h2>
      <p>Practice with actual WBP SI previous year papers in our exam-like environment:</p>
      <ul>
        <li>✅ <strong>WBP SI 2019 Paper</strong> — Full 100 MCQ test with answers</li>
        <li>✅ <strong>WBP SI 2018 Paper</strong> — Full 100 MCQ test with answers</li>
        <li>⏱️ Timed test environment (1.5 hours)</li>
        <li>📊 Instant scoring and answer review</li>
      </ul>
      <p>
        <Link to="/question-hub">→ Start WB Police SI Mock Test Now</Link>
      </p>

      <h2>Subject-Wise Preparation Guide</h2>

      <h3>General Knowledge (30–35 questions)</h3>
      <ul>
        <li>Indian History — focus on Modern India and Freedom Struggle</li>
        <li>Geography — Indian states, capitals, rivers, national parks</li>
        <li>Polity — Constitution, fundamental rights, parliament</li>
        <li>Current Affairs — last 6 months of national & WB news</li>
      </ul>

      <h3>Mathematics (25–30 questions)</h3>
      <ul>
        <li>Arithmetic: percentage, ratio, time & work, averages</li>
        <li>Number system: HCF, LCM, divisibility</li>
        <li>Geometry basics: area, perimeter, volume</li>
      </ul>

      <h3>Reasoning (15–20 questions)</h3>
      <ul>
        <li>Coding-decoding, series completion</li>
        <li>Blood relations, direction sense</li>
        <li>Syllogisms, analogies</li>
      </ul>

      <h3>English (15–20 questions)</h3>
      <ul>
        <li>Grammar: tenses, prepositions, articles</li>
        <li>Vocabulary: synonyms, antonyms, one-word substitution</li>
        <li>Comprehension passages</li>
      </ul>

      <h2>Tips for WB Police SI Exam</h2>
      <ol>
        <li><strong>Focus on GK + Math:</strong> These two cover 60% of the paper.</li>
        <li><strong>Practice previous year papers:</strong> Visit our <Link to="/question-hub">Question Bank</Link> for all WBP SI papers.</li>
        <li><strong>Physical fitness:</strong> Start running and exercising NOW — don't wait until after prelims.</li>
        <li><strong>Daily mock tests:</strong> Practice at least 1 full test every 2 days in the last month.</li>
      </ol>
    </BlogPostLayout>
  );
}
