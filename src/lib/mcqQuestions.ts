export interface MCQQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  type: "concept" | "output" | "complexity" | "scenario";
}

export interface TopicConfig {
  id: string;
  label: string;
  icon: string;
  questions: MCQQuestion[];
}

const osQuestions: MCQQuestion[] = [
  { question: "Which scheduling algorithm gives the minimum average waiting time?", options: ["FCFS", "SJF", "Round Robin", "Priority"], correctIndex: 1, type: "concept" },
  { question: "What is thrashing in an OS?", options: ["CPU overheating", "Excessive paging activity", "Deadlock state", "Buffer overflow"], correctIndex: 1, type: "concept" },
  { question: "Which of these is NOT a process state?", options: ["Ready", "Running", "Blocked", "Compiled"], correctIndex: 3, type: "concept" },
  { question: "What does a semaphore with value 0 indicate?", options: ["Resource available", "No process waiting", "Resource in use, no waiting", "Error state"], correctIndex: 2, type: "scenario" },
  { question: "Banker's algorithm is used for?", options: ["CPU scheduling", "Deadlock avoidance", "Memory allocation", "Disk scheduling"], correctIndex: 1, type: "concept" },
  { question: "In a system with 5 processes and 3 resources, max simultaneous deadlock-free processes?", options: ["3", "4", "5", "Depends on allocation"], correctIndex: 3, type: "scenario" },
  { question: "Which page replacement has Belady's anomaly?", options: ["LRU", "Optimal", "FIFO", "LFU"], correctIndex: 2, type: "concept" },
  { question: "What is the purpose of TLB?", options: ["Disk caching", "Address translation speedup", "Process scheduling", "Interrupt handling"], correctIndex: 1, type: "concept" },
  { question: "Which is true about user-level threads?", options: ["Kernel schedules them", "Blocking one blocks all", "They're slower than kernel threads", "They need system calls"], correctIndex: 1, type: "concept" },
  { question: "Internal fragmentation occurs in?", options: ["Paging", "Segmentation", "Both", "Neither"], correctIndex: 0, type: "concept" },
  { question: "A process in zombie state has?", options: ["Finished but parent hasn't called wait()", "Been killed by signal", "Run out of memory", "Exceeded time limit"], correctIndex: 0, type: "concept" },
  { question: "What is convoy effect?", options: ["Multiple CPUs competing", "Short processes waiting behind long one in FCFS", "Cache thrashing", "Priority inversion"], correctIndex: 1, type: "scenario" },
  { question: "Which condition is NOT required for deadlock?", options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], correctIndex: 2, type: "concept" },
  { question: "Working set model helps with?", options: ["CPU scheduling", "Thrashing prevention", "Deadlock detection", "File management"], correctIndex: 1, type: "concept" },
  { question: "Context switch overhead includes?", options: ["Saving/restoring registers", "Flushing TLB", "Both A and B", "Neither"], correctIndex: 2, type: "concept" },
  { question: "In producer-consumer, buffer size is 5. Producer produced 7, consumer consumed 3. Buffer has?", options: ["4", "5", "2", "Cannot determine without sync"], correctIndex: 3, type: "scenario" },
  { question: "Which disk scheduling minimizes seek time?", options: ["FCFS", "SSTF", "SCAN", "C-LOOK"], correctIndex: 1, type: "concept" },
  { question: "Virtual memory size is limited by?", options: ["Physical RAM", "Address bus width", "Disk size", "Page table size"], correctIndex: 1, type: "concept" },
  { question: "Starvation can occur in?", options: ["FCFS", "SJF", "Round Robin", "All of these"], correctIndex: 1, type: "concept" },
  { question: "Which system call creates a new process in Unix?", options: ["exec()", "fork()", "spawn()", "create()"], correctIndex: 1, type: "concept" },
];

const vmQuestions: MCQQuestion[] = [
  { question: "Type 1 hypervisor runs on?", options: ["Host OS", "Bare metal", "Container engine", "Cloud only"], correctIndex: 1, type: "concept" },
  { question: "Which is a Type 2 hypervisor?", options: ["VMware ESXi", "Xen", "VirtualBox", "Hyper-V bare metal"], correctIndex: 2, type: "concept" },
  { question: "What does VM snapshot capture?", options: ["Only disk", "Only memory", "Disk + memory + config state", "Network state only"], correctIndex: 2, type: "concept" },
  { question: "Paravirtualization requires?", options: ["Hardware support only", "Modified guest OS", "No changes", "Special CPU"], correctIndex: 1, type: "concept" },
  { question: "VT-x and AMD-V provide?", options: ["GPU virtualization", "Hardware-assisted CPU virtualization", "Network virtualization", "Storage virtualization"], correctIndex: 1, type: "concept" },
  { question: "What is VM sprawl?", options: ["VMs using too much RAM", "Uncontrolled proliferation of VMs", "VM network congestion", "Hypervisor crash"], correctIndex: 1, type: "concept" },
  { question: "Live migration moves a VM?", options: ["Between disks", "Between hosts without downtime", "To cloud only", "Requires shutdown"], correctIndex: 1, type: "concept" },
  { question: "Which provides OS-level virtualization?", options: ["VMware", "Docker", "VirtualBox", "QEMU"], correctIndex: 1, type: "concept" },
  { question: "VM escape attack targets?", options: ["Guest OS", "Hypervisor to reach host", "Network stack", "Storage layer"], correctIndex: 1, type: "scenario" },
  { question: "Thin provisioning means?", options: ["Less CPU allocated", "Storage allocated on demand", "Fewer network ports", "Reduced memory"], correctIndex: 1, type: "concept" },
  { question: "What is a golden image?", options: ["Encrypted VM", "Template VM for cloning", "Backup VM", "Production VM"], correctIndex: 1, type: "concept" },
  { question: "Nested virtualization is?", options: ["Running VM inside VM", "Two hypervisors on one host", "VM with multiple NICs", "Clustered VMs"], correctIndex: 0, type: "concept" },
  { question: "SR-IOV helps with?", options: ["CPU performance", "Direct I/O device access for VMs", "Memory dedup", "Storage speed"], correctIndex: 1, type: "concept" },
  { question: "Memory ballooning in VMs?", options: ["Adds physical RAM", "Reclaims unused guest memory", "Compresses memory", "Encrypts memory"], correctIndex: 1, type: "concept" },
  { question: "Which is NOT a VM benefit?", options: ["Hardware independence", "Easy backup", "Zero overhead", "Resource isolation"], correctIndex: 2, type: "concept" },
  { question: "A VM with 4 vCPUs on 2-core host will?", options: ["Fail to start", "Time-share CPU cores", "Use only 2 vCPUs", "Crash the host"], correctIndex: 1, type: "scenario" },
  { question: "What format does VMware use for VM disks?", options: [".vhd", ".vmdk", ".qcow2", ".img"], correctIndex: 1, type: "concept" },
  { question: "Containers differ from VMs because they?", options: ["Are more secure", "Share host kernel", "Need hypervisor", "Use more resources"], correctIndex: 1, type: "concept" },
  { question: "What does OVF stand for?", options: ["Open Virtual Format", "Online Virtual Framework", "Optimized VM File", "Open Virtualization Format"], correctIndex: 3, type: "concept" },
  { question: "Which hypervisor uses dom0?", options: ["VMware ESXi", "Xen", "Hyper-V", "KVM"], correctIndex: 1, type: "concept" },
];

const linuxQuestions: MCQQuestion[] = [
  { question: "What does `chmod 755 file` mean?", options: ["Owner: rwx, Group: r-x, Others: r-x", "Owner: rwx, Group: rwx, Others: r--", "Everyone: rwx", "Owner: rw-, Group: r-x, Others: r-x"], correctIndex: 0, type: "concept" },
  { question: "`grep -r 'error' /var/log` does what?", options: ["Deletes error logs", "Recursively searches for 'error'", "Renames log files", "Counts errors"], correctIndex: 1, type: "concept" },
  { question: "What does the `|` operator do?", options: ["Redirects to file", "Pipes output to next command", "Runs in background", "Logical OR"], correctIndex: 1, type: "concept" },
  { question: "`ls -la` output: `drwxr-x---`. What is this?", options: ["File with restricted access", "Directory: owner rwx, group rx, others none", "Symlink", "Device file"], correctIndex: 1, type: "output" },
  { question: "Which command finds files larger than 100MB?", options: ["find / -size +100M", "ls -size 100M", "grep -s 100M", "du --min 100M"], correctIndex: 0, type: "concept" },
  { question: "What is inode?", options: ["A network node", "Data structure storing file metadata", "A kernel module", "Mount point"], correctIndex: 1, type: "concept" },
  { question: "`kill -9 PID` sends which signal?", options: ["SIGTERM", "SIGKILL", "SIGHUP", "SIGINT"], correctIndex: 1, type: "concept" },
  { question: "What does `2>&1` do in bash?", options: ["Redirects stdin", "Redirects stderr to stdout", "Creates file descriptor 2", "Duplicates process"], correctIndex: 1, type: "concept" },
  { question: "Which filesystem is default in modern Ubuntu?", options: ["NTFS", "ext4", "XFS", "Btrfs"], correctIndex: 1, type: "concept" },
  { question: "`awk '{print $3}' file.txt` prints?", options: ["Line 3", "Third column", "Third character", "Third word of first line"], correctIndex: 1, type: "output" },
  { question: "What is /proc filesystem?", options: ["Process binary storage", "Virtual filesystem for kernel/process info", "Swap partition", "User home directory"], correctIndex: 1, type: "concept" },
  { question: "`crontab` entry `0 */2 * * *` runs?", options: ["Every 2 minutes", "Every 2 hours", "Every 2 days", "At 2 AM daily"], correctIndex: 1, type: "output" },
  { question: "Sticky bit on /tmp means?", options: ["Files are encrypted", "Only owner can delete their files", "All users have write access", "Files auto-delete"], correctIndex: 1, type: "concept" },
  { question: "Which manages systemd services?", options: ["service", "systemctl", "init.d", "rc.local"], correctIndex: 1, type: "concept" },
  { question: "`sed 's/old/new/g' file` does?", options: ["Deletes 'old'", "Replaces all 'old' with 'new'", "Appends 'new'", "Replaces first occurrence only"], correctIndex: 1, type: "output" },
  { question: "Hard link vs soft link?", options: ["Hard links cross filesystems", "Soft links share inode", "Hard links share inode number", "No difference"], correctIndex: 2, type: "concept" },
  { question: "What does `nohup command &` do?", options: ["Runs at high priority", "Runs in background, survives logout", "Runs with no output", "Schedules for later"], correctIndex: 1, type: "concept" },
  { question: "`df -h` shows?", options: ["Memory usage", "Disk space in human-readable format", "Directory sizes", "CPU usage"], correctIndex: 1, type: "output" },
  { question: "Which file controls DNS resolution?", options: ["/etc/hosts", "/etc/resolv.conf", "/etc/dns.conf", "/etc/network"], correctIndex: 1, type: "concept" },
  { question: "`tar -czf archive.tar.gz dir/` does?", options: ["Extracts archive", "Creates gzip-compressed tar archive", "Lists archive contents", "Appends to archive"], correctIndex: 1, type: "concept" },
];

const k8sQuestions: MCQQuestion[] = [
  { question: "What is a Pod in Kubernetes?", options: ["A virtual machine", "Smallest deployable unit with 1+ containers", "A cluster node", "A namespace"], correctIndex: 1, type: "concept" },
  { question: "Which component assigns Pods to Nodes?", options: ["kubelet", "kube-scheduler", "etcd", "kube-proxy"], correctIndex: 1, type: "concept" },
  { question: "What does `kubectl apply -f` do?", options: ["Deletes resource", "Creates/updates resource from file", "Shows logs", "Port forwards"], correctIndex: 1, type: "concept" },
  { question: "A Deployment with replicas: 3 has a Pod crash. What happens?", options: ["Nothing", "ReplicaSet creates new Pod", "Deployment is deleted", "Node restarts"], correctIndex: 1, type: "scenario" },
  { question: "What stores K8s cluster state?", options: ["kubelet", "etcd", "kube-apiserver", "CoreDNS"], correctIndex: 1, type: "concept" },
  { question: "ClusterIP service is accessible from?", options: ["Internet", "Within the cluster only", "Other clusters", "Host machine only"], correctIndex: 1, type: "concept" },
  { question: "What is a DaemonSet?", options: ["Runs one Pod per node", "Runs batch jobs", "Manages secrets", "Horizontal scaler"], correctIndex: 0, type: "concept" },
  { question: "Liveness probe failure causes?", options: ["Pod deletion", "Container restart", "Node drain", "Scaling up"], correctIndex: 1, type: "concept" },
  { question: "What is a ConfigMap?", options: ["Container image config", "Key-value config data for Pods", "Network policy", "Storage class"], correctIndex: 1, type: "concept" },
  { question: "Horizontal Pod Autoscaler scales based on?", options: ["Node count", "CPU/memory metrics", "Disk usage", "Network traffic only"], correctIndex: 1, type: "concept" },
  { question: "What does `kubectl rollout undo` do?", options: ["Deletes deployment", "Reverts to previous revision", "Pauses rollout", "Scales down"], correctIndex: 1, type: "concept" },
  { question: "Namespace purpose is?", options: ["Security only", "Resource isolation and organization", "Networking", "Storage management"], correctIndex: 1, type: "concept" },
  { question: "PersistentVolumeClaim is used to?", options: ["Create nodes", "Request storage resources", "Define network policies", "Set CPU limits"], correctIndex: 1, type: "concept" },
  { question: "Which exposes services to external traffic?", options: ["ClusterIP", "NodePort", "ConfigMap", "PV"], correctIndex: 1, type: "concept" },
  { question: "Init container runs?", options: ["In parallel with app", "Before app containers start", "After app crashes", "Only on first deploy"], correctIndex: 1, type: "concept" },
  { question: "What is Helm?", options: ["Container runtime", "Package manager for K8s", "Monitoring tool", "CI/CD pipeline"], correctIndex: 1, type: "concept" },
  { question: "Resource limits vs requests?", options: ["Same thing", "Requests=guaranteed, Limits=max allowed", "Limits=guaranteed, Requests=max", "Only for CPU"], correctIndex: 1, type: "concept" },
  { question: "What is a StatefulSet for?", options: ["Stateless apps", "Apps needing stable identity/storage", "Batch jobs", "Cron tasks"], correctIndex: 1, type: "concept" },
  { question: "NetworkPolicy controls?", options: ["DNS resolution", "Pod-to-pod traffic rules", "External DNS", "Load balancing"], correctIndex: 1, type: "concept" },
  { question: "Taint on a node does what?", options: ["Attracts pods", "Repels pods without matching toleration", "Deletes node", "Increases priority"], correctIndex: 1, type: "concept" },
];

const pythonQuestions: MCQQuestion[] = [
  { question: "What is output of `print(type([]) is list)`?", options: ["True", "False", "Error", "None"], correctIndex: 0, type: "output" },
  { question: "`x = [1,2,3]; y = x; y.append(4); print(x)`?", options: ["[1,2,3]", "[1,2,3,4]", "Error", "[1,2,3,[4]]"], correctIndex: 1, type: "output" },
  { question: "What does `*args` in a function do?", options: ["Keyword arguments", "Variable positional arguments", "Required arguments", "Default arguments"], correctIndex: 1, type: "concept" },
  { question: "`'hello'[1:4]` returns?", options: ["'hell'", "'ell'", "'ello'", "'hel'"], correctIndex: 1, type: "output" },
  { question: "What is a decorator in Python?", options: ["Class method", "Function that modifies another function", "Variable type", "Import statement"], correctIndex: 1, type: "concept" },
  { question: "`[x**2 for x in range(5)]` returns?", options: ["[1,4,9,16,25]", "[0,1,4,9,16]", "[0,2,4,6,8]", "Error"], correctIndex: 1, type: "output" },
  { question: "What is GIL in Python?", options: ["Garbage collector", "Global Interpreter Lock", "Graphics Interface Library", "General Import Loader"], correctIndex: 1, type: "concept" },
  { question: "`dict.get('key', 'default')` when key missing returns?", options: ["None", "KeyError", "'default'", "''"], correctIndex: 2, type: "output" },
  { question: "Which is immutable?", options: ["list", "dict", "set", "tuple"], correctIndex: 3, type: "concept" },
  { question: "`print(0.1 + 0.2 == 0.3)`?", options: ["True", "False", "Error", "0.3"], correctIndex: 1, type: "output" },
  { question: "What does `yield` do?", options: ["Returns and exits", "Pauses function, returns value", "Raises exception", "Imports module"], correctIndex: 1, type: "concept" },
  { question: "`lambda x: x*2` is a?", options: ["Class", "Anonymous function", "Module", "Decorator"], correctIndex: 1, type: "concept" },
  { question: "What is `__init__` method?", options: ["Destructor", "Constructor/initializer", "Static method", "Class method"], correctIndex: 1, type: "concept" },
  { question: "`set([1,2,2,3,3])` returns?", options: ["{1,2,2,3,3}", "{1,2,3}", "[1,2,3]", "Error"], correctIndex: 1, type: "output" },
  { question: "Time complexity of `in` for a set?", options: ["O(n)", "O(1) average", "O(log n)", "O(n²)"], correctIndex: 1, type: "complexity" },
  { question: "`try/except/finally` — finally runs?", options: ["Only on error", "Only on success", "Always", "Never with return"], correctIndex: 2, type: "concept" },
  { question: "What is `__name__ == '__main__'` for?", options: ["Defining main class", "Running code only when script is executed directly", "Error handling", "Module naming"], correctIndex: 1, type: "concept" },
  { question: "`sorted([3,1,2], reverse=True)`?", options: ["[1,2,3]", "[3,2,1]", "[3,1,2]", "Error"], correctIndex: 1, type: "output" },
  { question: "What is a Python generator?", options: ["Class factory", "Iterator using yield", "File reader", "Thread creator"], correctIndex: 1, type: "concept" },
  { question: "`isinstance(True, int)` returns?", options: ["True", "False", "Error", "None"], correctIndex: 0, type: "output" },
];

const javaQuestions: MCQQuestion[] = [
  { question: "What is JVM?", options: ["Java compiler", "Java Virtual Machine that runs bytecode", "Java IDE", "Java build tool"], correctIndex: 1, type: "concept" },
  { question: "`String s = new String(\"hello\"); String t = \"hello\"; s == t` is?", options: ["true", "false", "Compilation error", "Runtime error"], correctIndex: 1, type: "output" },
  { question: "Which is NOT a Java access modifier?", options: ["public", "private", "friend", "protected"], correctIndex: 2, type: "concept" },
  { question: "What is method overloading?", options: ["Same name, different parameters", "Same name, same parameters", "Overriding parent method", "Static methods only"], correctIndex: 0, type: "concept" },
  { question: "`ArrayList` vs `LinkedList` for random access?", options: ["LinkedList is faster", "ArrayList is O(1)", "Same performance", "Neither supports it"], correctIndex: 1, type: "complexity" },
  { question: "What does `final` keyword prevent?", options: ["Compilation", "Inheritance/modification", "Garbage collection", "Serialization"], correctIndex: 1, type: "concept" },
  { question: "Checked exception must be?", options: ["Ignored", "Caught or declared in throws", "Only logged", "Converted to unchecked"], correctIndex: 1, type: "concept" },
  { question: "What is autoboxing?", options: ["Automatic compilation", "Auto conversion primitive↔wrapper", "Auto import", "Auto casting"], correctIndex: 1, type: "concept" },
  { question: "`HashMap` allows null keys?", options: ["No", "Yes, one null key", "Yes, multiple null keys", "Only in TreeMap"], correctIndex: 1, type: "concept" },
  { question: "What is the output? `System.out.println(10/3);`", options: ["3.33", "3", "3.0", "Error"], correctIndex: 1, type: "output" },
  { question: "Interface vs abstract class?", options: ["Interfaces can have constructors", "Abstract classes support multiple inheritance", "Interfaces allow multiple implementation", "No difference in Java 8+"], correctIndex: 2, type: "concept" },
  { question: "What is garbage collection?", options: ["File cleanup", "Automatic memory management", "Code optimization", "Thread management"], correctIndex: 1, type: "concept" },
  { question: "Which collection is thread-safe?", options: ["ArrayList", "HashMap", "ConcurrentHashMap", "LinkedList"], correctIndex: 2, type: "concept" },
  { question: "`static` method can access?", options: ["Instance variables directly", "Only static members", "Both static and instance", "Nothing"], correctIndex: 1, type: "concept" },
  { question: "What does `volatile` keyword do?", options: ["Makes variable constant", "Ensures visibility across threads", "Prevents serialization", "Enables lazy loading"], correctIndex: 1, type: "concept" },
  { question: "Diamond problem in Java is solved by?", options: ["Multiple inheritance of classes", "Interfaces with default methods + explicit override", "Abstract classes", "Not possible in Java"], correctIndex: 1, type: "concept" },
  { question: "What is a functional interface?", options: ["Interface with no methods", "Interface with exactly one abstract method", "Interface with all default methods", "Deprecated interface"], correctIndex: 1, type: "concept" },
  { question: "`StringBuilder` vs `String` for concatenation?", options: ["String is faster", "StringBuilder is mutable and faster", "Same performance", "StringBuilder is immutable"], correctIndex: 1, type: "concept" },
  { question: "What is try-with-resources?", options: ["Multiple try blocks", "Auto-closes resources implementing AutoCloseable", "Try without catch", "Resource pooling"], correctIndex: 1, type: "concept" },
  { question: "Java streams `filter().map().collect()` is?", options: ["Imperative style", "Functional pipeline", "Recursive approach", "Thread-based"], correctIndex: 1, type: "concept" },
];

const jsQuestions: MCQQuestion[] = [
  { question: "`typeof null` returns?", options: ["'null'", "'object'", "'undefined'", "Error"], correctIndex: 1, type: "output" },
  { question: "`[] == false` is?", options: ["true", "false", "Error", "undefined"], correctIndex: 0, type: "output" },
  { question: "What is closure?", options: ["A syntax error", "Function retaining access to outer scope", "A class feature", "A loop construct"], correctIndex: 1, type: "concept" },
  { question: "`let` vs `var`?", options: ["Same thing", "`let` is block-scoped, `var` is function-scoped", "`var` is block-scoped", "`let` is hoisted"], correctIndex: 1, type: "concept" },
  { question: "`Promise.all([p1, p2])` — if p2 rejects?", options: ["Returns p1 result", "Entire promise rejects", "Returns [p1, undefined]", "Waits for p1"], correctIndex: 1, type: "scenario" },
  { question: "What is event loop?", options: ["A for loop", "Mechanism handling async callbacks", "DOM event handler", "A timer"], correctIndex: 1, type: "concept" },
  { question: "`'5' + 3` returns?", options: ["8", "'53'", "Error", "NaN"], correctIndex: 1, type: "output" },
  { question: "`'5' - 3` returns?", options: ["2", "'53'", "Error", "NaN"], correctIndex: 0, type: "output" },
  { question: "What does `async/await` do?", options: ["Parallel execution", "Syntactic sugar for Promises", "Multi-threading", "Synchronous execution"], correctIndex: 1, type: "concept" },
  { question: "`Object.freeze(obj)` does?", options: ["Deletes object", "Prevents modifications", "Deep clones", "Encrypts object"], correctIndex: 1, type: "concept" },
  { question: "What is `this` in arrow function?", options: ["Window always", "Lexically inherited from parent", "The function itself", "undefined"], correctIndex: 1, type: "concept" },
  { question: "`[1,2,3].map(x => x*2)` returns?", options: ["[1,2,3]", "[2,4,6]", "6", "[1,4,9]"], correctIndex: 1, type: "output" },
  { question: "What is destructuring?", options: ["Deleting variables", "Extracting values from arrays/objects", "Removing DOM nodes", "Error handling"], correctIndex: 1, type: "concept" },
  { question: "`setTimeout(fn, 0)` runs fn?", options: ["Immediately", "After current call stack clears", "Never", "After 1 second"], correctIndex: 1, type: "scenario" },
  { question: "What is the spread operator `...`?", options: ["Rest parameter only", "Expands iterables into elements", "String operator", "Math operator"], correctIndex: 1, type: "concept" },
  { question: "`NaN === NaN` is?", options: ["true", "false", "Error", "NaN"], correctIndex: 1, type: "output" },
  { question: "WeakMap keys must be?", options: ["Strings", "Numbers", "Objects", "Any type"], correctIndex: 2, type: "concept" },
  { question: "What does `?.` (optional chaining) do?", options: ["Throws if null", "Returns undefined if null/undefined", "Creates property", "Deletes property"], correctIndex: 1, type: "concept" },
  { question: "`console.log(1); setTimeout(()=>console.log(2),0); console.log(3);` output order?", options: ["1,2,3", "1,3,2", "2,1,3", "3,2,1"], correctIndex: 1, type: "output" },
  { question: "Symbol is used for?", options: ["Math operations", "Unique property keys", "String formatting", "Error handling"], correctIndex: 1, type: "concept" },
];

const dsaQuestions: MCQQuestion[] = [
  { question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, type: "complexity" },
  { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, type: "concept" },
  { question: "Worst case of quicksort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctIndex: 1, type: "complexity" },
  { question: "What is a balanced BST height for n nodes?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 1, type: "complexity" },
  { question: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Array"], correctIndex: 1, type: "concept" },
  { question: "Hash table average lookup time?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 2, type: "complexity" },
  { question: "Which sort is stable and O(n log n)?", options: ["Quicksort", "Merge sort", "Heap sort", "Selection sort"], correctIndex: 1, type: "concept" },
  { question: "Dijkstra's algorithm fails with?", options: ["Directed graphs", "Negative edge weights", "Sparse graphs", "Dense graphs"], correctIndex: 1, type: "concept" },
  { question: "A min-heap root contains?", options: ["Maximum value", "Minimum value", "Median value", "Random value"], correctIndex: 1, type: "concept" },
  { question: "Detecting cycle in linked list uses?", options: ["BFS", "Floyd's tortoise and hare", "DFS", "Binary search"], correctIndex: 1, type: "concept" },
  { question: "Inorder traversal of BST gives?", options: ["Random order", "Sorted order", "Reverse sorted", "Level order"], correctIndex: 1, type: "concept" },
  { question: "Which problem is solved by dynamic programming?", options: ["Binary search", "Fibonacci with memoization", "Linear search", "Bubble sort"], correctIndex: 1, type: "concept" },
  { question: "Space complexity of merge sort?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctIndex: 1, type: "complexity" },
  { question: "Topological sort works on?", options: ["Undirected graphs", "DAGs only", "Cyclic graphs", "Any graph"], correctIndex: 1, type: "concept" },
  { question: "Amortized time for dynamic array push?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctIndex: 1, type: "complexity" },
  { question: "Red-Black tree guarantees?", options: ["Perfect balance", "O(log n) operations", "O(1) insertion", "No rotations"], correctIndex: 1, type: "concept" },
  { question: "Count inversions in array uses?", options: ["Bubble sort", "Modified merge sort", "Binary search", "Hash map"], correctIndex: 1, type: "concept" },
  { question: "Kruskal's algorithm finds?", options: ["Shortest path", "Minimum spanning tree", "Maximum flow", "Topological order"], correctIndex: 1, type: "concept" },
  { question: "Trie is best for?", options: ["Sorting numbers", "Prefix-based string operations", "Graph traversal", "Heap operations"], correctIndex: 1, type: "concept" },
  { question: "What is memoization?", options: ["Caching results of expensive function calls", "Memory allocation", "Garbage collection", "Database indexing"], correctIndex: 0, type: "concept" },
];

export const TOPICS: TopicConfig[] = [
  { id: "os", label: "Operating Systems", icon: "🖥️", questions: osQuestions },
  { id: "vm", label: "Virtual Machines", icon: "📦", questions: vmQuestions },
  { id: "linux", label: "Linux", icon: "🐧", questions: linuxQuestions },
  { id: "k8s", label: "Kubernetes", icon: "☸️", questions: k8sQuestions },
  { id: "python", label: "Python", icon: "🐍", questions: pythonQuestions },
  { id: "java", label: "Java", icon: "☕", questions: javaQuestions },
  { id: "javascript", label: "JavaScript", icon: "⚡", questions: jsQuestions },
  { id: "dsa", label: "DSA", icon: "🧮", questions: dsaQuestions },
];

export function getTopicByIdOrDefault(id: string): TopicConfig {
  return TOPICS.find(t => t.id === id) || TOPICS[0];
}
