import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { prisma } from './lib/db'
import { z } from 'zod'
import path from 'path'

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../../web/dist')))

// Mock JWT secret - in production, use a secure secret
const JWT_SECRET = 'your-secret-key'

// Authentication middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const token = authHeader.split(' ')[1]
    
    // In production, verify the JWT token here
    // For now, we'll just check if it exists and get the user
    const user = await prisma.user.findFirst()
    if (!user) {
      res.status(401).json({ message: 'Invalid token' })
      return
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ message: 'Authentication failed' })
  }
}

// Auth routes
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
    })

    const { email, password, name } = schema.parse(req.body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash the password
        name,
      },
    })

    // In production, generate a proper JWT token
    const token = 'mock-jwt-token'

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ message: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Login request received:', req.body)
    
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = schema.parse(req.body)
    console.log('Validated login data:', { email })

    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log('User found:', user ? 'Yes' : 'No')

    if (!user || user.password !== password) {
      console.log('Invalid credentials')
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    // In production, generate a proper JWT token
    const token = 'mock-jwt-token'

    const response = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }

    console.log('Sending login response:', response)
    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input data', errors: error.errors })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'User not authenticated' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Failed to get user' })
  }
})

// Content check routes
app.get('/api/content-checks', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'User not authenticated' })
      return
    }

    const contentChecks = await prisma.contentCheck.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(contentChecks)
  } catch (error) {
    console.error('Failed to fetch content checks:', error)
    res.status(500).json({ message: 'Failed to fetch content checks' })
  }
})

app.post('/api/content-checks', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Content check request received:', req.body)
    console.log('Authenticated user:', req.user)

    if (!req.user?.id) {
      console.log('No authenticated user found')
      res.status(401).json({ message: 'User not authenticated' })
      return
    }

    const schema = z.object({
      content: z.string(),
      type: z.enum(['text', 'image', 'video', 'audio']),
    })

    const { content, type } = schema.parse(req.body)
    console.log('Validated content check data:', { type, contentLength: content.length })

    const contentCheck = await prisma.contentCheck.create({
      data: {
        content,
        type,
        userId: req.user.id,
      },
    })

    console.log('Created content check:', contentCheck)
    res.json(contentCheck)
  } catch (error) {
    console.error('Content check error:', error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input data', errors: error.errors })
      return
    }
    res.status(500).json({ message: 'Failed to create content check' })
  }
})

app.get('/api/content-checks/recent', async (req, res) => {
  try {
    const checks = await prisma.contentCheck.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    res.json(checks)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Chat routes
app.get('/api/chat/session', async (req, res) => {
  try {
    const session = await prisma.chatSession.findFirst({
      where: { status: 'active' },
      include: { messages: true },
    })

    res.json(session)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/chat/message', async (req, res) => {
  try {
    const { content, sessionId } = z.object({
      content: z.string(),
      sessionId: z.string(),
    }).parse(req.body)

    const message = await prisma.message.create({
      data: {
        content,
        role: 'user',
        sessionId,
      },
    })

    res.json(message)
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' })
  }
})

// Dashboard routes
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [totalChecks, totalViolations, recentActivity] = await Promise.all([
      prisma.contentCheck.count(),
      prisma.violation.count(),
      prisma.contentCheck.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
    ])

    res.json({
      totalChecks,
      totalViolations,
      recentActivity,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Handle all other routes by serving the frontend app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/dist/index.html'))
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 