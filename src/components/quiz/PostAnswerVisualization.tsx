import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Eye } from "lucide-react";
import type { AnyQuestion } from "@/lib/quizMode";

/**
 * Post-answer visualization shown after every question.
 * - DSA traversal questions → animated tree traversal
 * - Program questions → step-by-step execution trace (highlight line + variables)
 * - Other MCQs → animated reveal card highlighting the correct answer + explanation
 */
export default function PostAnswerVisualization({ question }: { question: AnyQuestion }) {
  if (question.kind === "program") {
    return <ProgramExecutionTrace q={question.data} />;
  }
  // MCQ
  const text = question.data.question.toLowerCase();
  if (
    text.includes("inorder") ||
    text.includes("preorder") ||
    text.includes("postorder") ||
    text.includes("traversal")
  ) {
    const order: TraversalOrder = text.includes("preorder")
      ? "pre"
      : text.includes("postorder")
      ? "post"
      : "in";
    return <TreeTraversal order={order} />;
  }
  return <ConceptReveal question={question.data.question} options={question.data.options} correctIndex={question.data.correctIndex} />;
}

/* ========== Tree Traversal Visualizer ========== */

type TraversalOrder = "in" | "pre" | "post";
interface TNode { id: number; val: number; x: number; y: number; left?: number; right?: number; }

const SAMPLE_TREE: TNode[] = [
  { id: 1, val: 5, x: 200, y: 40, left: 2, right: 3 },
  { id: 2, val: 3, x: 110, y: 110, left: 4, right: 5 },
  { id: 3, val: 8, x: 290, y: 110, left: 6, right: 7 },
  { id: 4, val: 1, x: 60, y: 180 },
  { id: 5, val: 4, x: 160, y: 180 },
  { id: 6, val: 7, x: 240, y: 180 },
  { id: 7, val: 9, x: 340, y: 180 },
];

function getNode(id?: number) {
  return SAMPLE_TREE.find((n) => n.id === id);
}

function buildTraversalSteps(order: TraversalOrder): number[] {
  const out: number[] = [];
  function rec(id?: number) {
    const node = getNode(id);
    if (!node) return;
    if (order === "pre") out.push(node.id);
    rec(node.left);
    if (order === "in") out.push(node.id);
    rec(node.right);
    if (order === "post") out.push(node.id);
  }
  rec(1);
  return out;
}

function TreeTraversal({ order }: { order: TraversalOrder }) {
  const steps = useMemo(() => buildTraversalSteps(order), [order]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setIdx((i) => (i < steps.length - 1 ? i + 1 : i));
    }, 700);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, steps.length]);

  const visited = steps.slice(0, idx + 1);
  const current = steps[idx];

  return (
    <div className="glass-panel p-4">
      <Header
        title={`${order === "in" ? "Inorder" : order === "pre" ? "Preorder" : "Postorder"} Traversal`}
        subtitle="Animated walk through the tree — current node highlighted, visited path glows."
      />
      <div className="flex flex-col lg:flex-row gap-4">
        <svg viewBox="0 0 400 240" className="w-full lg:w-2/3 h-56">
          {SAMPLE_TREE.map((n) => {
            const l = getNode(n.left); const r = getNode(n.right);
            return (
              <g key={`e-${n.id}`}>
                {l && <line x1={n.x} y1={n.y} x2={l.x} y2={l.y} stroke="hsl(var(--border))" strokeWidth={1.5} />}
                {r && <line x1={n.x} y1={n.y} x2={r.x} y2={r.y} stroke="hsl(var(--border))" strokeWidth={1.5} />}
              </g>
            );
          })}
          {SAMPLE_TREE.map((n) => {
            const isCur = n.id === current;
            const isVisited = visited.includes(n.id);
            return (
              <motion.g key={n.id} initial={{ scale: 1 }} animate={{ scale: isCur ? 1.15 : 1 }}>
                <circle
                  cx={n.x} cy={n.y} r={20}
                  fill={isCur ? "hsl(var(--primary))" : isVisited ? "hsl(var(--neon-cyan))" : "hsl(var(--muted))"}
                  fillOpacity={isCur ? 0.9 : isVisited ? 0.35 : 0.4}
                  stroke={isCur ? "hsl(var(--primary))" : isVisited ? "hsl(var(--neon-cyan))" : "hsl(var(--border))"}
                  strokeWidth={isCur ? 3 : 1.5}
                />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-foreground" fontSize="13" fontWeight="600">
                  {n.val}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">Visit order</div>
          <div className="flex flex-wrap gap-1.5">
            {steps.map((sid, i) => {
              const node = getNode(sid)!;
              const reached = i <= idx;
              return (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-md text-xs font-mono transition-all ${
                    i === idx
                      ? "bg-primary/25 text-primary neon-glow-blue"
                      : reached
                      ? "bg-neon-cyan/15 text-neon-cyan"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {node.val}
                </span>
              );
            })}
          </div>
          <Controls
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onStep={() => setIdx((i) => Math.min(i + 1, steps.length - 1))}
            onReset={() => { setIdx(0); setPlaying(true); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ========== Program Execution Trace ========== */

import type { ProgramQuestion } from "@/lib/programQuestions";

function ProgramExecutionTrace({ q }: { q: ProgramQuestion }) {
  // Build a simple synthetic trace: walk through code lines, highlight each.
  // Substitute blanks with their CORRECT answer for the trace.
  const fullCode = useMemo(() => {
    let s = q.code;
    for (const b of q.blanks) {
      s = s.split(`[BLANK_${b.id}]`).join(b.options[b.correctIndex]);
    }
    return s;
  }, [q]);

  const lines = useMemo(() => fullCode.split("\n"), [fullCode]);
  // Build pseudo-variable trace: simply enumerate non-empty code lines
  const execLines = useMemo(
    () => lines.map((l, i) => ({ idx: i, text: l })).filter((l) => l.text.trim().length > 0),
    [lines]
  );
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setStep((s) => (s < execLines.length - 1 ? s + 1 : s));
    }, 800);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, execLines.length]);

  const currentLineIdx = execLines[step]?.idx ?? -1;

  return (
    <div className="glass-panel p-4">
      <Header
        title="Execution Trace"
        subtitle="Watch the program run line by line with the correct fill-ins applied."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 glass-panel p-3 font-mono text-[12px] leading-6 overflow-x-auto">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`px-2 -mx-2 rounded ${
                i === currentLineIdx
                  ? "bg-primary/20 text-primary border-l-2 border-primary"
                  : "text-foreground/80"
              }`}
            >
              <span className="text-muted-foreground/50 select-none w-6 inline-block">{i + 1}</span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="glass-panel p-3 text-xs">
            <div className="text-muted-foreground mb-1">Step</div>
            <div className="font-mono text-foreground">
              {step + 1} / {execLines.length}
            </div>
          </div>
          {q.expectedOutput && (
            <div className="glass-panel p-3 text-xs">
              <div className="text-muted-foreground mb-1">Output</div>
              <div className="font-mono text-neon-cyan">{q.expectedOutput}</div>
            </div>
          )}
          {q.complexity && (
            <div className="glass-panel p-3 text-xs">
              <div className="text-muted-foreground mb-1">Complexity</div>
              <div className="font-mono text-neon-orange">{q.complexity}</div>
            </div>
          )}
          <Controls
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onStep={() => setStep((s) => Math.min(s + 1, execLines.length - 1))}
            onReset={() => { setStep(0); setPlaying(true); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ========== Concept reveal ========== */

function ConceptReveal({ question, options, correctIndex }: { question: string; options: string[]; correctIndex: number }) {
  return (
    <div className="glass-panel p-4">
      <Header title="Answer Reveal" subtitle="The correct option, highlighted." />
      <div className="text-sm text-foreground/90 mb-3">{question}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-3 rounded-lg border text-sm ${
              i === correctIndex
                ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                : "border-border bg-muted/20 text-muted-foreground"
            }`}
          >
            <span className="font-mono mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ========== Shared bits ========== */

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div>
        <div className="text-sm font-display font-bold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

function Controls({
  playing, onToggle, onStep, onReset,
}: {
  playing: boolean; onToggle: () => void; onStep: () => void; onReset: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <button onClick={onToggle} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 text-xs font-semibold">
        {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={onStep} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/40 text-foreground hover:bg-muted/60 text-xs">
        <SkipForward className="w-3 h-3" /> Step
      </button>
      <button onClick={onReset} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/40 text-foreground hover:bg-muted/60 text-xs">
        <RotateCcw className="w-3 h-3" /> Reset
      </button>
    </div>
  );
}
