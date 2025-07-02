'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Eye, Lock } from 'lucide-react'

interface DemoUser {
  email: string
  name: string
  role: string
  description: string
  icon: React.ReactNode
  color: string
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@blogplatform.com',
    name: 'Admin User',
    role: 'ADMIN',
    description: 'Full platform access - manage users, posts, categories, analytics, and all admin features',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-red-500'
  },
  {
    email: 'editor@blogplatform.com',
    name: 'Editor User', 
    role: 'EDITOR',
    description: 'Content management access - create, edit, and manage posts and categories',
    icon: <User className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  {
    email: 'viewer@blogplatform.com',
    name: 'Viewer User',
    role: 'VIEWER', 
    description: 'Read-only access - view content and basic features without editing capabilities',
    icon: <Eye className="h-5 w-5" />,
    color: 'bg-green-500'
  }
]

export default function DemoLoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDemoLogin = async (email: string) => {
    setLoading(email)
    setError(null)

    try {
      const result = await signIn('demo', {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        // Redirect to admin after successful login
        window.location.href = '/admin'
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Demo login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Universal Blog Platform</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose a demo account to explore the platform features
          </p>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Demo Environment - No Real Data
          </Badge>
        </div>

        {/* Demo Users Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {demoUsers.map((user) => (
            <Card key={user.email} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <div className={`absolute top-0 left-0 right-0 h-1 ${user.color}`} />
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-3 rounded-full ${user.color} text-white`}>
                    {user.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {user.role}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-center min-h-[60px] flex items-center">
                  {user.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>

                <Button
                  onClick={() => handleDemoLogin(user.email)}
                  disabled={loading !== null}
                  className="w-full"
                  variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'EDITOR' ? 'default' : 'secondary'}
                >
                  {loading === user.email ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Logging in...
                    </>
                  ) : (
                    `Login as ${user.role}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Content Management</h3>
              <p className="text-sm text-gray-300">Create, edit, and publish blog posts with rich editor</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">AI-Powered Features</h3>
              <p className="text-sm text-gray-300">Content analysis, SEO optimization, and automated distribution</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-gray-300">Track performance across multiple platforms</p>
            </div>
          </div>
        </div>

        {/* OAuth Alternative Note */}
        <div className="text-center text-gray-400 text-sm">
          <p>💡 This platform also supports Google and GitHub OAuth authentication</p>
          <p>For production use, proper authentication would be required</p>
        </div>
      </div>
    </div>
  )
}
