import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'

const formSchema = z.object({
  type: z.enum(['image', 'article', 'video']),
  content: z.string().url('Please enter a valid URL'),
})

type FormValues = z.infer<typeof formSchema>

interface CheckResult {
  id: string
  riskScore: number
  summary: string
  licenses: Array<{
    type: string
    description: string
  }>
  violations: Array<{
    type: string
    description: string
    severity: string
  }>
}

export default function ContentCheck() {
  const [result, setResult] = useState<CheckResult | null>(null)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'image',
      content: '',
    },
  })

  const checkMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axios.post('/api/content-checks', values)
      return response.data
    },
    onSuccess: (data) => {
      setResult(data)
      toast({
        title: 'Analysis Complete',
        description: 'Your content has been analyzed successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to analyze content. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await checkMutation.mutateAsync(values)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Content Compliance Check</h1>
        <p className="text-muted-foreground">
          Upload your content for AI-powered copyright and licensing analysis
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Content</CardTitle>
            <CardDescription>
              Enter the URL of your content to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/content"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Analyzing...' : 'Analyze Content'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Copyright and licensing analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Risk Score</h3>
                <div className="text-2xl font-bold text-primary">
                  {result.riskScore}%
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Summary</h3>
                <p className="text-muted-foreground">{result.summary}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Licenses</h3>
                <ul className="space-y-2">
                  {result.licenses.map((license, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{license.type}:</span>{' '}
                      {license.description}
                    </li>
                  ))}
                </ul>
              </div>

              {result.violations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Potential Violations</h3>
                  <ul className="space-y-2">
                    {result.violations.map((violation, index) => (
                      <li
                        key={index}
                        className={`text-sm ${
                          violation.severity === 'high'
                            ? 'text-destructive'
                            : violation.severity === 'medium'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      >
                        <span className="font-medium">{violation.type}:</span>{' '}
                        {violation.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 