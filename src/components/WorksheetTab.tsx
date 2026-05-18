import type { LessonKit } from "@/types/lesson";

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[level?.toLowerCase()] || "bg-slate-100 text-slate-700"}`}>
      {level}
    </span>
  );
}

export function WorksheetTab({ kit }: { kit: LessonKit }) {
  const w = kit.worksheet;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Student Worksheet</h2>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Total: {w.total_marks} marks
        </span>
      </div>
      <div className="bg-slate-50 border-l-4 border-slate-300 p-4 italic text-slate-700">
        {w.instructions}
      </div>
      {w.sections?.map((section, i) => (
        <div key={i} className="space-y-3">
          <h3 className="font-semibold text-lg text-slate-800">{section.section_title}</h3>
          {section.questions.map((q) => (
            <div key={q.q_number} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-slate-800 font-medium">
                  Q{q.q_number}. {q.question}
                </p>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <DifficultyBadge level={q.difficulty} />
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {q.marks} mark{q.marks !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <hr className="border-slate-300" />
                <hr className="border-slate-300" />
                <hr className="border-slate-300" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
