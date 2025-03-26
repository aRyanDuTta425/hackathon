import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ContentCheckInput {
  type: 'image' | 'article' | 'video'
  content: string
}

interface ContentCheckResult {
  id: string
  riskScore: number
  summary: string
  licenses: Array<{
    id: string
    type: string
    description: string
  }>
  violations: Array<{
    id: string
    type: string
    description: string
    severity: 'low' | 'medium' | 'high'
  }>
}

export const useCreateContentCheck = () => {
  return useMutation<ContentCheckResult, Error, ContentCheckInput>({
    mutationFn: async (input) => {
      const response = await axios.post('/api/content-checks', input)
      return response.data
    },
  })
} 