import type { LessonKit } from "@/types/lesson";
import { Check } from "lucide-react";

function DurationBadge({ value }: { value: string }) {
  return (
    <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded">
      ⏱ {value}
    </span>
  );
}

export function LessonPlanTab({ kit }: { kit: LessonKit }) {
  const lp = kit.lesson_plan;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-orange-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-800">Warm-Up</h3>
          <DurationBadge value={lp.warm_up.duration} />
        </div>
        <p className="text-slate-700">{lp.warm_up.activity}</p>
        <p className="italic text-slate-500 text-sm mt-2">{lp.warm_up.purpose}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-800">Concept Introduction</h3>
          <DurationBadge value={lp.concept_introduction.duration} />
        </div>
        <p className="text-slate-700">{lp.concept_introduction.content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {lp.concept_introduction.key_terms?.map((t) => (
            <span key={t} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-emerald-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-800">Guided Activity</h3>
          <DurationBadge value={lp.guided_activity.duration} />
        </div>
        <p className="text-slate-700">{lp.guided_activity.description}</p>
        <ul className="mt-3 space-y-1">
          {lp.guided_activity.materials?.map((m) => (
            <li key={m} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-emerald-500" /> {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-800">Recap</h3>
          <DurationBadge value={lp.recap.duration} />
        </div>
        <ol className="list-decimal list-inside space-y-1 text-slate-700">
          {lp.recap.questions?.map((q, i) => <li key={i}>{q}</li>)}
        </ol>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-yellow-400">
        <h3 className="font-semibold text-lg text-slate-800 mb-2">Homework</h3>
        <p className="text-slate-700">{lp.homework.description}</p>
      </div>
    </div>
  );
}
