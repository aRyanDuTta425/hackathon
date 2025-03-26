import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Shield, FileText, MessageSquare, AlertTriangle } from 'lucide-react'

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'AI-Powered Licensing Check',
    description: 'Automatically verify copyright and licensing information for your content using advanced AI technology.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Comprehensive Analysis',
    description: 'Get detailed reports on licensing terms, usage rights, and potential restrictions for your content.',
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Legal Q&A Chatbot',
    description: 'Ask questions about copyright laws and get instant, accurate responses from our AI legal assistant.',
  },
  {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: 'Risk Assessment',
    description: 'Receive risk scores and recommendations to ensure your content complies with legal requirements.',
  },
]

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold">
          Protect Your Content with AI-Powered Legal Compliance
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Verify copyright, licensing, and compliance for your content instantly. Get clear explanations and risk assessments powered by advanced AI.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/check">
            <Button size="lg" variant="outline">Try Demo</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="mb-4 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Protect Your Content?</h2>
        <p className="text-xl text-muted-foreground">
          Join thousands of content creators who trust our platform for legal compliance.
        </p>
        <Link to="/register">
          <Button size="lg">Start Free Trial</Button>
        </Link>
      </section>
    </div>
  )
} 