import { Redis } from "@upstash/redis"

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    
    if (!url || !token) {
      throw new Error(
        "Missing Upstash Redis environment variables. Please ensure KV_REST_API_URL and KV_REST_API_TOKEN are set."
      )
    }
    
    _redis = new Redis({ url, token })
  }
  return _redis
}

// Keep backward compatibility with existing imports
export const redis = {
  get: async <T>(key: string) => getRedis().get<T>(key),
  set: async (key: string, value: unknown, opts?: { ex?: number }) => getRedis().set(key, value, opts),
  keys: async (pattern: string) => getRedis().keys(pattern),
  del: async (...keys: string[]) => getRedis().del(...keys),
}

export type BrandContext = {
  brand: string
  context: string
  timestamp: number
}

export type Question = {
  id: string
  question: string
}

export type VisibilityAnswer = {
  questionId: string
  model: string
  run: number
  answer: string
  mentioned: boolean
  position: number | null
  timestamp: number
  failed?: boolean // Add optional failed flag
  error?: string // Add optional error message
}

export type RunStatus = {
  runId: string
  brand: string
  context: BrandContext | null
  questions: Question[] | null
  answers: VisibilityAnswer[]
  totalAnswers: number
  completedAnswers: number
  status: "pending" | "context" | "questions" | "checking" | "complete" | "failed"
}
