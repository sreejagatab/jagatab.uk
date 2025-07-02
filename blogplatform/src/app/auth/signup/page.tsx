import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Mail, 
  Lock, 
  User, 
  Building,
  ArrowRight,
  Check,
  Github,
  Chrome
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Universal Blog Platform account and start distributing content across 1000+ platforms.',
}

const features = [
  'Distribute to 1000+ platforms',
  'AI-powered content creation',
  'Advanced analytics dashboard',
  'Team collaboration tools',
  'Priority customer support',
  '14-day free trial'
]

export default function SignUpPage() {
  return (
    <PageLayout>
      <ContentSection className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                <p className="text-muted-foreground">
                  Start your free trial and join thousands of content creators
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    Choose your preferred sign-up method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" size="lg">
                      <Chrome className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Github className="mr-2 h-4 w-4" />
                      Continue with GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="john@example.com" className="pl-10" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="Create a strong password" className="pl-10" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="company" placeholder="Your Company" className="pl-10" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="plan">Choose Plan</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">Starter (Free)</SelectItem>
                          <SelectItem value="professional">Professional ($29/month)</SelectItem>
                          <SelectItem value="enterprise">Enterprise ($99/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="marketing" />
                      <Label htmlFor="marketing" className="text-sm">
                        Send me product updates and marketing emails
                      </Label>
                    </div>

                    <Button size="lg" className="w-full">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/auth/signin" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Benefits */}
            <div className="lg:pl-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Why Choose Universal Blog Platform?</h2>
                <p className="text-muted-foreground text-lg">
                  Join thousands of content creators who have transformed their reach and engagement with our platform.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">🎯 Free Trial Includes:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Full access to all features</li>
                    <li>• No credit card required</li>
                    <li>• 14 days to explore</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Trusted by 50,000+ content creators worldwide
                </p>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">+50,000 others</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
