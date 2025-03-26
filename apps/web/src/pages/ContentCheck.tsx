import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/api/config'

export default function ContentCheck() {
  const [content, setContent] = useState('')
  const [type, setType] = useState('text')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [result, setResult] = useState(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit content for checking.',
        variant: 'destructive',
      })
      navigate('/login')
    }
  }, [isAuthenticated, navigate, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user) {
        throw new Error('You must be logged in to submit content')
      }

      console.log('Submitting content check:', { content, type, userId: user.id })
      const response = await api.post('/api/content-checks', {
        content,
        type,
      })
      console.log('Content check response:', response.data)

      setResult(response.data)
      toast({
        title: 'Success',
        description: 'Content check has been initiated successfully.',
      })

      // Wait for 2 seconds before navigating to show the result
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Content check error:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to create content check. Please try again.',
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
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Content Check</h1>
          <p className="mt-2 text-sm text-gray-600">
            Submit your content for copyright and licensing analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content to Check
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
              rows={10}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? 'Checking...' : 'Check Content'}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Check Result</h2>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="space-y-2">
                <p><strong>Status:</strong> Success</p>
                <p><strong>Content Type:</strong> {result.type}</p>
                <p><strong>Content Length:</strong> {result.content.length} characters</p>
                <p><strong>Check ID:</strong> {result.id}</p>
                <p><strong>Created At:</strong> {new Date(result.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 