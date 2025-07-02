'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Github, Mail, User, Shield, Eye, Lock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const demoUsers = [
  {
    email: 'admin@blogplatform.com',
    name: 'Admin User',
    role: 'ADMIN',
    description: 'Full platform access',
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  {
    email: 'editor@blogplatform.com',
    name: 'Editor User', 
    role: 'EDITOR',
    description: 'Content management',
    icon: <User className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    email: 'viewer@blogplatform.com',
    name: 'Viewer User',
    role: 'VIEWER', 
    description: 'Read-only access',
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-green-500'
  }
]

function SignInContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(demoEmail)
    setError(null)

    try {
      const result = await signIn('demo', {
        email: demoEmail,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Demo login failed. Please ensure the demo data is seeded.')
      } else if (result?.ok) {
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error('Demo login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setLoading(provider)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      setError('OAuth login failed.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
          </div>
          <p className="text-gray-300">
            Access the Universal Blog Platform
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-center">Demo Accounts</CardTitle>
            <CardDescription className="text-center">
              Choose a demo account to explore features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoUsers.map((user) => (
              <Button
                key={user.email}
                onClick={() => handleDemoLogin(user.email)}
                disabled={loading !== null}
                variant="outline"
                className="w-full justify-start space-x-3 h-auto p-4"
              >
                <div className={`p-2 rounded-full ${user.color} text-white`}>
                  {user.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.description}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {user.role}
                  </Badge>
                </div>
                {loading === user.email && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                )}
              </Button>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="email">Or enter demo email</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="demo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading !== null}
                />
                <Button
                  onClick={() => handleDemoLogin(email)}
                  disabled={!email || loading !== null}
                  variant="secondary"
                >
                  Sign In
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Button
                onClick={() => handleOAuthLogin('google')}
                disabled={loading !== null}
                variant="outline"
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Sign in with Google
                {loading === 'google' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                )}
              </Button>

              <Button
                onClick={() => handleOAuthLogin('github')}
                disabled={loading !== null}
                variant="outline"
                className="w-full"
              >
                <Github className="h-4 w-4 mr-2" />
                Sign in with GitHub
                {loading === 'github' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-gray-400 text-sm">
          <p>💡 Demo environment with sample data</p>
          <p>Use any demo account to explore features</p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
