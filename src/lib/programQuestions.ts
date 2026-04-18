// Program Fill-in-the-Blanks Questions
// Each question shows code with 1-3 BLANKs. Each blank has 4 MCQ options.
// Languages match topic (C++ for DSA, Python/Java/JS by topic).

export type Language = "cpp" | "python" | "java" | "javascript" | "bash";

export interface BlankOption {
  text: string;
}

export interface ProgramBlank {
  id: number;             // marker number used in the code as [BLANK_<id>]
  options: [string, string, string, string];
  correctIndex: number;
  hint?: string;
}

export interface ProgramQuestion {
  id: string;
  language: Language;
  title: string;
  description: string;
  code: string;           // contains markers like [BLANK_1], [BLANK_2]
  blanks: ProgramBlank[];
  inputExample?: string;
  expectedOutput?: string;
  complexity?: string;    // e.g. "O(n log n)"
  type: "program";
}

// ---------- DSA (C++) ----------
const dsaPrograms: ProgramQuestion[] = [
  {
    id: "dsa-bsearch",
    language: "cpp",
    title: "Binary Search",
    description: "Complete the iterative binary search on a sorted array.",
    code: `int binarySearch(vector<int>& a, int target) {
  int lo = 0, hi = a.size() - 1;
  while ([BLANK_1]) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    else if (a[mid] < target) [BLANK_2];
    else hi = mid - 1;
  }
  return -1;
}`,
    blanks: [
      { id: 1, options: ["lo < hi", "lo <= hi", "lo > hi", "lo != hi"], correctIndex: 1, hint: "Inclusive bounds" },
      { id: 2, options: ["lo = mid", "hi = mid", "lo = mid + 1", "hi = mid - 1"], correctIndex: 2, hint: "Search right half" },
    ],
    inputExample: "a = [1,3,5,7,9], target = 7",
    expectedOutput: "3",
    complexity: "O(log n)",
    type: "program",
  },
  {
    id: "dsa-bubble",
    language: "cpp",
    title: "Bubble Sort",
    description: "Complete bubble sort by filling in the inner loop bound and swap condition.",
    code: `void bubbleSort(vector<int>& a) {
  int n = a.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < [BLANK_1]; j++) {
      if ([BLANK_2]) {
        swap(a[j], a[j + 1]);
      }
    }
  }
}`,
    blanks: [
      { id: 1, options: ["n", "n - i", "n - i - 1", "n - 1"], correctIndex: 2, hint: "Largest i elements already sorted" },
      { id: 2, options: ["a[j] < a[j+1]", "a[j] > a[j+1]", "a[j] == a[j+1]", "a[j+1] > a[j]"], correctIndex: 1 },
    ],
    expectedOutput: "Sorted ascending",
    complexity: "O(n²)",
    type: "program",
  },
  {
    id: "dsa-fact",
    language: "cpp",
    title: "Recursive Factorial",
    description: "Complete the recursive factorial function.",
    code: `long long fact(int n) {
  if ([BLANK_1]) return 1;
  return [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["n == 1", "n <= 1", "n == 0", "n < 0"], correctIndex: 1, hint: "Base case for 0 and 1" },
      { id: 2, options: ["n * fact(n)", "n + fact(n - 1)", "n * fact(n - 1)", "fact(n - 1)"], correctIndex: 2 },
    ],
    inputExample: "n = 5",
    expectedOutput: "120",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "dsa-fib",
    language: "cpp",
    title: "Fibonacci (DP)",
    description: "Complete the bottom-up DP fibonacci.",
    code: `int fib(int n) {
  if (n < 2) return n;
  vector<int> dp(n + 1);
  dp[0] = 0; dp[1] = 1;
  for (int i = 2; i <= n; i++) {
    dp[i] = [BLANK_1];
  }
  return [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["dp[i-1]", "dp[i-1] + dp[i-2]", "dp[i] + dp[i-1]", "i + dp[i-1]"], correctIndex: 1 },
      { id: 2, options: ["dp[n-1]", "dp[n]", "dp[n+1]", "n"], correctIndex: 1 },
    ],
    inputExample: "n = 7",
    expectedOutput: "13",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "dsa-reverse-ll",
    language: "cpp",
    title: "Reverse Linked List",
    description: "Complete the iterative linked-list reversal.",
    code: `Node* reverse(Node* head) {
  Node *prev = nullptr, *curr = head;
  while (curr) {
    Node* nxt = curr->next;
    curr->next = [BLANK_1];
    prev = curr;
    curr = [BLANK_2];
  }
  return prev;
}`,
    blanks: [
      { id: 1, options: ["nxt", "prev", "curr", "head"], correctIndex: 1 },
      { id: 2, options: ["prev", "head", "nxt", "curr->next"], correctIndex: 2 },
    ],
    expectedOutput: "Reversed list",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "dsa-bfs",
    language: "cpp",
    title: "BFS Traversal",
    description: "Complete BFS on a graph using a queue.",
    code: `void bfs(int start, vector<vector<int>>& adj) {
  queue<int> q;
  vector<bool> visited(adj.size(), false);
  q.push(start);
  visited[start] = true;
  while ([BLANK_1]) {
    int u = q.front(); q.pop();
    cout << u << " ";
    for (int v : adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        [BLANK_2];
      }
    }
  }
}`,
    blanks: [
      { id: 1, options: ["q.size() > 1", "!q.empty()", "q.front() != -1", "visited.size() > 0"], correctIndex: 1 },
      { id: 2, options: ["q.pop()", "q.push(u)", "q.push(v)", "visited[u] = true"], correctIndex: 2 },
    ],
    complexity: "O(V + E)",
    type: "program",
  },
  {
    id: "dsa-inorder",
    language: "cpp",
    title: "Inorder Traversal",
    description: "Complete the recursive inorder traversal of a BST.",
    code: `void inorder(Node* root) {
  if (!root) return;
  [BLANK_1];
  cout << root->val << " ";
  [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["inorder(root)", "inorder(root->left)", "inorder(root->right)", "cout << root->val"], correctIndex: 1 },
      { id: 2, options: ["inorder(root->left)", "inorder(root->right)", "inorder(root)", "return"], correctIndex: 1 },
    ],
    expectedOutput: "Left-Root-Right (sorted for BST)",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "dsa-quick-partition",
    language: "cpp",
    title: "Quicksort Partition",
    description: "Complete the Lomuto partition scheme.",
    code: `int partition(vector<int>& a, int lo, int hi) {
  int pivot = a[hi];
  int i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if ([BLANK_1]) {
      i++;
      swap(a[i], a[j]);
    }
  }
  swap(a[i + 1], a[hi]);
  return [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["a[j] > pivot", "a[j] <= pivot", "a[j] == pivot", "j < pivot"], correctIndex: 1 },
      { id: 2, options: ["i", "i + 1", "hi", "lo"], correctIndex: 1 },
    ],
    complexity: "O(n) per call",
    type: "program",
  },
];

// ---------- Python ----------
const pythonPrograms: ProgramQuestion[] = [
  {
    id: "py-sum-list",
    language: "python",
    title: "Sum of a List",
    description: "Compute the sum of a list using a loop.",
    code: `def total(nums):
    s = 0
    for x in [BLANK_1]:
        s [BLANK_2] x
    return s`,
    blanks: [
      { id: 1, options: ["nums", "range(nums)", "len(nums)", "nums[0]"], correctIndex: 0 },
      { id: 2, options: ["==", "+=", "+", "="], correctIndex: 1 },
    ],
    inputExample: "[1, 2, 3, 4]",
    expectedOutput: "10",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "py-fib",
    language: "python",
    title: "Fibonacci with Memoization",
    description: "Complete the memoized recursive fibonacci.",
    code: `def fib(n, memo={}):
    if n < 2:
        return n
    if n in [BLANK_1]:
        return memo[n]
    memo[n] = [BLANK_2]
    return memo[n]`,
    blanks: [
      { id: 1, options: ["n", "memo", "fib", "range(n)"], correctIndex: 1 },
      { id: 2, options: ["fib(n-1) + fib(n-2)", "fib(n) + fib(n-1)", "n", "memo[n-1]"], correctIndex: 0 },
    ],
    inputExample: "n = 10",
    expectedOutput: "55",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "py-reverse",
    language: "python",
    title: "Reverse a String",
    description: "Reverse a string using slicing.",
    code: `def reverse(s):
    return s[[BLANK_1]]`,
    blanks: [
      { id: 1, options: [":", "::-1", "::1", "-1:"], correctIndex: 1 },
    ],
    inputExample: '"hello"',
    expectedOutput: '"olleh"',
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "py-list-comp",
    language: "python",
    title: "List Comprehension",
    description: "Build a list of squares of even numbers from 0..n-1.",
    code: `def even_squares(n):
    return [[BLANK_1] for x in range(n) if [BLANK_2]]`,
    blanks: [
      { id: 1, options: ["x", "x*x", "x+x", "n*x"], correctIndex: 1 },
      { id: 2, options: ["x % 2 == 0", "x % 2 == 1", "x > 0", "x < n"], correctIndex: 0 },
    ],
    inputExample: "n = 5",
    expectedOutput: "[0, 4, 16]",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "py-dict-count",
    language: "python",
    title: "Count Word Frequency",
    description: "Count occurrences of each word in a list.",
    code: `def count(words):
    freq = {}
    for w in words:
        freq[w] = [BLANK_1] + 1
    return freq`,
    blanks: [
      { id: 1, options: ["freq[w]", "freq.get(w, 0)", "0", "len(freq)"], correctIndex: 1, hint: "Default to 0 if missing" },
    ],
    inputExample: '["a", "b", "a"]',
    expectedOutput: '{"a": 2, "b": 1}',
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "py-bsearch",
    language: "python",
    title: "Binary Search",
    description: "Iterative binary search.",
    code: `def bsearch(a, target):
    lo, hi = 0, len(a) - 1
    while [BLANK_1]:
        mid = (lo + hi) // 2
        if a[mid] == target: return mid
        elif a[mid] < target: lo = [BLANK_2]
        else: hi = mid - 1
    return -1`,
    blanks: [
      { id: 1, options: ["lo < hi", "lo <= hi", "lo > hi", "True"], correctIndex: 1 },
      { id: 2, options: ["mid", "mid + 1", "mid - 1", "lo + 1"], correctIndex: 1 },
    ],
    expectedOutput: "Index or -1",
    complexity: "O(log n)",
    type: "program",
  },
];

// ---------- Java ----------
const javaPrograms: ProgramQuestion[] = [
  {
    id: "java-max",
    language: "java",
    title: "Find Maximum",
    description: "Find the maximum value in an int array.",
    code: `static int max(int[] a) {
    int m = [BLANK_1];
    for (int i = 1; i < a.length; i++) {
        if (a[i] > m) [BLANK_2];
    }
    return m;
}`,
    blanks: [
      { id: 1, options: ["0", "a[0]", "Integer.MIN_VALUE", "a.length"], correctIndex: 1 },
      { id: 2, options: ["m++", "m = a[i]", "a[i] = m", "break"], correctIndex: 1 },
    ],
    inputExample: "[3, 7, 2, 9, 4]",
    expectedOutput: "9",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "java-reverse",
    language: "java",
    title: "Reverse Array In-Place",
    description: "Reverse an int array in place.",
    code: `static void reverse(int[] a) {
    int i = 0, j = [BLANK_1];
    while (i < j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
        i++; [BLANK_2];
    }
}`,
    blanks: [
      { id: 1, options: ["a.length", "a.length - 1", "a.length + 1", "0"], correctIndex: 1 },
      { id: 2, options: ["j++", "j--", "j = 0", "i--"], correctIndex: 1 },
    ],
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "java-fact",
    language: "java",
    title: "Iterative Factorial",
    description: "Compute factorial using a loop.",
    code: `static long fact(int n) {
    long r = 1;
    for (int i = 2; i <= n; i++) {
        r [BLANK_1] i;
    }
    return [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["+=", "*=", "-=", "/="], correctIndex: 1 },
      { id: 2, options: ["n", "i", "r", "1"], correctIndex: 2 },
    ],
    inputExample: "n = 5",
    expectedOutput: "120",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "java-hashmap",
    language: "java",
    title: "Two Sum with HashMap",
    description: "Return indices of two numbers that add to target.",
    code: `static int[] twoSum(int[] a, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < a.length; i++) {
        int need = [BLANK_1];
        if (map.containsKey(need))
            return new int[]{map.get(need), i};
        map.put([BLANK_2], i);
    }
    return new int[]{};
}`,
    blanks: [
      { id: 1, options: ["a[i]", "target - a[i]", "target + a[i]", "i - target"], correctIndex: 1 },
      { id: 2, options: ["i", "a[i]", "target", "need"], correctIndex: 1 },
    ],
    inputExample: "a=[2,7,11,15], target=9",
    expectedOutput: "[0, 1]",
    complexity: "O(n)",
    type: "program",
  },
];

// ---------- JavaScript ----------
const jsPrograms: ProgramQuestion[] = [
  {
    id: "js-sum",
    language: "javascript",
    title: "Sum with reduce",
    description: "Sum an array using Array.prototype.reduce.",
    code: `function total(nums) {
  return nums.reduce((acc, x) => [BLANK_1], [BLANK_2]);
}`,
    blanks: [
      { id: 1, options: ["acc", "x", "acc + x", "acc * x"], correctIndex: 2 },
      { id: 2, options: ["0", "1", "nums[0]", "[]"], correctIndex: 0 },
    ],
    inputExample: "[1, 2, 3]",
    expectedOutput: "6",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "js-map-double",
    language: "javascript",
    title: "Map: Double Each Element",
    description: "Return a new array with each value doubled.",
    code: `function double(nums) {
  return nums.map([BLANK_1]);
}`,
    blanks: [
      { id: 1, options: ["x => x", "x => x + 2", "x => x * 2", "(x, i) => i"], correctIndex: 2 },
    ],
    inputExample: "[1, 2, 3]",
    expectedOutput: "[2, 4, 6]",
    complexity: "O(n)",
    type: "program",
  },
  {
    id: "js-debounce",
    language: "javascript",
    title: "Debounce",
    description: "Implement a simple debounce wrapper.",
    code: `function debounce(fn, delay) {
  let t;
  return function(...args) {
    [BLANK_1];
    t = setTimeout(() => [BLANK_2], delay);
  };
}`,
    blanks: [
      { id: 1, options: ["clearInterval(t)", "clearTimeout(t)", "t = 0", "fn()"], correctIndex: 1 },
      { id: 2, options: ["fn(args)", "fn.apply(this, args)", "fn", "delay()"], correctIndex: 1 },
    ],
    complexity: "O(1) per call",
    type: "program",
  },
  {
    id: "js-promise",
    language: "javascript",
    title: "Async / Await Fetch",
    description: "Fetch JSON and return parsed data.",
    code: `async function getData(url) {
  const res = [BLANK_1] fetch(url);
  const json = [BLANK_2] res.json();
  return json;
}`,
    blanks: [
      { id: 1, options: ["async", "await", "yield", "return"], correctIndex: 1 },
      { id: 2, options: ["async", "await", "yield", "return"], correctIndex: 1 },
    ],
    expectedOutput: "Parsed JSON object",
    type: "program",
  },
];

// ---------- Linux (bash) ----------
const linuxPrograms: ProgramQuestion[] = [
  {
    id: "linux-count-files",
    language: "bash",
    title: "Count Files in Directory",
    description: "Count regular files in the current directory.",
    code: `#!/bin/bash
count=$(ls [BLANK_1] | wc [BLANK_2])
echo "Files: $count"`,
    blanks: [
      { id: 1, options: ["-l", "-a", "-h", "-R"], correctIndex: 0 },
      { id: 2, options: ["-c", "-w", "-l", "-m"], correctIndex: 2, hint: "Count lines" },
    ],
    expectedOutput: "Files: <number>",
    type: "program",
  },
  {
    id: "linux-grep",
    language: "bash",
    title: "Grep Lines and Save",
    description: "Find lines containing ERROR and save to a file.",
    code: `[BLANK_1] "ERROR" app.log [BLANK_2] errors.txt`,
    blanks: [
      { id: 1, options: ["find", "grep", "awk", "sed"], correctIndex: 1 },
      { id: 2, options: ["|", ">", "<", "&"], correctIndex: 1, hint: "Redirect output" },
    ],
    type: "program",
  },
  {
    id: "linux-perm",
    language: "bash",
    title: "Make Script Executable",
    description: "Give the owner execute permission on a script.",
    code: `[BLANK_1] [BLANK_2] script.sh`,
    blanks: [
      { id: 1, options: ["chown", "chmod", "chgrp", "ls"], correctIndex: 1 },
      { id: 2, options: ["+r", "u+x", "777", "-x"], correctIndex: 1 },
    ],
    type: "program",
  },
];

// ---------- OS (C++ pseudo) ----------
const osPrograms: ProgramQuestion[] = [
  {
    id: "os-mutex",
    language: "cpp",
    title: "Critical Section with Mutex",
    description: "Protect a shared counter with a mutex.",
    code: `mutex m;
int counter = 0;
void increment() {
  [BLANK_1];
  counter++;
  [BLANK_2];
}`,
    blanks: [
      { id: 1, options: ["m.unlock()", "m.lock()", "m.try_lock()", "m.notify()"], correctIndex: 1 },
      { id: 2, options: ["m.lock()", "m.unlock()", "m.wait()", "m.signal()"], correctIndex: 1 },
    ],
    type: "program",
  },
  {
    id: "os-sem",
    language: "cpp",
    title: "Producer using Semaphore",
    description: "A producer signals after producing an item.",
    code: `semaphore items(0);
void producer() {
  produce_item();
  [BLANK_1];
}`,
    blanks: [
      { id: 1, options: ["items.wait()", "items.signal()", "items.lock()", "items.reset()"], correctIndex: 1 },
    ],
    type: "program",
  },
];

// ---------- VM / Kubernetes (bash + yaml-ish) ----------
const vmPrograms: ProgramQuestion[] = [
  {
    id: "vm-docker-run",
    language: "bash",
    title: "Run Detached Container",
    description: "Run nginx in the background and map port 80 to 8080.",
    code: `docker run [BLANK_1] -p 8080:[BLANK_2] nginx`,
    blanks: [
      { id: 1, options: ["-it", "-d", "--rm", "-v"], correctIndex: 1 },
      { id: 2, options: ["80", "8080", "443", "3000"], correctIndex: 0 },
    ],
    type: "program",
  },
];

const k8sPrograms: ProgramQuestion[] = [
  {
    id: "k8s-scale",
    language: "bash",
    title: "Scale a Deployment",
    description: "Scale the 'web' deployment to 5 replicas.",
    code: `kubectl [BLANK_1] deployment/web --replicas=[BLANK_2]`,
    blanks: [
      { id: 1, options: ["get", "scale", "describe", "delete"], correctIndex: 1 },
      { id: 2, options: ["1", "3", "5", "10"], correctIndex: 2 },
    ],
    type: "program",
  },
  {
    id: "k8s-pod-logs",
    language: "bash",
    title: "Stream Pod Logs",
    description: "Follow logs of a pod named 'api'.",
    code: `kubectl [BLANK_1] -f [BLANK_2]`,
    blanks: [
      { id: 1, options: ["get", "logs", "exec", "describe"], correctIndex: 1 },
      { id: 2, options: ["api", "pod/api", "deploy/api", "svc/api"], correctIndex: 0 },
    ],
    type: "program",
  },
];

export const PROGRAMS_BY_TOPIC: Record<string, ProgramQuestion[]> = {
  dsa: dsaPrograms,
  python: pythonPrograms,
  java: javaPrograms,
  javascript: jsPrograms,
  linux: linuxPrograms,
  os: osPrograms,
  vm: vmPrograms,
  k8s: k8sPrograms,
};

export function getProgramsForTopic(topicId: string): ProgramQuestion[] {
  return PROGRAMS_BY_TOPIC[topicId] || dsaPrograms;
}
