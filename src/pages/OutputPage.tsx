import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentLesson } from "@/lib/lessonStore";
import type { LessonKit } from "@/types/lesson";
import { MetadataBar } from "@/components/MetadataBar";
import { LessonPlanTab } from "@/components/LessonPlanTab";
import { WorksheetTab } from "@/components/WorksheetTab";
import { QuizTab } from "@/components/QuizTab";
import { AnswerKeyTab } from "@/components/AnswerKeyTab";
import { ArrowLeft, Download } from "lucide-react";

const TABS = [
  { id: "plan", label: "📋 Lesson Plan" },
  { id: "worksheet", label: "📝 Worksheet" },
  { id: "quiz", label: "❓ Quiz" },
  { id: "answers", label: "✅ Answer Key" },
] as const;

const PRINT_CSS = `
@media print {
  body * { visibility: hidden; }
  #print-content, #print-content * { visibility: visible; }
  #print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-family: Georgia, serif;
    color: black;
    background: white;
    padding: 1cm;
    font-size: 12pt;
  }
  .print-page-break { page-break-before: always; }
  .print-section-title {
    font-size: 20pt;
    font-weight: bold;
    border-bottom: 2pt solid black;
    margin-bottom: 12pt;
    padding-bottom: 6pt;
  }
  .print-subheading {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 6pt;
  }
  .print-question { margin-bottom: 16pt; }
  .print-answer-lines {
    border-bottom: 1pt solid #ccc;
    height: 20pt;
    margin: 4pt 0;
  }
  .print-meta {
    font-size: 11pt;
    color: #444;
    margin-bottom: 20pt;
  }
  .print-key-answer {
    color: #1a5c1a;
    font-weight: bold;
  }
  .print-rubric-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16pt;
  }
  .print-rubric-table td,
  .print-rubric-table th {
    border: 1pt solid black;
    padding: 4pt 8pt;
    text-align: left;
  }
  @page { margin: 1cm; }
}
#print-content { display: none; }
@media print {
  #print-content { display: block; }
}
`;

export default function OutputPage() {
  const navigate = useNavigate();
  const initial = ((): LessonKit | null => {
    const fromStore = getCurrentLesson();
    if (fromStore) return fromStore;
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("currentLesson");
      if (stored) {
        try { return JSON.parse(stored) as LessonKit; } catch { return null; }
      }
    }
    return null;
  })();

  const [kit, setKit] = useState<LessonKit | null>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("plan");
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [showFullObjectives, setShowFullObjectives] = useState(false);

  useEffect(() => {
    if (!kit) {
      if (typeof window !== "undefined") window.location.href = "/";
      else navigate({ to: "/" });
    } else {
      document.title = `${kit.metadata.topic} Lesson | AI Teaching Studio`;
    }
  }, [kit, navigate]);

  if (!kit) return null;

  const handlePrint = () => {
    window.print();
  };

  async function regenerateSection(section: "lesson_plan" | "worksheet" | "quiz" | "answer_key") {
    if (!kit) return;
    setRegenerating(section);
    try {
      const response = await fetch(
        "https://yunoooo.app.n8n.cloud/webhook/generate-lesson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: kit.metadata.subject,
            grade: kit.metadata.grade,
            topic: kit.metadata.topic,
            duration: kit.metadata.duration,
            objectives: (kit.metadata as any).objectives ?? "",
            language: kit.metadata.language,
          }),
        }
      );
      const text = await response.text();
      const data = JSON.parse(text);
      if (data.success) {
        setKit((prev: any) => ({ ...prev, [section]: data.data[section] }));
        try {
          const merged = { ...kit, [section]: data.data[section] };
          sessionStorage.setItem("currentLesson", JSON.stringify(merged));
        } catch {}
        toast.success("Section regenerated!");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setRegenerating(null);
    }
  }

  const tabToSection: Record<string, "lesson_plan" | "worksheet" | "quiz" | "answer_key"> = {
    plan: "lesson_plan",
    worksheet: "worksheet",
    quiz: "quiz",
    answers: "answer_key",
  };
  const currentSection = tabToSection[tab];
  const sectionLabels: Record<string, string> = {
    lesson_plan: "lesson plan",
    worksheet: "worksheet",
    quiz: "quiz",
    answer_key: "answer key",
  };

  const m = kit.metadata;
  const lp = kit.lesson_plan;
  const ws = kit.worksheet;
  const qz = kit.quiz;
  const ak = kit.answer_key;

  const blankLines = (n: number) =>
    Array.from({ length: n }).map((_, i) => (
      <div key={i} className="print-answer-lines" />
    ));

  return (
    <div className="min-h-screen">
      <style>{PRINT_CSS}</style>
      <AppHeader
        right={
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200 text-sm"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <Link
              to="/library"
              className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Library
            </Link>
            <Link
              to="/"
              className="hidden sm:inline text-xs text-slate-500 hover:text-indigo-600 transition-all duration-200"
            >
              + Create New Lesson
            </Link>
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div>
          <MetadataBar metadata={kit.metadata} />
          {kit.metadata.objectives && (
            <p
              className={`text-xs italic text-slate-500 mt-2 px-4 ${
                showFullObjectives ? "" : "truncate"
              }`}
            >
              <span className="font-semibold not-italic">Objectives:</span>{" "}
              {kit.metadata.objectives}
              {kit.metadata.objectives.length > 80 && (
                <button
                  onClick={() => setShowFullObjectives((v) => !v)}
                  className="ml-2 text-indigo-600 not-italic font-medium hover:underline"
                >
                  {showFullObjectives ? "show less" : "show more"}
                </button>
              )}
            </p>
          )}
        </div>

        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-slate-900 capitalize mb-2">
            {kit.metadata.topic}
          </h1>
          <p className="text-slate-500">
            {kit.metadata.subject} • {kit.metadata.grade}
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm whitespace-nowrap rounded-xl transition-all duration-200 ${
                tab === t.id
                  ? "bg-white shadow-sm text-indigo-600 font-semibold"
                  : "text-slate-500 hover:text-slate-700 font-medium"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => regenerateSection(currentSection)}
              disabled={regenerating === currentSection}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all duration-200 disabled:opacity-50"
            >
              {regenerating === currentSection ? "Regenerating..." : "🔄 Regenerate Section"}
            </button>
          </div>
          {regenerating === currentSection ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-slate-500">
                Regenerating {sectionLabels[currentSection]} with AI...
              </span>
            </div>
          ) : (
            <>
              {tab === "plan" && <LessonPlanTab kit={kit} />}
              {tab === "worksheet" && <WorksheetTab kit={kit} />}
              {tab === "quiz" && <QuizTab kit={kit} />}
              {tab === "answers" && <AnswerKeyTab kit={kit} />}
            </>
          )}
        </div>
      </main>

      <div id="print-content">
        {/* Header */}
        <div style={{ marginBottom: "20pt" }}>
          <div style={{ fontSize: "10pt", color: "#666" }}>AI Teaching Studio</div>
          <h1 style={{ fontSize: "24pt", fontWeight: "bold", margin: "4pt 0", textTransform: "capitalize" }}>
            {m.topic}
          </h1>
          <div className="print-meta">
            {m.subject} | {m.grade} | {m.duration} | {m.language}
          </div>
          <div style={{ fontSize: "10pt", color: "#666" }}>
            Generated: {m.generated_at}
          </div>
        </div>

        {/* Lesson Plan */}
        <section>
          <div className="print-section-title">Lesson Plan</div>

          <div className="print-subheading">Warm-Up ({lp.warm_up.duration})</div>
          <div><strong>Activity:</strong> {lp.warm_up.activity}</div>
          <div><strong>Purpose:</strong> {lp.warm_up.purpose}</div>

          <div className="print-subheading">Concept Introduction ({lp.concept_introduction.duration})</div>
          <div>{lp.concept_introduction.content}</div>
          <div style={{ marginTop: "6pt" }}>
            <strong>Key Terms:</strong> {lp.concept_introduction.key_terms.join(", ")}
          </div>

          <div className="print-subheading">Guided Activity ({lp.guided_activity.duration})</div>
          <div>{lp.guided_activity.description}</div>
          <div style={{ marginTop: "6pt" }}><strong>Materials:</strong></div>
          <ul style={{ marginLeft: "20pt" }}>
            {lp.guided_activity.materials.map((mat, i) => <li key={i}>{mat}</li>)}
          </ul>

          <div className="print-subheading">Recap ({lp.recap.duration})</div>
          <ol style={{ marginLeft: "20pt" }}>
            {lp.recap.questions.map((q, i) => <li key={i}>{q}</li>)}
          </ol>

          <div className="print-subheading">Homework</div>
          <div>{lp.homework.description}</div>
        </section>

        {/* Worksheet */}
        <section className="print-page-break">
          <div className="print-section-title">
            Student Worksheet — Total Marks: {ws.total_marks}
          </div>
          <div style={{ marginBottom: "12pt", fontStyle: "italic" }}>
            {ws.instructions}
          </div>
          {ws.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: "16pt" }}>
              <div className="print-subheading">{sec.section_title}</div>
              {sec.questions.map((q) => (
                <div key={q.q_number} className="print-question">
                  <div>
                    <strong>Q{q.q_number}.</strong> {q.question}{" "}
                    <span style={{ color: "#666" }}>[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>
                  </div>
                  {blankLines(3)}
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Quiz */}
        <section className="print-page-break">
          <div className="print-section-title">Quiz</div>
          <div style={{ marginBottom: "12pt", fontStyle: "italic" }}>
            {qz.instructions}
          </div>

          <div className="print-subheading">Part A — Multiple Choice</div>
          {qz.mcq.map((q) => (
            <div key={q.q_number} className="print-question">
              <div>
                <strong>Q{q.q_number}.</strong> {q.question}{" "}
                <span style={{ color: "#666" }}>[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>
              </div>
              <div style={{ marginLeft: "16pt", marginTop: "4pt" }}>
                <div>A. {q.options.A}</div>
                <div>B. {q.options.B}</div>
                <div>C. {q.options.C}</div>
                <div>D. {q.options.D}</div>
              </div>
            </div>
          ))}

          <div className="print-subheading">Part B — Short Answer</div>
          {qz.short_answer.map((q) => (
            <div key={q.q_number} className="print-question">
              <div>
                <strong>Q{q.q_number}.</strong> {q.question}{" "}
                <span style={{ color: "#666" }}>[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>
              </div>
              {blankLines(3)}
            </div>
          ))}
        </section>

        {/* Answer Key */}
        <section className="print-page-break">
          <div className="print-section-title">Answer Key</div>

          <div className="print-subheading">Grading Rubric (Total: {ak.grading_rubric.total_marks})</div>
          <table className="print-rubric-table">
            <thead>
              <tr>
                <th>Range</th>
                <th>Grade</th>
                <th>Descriptor</th>
              </tr>
            </thead>
            <tbody>
              {ak.grading_rubric.grade_bands.map((b, i) => (
                <tr key={i}>
                  <td>{b.range}</td>
                  <td>{b.grade}</td>
                  <td>{b.descriptor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="print-subheading">Worksheet Answers</div>
          {ak.worksheet_answers.map((a) => (
            <div key={a.q_number} className="print-question">
              <div>
                <strong>Q{a.q_number}.</strong>{" "}
                <span className="print-key-answer">{a.answer}</span>
              </div>
              <div style={{ fontSize: "11pt", color: "#444" }}>{a.explanation}</div>
            </div>
          ))}

          <div className="print-subheading">Quiz Answers</div>
          {ak.quiz_answers.map((a) => (
            <div key={a.q_number} className="print-question">
              <div>
                <strong>Q{a.q_number}.</strong>{" "}
                <span className="print-key-answer">{a.answer}</span>
              </div>
              <div style={{ fontSize: "11pt", color: "#444" }}>{a.explanation}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
