import type { LessonKit } from "@/types/lesson";

export function QuizTab({ kit }: { kit: LessonKit }) {
  const q = kit.quiz;
  const total =
    (q.mcq?.reduce((s, m) => s + m.marks, 0) || 0) +
    (q.short_answer?.reduce((s, m) => s + m.marks, 0) || 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Quiz</h2>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Total: {total} marks
        </span>
      </div>
      {q.instructions && (
        <div className="bg-slate-50 border-l-4 border-slate-300 p-4 italic text-slate-700">
          {q.instructions}
        </div>
      )}

      <h3 className="font-semibold text-lg text-slate-800">Part A — Multiple Choice</h3>
      <div className="space-y-3">
        {q.mcq?.map((m) => (
          <div key={m.q_number} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between gap-3">
              <p className="font-semibold text-slate-800">
                Q{m.q_number}. {m.question}
              </p>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0 h-fit">
                {m.marks} mark{m.marks !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {(["A", "B", "C", "D"] as const).map((k) => (
                <label key={k} className="flex items-center gap-3 p-2 border border-slate-200 rounded hover:bg-slate-50">
                  <input type="radio" name={`mcq-${m.q_number}`} className="accent-indigo-600" />
                  <span className="text-slate-700">
                    <strong>{k}.</strong> {m.options[k]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-lg text-slate-800">Part B — Short Answer</h3>
      <div className="space-y-3">
        {q.short_answer?.map((s) => (
          <div key={s.q_number} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between gap-3">
              <p className="text-slate-800 font-medium">
                Q{s.q_number}. {s.question}
              </p>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0 h-fit">
                {s.marks} mark{s.marks !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
