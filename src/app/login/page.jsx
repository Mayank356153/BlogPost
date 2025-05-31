"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { Layers ,Github} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import isEmail from "validator/lib/isEmail"

const formSchema= z.object({
     email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
})
export default function LoginPage(){
    const {LoginWithEmail,googleLogin,githubLogin} =useAuth();
     const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
        email:"",
        password:""
    }
  })

  
    const onSubmit=async (values)=>{
        
        setIsLoading(true)
        try {
            await LoginWithEmail(values.email,values.password)
             toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
        } catch (error) {
             toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
      });
        }
        finally{
            setIsLoading(false);
        }
    }

    
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      toast({
        title: 'Google login',
        description: 'Successfully logged in with Google.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Failed to login with Google. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await githubLogin();
      toast({
        title: 'Github login',
        description: 'Successfully logged in with Github.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Failed to login with Github. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };


    
    return (

     <div className="container mx-auto flex flex-col justify-center space-y-6 sm:w-[350px] pt-16">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto">
          <Layers className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
             control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

            <div className="grid gap-2">
          <Button variant="outline"
           onClick={handleGoogleLogin} 
          disabled={isLoading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <Button variant="outline"
           onClick={handleGithubLogin}
           disabled={isLoading}>
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

       

        
        <div className="text-sm text-center">
          <Link
            href="/forgot-password"
            className="underline hover:text-brand text-muted-foreground underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <p className="px-8 text-sm text-center text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="underline hover:text-brand underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
    )

}