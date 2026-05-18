import type { LessonKit } from "@/types/lesson";
import { Key } from "lucide-react";

export function AnswerKeyTab({ kit }: { kit: LessonKit }) {
  const ak = kit.answer_key;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-600" /> Answer Key & Grading Rubric
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white text-sm">
            <tr>
              <th className="p-3">Grade</th>
              <th className="p-3">Range</th>
              <th className="p-3">Descriptor</th>
            </tr>
          </thead>
          <tbody>
            {ak.grading_rubric?.grade_bands?.map((b, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-3 font-semibold text-slate-800">{b.grade}</td>
                <td className="p-3 text-slate-700">{b.range}</td>
                <td className="p-3 text-slate-700">{b.descriptor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-slate-800 mb-3">Worksheet Answers</h3>
        <div className="space-y-3">
          {ak.worksheet_answers?.map((a) => (
            <div key={a.q_number} className="bg-white rounded-lg shadow-sm p-4">
              <p className="font-semibold text-emerald-700">
                Q{a.q_number}. {a.answer}
              </p>
              {a.explanation && (
                <p className="italic text-slate-500 text-sm mt-1">{a.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-slate-800 mb-3">Quiz Answers</h3>
        <div className="space-y-3">
          {ak.quiz_answers?.map((a) => {
            const isLetter = /^[A-D]$/.test(a.answer?.trim?.() || "");
            return (
              <div key={a.q_number} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Q{a.q_number}.</span>
                  {isLetter ? (
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">
                      {a.answer}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-700">{a.answer}</span>
                  )}
                </div>
                {a.explanation && (
                  <p className="italic text-slate-500 text-sm mt-1">{a.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
