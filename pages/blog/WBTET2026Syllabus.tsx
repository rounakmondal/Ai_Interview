import { Link } from "react-router-dom";
import BlogPostLayout from "../BlogPostLayout";

export default function WBTET2026Syllabus() {
  return (
    <BlogPostLayout slug="wb-tet-2026-syllabus-exam-pattern">
      <h2>What Is WB Primary TET?</h2>
      <p>
        The West Bengal Teacher Eligibility Test (WB TET) is a state-level exam conducted by the West Bengal Board of Primary Education (WBBPE). Passing this exam is mandatory for anyone who wants to teach in government primary schools (Classes I–V) in West Bengal.
      </p>

      <h2>WB TET 2026 Exam Pattern</h2>
      <table>
        <thead><tr><th>Part</th><th>Subject</th><th>Questions</th><th>Marks</th></tr></thead>
        <tbody>
          <tr><td>Part A</td><td>Child Development & Pedagogy</td><td>30</td><td>30</td></tr>
          <tr><td>Part B</td><td>Language I (Bengali/Hindi/Urdu/Nepali/Santali)</td><td>30</td><td>30</td></tr>
          <tr><td>Part C</td><td>Language II (English)</td><td>30</td><td>30</td></tr>
          <tr><td>Part D</td><td>Mathematics</td><td>30</td><td>30</td></tr>
          <tr><td>Part E</td><td>Environmental Studies</td><td>30</td><td>30</td></tr>
          <tr><td><strong>Total</strong></td><td></td><td><strong>150</strong></td><td><strong>150</strong></td></tr>
        </tbody>
      </table>
      <p><strong>Duration:</strong> 2 hours 30 minutes | <strong>Negative marking:</strong> None</p>

      <h2>Subject-Wise Syllabus</h2>

      <h3>Part A: Child Development & Pedagogy (30 Qs)</h3>
      <ul>
        <li>Growth and Development — concepts, principles, factors affecting</li>
        <li>Piaget's Theory of Cognitive Development</li>
        <li>Kohlberg's Moral Development Theory</li>
        <li>Vygotsky's Zone of Proximal Development</li>
        <li>Multiple Intelligence (Howard Gardner)</li>
        <li>Inclusive Education — concept, disabilities, learning difficulties</li>
        <li>Assessment types — formative, summative, CCE</li>
        <li>NCF 2005 and RTE Act 2009</li>
      </ul>

      <h3>Part B: Language I — Bengali (30 Qs)</h3>
      <ul>
        <li>Comprehension passage (গদ্যাংশ/কবিতা based)</li>
        <li>Grammar — সন্ধি, সমাস, কারক, বিভক্তি, ক্রিয়া</li>
        <li>Language pedagogy — teaching methods, learning disabilities</li>
      </ul>

      <h3>Part C: Language II — English (30 Qs)</h3>
      <ul>
        <li>Reading comprehension (prose/poetry)</li>
        <li>Grammar — tenses, parts of speech, voice, narration</li>
        <li>Vocabulary and language pedagogy</li>
      </ul>

      <h3>Part D: Mathematics (30 Qs)</h3>
      <ul>
        <li>Number system, fractions, decimals</li>
        <li>Profit & loss, simple interest, percentage</li>
        <li>Geometry, mensuration, data interpretation</li>
        <li>Mathematics pedagogy — teaching approaches, NCF guidelines</li>
      </ul>

      <h3>Part E: Environmental Studies (30 Qs)</h3>
      <ul>
        <li>Family, food, shelter, water</li>
        <li>Plants, animals, human body</li>
        <li>Our state (West Bengal) — geography, culture</li>
        <li>EVS pedagogy — experiential learning, project-based learning</li>
      </ul>

      <h2>Passing Marks</h2>
      <table>
        <thead><tr><th>Category</th><th>Minimum %</th><th>Minimum Marks (out of 150)</th></tr></thead>
        <tbody>
          <tr><td>General</td><td>60%</td><td>90</td></tr>
          <tr><td>OBC</td><td>55%</td><td>82.5</td></tr>
          <tr><td>SC/ST/PH</td><td>55%</td><td>82.5</td></tr>
        </tbody>
      </table>

      <h2>Previous Year Papers for Practice</h2>
      <p>Practice with actual WB TET papers from our <Link to="/question-hub">Question Bank</Link>:</p>
      <ul>
        <li>📝 WB Primary TET 2023 — 150 questions</li>
        <li>📝 WB Primary TET 2022 — 150 questions</li>
        <li>📝 WB Primary TET 2017 — 150 questions</li>
        <li>📝 WB Primary TET 2015 — 150 questions</li>
      </ul>

      <blockquote>
        <p><strong>💡 Important:</strong> TET has NO negative marking. Attempt ALL questions — even educated guesses can help you cross the pass mark.</p>
      </blockquote>
    </BlogPostLayout>
  );
}
