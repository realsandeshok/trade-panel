//auth page
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import {useState } from "react"
import { Login, Signup } from "@/controllers/authController"
import { EyeIcon, LockIcon, MailIcon, MountainIcon } from "lucide-react"



export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent the default form submission
   
    Login(email,password);
    
  };
  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent the default form submission
    if (password!=confirmPassword) {
      alert("Passwords do not match");
      return;
      
    }
    // Login(email,password);
    console.log("Signup");

    Signup(email,password);
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto">
            <MountainIcon className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#333333]">
            Welcome to Acme Stocks
          </h2>
          <p className="mt-2 text-center text-sm text-[#666666]">
            Invest in the future with our cutting-edge platform.
          </p>
        </div>
        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid grid-cols-2 rounded-lg bg-[#e0e0e0] p-1 h-12">
            <TabsTrigger value="login" className="rounded-md py-2 text-sm font-medium">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-md py-2 text-sm font-medium">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="flex items-center">
                  <MailIcon className="mr-2 h-4 w-4 text-[#666666]" />
                  <Label htmlFor="email" className="block text-sm font-medium text-[#666666]">
                    Email address
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-[#ccc] bg-[#f0f0f0] px-3 py-2 text-[#333333] placeholder-[#999999] focus:border-[#4CAF50] focus:outline-none focus:ring-[#4CAF50] sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <LockIcon className="mr-2 h-4 w-4 text-[#666666]" />
                  <Label htmlFor="password" className="block text-sm font-medium text-[#666666]">
                    Password
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-[#ccc] bg-[#f0f0f0] px-3 py-2 text-[#333333] placeholder-[#999999] focus:border-[#4CAF50] focus:outline-none focus:ring-[#4CAF50] sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember-me" className="h-4 w-4 rounded text-[#4CAF50] focus:ring-[#4CAF50]" />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-[#666666]">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <Link href="#" className="font-medium text-[#4CAF50] hover:text-[#3e8e41]" prefetch={false}>
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <Button   type="submit" className="w-full bg-[#4CAF50] text-white hover:bg-[#3e8e41] focus:ring-[#4CAF50]">
                Sign in
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="space-y-4" onSubmit={handleSignup}>
             
              <div>
                <div className="flex items-center">
                  <MailIcon className="mr-2 h-4 w-4 text-[#666666]" />
                  <Label htmlFor="email" className="block text-sm font-medium text-[#666666]">
                    Email address
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-[#ccc] bg-[#f0f0f0] px-3 py-2 text-[#333333] placeholder-[#999999] focus:border-[#4CAF50] focus:outline-none focus:ring-[#4CAF50] sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    
                  />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <LockIcon className="mr-2 h-4 w-4 text-[#666666]" />
                  <Label htmlFor="password" className="block text-sm font-medium text-[#666666]">
                    Password
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full appearance-none rounded-md border border-[#ccc] bg-[#f0f0f0] px-3 py-2 text-[#333333] placeholder-[#999999] focus:border-[#4CAF50] focus:outline-none focus:ring-[#4CAF50] sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <LockIcon className="mr-2 h-4 w-4 text-[#666666]" />
                  <Label htmlFor="confirm-password" className="block text-sm font-medium text-[#666666]">
                    Confirm Password
                  </Label>
                </div>
                <div className="mt-1">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full appearance-none rounded-md border border-[#ccc] bg-[#f0f0f0] px-3 py-2 text-[#333333] placeholder-[#999999] focus:border-[#4CAF50] focus:outline-none focus:ring-[#4CAF50] sm:text-sm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-7 w-7"
                    onClick={togglePasswordVisibility}
                    
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#4CAF50] text-white hover:bg-[#3e8e41] focus:ring-[#4CAF50]">
                Sign up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
