// Combines MCQ and Program questions into a unified per-room question list
// based on the room's quiz_mode.
import { getTopicByIdOrDefault, type MCQQuestion } from "./mcqQuestions";
import { getProgramsForTopic, type ProgramQuestion } from "./programQuestions";

export type QuizMode = "mcq" | "program" | "mixed";

export type AnyQuestion =
  | { kind: "mcq"; data: MCQQuestion }
  | { kind: "program"; data: ProgramQuestion };

export function buildQuestionList(topicId: string, mode: QuizMode): AnyQuestion[] {
  const mcqs = getTopicByIdOrDefault(topicId).questions.map((q) => ({
    kind: "mcq" as const,
    data: q,
  }));
  const programs = getProgramsForTopic(topicId).map((p) => ({
    kind: "program" as const,
    data: p,
  }));

  if (mode === "mcq") return mcqs;
  if (mode === "program") return programs.length ? programs : mcqs;

  // mixed: interleave MCQ, Program, MCQ, Program ...
  const out: AnyQuestion[] = [];
  const maxLen = Math.max(mcqs.length, programs.length);
  for (let i = 0; i < maxLen; i++) {
    if (mcqs[i]) out.push(mcqs[i]);
    if (programs[i]) out.push(programs[i]);
  }
  return out;
}

// Returns true if all blanks of a program question are answered correctly
export function gradeProgramAnswer(
  q: ProgramQuestion,
  selections: Record<number, number>
): { isCorrect: boolean; correctCount: number; total: number } {
  let correct = 0;
  for (const b of q.blanks) {
    if (selections[b.id] === b.correctIndex) correct++;
  }
  return { isCorrect: correct === q.blanks.length, correctCount: correct, total: q.blanks.length };
}
