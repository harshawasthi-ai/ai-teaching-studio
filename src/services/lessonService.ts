import { supabase } from '../integrations/supabase/client';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 
  "https://yunoooo.app.n8n.cloud/webhook/generate-lesson";

export interface LessonFormData {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  objectives: string;
  language: string;
}

export interface SavedLesson {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  language: string;
  created_at: string;
  user_id?: string;
}

export async function generateLesson(formData: LessonFormData) {
  const { data: { user } } = await supabase.auth.getUser();

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      user_id: user?.id || null
    }),
  });

  const text = await response.text();
  if (!text || text.trim() === "") {
    throw new Error("Empty response from server");
  }

  const data = JSON.parse(text);
  if (!data.success) {
    throw new Error(data.error || "Generation failed");
  }

  if (user) {
    const { error: saveError } = await supabase
      .from('lessons')
      .insert({
        subject: data.data.metadata.subject,
        grade: data.data.metadata.grade,
        topic: data.data.metadata.topic,
        duration: data.data.metadata.duration,
        language: data.data.metadata.language,
        objectives: data.data.metadata.objectives,
        lesson_plan: data.data.lesson_plan,
        worksheet: data.data.worksheet,
        quiz: data.data.quiz,
        answer_key: data.data.answer_key,
        user_id: user.id
      });

    if (saveError) {
      console.error('Save error:', saveError);
    }
  }

  return data.data;
}

export async function fetchLessonLibrary(): Promise<SavedLesson[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('lessons')
    .select('id, subject, grade, topic, duration, language, created_at, user_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to load library');
  }

  return data || [];
}

export async function fetchSingleLesson(id: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error('Lesson not found');
  }

  return {
    metadata: {
      subject: data.subject,
      grade: data.grade,
      topic: data.topic,
      duration: data.duration,
      language: data.language,
      objectives: data.objectives || '',
      generated_at: data.created_at
    },
    lesson_plan: data.lesson_plan,
    worksheet: data.worksheet,
    quiz: data.quiz,
    answer_key: data.answer_key
  };
}

export async function deleteLesson(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete lesson');
  }

  return true;
}

export async function getLessonCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return 0;
  return count || 0;
}
