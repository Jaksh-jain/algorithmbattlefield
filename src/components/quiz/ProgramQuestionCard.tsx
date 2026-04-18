import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, X, Code2 } from "lucide-react";
import type { ProgramQuestion } from "@/lib/programQuestions";

interface Props {
  question: ProgramQuestion;
  selections: Record<number, number>;     // blankId -> selectedOptionIdx
  onSelect: (blankId: number, optionIdx: number) => void;
  locked: boolean;                         // submitted or time up
  showResult: boolean;
}

// Renders code with [BLANK_X] markers replaced by interactive chips.
// Below the code, render an MCQ block for each blank.
export default function ProgramQuestionCard({
  question, selections, onSelect, locked, showResult,
}: Props) {
  // Split code into segments: text and blank markers.
  const segments = useMemo(() => {
    const re = /\[BLANK_(\d+)\]/g;
    const parts: Array<{ type: "text"; value: string } | { type: "blank"; id: number }> = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(question.code)) !== null) {
      if (m.index > last) parts.push({ type: "text", value: question.code.slice(last, m.index) });
      parts.push({ type: "blank", id: parseInt(m[1], 10) });
      last = m.index + m[0].length;
    }
    if (last < question.code.length) parts.push({ type: "text", value: question.code.slice(last) });
    return parts;
  }, [question.code]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-4 h-4 text-secondary" />
          <h3 className="text-lg font-display font-bold text-foreground">{question.title}</h3>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-mono">
            {question.language}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{question.description}</p>
      </div>

      {/* Code block with inline blank chips */}
      <div className="glass-panel p-4 font-mono text-[13px] leading-6 text-foreground/90 overflow-x-auto whitespace-pre">
        {segments.map((seg, i) => {
          if (seg.type === "text") return <span key={i}>{seg.value}</span>;
          const blank = question.blanks.find((b) => b.id === seg.id);
          const sel = selections[seg.id];
          const filled = blank && sel !== undefined ? blank.options[sel] : `_____`;
          const isCorrect = showResult && blank && sel === blank.correctIndex;
          const isWrong = showResult && blank && sel !== undefined && sel !== blank.correctIndex;
          return (
            <span
              key={i}
              className={`inline-block px-2 mx-0.5 rounded-md border text-xs align-middle ${
                isCorrect
                  ? "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan"
                  : isWrong
                  ? "bg-destructive/15 border-destructive/40 text-destructive"
                  : sel !== undefined
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-muted/30 border-border text-muted-foreground"
              }`}
            >
              {filled}
            </span>
          );
        })}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {question.inputExample && (
          <div className="glass-panel p-2.5">
            <span className="text-muted-foreground block mb-0.5">Input</span>
            <span className="font-mono text-foreground/90">{question.inputExample}</span>
          </div>
        )}
        {question.expectedOutput && (
          <div className="glass-panel p-2.5">
            <span className="text-muted-foreground block mb-0.5">Expected</span>
            <span className="font-mono text-foreground/90">{question.expectedOutput}</span>
          </div>
        )}
        {question.complexity && (
          <div className="glass-panel p-2.5">
            <span className="text-muted-foreground block mb-0.5">Time complexity</span>
            <span className="font-mono text-neon-orange">{question.complexity}</span>
          </div>
        )}
      </div>

      {/* Per-blank MCQs */}
      <div className="grid grid-cols-1 gap-3">
        {question.blanks.map((b) => {
          const sel = selections[b.id];
          return (
            <div key={b.id} className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-secondary">Blank #{b.id}</span>
                {b.hint && !showResult && (
                  <span className="text-[11px] text-muted-foreground italic">💡 {b.hint}</span>
                )}
                {showResult && (
                  <span
                    className={`text-[11px] font-semibold ${
                      sel === b.correctIndex ? "text-neon-cyan" : "text-destructive"
                    }`}
                  >
                    {sel === b.correctIndex ? "✓ Correct" : `✗ Answer: ${b.options[b.correctIndex]}`}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {b.options.map((opt, i) => {
                  const isSelected = sel === i;
                  const isAnswer = b.correctIndex === i;
                  let cls =
                    "px-3 py-2 rounded-lg text-xs font-mono text-left transition-all border";
                  if (showResult) {
                    if (isAnswer) cls += " bg-neon-cyan/15 border-neon-cyan/50 text-neon-cyan";
                    else if (isSelected) cls += " bg-destructive/10 border-destructive/40 text-destructive";
                    else cls += " bg-muted/20 border-border text-muted-foreground opacity-60";
                  } else if (isSelected) {
                    cls += " bg-primary/15 border-primary/50 text-primary neon-glow-blue";
                  } else {
                    cls += " bg-muted/20 border-border text-foreground/80 hover:border-primary/40";
                  }
                  return (
                    <motion.button
                      key={i}
                      whileHover={!locked ? { scale: 1.02 } : {}}
                      whileTap={!locked ? { scale: 0.98 } : {}}
                      disabled={locked}
                      onClick={() => onSelect(b.id, i)}
                      className={cls}
                    >
                      <span className="opacity-50 mr-1">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                      {showResult && isAnswer && <Check className="w-3 h-3 inline ml-1" />}
                      {showResult && isSelected && !isAnswer && <X className="w-3 h-3 inline ml-1" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
