// Static catalog of documentation resources.
// Each entry: name, url, description, category.
// Category options: "DSA" | "Language" | "Framework" | "Tool" | "Database" | "CS"

export interface DocEntry {
  name: string;
  url: string;
  description: string;
  category: "DSA" | "Language" | "Framework" | "Tool" | "Database" | "CS";
}

export const DOCS_CATALOG: DocEntry[] = [
  // ── DSA ──────────────────────────────────────────────────────
  {
    name: "Array",
    url: "https://www.geeksforgeeks.org/array-data-structure/",
    description:
      "Contiguous memory structure. Foundation of nearly every algorithm.",
    category: "DSA",
  },
  {
    name: "Binary Search",
    url: "https://www.geeksforgeeks.org/binary-search/",
    description:
      "O(log n) search on sorted arrays. Template for many problems.",
    category: "DSA",
  },
  {
    name: "Linked List",
    url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
    description:
      "Nodes with pointers. Covers singly, doubly, and circular variants.",
    category: "DSA",
  },
  {
    name: "Stack",
    url: "https://www.geeksforgeeks.org/stack-data-structure/",
    description:
      "LIFO structure. Used in DFS, backtracking, and expression parsing.",
    category: "DSA",
  },
  {
    name: "Queue",
    url: "https://www.geeksforgeeks.org/queue-data-structure/",
    description:
      "FIFO structure. Foundation of BFS and level-order traversals.",
    category: "DSA",
  },
  {
    name: "Hash Map",
    url: "https://www.geeksforgeeks.org/hashing-data-structure/",
    description:
      "O(1) average lookup. Key tool for frequency counting and lookups.",
    category: "DSA",
  },
  {
    name: "Binary Tree",
    url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
    description: "Hierarchical structure with at most two children per node.",
    category: "DSA",
  },
  {
    name: "Binary Search Tree",
    url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
    description: "BST property: left < root < right. Enables O(log n) ops.",
    category: "DSA",
  },
  {
    name: "Heap / Priority Queue",
    url: "https://www.geeksforgeeks.org/heap-data-structure/",
    description:
      "Complete binary tree satisfying heap property. O(log n) insert/extract.",
    category: "DSA",
  },
  {
    name: "Graph",
    url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
    description: "Nodes and edges. BFS, DFS, shortest paths, topological sort.",
    category: "DSA",
  },
  {
    name: "BFS (Breadth-First Search)",
    url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
    description:
      "Level-order traversal using a queue. Shortest path in unweighted graphs.",
    category: "DSA",
  },
  {
    name: "DFS (Depth-First Search)",
    url: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
    description:
      "Explore as far as possible before backtracking. Cycle detection, paths.",
    category: "DSA",
  },
  {
    name: "Dynamic Programming",
    url: "https://www.geeksforgeeks.org/dynamic-programming/",
    description:
      "Overlapping subproblems + optimal substructure. Memoization & tabulation.",
    category: "DSA",
  },
  {
    name: "Greedy Algorithms",
    url: "https://www.geeksforgeeks.org/greedy-algorithms/",
    description:
      "Make locally optimal choices at each step. Intervals, scheduling, MST.",
    category: "DSA",
  },
  {
    name: "Backtracking",
    url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
    description:
      "Systematically try all possibilities by undoing choices. N-Queens, subsets.",
    category: "DSA",
  },
  {
    name: "Two Pointers",
    url: "https://www.geeksforgeeks.org/two-pointers-technique/",
    description:
      "Two indices moving through array. Pair sum, palindrome, container problems.",
    category: "DSA",
  },
  {
    name: "Sliding Window",
    url: "https://www.geeksforgeeks.org/window-sliding-technique/",
    description:
      "Fixed or variable window over array/string. Max subarray, substrings.",
    category: "DSA",
  },
  {
    name: "Prefix Sum",
    url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
    description: "Precompute cumulative sums for O(1) range queries.",
    category: "DSA",
  },
  {
    name: "Trie",
    url: "https://www.geeksforgeeks.org/introduction-to-trie-data-structure-and-algorithm-tutorials/",
    description:
      "Prefix tree for efficient string search, autocomplete, and word problems.",
    category: "DSA",
  },
  {
    name: "Union Find (DSU)",
    url: "https://www.geeksforgeeks.org/disjoint-set-union-randomized-algorithm/",
    description:
      "Disjoint set union. Connected components, Kruskal's MST, cycle detection.",
    category: "DSA",
  },
  {
    name: "Monotonic Stack",
    url: "https://www.geeksforgeeks.org/monotonic-stack/",
    description:
      "Stack maintaining monotonic order. Next greater/smaller element problems.",
    category: "DSA",
  },
  {
    name: "Dijkstra's Algorithm",
    url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
    description:
      "Shortest path in weighted graphs with non-negative edges. Uses min-heap.",
    category: "DSA",
  },
  {
    name: "Topological Sort",
    url: "https://www.geeksforgeeks.org/topological-sorting/",
    description:
      "Linear ordering of DAG vertices. Dependency resolution, course scheduling.",
    category: "DSA",
  },
  {
    name: "Bit Manipulation",
    url: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/",
    description:
      "XOR, AND, OR, shifts. Space-efficient tricks and constant-time ops.",
    category: "DSA",
  },
  {
    name: "Sorting Algorithms",
    url: "https://www.geeksforgeeks.org/sorting-algorithms/",
    description:
      "Merge sort, quicksort, heapsort, counting sort and their trade-offs.",
    category: "DSA",
  },
  {
    name: "NeetCode 150",
    url: "https://neetcode.io/practice",
    description: "Curated 150 LeetCode problems covering every major pattern.",
    category: "DSA",
  },
  {
    name: "Big-O Cheat Sheet",
    url: "https://www.bigocheatsheet.com/",
    description:
      "Time and space complexity of common data structures and algorithms.",
    category: "DSA",
  },

  // ── Language ─────────────────────────────────────────────────
  {
    name: "TypeScript",
    url: "https://www.typescriptlang.org/docs/",
    description:
      "Typed superset of JavaScript. Types, interfaces, generics, utility types.",
    category: "Language",
  },
  {
    name: "JavaScript (MDN)",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description:
      "Complete JS reference: closures, prototypes, async/await, Web APIs.",
    category: "Language",
  },
  {
    name: "Python",
    url: "https://docs.python.org/3/",
    description: "Official Python 3 docs. Stdlib, built-ins, data model.",
    category: "Language",
  },
  {
    name: "Java",
    url: "https://docs.oracle.com/en/java/javase/21/docs/api/index.html",
    description: "Java 21 API. Collections, streams, concurrency, generics.",
    category: "Language",
  },
  {
    name: "C++",
    url: "https://cppreference.com",
    description:
      "Comprehensive C++ reference. STL containers, algorithms, templates.",
    category: "Language",
  },
  {
    name: "Go",
    url: "https://go.dev/doc/",
    description:
      "Official Go docs. Goroutines, channels, interfaces, standard library.",
    category: "Language",
  },
  {
    name: "Rust",
    url: "https://doc.rust-lang.org/book/",
    description:
      "The Rust Book. Ownership, borrowing, lifetimes, traits, async.",
    category: "Language",
  },
  {
    name: "Kotlin",
    url: "https://kotlinlang.org/docs/home.html",
    description:
      "Official Kotlin docs. Coroutines, data classes, extension functions.",
    category: "Language",
  },
  {
    name: "Swift",
    url: "https://www.swift.org/documentation/",
    description: "Swift language reference. Optionals, protocols, concurrency.",
    category: "Language",
  },

  // ── Framework ────────────────────────────────────────────────
  {
    name: "Next.js",
    url: "https://nextjs.org/docs",
    description:
      "App Router, server components, file-based routing, ISR, middleware.",
    category: "Framework",
  },
  {
    name: "React",
    url: "https://react.dev/reference/react",
    description:
      "Hooks, components, state, context, suspense, and concurrent features.",
    category: "Framework",
  },
  {
    name: "Vue.js",
    url: "https://vuejs.org/guide/introduction.html",
    description:
      "Composition API, reactivity system, directives, component lifecycle.",
    category: "Framework",
  },
  {
    name: "Svelte",
    url: "https://svelte.dev/docs",
    description:
      "Compile-time framework. Reactivity, stores, animations, SvelteKit.",
    category: "Framework",
  },
  {
    name: "Express.js",
    url: "https://expressjs.com/en/4x/api.html",
    description:
      "Minimal Node.js web framework. Routing, middleware, request/response.",
    category: "Framework",
  },
  {
    name: "Fastify",
    url: "https://fastify.dev/docs/latest/",
    description:
      "Fast and low-overhead Node.js web framework with schema validation.",
    category: "Framework",
  },
  {
    name: "NestJS",
    url: "https://docs.nestjs.com/",
    description:
      "Opinionated Node.js framework. Modules, decorators, DI, OpenAPI.",
    category: "Framework",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
    description:
      "Utility-first CSS. All classes, responsive prefixes, dark mode, config.",
    category: "Framework",
  },
  {
    name: "Prisma",
    url: "https://www.prisma.io/docs",
    description:
      "Type-safe ORM. Schema, migrations, queries, relations, Prisma Studio.",
    category: "Framework",
  },

  // ── Tool ─────────────────────────────────────────────────────
  {
    name: "Git",
    url: "https://git-scm.com/doc",
    description:
      "Version control reference. Commands, branching, rebasing, stashing.",
    category: "Tool",
  },
  {
    name: "Docker",
    url: "https://docs.docker.com/",
    description: "Containerisation. Dockerfile, compose, volumes, networking.",
    category: "Tool",
  },
  {
    name: "Vite",
    url: "https://vitejs.dev/guide/",
    description: "Fast build tool. HMR, plugins, SSR, environment variables.",
    category: "Tool",
  },
  {
    name: "Vitest",
    url: "https://vitest.dev/guide/",
    description: "Vite-native test framework. Compatible with Jest API.",
    category: "Tool",
  },
  {
    name: "ESLint",
    url: "https://eslint.org/docs/latest/",
    description: "JS/TS linter. Rules, plugins, flat config, custom rules.",
    category: "Tool",
  },
  {
    name: "Zod",
    url: "https://zod.dev/",
    description:
      "TypeScript-first schema validation. Parse, transform, infer types.",
    category: "Tool",
  },
  {
    name: "tRPC",
    url: "https://trpc.io/docs",
    description: "End-to-end type-safe APIs without code generation.",
    category: "Tool",
  },
  {
    name: "SWR",
    url: "https://swr.vercel.app/docs/getting-started",
    description:
      "React hooks for data fetching. Stale-while-revalidate, mutation.",
    category: "Tool",
  },
  {
    name: "Zustand",
    url: "https://zustand-demo.pmnd.rs/",
    description: "Minimal state management. No boilerplate, devtools support.",
    category: "Tool",
  },
  {
    name: "Axios",
    url: "https://axios-http.com/docs/intro",
    description:
      "Promise-based HTTP client. Interceptors, timeouts, cancel tokens.",
    category: "Tool",
  },

  // ── Database ─────────────────────────────────────────────────
  {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/docs/current/",
    description:
      "Full SQL reference. Indexes, CTEs, window functions, JSONB, full-text.",
    category: "Database",
  },
  {
    name: "Supabase",
    url: "https://supabase.com/docs",
    description:
      "Postgres-as-a-service. Auth, storage, realtime, edge functions.",
    category: "Database",
  },
  {
    name: "MongoDB",
    url: "https://www.mongodb.com/docs/manual/",
    description:
      "Document database. Aggregation pipeline, indexes, transactions.",
    category: "Database",
  },
  {
    name: "Redis",
    url: "https://redis.io/docs/",
    description:
      "In-memory data structure store. Caching, pub/sub, sorted sets.",
    category: "Database",
  },
  {
    name: "SQLite",
    url: "https://www.sqlite.org/docs.html",
    description:
      "Serverless embedded SQL database. Perfect for local/edge use.",
    category: "Database",
  },

  // ── CS ───────────────────────────────────────────────────────
  {
    name: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    description:
      "How to design large-scale systems. CAP theorem, sharding, caching.",
    category: "CS",
  },
  {
    name: "Operating Systems (OSDev)",
    url: "https://wiki.osdev.org/Main_Page",
    description:
      "Processes, threads, memory management, scheduling, file systems.",
    category: "CS",
  },
  {
    name: "Computer Networks",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    description: "HTTP/HTTPS, TCP/IP, DNS, TLS, REST, WebSockets.",
    category: "CS",
  },
  {
    name: "Regex",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions",
    description: "Regular expressions syntax, groups, lookaheads, flags.",
    category: "CS",
  },
  {
    name: "VisuAlgo",
    url: "https://visualgo.net/en",
    description:
      "Interactive visualisations of sorting, trees, graphs, and more.",
    category: "CS",
  },
];

// All unique categories
export const CATALOG_CATEGORIES = [
  "All",
  "DSA",
  "Language",
  "Framework",
  "Tool",
  "Database",
  "CS",
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
