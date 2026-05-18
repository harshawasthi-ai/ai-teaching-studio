import type { LessonKit } from "@/types/lesson";

let currentLesson: LessonKit | null = null;

export function setCurrentLesson(lesson: LessonKit | null) {
  currentLesson = lesson;
}

export function getCurrentLesson(): LessonKit | null {
  return currentLesson;
}
