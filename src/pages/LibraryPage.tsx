import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { fetchLessonLibrary, deleteLesson as deleteLessonApi, type SavedLesson } from "../services/lessonService";
import { setCurrentLesson } from "@/lib/lessonStore";
import { UserMenu } from "@/components/UserMenu";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [filtered, setFiltered] = useState<SavedLesson[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteLessonApi(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      setFiltered((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lesson deleted");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    document.title = "My Library | AI Teaching Studio";
    loadLibrary();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(lessons);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        lessons.filter(
          (l) =>
            l.topic.toLowerCase().includes(q) ||
            l.subject.toLowerCase().includes(q) ||
            l.grade.toLowerCase().includes(q)
        )
      );
    }
  }, [search, lessons]);

  async function loadLibrary() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchLessonLibrary();
      console.log("Lessons loaded:", data);
      setLessons(data);
      setFiltered(data);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleView(id: string) {
    setViewingId(id);
    fetch("https://yunoooo.app.n8n.cloud/webhook/get-lesson?id=" + id)
      .then((r) => r.text())
      .then((text) => {
        const data = JSON.parse(text);
        const lessonData = data.data;
        setCurrentLesson(lessonData);
        sessionStorage.setItem("currentLesson", JSON.stringify(lessonData));
        window.location.href = "/lesson";
      })
      .catch(() => {
        alert("Could not load lesson. Please try again.");
        setViewingId(null);
      });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const subjectGradient = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes("science") || s.includes("bio") || s.includes("chem") || s.includes("phys"))
      return "from-emerald-400 to-teal-500";
    if (s.includes("math")) return "from-blue-400 to-indigo-500";
    if (s.includes("history") || s.includes("social")) return "from-amber-400 to-orange-500";
    if (s.includes("english") || s.includes("language") || s.includes("hindi"))
      return "from-pink-400 to-rose-500";
    return "from-indigo-400 to-violet-500";
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
              <span className="text-lg">🎓</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">AI Teaching Studio</h1>
              <p className="text-xs text-slate-400">Generate a complete lesson kit in 60 seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200"
            >
              + Create New Lesson
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📚 My Lesson Library</h1>
          <p className="text-indigo-200">All your generated lesson kits in one place</p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 -mt-6 mb-8">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search by topic, subject or grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 shadow-lg shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm transition-all duration-200"
          />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-1.5 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-5 bg-slate-200 rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-slate-100 rounded mb-4 w-1/3"></div>
                <div className="h-8 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadLibrary}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            {search ? (
              <p className="text-slate-500">No lessons match your search.</p>
            ) : (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Your library is empty
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  Generate your first lesson kit and it will appear here automatically.
                </p>
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200"
                >
                  ✨ Create First Lesson
                </button>
              </>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((lesson) => (
              <div
                key={lesson.id}
                className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className={`h-1.5 bg-gradient-to-r ${subjectGradient(lesson.subject)} rounded-full mb-4`}
                ></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLesson(lesson.id);
                  }}
                  disabled={deletingId === lesson.id}
                  className="absolute top-5 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Delete lesson"
                >
                  {deletingId === lesson.id ? "..." : "🗑️"}
                </button>
                <h3 className="font-bold text-slate-900 text-lg mb-2 capitalize pr-8">
                  {lesson.topic}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-3 py-1 rounded-full capitalize">
                    {lesson.subject}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs px-3 py-1 rounded-full capitalize">
                    {lesson.grade}
                  </span>
                  <span className="bg-slate-50 text-slate-600 border border-slate-100 text-xs px-3 py-1 rounded-full">
                    {lesson.duration}
                  </span>
                  {lesson.language === "Hindi" && (
                    <span className="bg-orange-50 text-orange-700 border border-orange-100 text-xs px-3 py-1 rounded-full">
                      Hindi
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {formatDate(lesson.created_at)}
                </p>
                <button
                  onClick={() => handleView(lesson.id)}
                  disabled={viewingId === lesson.id}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {viewingId === lesson.id ? "Loading..." : "View Lesson →"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
