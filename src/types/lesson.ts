export interface LessonMetadata {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  language: string;
  objectives: string;
  generated_at: string;
}

export interface LessonKit {
  metadata: LessonMetadata;
  lesson_plan: {
    warm_up: { duration: string; activity: string; purpose: string };
    concept_introduction: { duration: string; content: string; key_terms: string[] };
    guided_activity: { duration: string; description: string; materials: string[] };
    recap: { duration: string; questions: string[] };
    homework: { description: string };
  };
  worksheet: {
    instructions: string;
    sections: Array<{
      section_title: string;
      questions: Array<{
        q_number: number;
        question: string;
        difficulty: string;
        marks: number;
      }>;
    }>;
    total_marks: number;
  };
  quiz: {
    instructions: string;
    mcq: Array<{
      q_number: number;
      question: string;
      options: { A: string; B: string; C: string; D: string };
      correct_option: string;
      marks: number;
    }>;
    short_answer: Array<{
      q_number: number;
      question: string;
      marks: number;
    }>;
  };
  answer_key: {
    worksheet_answers: Array<{ q_number: number; answer: string; explanation: string }>;
    quiz_answers: Array<{ q_number: number; answer: string; explanation: string }>;
    grading_rubric: {
      total_marks: number;
      grade_bands: Array<{ range: string; grade: string; descriptor: string }>;
    };
  };
}
