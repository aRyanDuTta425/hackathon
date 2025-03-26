import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/api/config'

interface ContentCheck {
  id: string
  content: string
  type: string
  createdAt: string
  status: string
  riskScore: number | null
}

export default function Dashboard() {
  const [contentChecks, setContentChecks] = useState<ContentCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to view your dashboard.',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    fetchContentChecks()
  }, [isAuthenticated, navigate, toast])

  const fetchContentChecks = async () => {
    try {
      const response = await api.get('/api/content-checks')
      setContentChecks(response.data)
    } catch (error: any) {
      console.error('Failed to fetch content checks:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch content checks',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <button
          onClick={() => navigate('/content-check')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          New Content Check
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading content checks...</p>
        </div>
      ) : contentChecks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No content checks found.</p>
          <button
            onClick={() => navigate('/content-check')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Submit Your First Check
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {contentChecks.map((check) => (
            <div
              key={check.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Content Check #{check.id.slice(0, 8)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(check.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                  {check.type}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Content: {check.content.slice(0, 100)}...
                </p>
                {check.riskScore !== null && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Risk Score: {check.riskScore}
                    </p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${check.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 