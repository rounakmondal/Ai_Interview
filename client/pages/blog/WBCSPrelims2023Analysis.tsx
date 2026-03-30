import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBCSPrelims2023Analysis() {
  return (
    <BlogPostLayout slug="wbcs-prelims-2023-question-paper-analysis">
      <h2>WBCS Prelims 2023 — Overview</h2>
      <p>
        The WBCS Preliminary Examination 2023 was conducted by WBPSC and tested candidates on General Studies, English, and Bengali. This analysis breaks down the paper to help 2026 aspirants understand the trends and prepare strategically.
      </p>

      <h2>Paper Structure</h2>
      <table>
        <thead>
          <tr><th>Section</th><th>Questions</th><th>Marks</th></tr>
        </thead>
        <tbody>
          <tr><td>General Studies</td><td>100</td><td>100</td></tr>
          <tr><td>English</td><td>50</td><td>50</td></tr>
          <tr><td>Bengali</td><td>50</td><td>50</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>200</strong></td><td><strong>200</strong></td></tr>
        </tbody>
      </table>

      <h2>Topic-Wise Breakup (General Studies)</h2>
      <table>
        <thead>
          <tr><th>Topic</th><th>Questions</th><th>Difficulty</th></tr>
        </thead>
        <tbody>
          <tr><td>Indian History</td><td>22</td><td>Moderate</td></tr>
          <tr><td>Geography</td><td>18</td><td>Easy–Moderate</td></tr>
          <tr><td>Indian Polity</td><td>15</td><td>Moderate</td></tr>
          <tr><td>General Science</td><td>12</td><td>Easy</td></tr>
          <tr><td>Economy</td><td>10</td><td>Moderate</td></tr>
          <tr><td>Current Affairs</td><td>15</td><td>Moderate–Hard</td></tr>
          <tr><td>Miscellaneous GK</td><td>8</td><td>Easy</td></tr>
        </tbody>
      </table>

      <h2>Key Observations</h2>
      <ol>
        <li><strong>History dominated:</strong> 22 questions — highest weightage among all topics. Focus on Modern India and Freedom Struggle.</li>
        <li><strong>Current Affairs were tricky:</strong> Questions were from the last 6–8 months before the exam. Daily reading is essential.</li>
        <li><strong>Geography was straightforward:</strong> Most questions from India's physical geography — rivers, mountains, states.</li>
        <li><strong>Science questions were basic:</strong> Class 10 level questions from Biology and Physics.</li>
        <li><strong>English section was standard:</strong> Grammar, vocabulary, and comprehension — no surprises.</li>
      </ol>

      <blockquote>
        <p><strong>Pro Tip:</strong> Practice the actual 2023 paper in timed mode on our <Link to="/wbcs-mock-test">WBCS Mock Test</Link> page to understand the real exam difficulty.</p>
      </blockquote>

      <h2>Difficulty Analysis</h2>
      <ul>
        <li><strong>Easy questions (60–65):</strong> Basic GK, science facts, grammar — these are the "must-score" questions</li>
        <li><strong>Moderate questions (80–90):</strong> Required proper preparation but not very tricky</li>
        <li><strong>Hard questions (45–60):</strong> Current affairs, advanced history, complex polity questions</li>
      </ul>
      <p>
        <strong>Expected cutoff range:</strong> 110–120 marks (out of 200) for General category
      </p>

      <h2>What This Means for WBCS 2026</h2>
      <ul>
        <li>📌 History + Geography + Polity = 55% of the GS paper. Master these three subjects first.</li>
        <li>📌 Current Affairs from the last 8–10 months will be tested. Start now.</li>
        <li>📌 English and Bengali are "scoring" sections — don't neglect them.</li>
        <li>📌 Practice with actual papers using our <Link to="/question-hub">Question Bank</Link> to build speed and accuracy.</li>
      </ul>

      <h2>Practice This Paper Now</h2>
      <p>
        We've digitized the WBCS 2023 question paper. You can attempt it as a full-length <Link to="/wbcs-mock-test">mock test with timer and scoring</Link>, or <Link to="/question-hub">download the PDF</Link> for offline study.
      </p>
    </BlogPostLayout>
  );
}
