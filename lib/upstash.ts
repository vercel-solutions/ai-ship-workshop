import { Redis } from "@upstash/redis"

// Create Redis instance lazily on first actual use
function createRedisClient(): Redis {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  
  console.log("[v0] createRedisClient called")
  console.log("[v0] KV_REST_API_URL:", url)
  console.log("[v0] KV_REST_API_TOKEN exists:", !!token)
  
  if (!url || !token) {
    console.log("[v0] ERROR: Missing environment variables!")
    throw new Error(
      "Missing Upstash Redis environment variables. Please ensure KV_REST_API_URL and KV_REST_API_TOKEN are set."
    )
  }
  
  return new Redis({ url, token })
}

// Wrapper that creates client on each call to ensure fresh env vars
export const redis = {
  get: async <T>(key: string) => {
    console.log("[v0] redis.get called for key:", key)
    return createRedisClient().get<T>(key)
  },
  set: async (key: string, value: unknown, opts?: { ex?: number }) => {
    console.log("[v0] redis.set called for key:", key)
    return createRedisClient().set(key, value, opts)
  },
  keys: async (pattern: string) => {
    console.log("[v0] redis.keys called for pattern:", pattern)
    return createRedisClient().keys(pattern)
  },
  del: async (...keys: string[]) => {
    console.log("[v0] redis.del called for keys:", keys)
    return createRedisClient().del(...keys)
  },
  mget: async <T>(...keys: string[]) => {
    console.log("[v0] redis.mget called for keys:", keys)
    return createRedisClient().mget<T[]>(...keys)
  },
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
