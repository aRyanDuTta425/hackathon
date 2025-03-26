import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Protect Your Digital Content
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          AI-powered copyright and licensing analysis to ensure your content is protected and compliant.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/check">
            <Button variant="outline" size="lg">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">AI-Powered Licensing Check</h3>
          <p className="mt-2 text-sm text-gray-600">
            Advanced AI algorithms analyze your content for copyright and licensing issues.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Comprehensive Analysis</h3>
          <p className="mt-2 text-sm text-gray-600">
            Detailed reports on copyright status, licensing requirements, and potential risks.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Legal Q&A Chatbot</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get instant answers to your copyright and licensing questions.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Risk Assessment</h3>
          <p className="mt-2 text-sm text-gray-600">
            Identify potential legal risks and get recommendations for mitigation.
          </p>
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to protect your content?
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Start your free trial today and get comprehensive copyright protection.
        </p>
        <div className="mt-8">
          <Link to="/register">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 