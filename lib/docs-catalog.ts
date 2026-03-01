// Static catalog of documentation resources.
// Each entry: name, url, description, category.

export interface DocEntry {
  name: string;
  url: string;
  description: string;
  category:
    | "DSA"
    | "Language"
    | "Frontend"
    | "Backend"
    | "Database"
    | "DevOps"
    | "Mobile"
    | "Tool"
    | "CS"
    | "AI/ML";
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
      "O(log n) search on sorted arrays. Template for many LeetCode problems.",
    category: "DSA",
  },
  {
    name: "Linked List",
    url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
    description: "Nodes with pointers. Singly, doubly, and circular variants.",
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
      "O(1) average lookup. Key tool for frequency counting and caching.",
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
    description:
      "BST property: left < root < right. Enables O(log n) operations.",
    category: "DSA",
  },
  {
    name: "Heap / Priority Queue",
    url: "https://www.geeksforgeeks.org/heap-data-structure/",
    description:
      "Complete binary tree. O(log n) insert/extract-min. Top-K problems.",
    category: "DSA",
  },
  {
    name: "Graph",
    url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
    description: "Nodes and edges. BFS, DFS, shortest paths, topological sort.",
    category: "DSA",
  },
  {
    name: "BFS",
    url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
    description:
      "Level-order traversal using a queue. Shortest path in unweighted graphs.",
    category: "DSA",
  },
  {
    name: "DFS",
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
      "Make locally optimal choices. Intervals, scheduling, Huffman, MST.",
    category: "DSA",
  },
  {
    name: "Backtracking",
    url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
    description:
      "Try all possibilities by undoing choices. N-Queens, subsets, permutations.",
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
      "Fixed or variable window. Max subarray, longest substring problems.",
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
      "Prefix tree for string search, autocomplete, and word problems.",
    category: "DSA",
  },
  {
    name: "Union Find (DSU)",
    url: "https://www.geeksforgeeks.org/disjoint-set-union-randomized-algorithm/",
    description: "Connected components, Kruskal's MST, cycle detection.",
    category: "DSA",
  },
  {
    name: "Monotonic Stack",
    url: "https://www.geeksforgeeks.org/monotonic-stack/",
    description:
      "Stack maintaining monotonic order. Next greater/smaller element.",
    category: "DSA",
  },
  {
    name: "Dijkstra's Algorithm",
    url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
    description: "Shortest path in weighted graphs with non-negative edges.",
    category: "DSA",
  },
  {
    name: "Topological Sort",
    url: "https://www.geeksforgeeks.org/topological-sorting/",
    description: "Linear ordering of DAG vertices. Dependency resolution.",
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
      "Merge sort, quicksort, heapsort, counting sort and trade-offs.",
    category: "DSA",
  },
  {
    name: "Segment Tree",
    url: "https://www.geeksforgeeks.org/segment-tree-data-structure/",
    description:
      "Range query and point update in O(log n). Sum, min, max queries.",
    category: "DSA",
  },
  {
    name: "Fenwick Tree (BIT)",
    url: "https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/",
    description: "Binary Indexed Tree for prefix sums with O(log n) updates.",
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
  {
    name: "VisuAlgo",
    url: "https://visualgo.net/en",
    description:
      "Interactive visualisations of sorting, trees, graphs, and more.",
    category: "DSA",
  },
  {
    name: "CP Algorithms",
    url: "https://cp-algorithms.com/",
    description:
      "Competitive programming algorithms with proofs and implementations.",
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
    description:
      "Official Python 3 docs. Stdlib, built-ins, decorators, data model.",
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
    name: "C",
    url: "https://devdocs.io/c/",
    description:
      "C standard library reference. Pointers, memory, I/O, strings.",
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
  {
    name: "Ruby",
    url: "https://ruby-doc.org/",
    description:
      "Ruby core and stdlib. Blocks, procs, metaprogramming, enumerable.",
    category: "Language",
  },
  {
    name: "PHP",
    url: "https://www.php.net/docs.php",
    description: "PHP manual. Functions, OOP, namespaces, generators, fibers.",
    category: "Language",
  },
  {
    name: "Scala",
    url: "https://docs.scala-lang.org/",
    description:
      "Functional + OOP on JVM. Pattern matching, implicits, collections.",
    category: "Language",
  },
  {
    name: "Dart",
    url: "https://dart.dev/guides",
    description: "Dart language tour. Null safety, async, isolates, core libs.",
    category: "Language",
  },
  {
    name: "Elixir",
    url: "https://elixir-lang.org/docs.html",
    description:
      "Functional, concurrent language. Processes, OTP, pattern matching.",
    category: "Language",
  },
  {
    name: "Haskell",
    url: "https://www.haskell.org/documentation/",
    description:
      "Pure functional language. Monads, type classes, lazy evaluation.",
    category: "Language",
  },
  {
    name: "Lua",
    url: "https://www.lua.org/docs.html",
    description:
      "Lightweight scripting language. Tables, metatables, coroutines.",
    category: "Language",
  },
  {
    name: "R",
    url: "https://www.rdocumentation.org/",
    description:
      "Statistical computing language. Data frames, ggplot2, tidyverse.",
    category: "Language",
  },

  // ── Frontend ─────────────────────────────────────────────────
  {
    name: "React",
    url: "https://react.dev/reference/react",
    description:
      "Hooks, components, state, context, suspense, concurrent features.",
    category: "Frontend",
  },
  {
    name: "Next.js",
    url: "https://nextjs.org/docs",
    description:
      "App Router, server components, file-based routing, ISR, middleware.",
    category: "Frontend",
  },
  {
    name: "Vue.js",
    url: "https://vuejs.org/guide/introduction.html",
    description:
      "Composition API, reactivity, directives, component lifecycle.",
    category: "Frontend",
  },
  {
    name: "Nuxt.js",
    url: "https://nuxt.com/docs",
    description: "Vue meta-framework. SSR, file-based routing, auto-imports.",
    category: "Frontend",
  },
  {
    name: "Svelte",
    url: "https://svelte.dev/docs",
    description: "Compile-time framework. Reactivity, stores, animations.",
    category: "Frontend",
  },
  {
    name: "SvelteKit",
    url: "https://kit.svelte.dev/docs",
    description:
      "Full-stack Svelte. Routing, load functions, form actions, adapters.",
    category: "Frontend",
  },
  {
    name: "Astro",
    url: "https://docs.astro.build/",
    description:
      "Content-first framework. Islands architecture, zero JS by default.",
    category: "Frontend",
  },
  {
    name: "Angular",
    url: "https://angular.dev/overview",
    description:
      "Full MVC framework. Components, services, RxJS, dependency injection.",
    category: "Frontend",
  },
  {
    name: "Remix",
    url: "https://remix.run/docs",
    description:
      "Full-stack React. Nested routes, loaders, actions, progressive enhancement.",
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
    description:
      "Utility-first CSS. All classes, responsive prefixes, dark mode.",
    category: "Frontend",
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com/docs",
    description: "Copy-paste React components built on Radix UI and Tailwind.",
    category: "Frontend",
  },
  {
    name: "Radix UI",
    url: "https://www.radix-ui.com/docs/primitives/overview/introduction",
    description:
      "Accessible, unstyled UI primitives for React. Dialog, dropdown, tooltip.",
    category: "Frontend",
  },
  {
    name: "Framer Motion",
    url: "https://www.framer.com/motion/",
    description:
      "Production-ready React animation library. Gestures, layout, scroll.",
    category: "Frontend",
  },
  {
    name: "Three.js",
    url: "https://threejs.org/docs/",
    description:
      "3D graphics in the browser. WebGL abstraction, geometries, shaders.",
    category: "Frontend",
  },
  {
    name: "D3.js",
    url: "https://d3js.org/",
    description:
      "Data-driven documents. SVG charts, scales, transitions, axes.",
    category: "Frontend",
  },
  {
    name: "Zustand",
    url: "https://zustand-demo.pmnd.rs/",
    description:
      "Minimal React state management. No boilerplate, devtools support.",
    category: "Frontend",
  },
  {
    name: "TanStack Query",
    url: "https://tanstack.com/query/latest/docs/framework/react/overview",
    description:
      "Async state management. Caching, background refetch, optimistic updates.",
    category: "Frontend",
  },
  {
    name: "SWR",
    url: "https://swr.vercel.app/docs/getting-started",
    description:
      "React hooks for data fetching. Stale-while-revalidate, mutation.",
    category: "Frontend",
  },
  {
    name: "Redux Toolkit",
    url: "https://redux-toolkit.js.org/introduction/getting-started",
    description: "Official Redux toolset. Slices, thunks, RTK Query, DevTools.",
    category: "Frontend",
  },
  {
    name: "Vite",
    url: "https://vitejs.dev/guide/",
    description:
      "Fast build tool and dev server. HMR, plugins, SSR, env variables.",
    category: "Frontend",
  },
  {
    name: "CSS (MDN)",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    description:
      "Full CSS reference. Flexbox, Grid, animations, custom properties.",
    category: "Frontend",
  },
  {
    name: "HTML (MDN)",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    description: "HTML elements, attributes, forms, semantics, accessibility.",
    category: "Frontend",
  },

  // ── Backend ───────────────────────────────────────────────────
  {
    name: "Spring Boot",
    url: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
    description:
      "Java framework for production-ready apps. Auto-config, REST, security.",
    category: "Backend",
  },
  {
    name: "Spring Framework",
    url: "https://docs.spring.io/spring-framework/reference/",
    description: "Core Spring. IoC, AOP, data access, MVC, WebFlux.",
    category: "Backend",
  },
  {
    name: "Spring Security",
    url: "https://docs.spring.io/spring-security/reference/",
    description: "Authentication, authorisation, OAuth2, JWT for Spring apps.",
    category: "Backend",
  },
  {
    name: "Spring Data JPA",
    url: "https://docs.spring.io/spring-data/jpa/reference/",
    description:
      "JPA repositories, query derivation, custom queries, pagination.",
    category: "Backend",
  },
  {
    name: "Express.js",
    url: "https://expressjs.com/en/4x/api.html",
    description:
      "Minimal Node.js web framework. Routing, middleware, request/response.",
    category: "Backend",
  },
  {
    name: "Fastify",
    url: "https://fastify.dev/docs/latest/",
    description:
      "Fast and low-overhead Node.js framework with schema validation.",
    category: "Backend",
  },
  {
    name: "NestJS",
    url: "https://docs.nestjs.com/",
    description:
      "Opinionated Node.js framework. Modules, decorators, DI, OpenAPI.",
    category: "Backend",
  },
  {
    name: "Django",
    url: "https://docs.djangoproject.com/",
    description:
      "Python batteries-included framework. ORM, admin, auth, templates.",
    category: "Backend",
  },
  {
    name: "FastAPI",
    url: "https://fastapi.tiangolo.com/",
    description:
      "Modern Python API framework. Auto docs, Pydantic validation, async.",
    category: "Backend",
  },
  {
    name: "Flask",
    url: "https://flask.palletsprojects.com/",
    description: "Micro Python web framework. Routing, blueprints, extensions.",
    category: "Backend",
  },
  {
    name: "Ruby on Rails",
    url: "https://guides.rubyonrails.org/",
    description:
      "Full-stack Ruby framework. Convention over configuration, ActiveRecord.",
    category: "Backend",
  },
  {
    name: "Laravel",
    url: "https://laravel.com/docs",
    description:
      "PHP framework. Eloquent ORM, Artisan CLI, queues, broadcasting.",
    category: "Backend",
  },
  {
    name: "ASP.NET Core",
    url: "https://learn.microsoft.com/en-us/aspnet/core/",
    description:
      "Cross-platform .NET framework. Minimal APIs, MVC, SignalR, gRPC.",
    category: "Backend",
  },
  {
    name: "Gin (Go)",
    url: "https://gin-gonic.com/docs/",
    description:
      "Fast HTTP web framework for Go. Routing, middleware, JSON rendering.",
    category: "Backend",
  },
  {
    name: "Fiber (Go)",
    url: "https://docs.gofiber.io/",
    description: "Express-inspired Go web framework built on Fasthttp.",
    category: "Backend",
  },
  {
    name: "Echo (Go)",
    url: "https://echo.labstack.com/docs",
    description:
      "High performance Go web framework. Middleware, routing, validation.",
    category: "Backend",
  },
  {
    name: "Actix Web (Rust)",
    url: "https://actix.rs/docs/",
    description:
      "Powerful, fast Rust web framework. Actors, async handlers, extractors.",
    category: "Backend",
  },
  {
    name: "Axum (Rust)",
    url: "https://docs.rs/axum/latest/axum/",
    description: "Ergonomic Rust web framework built on Tokio and Tower.",
    category: "Backend",
  },
  {
    name: "Ktor (Kotlin)",
    url: "https://ktor.io/docs/",
    description: "Async Kotlin framework for microservices and web apps.",
    category: "Backend",
  },
  {
    name: "Phoenix (Elixir)",
    url: "https://hexdocs.pm/phoenix/overview.html",
    description:
      "Productive web framework for Elixir. Channels, LiveView, PubSub.",
    category: "Backend",
  },
  {
    name: "GraphQL",
    url: "https://graphql.org/learn/",
    description:
      "Query language for APIs. Schema, resolvers, mutations, subscriptions.",
    category: "Backend",
  },
  {
    name: "tRPC",
    url: "https://trpc.io/docs",
    description: "End-to-end type-safe APIs without code generation.",
    category: "Backend",
  },
  {
    name: "Prisma",
    url: "https://www.prisma.io/docs",
    description:
      "Type-safe ORM. Schema, migrations, queries, relations, Studio.",
    category: "Backend",
  },
  {
    name: "Drizzle ORM",
    url: "https://orm.drizzle.team/docs/overview",
    description:
      "Lightweight TypeScript ORM. SQL-like syntax, type-safe queries.",
    category: "Backend",
  },
  {
    name: "Hibernate",
    url: "https://hibernate.org/orm/documentation/",
    description: "Java ORM framework. Mappings, HQL, caching, transactions.",
    category: "Backend",
  },
  {
    name: "NextAuth.js",
    url: "https://next-auth.js.org/getting-started/introduction",
    description: "Auth for Next.js. OAuth providers, JWTs, database sessions.",
    category: "Backend",
  },
  {
    name: "Passport.js",
    url: "https://www.passportjs.org/docs/",
    description:
      "Node.js auth middleware. 500+ strategies including OAuth, JWT.",
    category: "Backend",
  },
  {
    name: "Socket.IO",
    url: "https://socket.io/docs/v4/",
    description:
      "Realtime bidirectional event-based communication. Rooms, namespaces.",
    category: "Backend",
  },
  {
    name: "gRPC",
    url: "https://grpc.io/docs/",
    description: "High-performance RPC framework. Protocol buffers, streaming.",
    category: "Backend",
  },
  {
    name: "Apache Kafka",
    url: "https://kafka.apache.org/documentation/",
    description:
      "Distributed event streaming. Topics, partitions, consumers, producers.",
    category: "Backend",
  },
  {
    name: "RabbitMQ",
    url: "https://www.rabbitmq.com/docs",
    description: "Message broker. Exchanges, queues, bindings, AMQP protocol.",
    category: "Backend",
  },
  {
    name: "Celery",
    url: "https://docs.celeryq.dev/en/stable/",
    description:
      "Python distributed task queue. Workers, beat scheduler, result backends.",
    category: "Backend",
  },

  // ── Database ──────────────────────────────────────────────────
  {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/docs/current/",
    description: "Full SQL reference. Indexes, CTEs, window functions, JSONB.",
    category: "Database",
  },
  {
    name: "MySQL",
    url: "https://dev.mysql.com/doc/",
    description:
      "Popular open-source RDBMS. Queries, indexes, replication, InnoDB.",
    category: "Database",
  },
  {
    name: "SQLite",
    url: "https://www.sqlite.org/docs.html",
    description:
      "Serverless embedded SQL database. Perfect for local/edge use.",
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
    name: "Supabase",
    url: "https://supabase.com/docs",
    description:
      "Postgres-as-a-service. Auth, storage, realtime, edge functions.",
    category: "Database",
  },
  {
    name: "Firebase",
    url: "https://firebase.google.com/docs",
    description:
      "Google BaaS. Firestore, Realtime DB, Auth, Storage, Cloud Functions.",
    category: "Database",
  },
  {
    name: "PlanetScale",
    url: "https://planetscale.com/docs",
    description:
      "Serverless MySQL. Branching, non-blocking schema changes, insights.",
    category: "Database",
  },
  {
    name: "Neon",
    url: "https://neon.tech/docs",
    description:
      "Serverless Postgres. Branching, auto-suspend, connection pooling.",
    category: "Database",
  },
  {
    name: "Cassandra",
    url: "https://cassandra.apache.org/doc/latest/",
    description:
      "Wide-column NoSQL. Partition keys, CQL, eventual consistency.",
    category: "Database",
  },
  {
    name: "Elasticsearch",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html",
    description:
      "Distributed search engine. Full-text search, aggregations, Kibana.",
    category: "Database",
  },
  {
    name: "DynamoDB",
    url: "https://docs.aws.amazon.com/dynamodb/",
    description:
      "AWS serverless NoSQL. Partition/sort keys, GSI, DynamoDB Streams.",
    category: "Database",
  },
  {
    name: "Neo4j",
    url: "https://neo4j.com/docs/",
    description:
      "Graph database. Cypher query language, relationships, graph algorithms.",
    category: "Database",
  },
  {
    name: "InfluxDB",
    url: "https://docs.influxdata.com/",
    description:
      "Time-series database. Flux queries, retention policies, Telegraf.",
    category: "Database",
  },

  // ── DevOps ───────────────────────────────────────────────────
  {
    name: "Docker",
    url: "https://docs.docker.com/",
    description: "Containerisation. Dockerfile, compose, volumes, networking.",
    category: "DevOps",
  },
  {
    name: "Kubernetes",
    url: "https://kubernetes.io/docs/home/",
    description:
      "Container orchestration. Pods, deployments, services, ingress, Helm.",
    category: "DevOps",
  },
  {
    name: "GitHub Actions",
    url: "https://docs.github.com/en/actions",
    description:
      "CI/CD pipelines in GitHub. Workflows, jobs, actions, secrets.",
    category: "DevOps",
  },
  {
    name: "Terraform",
    url: "https://developer.hashicorp.com/terraform/docs",
    description:
      "Infrastructure as code. Providers, resources, state, modules.",
    category: "DevOps",
  },
  {
    name: "AWS",
    url: "https://docs.aws.amazon.com/",
    description: "Amazon Web Services. EC2, S3, Lambda, RDS, CloudFront, IAM.",
    category: "DevOps",
  },
  {
    name: "Google Cloud",
    url: "https://cloud.google.com/docs",
    description: "GCP services. Compute Engine, Cloud Run, BigQuery, GKE.",
    category: "DevOps",
  },
  {
    name: "Azure",
    url: "https://learn.microsoft.com/en-us/azure/",
    description:
      "Microsoft cloud. App Service, AKS, Cosmos DB, Azure Functions.",
    category: "DevOps",
  },
  {
    name: "Vercel",
    url: "https://vercel.com/docs",
    description:
      "Frontend deployment. Edge functions, ISR, previews, analytics.",
    category: "DevOps",
  },
  {
    name: "Nginx",
    url: "https://nginx.org/en/docs/",
    description: "Web server and reverse proxy. Load balancing, caching, SSL.",
    category: "DevOps",
  },
  {
    name: "Linux CLI",
    url: "https://linuxcommand.org/tlcl.php",
    description:
      "Command line essentials. Files, processes, permissions, bash scripting.",
    category: "DevOps",
  },
  {
    name: "Git",
    url: "https://git-scm.com/doc",
    description:
      "Version control reference. Commands, branching, rebasing, stashing.",
    category: "DevOps",
  },
  {
    name: "Ansible",
    url: "https://docs.ansible.com/",
    description: "IT automation. Playbooks, roles, inventory, modules.",
    category: "DevOps",
  },
  {
    name: "Helm",
    url: "https://helm.sh/docs/",
    description:
      "Kubernetes package manager. Charts, templates, releases, repositories.",
    category: "DevOps",
  },
  {
    name: "Prometheus",
    url: "https://prometheus.io/docs/",
    description:
      "Metrics monitoring. PromQL, scraping, alerting, Grafana integration.",
    category: "DevOps",
  },
  {
    name: "Grafana",
    url: "https://grafana.com/docs/grafana/latest/",
    description:
      "Observability dashboards. Panels, data sources, alerts, Loki.",
    category: "DevOps",
  },

  // ── Mobile ───────────────────────────────────────────────────
  {
    name: "React Native",
    url: "https://reactnative.dev/docs/getting-started",
    description:
      "Cross-platform mobile apps with React. Core components, navigation.",
    category: "Mobile",
  },
  {
    name: "Flutter",
    url: "https://docs.flutter.dev/",
    description:
      "Dart UI toolkit for mobile, web, desktop. Widgets, state, animations.",
    category: "Mobile",
  },
  {
    name: "Expo",
    url: "https://docs.expo.dev/",
    description: "React Native toolchain. EAS Build, OTA updates, native APIs.",
    category: "Mobile",
  },
  {
    name: "Android (Jetpack Compose)",
    url: "https://developer.android.com/docs",
    description:
      "Official Android docs. Jetpack Compose, lifecycle, navigation.",
    category: "Mobile",
  },
  {
    name: "iOS (SwiftUI)",
    url: "https://developer.apple.com/documentation/",
    description: "Apple platform docs. SwiftUI, UIKit, Core Data, networking.",
    category: "Mobile",
  },
  {
    name: "Ionic",
    url: "https://ionicframework.com/docs",
    description:
      "Cross-platform apps with web tech. Capacitor, native plugins.",
    category: "Mobile",
  },

  // ── Tool ─────────────────────────────────────────────────────
  {
    name: "Zod",
    url: "https://zod.dev/",
    description:
      "TypeScript-first schema validation. Parse, transform, infer types.",
    category: "Tool",
  },
  {
    name: "Axios",
    url: "https://axios-http.com/docs/intro",
    description:
      "Promise-based HTTP client. Interceptors, timeouts, cancel tokens.",
    category: "Tool",
  },
  {
    name: "Jest",
    url: "https://jestjs.io/docs/getting-started",
    description:
      "JavaScript testing framework. Matchers, mocks, snapshots, coverage.",
    category: "Tool",
  },
  {
    name: "Vitest",
    url: "https://vitest.dev/guide/",
    description: "Vite-native unit test framework. Jest-compatible API, fast.",
    category: "Tool",
  },
  {
    name: "Playwright",
    url: "https://playwright.dev/docs/intro",
    description:
      "End-to-end browser testing. Multi-browser, network mocking, traces.",
    category: "Tool",
  },
  {
    name: "Cypress",
    url: "https://docs.cypress.io/",
    description: "Frontend E2E testing. Real browser, time-travel debugging.",
    category: "Tool",
  },
  {
    name: "ESLint",
    url: "https://eslint.org/docs/latest/",
    description: "JS/TS linter. Rules, plugins, flat config, custom rules.",
    category: "Tool",
  },
  {
    name: "Prettier",
    url: "https://prettier.io/docs/en/",
    description:
      "Opinionated code formatter. Config, ignore files, editor integration.",
    category: "Tool",
  },
  {
    name: "Storybook",
    url: "https://storybook.js.org/docs",
    description:
      "UI component explorer. Stories, addons, docs, visual testing.",
    category: "Tool",
  },
  {
    name: "OpenAPI / Swagger",
    url: "https://swagger.io/docs/",
    description:
      "API documentation standard. YAML/JSON spec, Swagger UI, codegen.",
    category: "Tool",
  },
  {
    name: "Postman",
    url: "https://learning.postman.com/docs/",
    description:
      "API testing and collaboration. Collections, environments, monitors.",
    category: "Tool",
  },
  {
    name: "pnpm",
    url: "https://pnpm.io/",
    description: "Fast, disk-efficient package manager. Workspaces, monorepos.",
    category: "Tool",
  },
  {
    name: "Turborepo",
    url: "https://turbo.build/repo/docs",
    description:
      "High-performance monorepo build system. Caching, pipelines, remote cache.",
    category: "Tool",
  },
  {
    name: "Maven",
    url: "https://maven.apache.org/guides/",
    description:
      "Java build and dependency management. POM, lifecycle, plugins.",
    category: "Tool",
  },
  {
    name: "Gradle",
    url: "https://docs.gradle.org/current/userguide/userguide.html",
    description:
      "Build tool for Java/Kotlin/Android. DSL, tasks, plugins, caching.",
    category: "Tool",
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
    name: "HTTP (MDN)",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    description:
      "HTTP/HTTPS, methods, headers, status codes, caching, cookies.",
    category: "CS",
  },
  {
    name: "Regex",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions",
    description: "Regular expressions syntax, groups, lookaheads, flags.",
    category: "CS",
  },
  {
    name: "OAuth 2.0",
    url: "https://oauth.net/2/",
    description: "Authorization framework. Flows, tokens, scopes, PKCE.",
    category: "CS",
  },
  {
    name: "JWT",
    url: "https://jwt.io/introduction",
    description:
      "JSON Web Tokens. Structure, signing algorithms, verification.",
    category: "CS",
  },
  {
    name: "WebSockets",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
    description:
      "Full-duplex communication. Connection lifecycle, events, frames.",
    category: "CS",
  },
  {
    name: "REST API Design",
    url: "https://restfulapi.net/",
    description:
      "REST principles, HTTP methods, status codes, HATEOAS, versioning.",
    category: "CS",
  },
  {
    name: "Design Patterns",
    url: "https://refactoring.guru/design-patterns",
    description:
      "Creational, structural, behavioural patterns with code examples.",
    category: "CS",
  },
  {
    name: "Clean Code",
    url: "https://refactoring.guru/refactoring",
    description:
      "Refactoring techniques, code smells, and clean code principles.",
    category: "CS",
  },
  {
    name: "SOLID Principles",
    url: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design",
    description: "Single responsibility, open/closed, LSP, ISP, DIP explained.",
    category: "CS",
  },
  {
    name: "Microservices",
    url: "https://microservices.io/patterns/index.html",
    description:
      "Microservice patterns. Saga, CQRS, API gateway, service mesh.",
    category: "CS",
  },

  // ── AI/ML ────────────────────────────────────────────────────
  {
    name: "PyTorch",
    url: "https://pytorch.org/docs/stable/index.html",
    description:
      "Deep learning framework. Tensors, autograd, neural nets, CUDA.",
    category: "AI/ML",
  },
  {
    name: "TensorFlow",
    url: "https://www.tensorflow.org/api_docs",
    description: "ML platform by Google. Keras, datasets, serving, TFLite.",
    category: "AI/ML",
  },
  {
    name: "scikit-learn",
    url: "https://scikit-learn.org/stable/user_guide.html",
    description:
      "Python ML library. Classification, regression, clustering, pipelines.",
    category: "AI/ML",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/docs",
    description:
      "Transformers, datasets, tokenizers. NLP, vision, audio models.",
    category: "AI/ML",
  },
  {
    name: "LangChain",
    url: "https://python.langchain.com/docs/introduction/",
    description:
      "LLM application framework. Chains, agents, RAG, memory, tools.",
    category: "AI/ML",
  },
  {
    name: "OpenAI API",
    url: "https://platform.openai.com/docs/",
    description:
      "GPT-4o, embeddings, DALL-E, TTS, Whisper. Completions, function calling.",
    category: "AI/ML",
  },
  {
    name: "Anthropic API",
    url: "https://docs.anthropic.com/",
    description:
      "Claude API. Messages, tool use, streaming, vision, prompt caching.",
    category: "AI/ML",
  },
  {
    name: "Pandas",
    url: "https://pandas.pydata.org/docs/",
    description:
      "Python data analysis. DataFrames, indexing, groupby, merge, IO.",
    category: "AI/ML",
  },
  {
    name: "NumPy",
    url: "https://numpy.org/doc/stable/",
    description: "N-dimensional arrays, linear algebra, random, FFT.",
    category: "AI/ML",
  },
  {
    name: "Matplotlib",
    url: "https://matplotlib.org/stable/users/index.html",
    description:
      "Python plotting library. Line, bar, scatter, subplots, animations.",
    category: "AI/ML",
  },
  {
    name: "Jupyter",
    url: "https://docs.jupyter.org/en/latest/",
    description:
      "Interactive notebooks. Kernels, magic commands, widgets, JupyterLab.",
    category: "AI/ML",
  },
];

// All unique categories
export const CATALOG_CATEGORIES = [
  "All",
  "DSA",
  "Language",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Tool",
  "CS",
  "AI/ML",
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
