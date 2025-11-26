"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const { signIn, signUp, resendConfirmationEmail } = useAuth()
  const router = useRouter()
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Invoice Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your invoices with ease</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setLoading(true)
                    try {
                      const { error } = await signIn(signInEmail, signInPassword)
                      if (error) {
                        if (error.message?.includes("email_not_confirmed") || error.code === "email_not_confirmed") {
                          toast.error("Please verify your email before signing in")
                          setPendingEmail(signInEmail)
                          setShowEmailConfirmation(true)
                        } else {
                          toast.error(error.message || "Failed to sign in")
                        }
                      } else {
                        toast.success("Signed in successfully!")
                        router.push("/")
                      }
                    } catch (err: any) {
                      toast.error(err.message || "An error occurred")
                    } finally {
                      setLoading(false)
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="email-signin"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="password-signin"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        disabled={loading}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Email Confirmation Message */}
                {showEmailConfirmation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      📧 Email Verification Required
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      We've sent a verification email to <strong>{pendingEmail}</strong>. 
                      Please check your inbox and click the verification link to activate your account.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={async () => {
                          setLoading(true)
                          try {
                            const { error } = await resendConfirmationEmail(pendingEmail)
                            if (error) {
                              toast.error(error.message || "Failed to resend email")
                            } else {
                              toast.success("Verification email sent! Please check your inbox.")
                            }
                          } catch (err: any) {
                            toast.error(err.message || "An error occurred")
                          } finally {
                            setLoading(false)
                          }
                        }}
                        disabled={loading}
                      >
                        Resend Email
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setShowEmailConfirmation(false)
                          setPendingEmail("")
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (signUpData.password !== signUpData.confirmPassword) {
                      toast.error("Passwords do not match")
                      return
                    }
                    if (signUpData.password.length < 6) {
                      toast.error("Password must be at least 6 characters")
                      return
                    }
                    setLoading(true)
                    try {
                      const { error, data } = await signUp(
                        signUpData.email,
                        signUpData.password,
                        signUpData.name,
                        signUpData.phone
                      )
                      
                      // Check for duplicate email (even if no error, check if user was created)
                      if (error || !data?.user) {
                        // Check for duplicate email error
                        if (
                          error?.code === "user_already_registered" ||
                          error?.message?.toLowerCase().includes("user already registered") ||
                          error?.message?.toLowerCase().includes("already registered") ||
                          error?.message?.toLowerCase().includes("email already exists") ||
                          error?.message?.toLowerCase().includes("already exists") ||
                          error?.message?.toLowerCase().includes("duplicate") ||
                          (!error && !data?.user) // API returned 200 but no user created
                        ) {
                          toast.error("This email is already registered. Please sign in instead.")
                          // Switch to sign in tab and pre-fill email
                          setTimeout(() => {
                            const signInTab = document.querySelector('[value="signin"]') as HTMLElement
                            if (signInTab) {
                              signInTab.click()
                              setSignInEmail(signUpData.email)
                            }
                          }, 1000)
                        } else {
                          toast.error(error?.message || "Failed to create account")
                        }
                      } else {
                        toast.success("Account created! Please check your email to verify your account.")
                        setPendingEmail(signUpData.email)
                        setShowEmailConfirmation(true)
                        setSignUpData({
                          name: "",
                          email: "",
                          phone: "",
                          password: "",
                          confirmPassword: "",
                        })
                        // Switch to sign in tab after successful signup
                        setTimeout(() => {
                          const signInTab = document.querySelector('[value="signin"]') as HTMLElement
                          if (signInTab) {
                            signInTab.click()
                          }
                        }, 2000)
                      }
                    } catch (err: any) {
                      toast.error(err.message || "An error occurred")
                    } finally {
                      setLoading(false)
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name-signup">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="name-signup"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-signup">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="phone-signup"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        className="pl-10 pr-10"
                        required
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        id="confirm-password-signup"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        required
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500 mt-1"
                      required
                      disabled={loading}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-teal-600 hover:text-teal-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-teal-600 hover:text-teal-700">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{" "}
          <Link href="/support" className="text-teal-600 hover:text-teal-700 font-medium">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}

