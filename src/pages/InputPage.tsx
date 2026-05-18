import { useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { generateLesson, type LessonFormData } from "@/services/lessonService";
import { setCurrentLesson } from "@/lib/lessonStore";
import { Sparkles, BookOpen } from "lucide-react";

const empty: LessonFormData = {
  subject: "",
  grade: "",
  topic: "",
  duration: "45 minutes",
  objectives: "",
  language: "English",
};

export default function InputPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LessonFormData>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    "Analyzing your topic...",
    "Creating lesson plan...",
    "Generating worksheet...",
    "Building quiz questions...",
    "Preparing answer key...",
    "Almost ready...",
  ];

  useEffect(() => {
    document.title = "Create Lesson | AI Teaching Studio";
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      setProgress(0);
      return;
    }
    setLoadingStep(0);
    setProgress(0);
    const stepTimer = setInterval(() => {
      setLoadingStep((s) => (s + 1) % loadingSteps.length);
    }, 4000);
    const startedAt = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(95, ((Date.now() - startedAt) / 30000) * 100);
      setProgress(pct);
    }, 200);
    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [loading]);

  function update<K extends keyof LessonFormData>(k: K, v: LessonFormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: false }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    (Object.keys(form) as (keyof LessonFormData)[]).forEach((k) => {
      if (!String(form[k]).trim()) newErrors[k] = true;
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await generateLesson(form);
      setCurrentLesson(data);
      toast.success("Lesson generated and saved!");
      navigate({ to: "/lesson" });
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const baseInput =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-slate-800 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400";

  return (
    <div className="min-h-screen">
      <AppHeader
        tagline="Generate a complete lesson kit in 60 seconds"
        right={
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" /> Library
          </Link>
        }
      />
      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* Hero */}
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-indigo-100">
            ✨ AI-Powered Lesson Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Create Complete Lesson Kits
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {" "}in Seconds
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Generate professional lesson plans, worksheets, quizzes and answer keys instantly with AI.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
          <div className="p-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-spin opacity-20"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center text-2xl">
                    ✨
                  </div>
                </div>
                <p className="font-semibold text-slate-800 mb-1">
                  {loadingSteps[loadingStep]}
                </p>
                <p className="text-slate-400 text-sm">
                  This takes about 20 seconds
                </p>
                <div className="mt-4 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Create Your Lesson Kit</h2>
                <p className="text-slate-500 mt-1">
                  Fill in the details below and get a complete lesson plan, worksheet, quiz and answer key instantly.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  {([
                    { k: "subject", label: "Subject", ph: "e.g. Mathematics, Science, History" },
                    { k: "grade", label: "Grade / Level", ph: "e.g. Grade 6, Grade 10" },
                    { k: "topic", label: "Topic", ph: "e.g. Fractions, Photosynthesis" },
                  ] as const).map(({ k, label, ph }) => (
                    <div key={k}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input
                        className={`${baseInput} ${errors[k] ? "border-red-400" : "border-slate-200"}`}
                        placeholder={ph}
                        value={form[k]}
                        onChange={(e) => update(k, e.target.value)}
                      />
                      {errors[k] && <p className="text-xs text-red-500 mt-1">This field is required.</p>}
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Duration</label>
                    <select
                      className={`${baseInput} ${errors.duration ? "border-red-400" : "border-slate-200"}`}
                      value={form.duration}
                      onChange={(e) => update("duration", e.target.value)}
                    >
                      {["30 minutes", "45 minutes", "60 minutes", "90 minutes"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Learning Objectives</label>
                    <textarea
                      rows={3}
                      className={`${baseInput} ${errors.objectives ? "border-red-400" : "border-slate-200"}`}
                      placeholder="What should students learn?"
                      value={form.objectives}
                      onChange={(e) => update("objectives", e.target.value)}
                    />
                    {errors.objectives && <p className="text-xs text-red-500 mt-1">This field is required.</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Output Language</label>
                    <div className="mt-1 inline-flex rounded-xl bg-slate-100 p-1">
                      {["English", "Hindi"].map((l) => (
                        <button
                          type="button"
                          key={l}
                          onClick={() => update("language", l)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            form.language === l
                              ? "bg-white text-indigo-600 shadow"
                              : "text-slate-600"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    {form.language === "Hindi" && (
                      <div className="mt-2 inline-block bg-indigo-50 text-indigo-700 text-xs rounded px-3 py-1">
                        📝 All content will be generated in Hindi
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-indigo-200 hover:shadow-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <Sparkles className="w-5 h-5" /> Generate Lesson Kit
                  </button>

                  <div className="flex justify-center gap-8 mt-6 text-center text-sm text-slate-500">
                    <div>
                      <span className="font-bold text-slate-800">20s</span>
                      <br />
                      Generation time
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">4</span>
                      <br />
                      Document types
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Free</span>
                      <br />
                      No credit card
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
