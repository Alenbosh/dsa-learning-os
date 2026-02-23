import type { Difficulty, SolveStatus, StudyStatus, LearnStage, ResourceType } from "@prisma/client"

export type { Difficulty, SolveStatus, StudyStatus, LearnStage, ResourceType }

export interface TagType {
  id: string
  name: string
}

export interface ProblemWithTags {
  id: string
  userId: string
  name: string
  url: string | null
  difficulty: Difficulty
  date: Date | null
  timeTaken: number | null
  attempts: number
  solved: SolveStatus | null
  confidence: number | null
  rating: number | null
  pattern: string | null
  mistake: string | null
  isContest: boolean
  revisit: boolean
  notes: string | null
  tags: { tag: TagType }[]
  topicLinks: { topicId: string }[]
  createdAt: Date
  updatedAt: Date
}

export interface DsaTopicWithRelations {
  id: string
  userId: string
  name: string
  status: StudyStatus
  notes: string | null
  lastReviewed: Date | null
  confidence: number | null
  order: number
  problems: { problem: ProblemWithTags }[]
  resources: ResourceType[]
  createdAt: Date
  updatedAt: Date
}

export interface TechStackWithRelations {
  id: string
  userId: string
  name: string
  category: string | null
  stage: LearnStage
  confidence: number | null
  notes: string | null
  order: number
  resources: { id: string; title: string; url: string }[]
  projects: { id: string; name: string; url: string | null }[]
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  currentStreak: number
  revisitCount: number
  topicsInProgress: number
  topicsNeedRevision: number
  techsLearning: number
}

// Form types
export interface ProblemFormData {
  name: string
  url?: string
  difficulty: Difficulty
  date?: string
  timeTaken?: number
  attempts?: number
  solved?: SolveStatus
  confidence?: number
  rating?: number
  pattern?: string
  mistake?: string
  isContest?: boolean
  revisit?: boolean
  tagIds: string[]
}

export interface TopicFormData {
  name: string
  status?: StudyStatus
  confidence?: number
}

export interface TechFormData {
  name: string
  category?: string
  stage?: LearnStage
  confidence?: number
  notes?: string
}
