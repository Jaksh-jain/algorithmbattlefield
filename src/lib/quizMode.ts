// Combines MCQ and Program questions into a unified per-room question list
// based on the room's quiz_mode.
import { getTopicByIdOrDefault, type MCQQuestion } from "./mcqQuestions";
import { getProgramsForTopic, type ProgramQuestion } from "./programQuestions";

export type QuizMode = "mcq" | "program" | "mixed";

export type AnyQuestion =
  | { kind: "mcq"; data: MCQQuestion }
  | { kind: "program"; data: ProgramQuestion };

function seededHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let state = seededHash(seed) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const rand = (state >>> 0) / 4294967296;
    const j = Math.floor(rand * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type RNG = () => number;

function createRng(seed: string): RNG {
  let state = seededHash(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: readonly T[], rng: RNG): T {
  return arr[Math.floor(rng() * arr.length)];
}

function makeUniqueOptions(correct: string, distractors: string[], rng: RNG): [string, string, string, string] {
  const uniq = Array.from(new Set([correct, ...distractors])).slice(0, 4);
  while (uniq.length < 4) uniq.push(`${correct} (approx ${uniq.length})`);
  const shuffled = seededShuffle(uniq, `${correct}:${rng()}`);
  return [shuffled[0], shuffled[1], shuffled[2], shuffled[3]];
}

function generateDynamicMcqs(topicId: string, count: number, seed: string): MCQQuestion[] {
  const rng = createRng(`${seed}:${topicId}:dynamic`);
  const generated: MCQQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const qType = Math.floor(rng() * 4);

    if (qType === 0) {
      const n = 8 + Math.floor(rng() * 80);
      const correct = "O(log n)";
      const options = makeUniqueOptions(correct, ["O(n)", "O(1)", "O(n log n)"], rng);
      generated.push({
        question: `You repeatedly halve a search space of size n=${n}. What is the time complexity?`,
        options,
        correctIndex: options.indexOf(correct),
        type: "complexity",
      });
      continue;
    }

    if (qType === 1) {
      const m = 2 + Math.floor(rng() * 7);
      const k = 2 + Math.floor(rng() * 8);
      const correct = String(m * k);
      const options = makeUniqueOptions(correct, [String(m + k), String(m * k + k), String(m * k - 1)], rng);
      generated.push({
        question: `Nested loops run m=${m} times and inner loop k=${k} times. Total iterations?`,
        options,
        correctIndex: options.indexOf(correct),
        type: "output",
      });
      continue;
    }

    if (qType === 2) {
      const structures =
        topicId === "linux"
          ? ["journaled filesystem", "inode cache", "process table", "run queue"]
          : topicId === "k8s"
          ? ["Deployment", "DaemonSet", "StatefulSet", "Job"]
          : ["stack", "queue", "hash table", "heap"];
      const promptSet =
        topicId === "k8s"
          ? "one Pod per node"
          : topicId === "linux"
          ? "file metadata lookup"
          : "LIFO access";
      const correct =
        topicId === "k8s" ? "DaemonSet" : topicId === "linux" ? "inode cache" : "stack";
      const options = makeUniqueOptions(correct, structures.filter((s) => s !== correct), rng);
      generated.push({
        question: `Which option best matches "${promptSet}"?`,
        options,
        correctIndex: options.indexOf(correct),
        type: "concept",
      });
      continue;
    }

    const n = 40 + Math.floor(rng() * 160);
    const target = 1 + Math.floor(rng() * n);
    const sortedPos = 1 + Math.floor(rng() * n);
    const correct = "Use binary search";
    const wrong = ["Use linear scan only", "Use bubble sort first", "Use DFS traversal"];
    const options = makeUniqueOptions(correct, wrong, rng);
    generated.push({
      question: `In a sorted array of size ${n}, you need to locate ${target}. Which approach is best? (Element is at position ${sortedPos})`,
      options,
      correctIndex: options.indexOf(correct),
      type: "scenario",
    });
  }

  return generated;
}

export function buildQuestionList(
  topicId: string,
  mode: QuizMode,
  opts?: { seed?: string; count?: number }
): AnyQuestion[] {
  const baseMcqs = getTopicByIdOrDefault(topicId).questions;
  const dynamicMcqs = generateDynamicMcqs(topicId, Math.max(12, opts?.count ?? 10), opts?.seed ?? topicId);
  const mcqs = [...baseMcqs, ...dynamicMcqs].map((q) => ({
    kind: "mcq" as const,
    data: q,
  }));
  const programs = getProgramsForTopic(topicId).map((p) => ({
    kind: "program" as const,
    data: p,
  }));

  const seed = opts?.seed ?? `${topicId}:${mode}`;
  const targetCount = Math.max(1, opts?.count ?? 10);

  if (mode === "mcq") {
    return seededShuffle(mcqs, `${seed}:mcq`).slice(0, Math.min(targetCount, mcqs.length));
  }
  if (mode === "program") {
    const source = programs.length ? programs : mcqs;
    return seededShuffle(source, `${seed}:program`).slice(0, Math.min(targetCount, source.length));
  }

  // mixed: interleave MCQ, Program, MCQ, Program ...
  const out: AnyQuestion[] = [];
  const maxLen = Math.max(mcqs.length, programs.length);
  for (let i = 0; i < maxLen; i++) {
    if (mcqs[i]) out.push(mcqs[i]);
    if (programs[i]) out.push(programs[i]);
  }
  const mixed = seededShuffle(out, `${seed}:mixed`);
  return mixed.slice(0, Math.min(targetCount, mixed.length));
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
