"use client"

import { useState } from "react"
import Link from "next/link"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {Layers} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      { message: "Password must include uppercase, lowercase, number, and special character." }
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});



export default function SignupPage() {

    const { signUpWithEmail}=useAuth();
    const {toast}=useToast();
    const[isLoading,setIsLoading]=useState(false)
    const form=useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email:"",
            name:"",
            password:"",
            confirmPassword:""
        }
    })

    const onSubmit=async (values)=>{
        setIsLoading(true)
        try {
            await signUpWithEmail(values.name,values.email,values.password)
             toast({
        title: 'Account created!',
        description: 'You have successfully signed up.',
      });
        } catch (error) {
            toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'There was a problem creating your account.',
      });
        }
        finally{
            setIsLoading(false)
        }
        }

        return(
               <div className="container mx-auto flex flex-col justify-center space-y-6 sm:w-[350px] pt-16">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto">
          <Layers className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to create a new account
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Form>
      </div>

      <p className="px-8 text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="underline hover:text-brand underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
        )
}