/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { prisma } from './lib/db'
import { z } from 'zod'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', cors())
app.use('/api/*', jwt({
  secret: 'your-secret-key'
}))

// Auth Routes
app.post('/api/auth/register', async (c) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  })

  try {
    const body = await c.req.json()
    const { email, password, name } = schema.parse(body)

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    })

    const token = 'mock-token'

    return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    return c.json({ error: 'Invalid input' }, 400)
  }
})

app.post('/api/auth/login', async (c) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  try {
    const body = await c.req.json()
    const { email, password } = schema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.password !== password) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const token = 'mock-token'

    return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    return c.json({ error: 'Invalid input' }, 400)
  }
})

// Content Check Routes
app.post('/api/content-checks', async (c) => {
  const schema = z.object({
    type: z.enum(['image', 'article', 'video']),
    content: z.string().url(),
  })

  try {
    const body = await c.req.json()
    const { type, content } = schema.parse(body)
    const userId = c.get('jwtPayload').sub

    // Here you would integrate with your AI service for content analysis
    // For now, we'll return mock data
    const check = await prisma.contentCheck.create({
      data: {
        userId,
        type,
        content,
        riskScore: Math.random() * 100,
        summary: 'This is a mock analysis summary.',
      },
    })

    // Create mock licenses and violations
    await prisma.license.create({
      data: {
        contentCheckId: check.id,
        type: 'CC-BY',
        description: 'Creative Commons Attribution License',
      },
    })

    await prisma.violation.create({
      data: {
        contentCheckId: check.id,
        type: 'Copyright',
        description: 'Potential copyright issue detected',
        severity: 'medium',
      },
    })

    return c.json(check)
  } catch (error) {
    return c.json({ error: 'Invalid input' }, 400)
  }
})

app.get('/api/content-checks/recent', async (c) => {
  const userId = c.get('jwtPayload').sub

  const checks = await prisma.contentCheck.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return c.json(checks)
})

// Chat Routes
app.get('/api/chat/session', async (c) => {
  const userId = c.get('jwtPayload').sub

  const session = await prisma.chatSession.findFirst({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  return c.json(session)
})

app.post('/api/chat/message', async (c) => {
  const schema = z.object({
    message: z.string().min(1),
  })

  try {
    const body = await c.req.json()
    const { message } = schema.parse(body)
    const userId = c.get('jwtPayload').sub

    const session = await prisma.chatSession.findFirst({
      where: { userId },
    })

    if (!session) {
      return c.json({ error: 'Chat session not found' }, 404)
    }

    // Create user message
    await prisma.message.create({
      data: {
        chatSessionId: session.id,
        role: 'user',
        content: message,
      },
    })

    // Here you would integrate with your AI service for response generation
    // For now, we'll return a mock response
    const aiResponse = await prisma.message.create({
      data: {
        chatSessionId: session.id,
        role: 'assistant',
        content: 'This is a mock AI response to your question.',
      },
    })

    return c.json(aiResponse)
  } catch (error) {
    return c.json({ error: 'Invalid input' }, 400)
  }
})

// Dashboard Stats
app.get('/api/dashboard/stats', async (c) => {
  const userId = c.get('jwtPayload').sub

  const [totalChecks, highRiskChecks, lowRiskChecks, pendingChecks] = await Promise.all([
    prisma.contentCheck.count({ where: { userId } }),
    prisma.contentCheck.count({
      where: { userId, riskScore: { gte: 70 } },
    }),
    prisma.contentCheck.count({
      where: { userId, riskScore: { lte: 30 } },
    }),
    prisma.contentCheck.count({
      where: { userId, riskScore: null },
    }),
  ])

  return c.json({
    totalChecks,
    highRiskChecks,
    lowRiskChecks,
    pendingChecks,
  })
})

export default app 