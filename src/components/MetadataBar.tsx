import type { LessonMetadata } from "@/types/lesson";

export function MetadataBar({ metadata }: { metadata: LessonMetadata }) {
  const chips = [
    { label: "Subject", value: metadata.subject },
    { label: "Grade", value: metadata.grade },
    { label: "Topic", value: metadata.topic },
    { label: "Duration", value: metadata.duration },
    { label: "Language", value: metadata.language },
  ];
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4">
      <div className="flex flex-wrap gap-3">
        {chips.map((c) => (
          <div
            key={c.label}
            className="bg-white border border-indigo-100 rounded-lg px-3 py-1.5 text-sm shadow-sm"
          >
            <span className="text-slate-500">{c.label}:</span>{" "}
            <span className="font-semibold text-slate-800 capitalize">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
