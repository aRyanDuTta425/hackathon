import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'

interface ContentCheck {
  id: string
  type: string
  content: string
  riskScore: number
  createdAt: string
}

interface DashboardStats {
  totalChecks: number
  highRiskChecks: number
  lowRiskChecks: number
  pendingChecks: number
}

export default function Dashboard() {
  const { data: recentChecks } = useQuery<ContentCheck[]>({
    queryKey: ['recentChecks'],
    queryFn: async () => {
      const response = await axios.get('/api/content-checks/recent')
      return response.data
    },
  })

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/stats')
      return response.data
    },
  })

  const statCards = [
    {
      title: 'Total Checks',
      value: stats?.totalChecks || 0,
      icon: <FileText className="h-4 w-4" />,
      description: 'Total content checks performed',
    },
    {
      title: 'High Risk',
      value: stats?.highRiskChecks || 0,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Content with high risk score',
    },
    {
      title: 'Low Risk',
      value: stats?.lowRiskChecks || 0,
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Content with low risk score',
    },
    {
      title: 'Pending',
      value: stats?.pendingChecks || 0,
      icon: <Clock className="h-4 w-4" />,
      description: 'Pending content checks',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/check">
          <Button>New Content Check</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Checks</CardTitle>
          <CardDescription>
            Your latest content compliance checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentChecks?.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {check.type.charAt(0).toUpperCase() + check.type.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(check.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    Risk Score: {check.riskScore}%
                  </div>
                  <Link to={`/check/${check.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 