import type { Problem } from "./problems";

export interface ExecutionResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  efficiencyScore: number;
  output: string;
}

// Simulated code execution - checks for common patterns
export function simulateExecution(code: string, problem: Problem): ExecutionResult {
  const startTime = performance.now();

  // Simple heuristic: check if code has meaningful content beyond the starter
  const hasImplementation = code.length > problem.starterCode.length + 20;
  const hasReturn = /return\s+[^;{}]+;/.test(code);
  const hasLoop = /for|while|if/.test(code);
  const hasDataStructure = /map|set|vector|stack|queue|unordered/.test(code);

  // Score based on code quality heuristics
  let correctness = 0;
  if (hasImplementation && hasReturn) correctness += 0.5;
  if (hasLoop) correctness += 0.25;
  if (hasDataStructure) correctness += 0.25;

  const passedTests = Math.round(correctness * problem.testCases.length);
  const passed = passedTests === problem.testCases.length;

  // Simulate execution time (faster code with hash maps = better)
  const baseTime = 4 + Math.random() * 12;
  const timeBonus = hasDataStructure ? 0.5 : 1.5;
  const executionTimeMs = Math.round(baseTime * timeBonus);

  // Efficiency score: 0-100
  const efficiencyScore = Math.min(100, Math.round(
    (passed ? 50 : passedTests * 15) +
    (hasDataStructure ? 30 : 10) +
    Math.max(0, 20 - executionTimeMs)
  ));

  const elapsed = performance.now() - startTime;

  const lines: string[] = [];
  problem.testCases.forEach((tc, i) => {
    const pass = i < passedTests;
    lines.push(`${pass ? "✅" : "❌"} Test Case ${i + 1}: ${pass ? "Passed" : "Failed"} ${tc.expected}`);
  });
  lines.push("");
  lines.push(passed ? "All test cases passed!" : `${passedTests}/${problem.testCases.length} test cases passed`);
  lines.push(`Execution Time: ${executionTimeMs}ms (simulated)`);
  lines.push(`Efficiency: ${efficiencyScore}/100`);

  return {
    passed,
    totalTests: problem.testCases.length,
    passedTests,
    executionTimeMs,
    efficiencyScore,
    output: lines.join("\n"),
  };
}

// Calculate score for leaderboard
export function calculateScore(result: ExecutionResult, solveTimeMs: number): number {
  if (!result.passed) return result.passedTests * 50;

  // Base score for solving
  let score = 500;

  // Time bonus: faster = more points (max 300 bonus)
  const timeBonusMax = 300;
  const maxTimeForBonus = 300000; // 5 minutes
  const timeBonus = Math.max(0, timeBonusMax * (1 - solveTimeMs / maxTimeForBonus));
  score += Math.round(timeBonus);

  // Efficiency bonus (max 200)
  score += result.efficiencyScore * 2;

  return Math.min(1000, score);
}
