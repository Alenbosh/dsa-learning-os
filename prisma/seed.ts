import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL },
  },
});

const TAGS = [
  "Array",
  "HashMap",
  "Sliding Window",
  "DP",
  "Binary Search",
  "Graph",
  "Tree",
  "Stack",
  "Greedy",
  "Bit Manipulation",
  "Backtracking",
  "Math",
  "Heap",
  "Prefix Sum",
  "Two Pointers",
  "BFS",
  "DFS",
  "Trie",
  "Union Find",
  "Monotonic Stack",
  "String",
  "Recursion",
  "Sorting",
  "Linked List",
];

async function main() {
  console.log("🌱 Seeding tags...");
  for (const name of TAGS) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ Seeded ${TAGS.length} tags`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
